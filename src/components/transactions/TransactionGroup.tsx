import {TransactionCard} from './TransactionCard'

type Transaction = {
    id: string
    description: string
    amount: number
    type: string
    date: string
    paymentMethod: string
    status: string
    notes: string | null
    account: { name: string; bank: string }
    card: { nickname: string; lastFour: string } | null
    category: { name: string; icon: string | null; color: string | null } | null
}

const DAY_NAMES = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado']
const MONTH_NAMES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']

type TransactionGroupProps = {
    date: string
    transactions: Transaction[]
    onEdit: (transaction: Transaction) => void
    onDelete: (transaction: Transaction) => void
}

export function TransactionGroup({date, transactions, onEdit, onDelete}: TransactionGroupProps) {
    const d = new Date(date + 'T12:00:00')
    const dayName = DAY_NAMES[d.getDay()]
    const dayNumber = d.getDate()
    const monthName = MONTH_NAMES[d.getMonth()]

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
                <h3 className="text-sm font-bold text-text-secondary whitespace-nowrap">
                    {dayNumber} de {monthName}, {dayName}
                </h3>
                <div className="flex-1 h-px bg-surface-high"/>
            </div>
            <div className="flex flex-col gap-2">
                {transactions.map(tx => (
                    <TransactionCard
                        key={tx.id}
                        transaction={tx}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    )
}