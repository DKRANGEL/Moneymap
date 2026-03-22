import {NextRequest, NextResponse} from 'next/server'
import {createClient} from '@/lib/supabase/server'
import {getCardsByAccount, createCard} from '@/lib/cards'
import {z} from 'zod'
import {CardBrand} from '@prisma/client'

const createCardSchema = z.object({
    accountId: z.string().uuid(),
    nickname: z.string().min(1).max(100),
    lastFour: z.string().length(4).regex(/^\d{4}$/),
    brand: z.nativeEnum(CardBrand),
    closingDay: z.number().int().min(1).max(31),
    dueDay: z.number().int().min(1).max(31),
})

export async function GET(request: NextRequest) {
    const supabase = await createClient()
    const {data: {user}} = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({error: 'Não autorizado'}, {status: 401})
    }

    const {searchParams} = new URL(request.url)
    const accountId = searchParams.get('accountId')

    if (!accountId) {
        return NextResponse.json({error: 'accountId é obrigatório'}, {status: 400})
    }

    try {
        const cards = await getCardsByAccount(user.id, accountId)
        return NextResponse.json(cards)
    } catch {
        return NextResponse.json({error: 'Erro ao buscar cartões'}, {status: 500})
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
        const parsed = createCardSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                {error: 'Dados inválidos', details: parsed.error.flatten()},
                {status: 400}
            )
        }

        const {accountId, ...cardInput} = parsed.data
        const card = await createCard(user.id, accountId, cardInput)
        return NextResponse.json(card, {status: 201})
    } catch {
        return NextResponse.json({error: 'Erro ao criar cartão'}, {status: 500})
    }
}