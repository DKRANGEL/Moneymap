import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
        return NextResponse.redirect(`${origin}/login?error=missing_code`)
    }

    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error || !data.user) {
        return NextResponse.redirect(`${origin}/login?error=auth_failed`)
    }

    const { id, email, user_metadata } = data.user

    if (!email) {
        return NextResponse.redirect(`${origin}/login?error=missing_email`)
    }

    try {
        await prisma.user.upsert({
            where: { id },
            update: {
                email,
                name: user_metadata?.full_name ?? null,
                avatarUrl: user_metadata?.avatar_url ?? null,
            },
            create: {
                id,
                email,
                name: user_metadata?.full_name ?? null,
                avatarUrl: user_metadata?.avatar_url ?? null,
            },
        })
    } catch (err) {
        console.error('[callback] prisma upsert failed:', err)
        return NextResponse.redirect(`${origin}/login?error=db_error`)
    }

    return NextResponse.redirect(`${origin}/dashboard`)
}