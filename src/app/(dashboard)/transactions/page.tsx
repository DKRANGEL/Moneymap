import {createClient} from '@/lib/supabase/server'
import {redirect} from 'next/navigation'
import {getTransactionsByMonth, getMonthlySummary} from '@/lib/transactions'
import {getAccountsByUser} from '@/lib/accounts'
import {TransactionsClient} from '@/components/transactions/TransactionsClient'

export default async function TransactionsPage() {
    const supabase = await createClient()
    const {data: {user}} = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const now = new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()

    const [transactions, summary, accounts] = await Promise.all([
        getTransactionsByMonth(user.id, month, year),
        getMonthlySummary(user.id, month, year),
        getAccountsByUser(user.id),
    ])

    const serializedTransactions = transactions.map(tx => ({
        ...tx,
        amount: Number(tx.amount),
        date: tx.date.toISOString(),
    }))

    return (
        <TransactionsClient
            initialTransactions={serializedTransactions}
            initialSummary={summary}
            initialAccounts={accounts}
            initialMonth={month}
            initialYear={year}
        />
    )
}