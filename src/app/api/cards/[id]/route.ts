import {NextRequest, NextResponse} from 'next/server'
import {createClient} from '@/lib/supabase/server'
import {getCardById, updateCard} from '@/lib/cards'
import {z} from 'zod'
import {CardBrand} from '@prisma/client'

const updateCardSchema = z.object({
    nickname: z.string().min(1).max(100).optional(),
    lastFour: z.string().length(4).regex(/^\d{4}$/).optional(),
    brand: z.nativeEnum(CardBrand).optional(),
    closingDay: z.number().int().min(1).max(31).optional(),
    dueDay: z.number().int().min(1).max(31).optional(),
    isActive: z.boolean().optional(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
})

type RouteParams = { params: { id: string } }

export async function GET(_request: NextRequest, {params}: RouteParams) {
    const supabase = await createClient()
    const {data: {user}} = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({error: 'Não autorizado'}, {status: 401})
    }

    try {
        const card = await getCardById(user.id, params.id)

        if (!card) {
            return NextResponse.json({error: 'Cartão não encontrado'}, {status: 404})
        }

        return NextResponse.json(card)
    } catch {
        return NextResponse.json({error: 'Erro ao buscar cartão'}, {status: 500})
    }
}

export async function PATCH(request: NextRequest, {params}: RouteParams) {
    const supabase = await createClient()
    const {data: {user}} = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({error: 'Não autorizado'}, {status: 401})
    }

    try {
        const body = await request.json()
        const parsed = updateCardSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                {error: 'Dados inválidos', details: parsed.error.flatten()},
                {status: 400}
            )
        }

        const card = await getCardById(user.id, params.id)

        if (!card) {
            return NextResponse.json({error: 'Cartão não encontrado'}, {status: 404})
        }

        const updated = await updateCard(user.id, params.id, parsed.data)
        return NextResponse.json(updated)
    } catch {
        return NextResponse.json({error: 'Erro ao atualizar cartão'}, {status: 500})
    }
}