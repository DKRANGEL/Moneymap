import {prisma} from '@/lib/prisma'
import {PaymentMethod, TransactionStatus, TransactionType} from '@prisma/client'

export type CreateTransactionInput = {
    accountId: string
    cardId?: string
    categoryId?: string
    amount: number
    type: TransactionType
    description: string
    date: Date
    paymentMethod: PaymentMethod
    status: TransactionStatus
    notes?: string
}

// Calcula o mês de referência para transações de crédito
export function getTransactionReferenceMonth(
    date: Date,
    paymentMethod: PaymentMethod,
    closingDay?: number
): { month: number; year: number } {
    const transactionDay = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    if (paymentMethod === 'credito' && closingDay !== undefined) {
        if (transactionDay > closingDay) {
            // Após fechamento → mês seguinte
            if (month === 12) return {month: 1, year: year + 1}
            return {month: month + 1, year}
        }
    }

    return {month, year}
}

export async function getTransactionsByMonth(
    userId: string,
    month: number,
    year: number,
    filters?: {
        type?: TransactionType
        accountId?: string
        cardId?: string
        status?: TransactionStatus
        paymentMethod?: PaymentMethod
    }
) {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    return prisma.transaction.findMany({
        where: {
            userId,
            date: {gte: startDate, lte: endDate},
            ...(filters?.type && {type: filters.type}),
            ...(filters?.accountId && {accountId: filters.accountId}),
            ...(filters?.cardId && {cardId: filters.cardId}),
            ...(filters?.status && {status: filters.status}),
            ...(filters?.paymentMethod && {paymentMethod: filters.paymentMethod}),
        },
        include: {
            account: {select: {name: true, bank: true}},
            card: {select: {nickname: true, lastFour: true}},
            category: {select: {name: true, icon: true, color: true}},
        },
        orderBy: {date: 'desc'},
    })
}

export async function getMonthlySummary(
    userId: string,
    month: number,
    year: number
) {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    const transactions = await prisma.transaction.findMany({
        where: {
            userId,
            date: {gte: startDate, lte: endDate},
        },
        select: {amount: true, type: true},
    })

    const receitas = transactions
        .filter(t => t.type === 'entrada')
        .reduce((sum, t) => sum + Number(t.amount), 0)

    const despesas = transactions
        .filter(t => t.type === 'saida')
        .reduce((sum, t) => sum + Number(t.amount), 0)

    return {
        receitas: +receitas.toFixed(2),
        despesas: +despesas.toFixed(2),
        saldo: +(receitas - despesas).toFixed(2),
    }
}

export async function createTransaction(
    userId: string,
    input: CreateTransactionInput
) {
    // Se crédito, busca o cartão para calcular mês de referência
    let referenceDate = input.date

    if (input.paymentMethod === 'credito' && input.cardId) {
        const card = await prisma.card.findFirst({
            where: {id: input.cardId, userId},
        })

        if (card) {
            const {month, year} = getTransactionReferenceMonth(
                input.date,
                input.paymentMethod,
                card.closingDay
            )
            // Ajusta a data para o primeiro dia do mês de referência
            referenceDate = new Date(year, month - 1, input.date.getDate())
        }
    }

    return prisma.transaction.create({
        data: {
            userId,
            accountId: input.accountId,
            cardId: input.cardId ?? null,
            categoryId: input.categoryId ?? null,
            amount: input.amount,
            type: input.type,
            description: input.description,
            date: referenceDate,
            paymentMethod: input.paymentMethod,
            status: input.status,
            notes: input.notes ?? null,
        },
        include: {
            account: {select: {name: true, bank: true}},
            card: {select: {nickname: true, lastFour: true}},
            category: {select: {name: true, icon: true, color: true}},
        },
    })
}