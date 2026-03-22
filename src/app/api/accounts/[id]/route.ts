import {NextRequest, NextResponse} from 'next/server'
import {createClient} from '@/lib/supabase/server'
import {getAccountById, updateAccount} from '@/lib/accounts'
import {z} from 'zod'
import {BankType, AccountType} from '@prisma/client'

const updateAccountSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    bank: z.nativeEnum(BankType).optional(),
    type: z.nativeEnum(AccountType).optional(),
    isActive: z.boolean().optional(),
})

type RouteParams = { params: { id: string } }

export async function GET(_request: NextRequest, {params}: RouteParams) {
    const supabase = await createClient()
    const {data: {user}} = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({error: 'Não autorizado'}, {status: 401})
    }

    try {
        const account = await getAccountById(user.id, params.id)

        if (!account) {
            return NextResponse.json({error: 'Conta não encontrada'}, {status: 404})
        }

        return NextResponse.json(account)
    } catch {
        return NextResponse.json({error: 'Erro ao buscar conta'}, {status: 500})
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
        const parsed = updateAccountSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                {error: 'Dados inválidos', details: parsed.error.flatten()},
                {status: 400}
            )
        }

        const account = await getAccountById(user.id, params.id)

        if (!account) {
            return NextResponse.json({error: 'Conta não encontrada'}, {status: 404})
        }

        const updated = await updateAccount(user.id, params.id, parsed.data)
        return NextResponse.json(updated)
    } catch {
        return NextResponse.json({error: 'Erro ao atualizar conta'}, {status: 500})
    }
}