'use client'

import {useState} from 'react'
import {Account, BankType, AccountType} from '@prisma/client'
import {X} from 'lucide-react'

const BANK_OPTIONS = [
    {value: 'nubank', label: 'Nubank'},
    {value: 'mercadopago', label: 'Mercado Pago'},
    {value: 'picpay', label: 'PicPay'},
    {value: 'btg', label: 'BTG Pactual'},
    {value: 'other', label: 'Outro'},
]

const TYPE_OPTIONS = [
    { value: 'conta_digital', label: 'Conta Digital' },
    { value: 'investimento', label: 'Investimento' },
]

type AccountModalProps = {
    account: Account | null
    onClose: () => void
    onSaved: (account: Account) => void
}

export function AccountModal({account, onClose, onSaved}: AccountModalProps) {
    const [name, setName] = useState(account?.name ?? '')
    const [bank, setBank] = useState<BankType>(account?.bank ?? 'nubank')
    const [type, setType] = useState<AccountType>(account?.type ?? 'conta_digital')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const isEditing = !!account

    async function handleSubmit() {
        if (!name.trim()) {
            setError('Nome da conta é obrigatório')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const url = isEditing ? `/api/accounts/${account.id}` : '/api/accounts'
            const method = isEditing ? 'PATCH' : 'POST'

            const res = await fetch(url, {
                method,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name, bank, type}),
            })

            if (!res.ok) {
                const data = await res.json()
                setError(data.error ?? 'Erro ao salvar conta')
                return
            }

            const saved = await res.json()
            onSaved(saved)
        } catch {
            setError('Erro inesperado. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60 px-4">
            <div className="w-full max-w-lg bg-surface-card rounded-2xl shadow-2xl p-8 border border-white/5">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="font-display text-2xl font-bold text-text-primary">
                            {isEditing ? 'Editar Conta' : 'Nova Conta'}
                        </h2>
                        <div className="h-1 w-12 bg-accent mt-2 rounded-full"/>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-text-secondary hover:text-text-primary transition-colors"
                    >
                        <X size={20}/>
                    </button>
                </div>

                {/* Campos */}
                <div className="flex flex-col gap-6">

                    {/* Nome */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                            Apelido da Conta
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Ex: Conta Principal"
                            className="w-full bg-surface-low border-0 border-l-2 border-accent rounded-lg px-4 py-3 text-text-primary placeholder:text-text-secondary focus:ring-0 focus:outline-none text-sm"
                        />
                    </div>

                    {/* Banco */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                            Banco
                        </label>
                        <select
                            value={bank}
                            onChange={e => setBank(e.target.value as BankType)}
                            className="w-full bg-surface-low border-0 rounded-lg px-4 py-3 text-text-primary focus:ring-0 focus:outline-none text-sm appearance-none"
                        >
                            {BANK_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Tipo */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                            Tipo de Conta
                        </label>
                        <select
                            value={type}
                            onChange={e => setType(e.target.value as AccountType)}
                            className="w-full bg-surface-low border-0 rounded-lg px-4 py-3 text-text-primary focus:ring-0 focus:outline-none text-sm appearance-none"
                        >
                            {TYPE_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Erro */}
                    {error && (
                        <p className="text-status-error text-sm">{error}</p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t border-white/5">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-text-secondary hover:text-text-primary font-medium transition-colors text-sm"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-accent text-accent-dark px-8 py-2.5 rounded-lg font-bold hover:bg-accent/90 transition-colors text-sm disabled:opacity-50"
                    >
                        {loading ? 'Salvando...' : isEditing ? 'Salvar' : 'Criar Conta'}
                    </button>
                </div>

            </div>
        </div>
    )
}