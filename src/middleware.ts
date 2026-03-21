import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const PUBLIC_ROUTES = ['/login']

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    const response = NextResponse.next({
        request: { headers: request.headers },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value)
                        response.cookies.set(name, value, options)
                    })
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    const isPublicRoute = PUBLIC_ROUTES.some(route =>
        pathname.startsWith(route)
    )

    // Não autenticado tentando acessar rota protegida
    if (!user && !isPublicRoute) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Autenticado tentando acessar rota pública
    if (user && isPublicRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|logo.png|api/auth).*)',
    ],
}