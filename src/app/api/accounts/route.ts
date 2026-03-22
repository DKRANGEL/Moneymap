import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAccountsByUser, createAccount } from '@/lib/accounts'
import { z } from 'zod'
import { BankType, AccountType } from '@prisma/client'

const createAccountSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório').max(100),
    bank: z.nativeEnum(BankType),
    type: z.nativeEnum(AccountType),
})

export async function GET() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    try {
        const accounts = await getAccountsByUser(user.id)
        return NextResponse.json(accounts)
    } catch {
        return NextResponse.json({ error: 'Erro ao buscar contas' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const parsed = createAccountSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Dados inválidos', details: parsed.error.flatten() },
                { status: 400 }
            )
        }

        const account = await createAccount(user.id, parsed.data)
        return NextResponse.json(account, { status: 201 })
    } catch {
        return NextResponse.json({ error: 'Erro ao criar conta' }, { status: 500 })
    }
}