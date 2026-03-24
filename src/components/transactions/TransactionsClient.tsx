'use client'

import {useState} from 'react'
import {Account} from '@prisma/client'
import {Plus} from 'lucide-react'
import {MonthNavigator} from './MonthNavigator'
import {MonthlySummary} from './MonthlySummary'
import {FilterBar} from './FilterBar'
import {TransactionGroup} from './TransactionGroup'
import {TransactionModal} from './TransactionModal'
import {ConfirmModal} from './ConfirmModal'
import {RecurringDeleteModal} from './RecurringDeleteModal'

type Transaction = {
    id: string
    description: string
    amount: number
    type: string
    date: string
    paymentMethod: string
    status: string
    notes: string | null
    recurringGroupId: string | null
    installmentNumber: number | null
    installmentsTotal: number | null
    isFixed: boolean
    account: { name: string; bank: string }
    card: { nickname: string; lastFour: string } | null
    category: { name: string; icon: string | null; color: string | null } | null
}

type Summary = {
    receitas: number
    despesas: number
    saldo: number
}

type Filters = {
    type?: string
    accountId?: string
    cardId?: string
    status?: string
    paymentMethod?: string
}

type TransactionsClientProps = {
    initialTransactions: Transaction[]
    initialSummary: Summary
    initialAccounts: Account[]
    initialMonth: number
    initialYear: number
}

export function TransactionsClient({
                                       initialTransactions,
                                       initialSummary,
                                       initialAccounts,
                                       initialMonth,
                                       initialYear,
                                   }: TransactionsClientProps) {
    const [transactions, setTransactions] = useState(initialTransactions)
    const [summary, setSummary] = useState(initialSummary)
    const [month, setMonth] = useState(initialMonth)
    const [year, setYear] = useState(initialYear)
    const [filters, setFilters] = useState<Filters>({})
    const [modalOpen, setModalOpen] = useState(false)
    const [duplicatingTransaction, setDuplicatingTransaction] = useState<Transaction | null>(null)
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
    const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [loading, setLoading] = useState(false)

    async function fetchTransactions(m: number, y: number, f: Filters = {}) {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                month: String(m),
                year: String(y),
                ...(f.type && {type: f.type}),
                ...(f.accountId && {accountId: f.accountId}),
                ...(f.cardId && {cardId: f.cardId}),
                ...(f.status && {status: f.status}),
                ...(f.paymentMethod && {paymentMethod: f.paymentMethod}),
            })

            const res = await fetch(`/api/transactions?${params}`)
            if (res.ok) {
                const data = await res.json()
                setTransactions(data.transactions.map((tx: Transaction & { amount: unknown }) => ({
                    ...tx,
                    amount: Number(tx.amount),
                    date: typeof tx.date === 'string' ? tx.date : new Date(tx.date).toISOString(),
                })))
                setSummary(data.summary)
            }
        } finally {
            setLoading(false)
        }
    }

    function handleMonthChange(newMonth: number, newYear: number) {
        setMonth(newMonth)
        setYear(newYear)
        fetchTransactions(newMonth, newYear, filters)
    }

    function handleFilterChange(newFilters: Filters) {
        setFilters(newFilters)
        fetchTransactions(month, year, newFilters)
    }

    function handleTransactionSaved() {
        fetchTransactions(month, year, filters)
        setModalOpen(false)
        setEditingTransaction(null)
    }

    function handleEdit(transaction: Transaction) {
        setEditingTransaction(transaction)
        setModalOpen(true)
    }

    function handleDuplicate(transaction: Transaction) {
        setDuplicatingTransaction(transaction)
        setEditingTransaction(null)
        setModalOpen(true)
    }

    function handleDeleteRequest(transaction: Transaction) {
        setDeletingTransaction(transaction)
    }

    async function handleDeleteConfirm(deleteAll: boolean = false) {
        if (!deletingTransaction) return
        setDeleteLoading(true)
        try {
            const url = deleteAll
                ? `/api/transactions/${deletingTransaction.id}?deleteAll=true`
                : `/api/transactions/${deletingTransaction.id}`

            const res = await fetch(url, {method: 'DELETE'})
            if (res.ok) {
                setDeletingTransaction(null)
                fetchTransactions(month, year, filters)
            }
        } finally {
            setDeleteLoading(false)
        }
    }

    const grouped = transactions.reduce<Record<string, Transaction[]>>((acc, tx) => {
        const day = new Date(tx.date).toISOString().split('T')[0]!
        if (!acc[day]) acc[day] = []
        acc[day].push(tx)
        return acc
    }, {})

    const sortedDays = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

    return (
        <div className="flex flex-col gap-8">
            <MonthNavigator month={month} year={year} onChange={handleMonthChange}/>
            <MonthlySummary summary={summary}/>
            <FilterBar accounts={initialAccounts} filters={filters} onChange={handleFilterChange}/>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <p className="text-text-secondary text-sm">Carregando...</p>
                </div>
            ) : sortedDays.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <span className="text-4xl mb-4">💸</span>
                    <h3 className="font-display text-lg font-semibold text-text-primary mb-2">
                        Nenhuma transação em {month}/{year}
                    </h3>
                    <p className="text-text-secondary text-sm">
                        Clique no botão + para adicionar uma transação.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-8">
                    {sortedDays.map(day => (
                        <TransactionGroup
                            key={day}
                            date={day}
                            transactions={grouped[day]!}
                            onEdit={handleEdit}
                            onDuplicate={handleDuplicate}
                            onDelete={handleDeleteRequest}
                        />
                    ))}
                </div>
            )}

            {/* FAB */}
            <button
                onClick={() => {
                    setEditingTransaction(null);
                    setModalOpen(true)
                }}
                className="fixed bottom-10 right-10 w-14 h-14 rounded-full bg-accent text-accent-dark shadow-2xl shadow-accent/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-50"
            >
                <Plus size={24}/>
            </button>

            {/* Modal criação/edição */}
            {modalOpen && (
                <TransactionModal
                    accounts={initialAccounts}
                    transaction={editingTransaction}
                    duplicateFrom={duplicatingTransaction}
                    onClose={() => {
                        setModalOpen(false)
                        setEditingTransaction(null)
                        setDuplicatingTransaction(null)
                    }}
                    onSaved={handleTransactionSaved}
                />
            )}

            {/* Modal confirmação exclusão */}
            {deletingTransaction && (
                deletingTransaction.recurringGroupId ? (
                    <RecurringDeleteModal
                        transaction={deletingTransaction}
                        onConfirm={handleDeleteConfirm}
                        onClose={() => setDeletingTransaction(null)}
                        loading={deleteLoading}
                    />
                ) : (
                    <ConfirmModal
                        title="Excluir transação"
                        message={`Tem certeza que deseja excluir "${deletingTransaction.description}"? Esta ação não pode ser desfeita.`}
                        confirmLabel="Excluir"
                        onConfirm={() => handleDeleteConfirm(false)}
                        onClose={() => setDeletingTransaction(null)}
                        loading={deleteLoading}
                    />
                )
            )}
        </div>
    )
}