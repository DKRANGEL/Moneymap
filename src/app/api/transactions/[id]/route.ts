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

export async function DELETE(_request: NextRequest, {params}: RouteParams) {
    const supabase = await createClient()
    const {data: {user}} = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({error: 'Não autorizado'}, {status: 401})
    }

    try {
        const existing = await prisma.transaction.findFirst({
            where: {id: params.id, userId: user.id},
        })

        if (!existing) {
            return NextResponse.json({error: 'Transação não encontrada'}, {status: 404})
        }

        await prisma.transaction.delete({
            where: {id: params.id},
        })

        return NextResponse.json({success: true})
    } catch {
        return NextResponse.json({error: 'Erro ao deletar transação'}, {status: 500})
    }
}