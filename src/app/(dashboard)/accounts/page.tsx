import {createClient} from '@/lib/supabase/server'
import {getAccountsByUser} from '@/lib/accounts'
import {AccountsClient} from '@/components/accounts/AccountsClient'
import {redirect} from 'next/navigation'

export default async function AccountsPage() {
    const supabase = await createClient()
    const {data: {user}} = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const accounts = await getAccountsByUser(user.id)

    return <AccountsClient initialAccounts={accounts}/>
}