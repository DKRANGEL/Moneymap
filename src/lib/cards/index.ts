import { prisma } from '@/lib/prisma'
import { CardBrand } from '@prisma/client'

export type CreateCardInput = {
    nickname: string
    lastFour: string
    brand: CardBrand
    closingDay: number
    dueDay: number
}

export async function getCardsByAccount(userId: string, accountId: string) {
    return prisma.card.findMany({
        where: { userId, accountId },
        orderBy: { createdAt: 'desc' },
    })
}

export async function createCard(
    userId: string,
    accountId: string,
    input: CreateCardInput
) {
    return prisma.card.create({
        data: {
            userId,
            accountId,
            nickname: input.nickname,
            lastFour: input.lastFour,
            brand: input.brand,
            closingDay: input.closingDay,
            dueDay: input.dueDay,
        },
    })
}

export async function getCardById(userId: string, cardId: string) {
    return prisma.card.findFirst({
        where: { id: cardId, userId },
    })
}

export async function updateCard(
    userId: string,
    cardId: string,
    input: Partial<CreateCardInput> & { isActive?: boolean }
) {
    return prisma.card.update({
        where: { id: cardId, userId },
        data: input,
    })
}