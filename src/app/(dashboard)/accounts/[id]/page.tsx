import {createClient} from '@/lib/supabase/server'
import {getAccountById} from '@/lib/accounts'
import {getCardsByAccount} from '@/lib/cards'
import {redirect, notFound} from 'next/navigation'
import {AccountDetailClient} from '@/components/accounts/AccountDetailClient'

type PageProps = { params: { id: string } }

export default async function AccountDetailPage({params}: PageProps) {
    const supabase = await createClient()
    const {data: {user}} = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const account = await getAccountById(user.id, params.id)
    if (!account) notFound()

    const cards = await getCardsByAccount(user.id, params.id)

    return <AccountDetailClient account={account} initialCards={cards}/>
}