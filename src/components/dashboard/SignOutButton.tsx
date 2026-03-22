'use client'

import {createClient} from '@/lib/supabase/client'
import {useRouter} from 'next/navigation'
import {LogOut} from 'lucide-react'

export function SignOutButton() {
    const router = useRouter()

    async function handleSignOut() {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-text-secondary hover:text-status-error
                 transition-colors duration-150"
            aria-label="Sair"
            title="Sair"
        >
            <LogOut size={16}/>
        </button>
    )
}