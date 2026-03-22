import {prisma} from '@/lib/prisma'
import {BankType, AccountType} from '@prisma/client'

export type CreateAccountInput = {
    name: string
    bank: BankType
    type: AccountType
}

export async function getAccountsByUser(userId: string) {
    return prisma.account.findMany({
        where: {userId},
        orderBy: {createdAt: 'desc'},
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

export async function getAccountById(userId: string, accountId: string) {
    return prisma.account.findFirst({
        where: {id: accountId, userId},
    })
}

export async function updateAccount(
    userId: string,
    accountId: string,
    input: Partial<CreateAccountInput> & { isActive?: boolean }
) {
    return prisma.account.update({
        where: {id: accountId, userId},
        data: input,
    })
}