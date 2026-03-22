'use client'

import {useState} from 'react'
import {Account} from '@prisma/client'
import {Plus} from 'lucide-react'
import {AccountCard} from './AccountCard'
import {AccountModal} from './AccountModal'

type AccountsClientProps = {
    initialAccounts: Account[]
}

export function AccountsClient({initialAccounts}: AccountsClientProps) {
    const [accounts, setAccounts] = useState(initialAccounts)
    const [modalOpen, setModalOpen] = useState(false)
    const [editingAccount, setEditingAccount] = useState<Account | null>(null)

    async function handleToggleActive(account: Account) {
        const res = await fetch(`/api/accounts/${account.id}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({isActive: !account.isActive}),
        })

        if (res.ok) {
            const updated = await res.json()
            setAccounts(prev => prev.map(a => a.id === updated.id ? updated : a))
        }
    }

    function handleEdit(account: Account) {
        setEditingAccount(account)
        setModalOpen(true)
    }

    function handleModalClose() {
        setModalOpen(false)
        setEditingAccount(null)
    }

    function handleAccountSaved(account: Account) {
        setAccounts(prev => {
            const exists = prev.find(a => a.id === account.id)
            return exists
                ? prev.map(a => a.id === account.id ? account : a)
                : [account, ...prev]
        })
        handleModalClose()
    }

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-3xl font-bold text-text-primary">
                        Contas
                    </h1>
                    <p className="text-text-secondary text-sm mt-1">
                        Gerencie suas contas bancárias.
                    </p>
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 bg-accent text-accent-dark px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-accent/90 transition-colors"
                >
                    <Plus size={16}/>
                    Nova Conta
                </button>
            </div>

            {/* Grid de cards */}
            {accounts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-16 h-16 bg-surface-card rounded-2xl flex items-center justify-center mb-4">
                        <span className="text-2xl">🏦</span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-text-primary mb-2">
                        Nenhuma conta cadastrada
                    </h3>
                    <p className="text-text-secondary text-sm max-w-sm">
                        Adicione sua primeira conta para começar a mapear suas finanças.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {accounts.map(account => (
                        <AccountCard
                            key={account.id}
                            account={account}
                            onEdit={handleEdit}
                            onToggleActive={handleToggleActive}
                        />
                    ))}
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <AccountModal
                    account={editingAccount}
                    onClose={handleModalClose}
                    onSaved={handleAccountSaved}
                />
            )}
        </div>
    )
}