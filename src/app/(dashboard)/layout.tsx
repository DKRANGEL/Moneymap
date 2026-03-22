import {redirect} from 'next/navigation'
import {createClient} from '@/lib/supabase/server'
import {Sidebar} from '@/components/dashboard/Sidebar'

export default async function DashboardLayout({
                                                  children,
                                              }: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const {data: {user}} = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const userData = {
        name: user.user_metadata?.full_name ?? null,
        email: user.email ?? '',
        avatarUrl: user.user_metadata?.avatar_url ?? null,
    }

    return (
        <div className="flex h-screen bg-surface-base overflow-hidden">
            <Sidebar user={userData}/>
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    )
}