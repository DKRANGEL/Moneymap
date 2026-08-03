import {NextRequest, NextResponse} from 'next/server'
import {createClient} from '@/lib/supabase/server'
import {getTransactionsByMonth, getMonthlySummary, createTransaction} from '@/lib/transactions'
import {z} from 'zod'
import {PaymentMethod, TransactionStatus, TransactionType} from '@prisma/client'

const createTransactionSchema = z.object({
    accountId: z.string().uuid(),
    cardId: z.string().uuid().optional(),
    categoryId: z.string().uuid().optional(),
    amount: z.number().positive(),
    type: z.nativeEnum(TransactionType),
    description: z.string().min(1).max(255),
    date: z.string().datetime(),
    paymentMethod: z.nativeEnum(PaymentMethod),
    status: z.nativeEnum(TransactionStatus),
    notes: z.string().optional(),
    isFixed: z.boolean().optional(),
    fixedDay: z.number().int().min(1).max(31).optional(),
    installmentsTotal: z.number().int().min(1).optional(),
    installmentNumberStart: z.number().int().min(1).optional(),
})

export async function GET(request: NextRequest) {
    const supabase = await createClient()
    const {data: {user}} = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({error: 'Não autorizado'}, {status: 401})
    }

    const {searchParams} = new URL(request.url)
    const month = Number(searchParams.get('month')) || new Date().getMonth() + 1
    const year = Number(searchParams.get('year')) || new Date().getFullYear()

    const filters = {
        type: searchParams.get('type') as TransactionType | undefined,
        accountId: searchParams.get('accountId') ?? undefined,
        cardId: searchParams.get('cardId') ?? undefined,
        status: searchParams.get('status') as TransactionStatus | undefined,
        paymentMethod: searchParams.get('paymentMethod') as PaymentMethod | undefined,
    }

    try {
        const [transactions, summary] = await Promise.all([
            getTransactionsByMonth(user.id, month, year, filters),
            getMonthlySummary(user.id, month, year),
        ])

        return NextResponse.json({transactions, summary})
    } catch {
        return NextResponse.json({error: 'Erro ao buscar transações'}, {status: 500})
    }
}

export async function POST(request: NextRequest) {
    const supabase = await createClient()
    const {data: {user}} = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({error: 'Não autorizado'}, {status: 401})
    }

    try {
        const body = await request.json()
        const parsed = createTransactionSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                {error: 'Dados inválidos', details: parsed.error.flatten()},
                {status: 400}
            )
        }

        const transaction = await createTransaction(user.id, {
            ...parsed.data,
            date: new Date(parsed.data.date),
        })

        return NextResponse.json(transaction, {status: 201})
    } catch {
        return NextResponse.json({error: 'Erro ao criar transação'}, {status: 500})
    }
}