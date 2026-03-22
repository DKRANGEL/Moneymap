import { prisma } from '@/lib/prisma'
import { BankType, AccountType } from '@prisma/client'

export type CreateAccountInput = {
    name: string
    bank: BankType
    type: AccountType
}

export async function getAccountsByUser(userId: string) {
    return prisma.account.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    })
}

export async function createAccount(userId: string, input: CreateAccountInput) {
    return prisma.account.create({
        data: {
            userId,
            name: input.name,
            bank: input.bank,
            type: input.type,
        },
    })
}