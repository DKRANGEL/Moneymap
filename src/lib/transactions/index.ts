import {prisma} from '@/lib/prisma'
import {PaymentMethod, TransactionStatus, TransactionType} from '@prisma/client'
import {v4 as uuidv4} from 'uuid'

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
    // Fixas
    isFixed?: boolean
    fixedDay?: number
    // Parceladas
    installmentsTotal?: number
    installmentNumberStart?: number
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
            if (month === 12) return {month: 1, year: year + 1}
            return {month: month + 1, year}
        }
    }

    return {month, year}
}

// Adiciona N meses a uma data
function addMonths(date: Date, months: number): Date {
    const result = new Date(date)
    result.setMonth(result.getMonth() + months)
    return result
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
    // Busca cartão se crédito
    let closingDay: number | undefined
    if (input.paymentMethod === 'credito' && input.cardId) {
        const card = await prisma.card.findFirst({
            where: {id: input.cardId, userId},
        })
        if (card) closingDay = card.closingDay
    }

    // Conta fixa — cria 12 ocorrências
    if (input.isFixed && input.fixedDay) {
        const recurringGroupId = uuidv4()
        const transactions = []

        for (let i = 0; i < 12; i++) {
            const baseDate = addMonths(input.date, i)
            const occurrenceDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), input.fixedDay)

            let referenceDate = occurrenceDate
            if (input.paymentMethod === 'credito' && closingDay !== undefined) {
                const {month, year} = getTransactionReferenceMonth(occurrenceDate, input.paymentMethod, closingDay)
                referenceDate = new Date(year, month - 1, input.fixedDay)
            }

            transactions.push({
                userId,
                accountId: input.accountId,
                cardId: input.cardId ?? null,
                categoryId: input.categoryId ?? null,
                amount: input.amount,
                type: input.type,
                description: input.description,
                date: referenceDate,
                paymentMethod: input.paymentMethod,
                status: i === 0 ? input.status : 'pendente',
                notes: input.notes ?? null,
                isFixed: true,
                recurringGroupId,
            })
        }

        await prisma.transaction.createMany({data: transactions})

        return prisma.transaction.findFirst({
            where: {recurringGroupId},
            include: {
                account: {select: {name: true, bank: true}},
                card: {select: {nickname: true, lastFour: true}},
                category: {select: {name: true, icon: true, color: true}},
            },
            orderBy: {date: 'asc'},
        })
    }

    // Parcelada — cria N parcelas a partir da parcela inicial
    if (input.installmentsTotal && input.installmentsTotal > 1) {
        const recurringGroupId = uuidv4()
        const startInstallment = input.installmentNumberStart ?? 1
        const remainingInstallments = input.installmentsTotal - startInstallment + 1
        const transactions = []

        for (let i = 0; i < remainingInstallments; i++) {
            const installmentNumber = startInstallment + i
            const baseDate = addMonths(input.date, i)

            // Parceladas não aplicam lógica de virada — data informada é a data real da parcela
            const referenceDate = baseDate

            transactions.push({
                userId,
                accountId: input.accountId,
                cardId: input.cardId ?? null,
                categoryId: input.categoryId ?? null,
                amount: input.amount,
                type: input.type,
                description: `${input.description} (${installmentNumber}/${input.installmentsTotal})`,
                date: referenceDate,
                paymentMethod: input.paymentMethod,
                status: i === 0 ? input.status : 'pendente',
                notes: input.notes ?? null,
                isFixed: false,
                installmentNumber,
                installmentsTotal: input.installmentsTotal,
                recurringGroupId,
            })
        }

        await prisma.transaction.createMany({data: transactions})

        return prisma.transaction.findFirst({
            where: {recurringGroupId},
            include: {
                account: {select: {name: true, bank: true}},
                card: {select: {nickname: true, lastFour: true}},
                category: {select: {name: true, icon: true, color: true}},
            },
            orderBy: {date: 'asc'},
        })
    }

    // Transação simples
    let referenceDate = input.date
    if (input.paymentMethod === 'credito' && closingDay !== undefined) {
        const {month, year} = getTransactionReferenceMonth(input.date, input.paymentMethod, closingDay)
        referenceDate = new Date(year, month - 1, input.date.getDate())
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