import {NextRequest, NextResponse} from 'next/server'
import {createClient} from '@/lib/supabase/server'
import {prisma} from '@/lib/prisma'
import {z} from 'zod'
import {PaymentMethod, TransactionStatus, TransactionType} from '@prisma/client'

const updateTransactionSchema = z.object({
    accountId: z.string().uuid().optional(),
    cardId: z.string().uuid().nullable().optional(),
    categoryId: z.string().uuid().nullable().optional(),
    amount: z.number().positive().optional(),
    type: z.nativeEnum(TransactionType).optional(),
    description: z.string().min(1).max(255).optional(),
    date: z.string().datetime().optional(),
    paymentMethod: z.nativeEnum(PaymentMethod).optional(),
    status: z.nativeEnum(TransactionStatus).optional(),
    notes: z.string().nullable().optional(),
})

type RouteParams = { params: { id: string } }

export async function PATCH(request: NextRequest, {params}: RouteParams) {
    const supabase = await createClient()
    const {data: {user}} = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({error: 'Não autorizado'}, {status: 401})
    }

    try {
        const {searchParams} = new URL(request.url)
        const editAll = searchParams.get('editAll') === 'true'

        const body = await request.json()
        const parsed = updateTransactionSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                {error: 'Dados inválidos', details: parsed.error.flatten()},
                {status: 400}
            )
        }

        const existing = await prisma.transaction.findFirst({
            where: {id: params.id, userId: user.id},
        })

        if (!existing) {
            return NextResponse.json({error: 'Transação não encontrada'}, {status: 404})
        }

        if (editAll && existing.recurringGroupId) {
            console.log('PATCH editAll debug:', {
                existingId: existing.id,
                existingDate: existing.date,
                existingInstallmentNumber: existing.installmentNumber,
                parsedDate: parsed.data.date,
                newBaseDate: parsed.data.date ? new Date(parsed.data.date) : existing.date,
                newBaseDateUTC: parsed.data.date ? new Date(parsed.data.date).toISOString() : existing.date,
            })

            // Busca todas as ocorrências futuras ordenadas por data
            const futureOccurrences = await prisma.transaction.findMany({
                where: {
                    userId: user.id,
                    recurringGroupId: existing.recurringGroupId,
                    ...(existing.installmentNumber !== null
                            ? {installmentNumber: {gte: existing.installmentNumber}}
                            : {date: {gte: existing.date}}
                    ),
                },
                orderBy: existing.installmentNumber !== null
                    ? {installmentNumber: 'asc'}
                    : {date: 'asc'},
            })

            const newBaseDate = parsed.data.date
                ? new Date(parsed.data.date)
                : existing.date
            const {description, amount, paymentMethod, accountId, cardId, notes} = parsed.data

            // Extrai descrição base removendo sufixo de parcela se existir
            const baseDescription = description
                ? description.replace(/\s*\(\d+\/\d+\)$/, '')
                : existing.description.replace(/\s*\(\d+\/\d+\)$/, '')

            await Promise.all(
                futureOccurrences.map(async (occurrence, index) => {
                    const newDate = new Date(Date.UTC(
                        newBaseDate.getUTCFullYear(),
                        newBaseDate.getUTCMonth() + index,
                        newBaseDate.getUTCDate(),
                    ))

                    const newDescription = occurrence.installmentsTotal
                        ? `${baseDescription} (${occurrence.installmentNumber}/${occurrence.installmentsTotal})`
                        : baseDescription

                    return prisma.transaction.update({
                        where: {id: occurrence.id},
                        data: {
                            description: newDescription,
                            ...(amount && {amount}),
                            ...(paymentMethod && {paymentMethod}),
                            ...(accountId && {accountId}),
                            ...(cardId !== undefined && {cardId}),
                            ...(notes !== undefined && {notes}),
                            ...(index === 0 && parsed.data.status && {status: parsed.data.status}),
                            date: newDate,
                        },
                    })
                })
            )

            const updated = await prisma.transaction.findFirst({
                where: {id: params.id},
                include: {
                    account: {select: {name: true, bank: true}},
                    card: {select: {nickname: true, lastFour: true}},
                    category: {select: {name: true, icon: true, color: true}},
                },
            })

            return NextResponse.json(updated)
        }

        // Edição simples — só esta
        const updated = await prisma.transaction.update({
            where: {id: params.id},
            data: {
                ...parsed.data,
                ...(parsed.data.date && {date: new Date(parsed.data.date)}),
            },
            include: {
                account: {select: {name: true, bank: true}},
                card: {select: {nickname: true, lastFour: true}},
                category: {select: {name: true, icon: true, color: true}},
            },
        })

        return NextResponse.json(updated)
    } catch {
        return NextResponse.json({error: 'Erro ao atualizar transação'}, {status: 500})
    }
}

export async function DELETE(request: NextRequest, {params}: RouteParams) {
    const supabase = await createClient()
    const {data: {user}} = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({error: 'Não autorizado'}, {status: 401})
    }

    try {
        const {searchParams} = new URL(request.url)
        const deleteAll = searchParams.get('deleteAll') === 'true'

        const existing = await prisma.transaction.findFirst({
            where: {id: params.id, userId: user.id},
        })

        if (!existing) {
            return NextResponse.json({error: 'Transação não encontrada'}, {status: 404})
        }

        if (deleteAll && existing.recurringGroupId) {
            // Deleta esta e todas as próximas do mesmo grupo
            await prisma.transaction.deleteMany({
                where: {
                    userId: user.id,
                    recurringGroupId: existing.recurringGroupId,
                    date: {gte: existing.date},
                },
            })
        } else {
            // Deleta só esta
            await prisma.transaction.delete({
                where: {id: params.id},
            })
        }

        return NextResponse.json({success: true})
    } catch {
        return NextResponse.json({error: 'Erro ao deletar transação'}, {status: 500})
    }
}