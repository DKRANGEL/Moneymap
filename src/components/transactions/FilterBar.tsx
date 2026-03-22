'use client'

import {Account} from '@prisma/client'

type Filters = {
    type?: string
    accountId?: string
    cardId?: string
    status?: string
    paymentMethod?: string
}

type FilterBarProps = {
    accounts: Account[]
    filters: Filters
    onChange: (filters: Filters) => void
}

export function FilterBar({accounts, filters, onChange}: FilterBarProps) {
    function handleChange(key: keyof Filters, value: string) {
        const updated = {...filters, [key]: value || undefined}
        onChange(updated)
    }

    function handleClear() {
        onChange({})
    }

    const hasFilters = Object.values(filters).some(Boolean)

    return (
        <div className="flex flex-wrap items-center gap-3">
            <select
                value={filters.type ?? ''}
                onChange={e => handleChange('type', e.target.value)}
                className="px-4 py-2 rounded-full bg-surface-low text-text-secondary text-xs font-semibold focus:ring-0 focus:outline-none appearance-none cursor-pointer hover:bg-surface-card transition-colors"
            >
                <option value="">Tipo</option>
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
            </select>

            <select
                value={filters.accountId ?? ''}
                onChange={e => handleChange('accountId', e.target.value)}
                className="px-4 py-2 rounded-full bg-surface-low text-text-secondary text-xs font-semibold focus:ring-0 focus:outline-none appearance-none cursor-pointer hover:bg-surface-card transition-colors"
            >
                <option value="">Conta</option>
                {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                ))}
            </select>

            <select
                value={filters.status ?? ''}
                onChange={e => handleChange('status', e.target.value)}
                className="px-4 py-2 rounded-full bg-surface-low text-text-secondary text-xs font-semibold focus:ring-0 focus:outline-none appearance-none cursor-pointer hover:bg-surface-card transition-colors"
            >
                <option value="">Status</option>
                <option value="pago">Pago</option>
                <option value="pendente">Pendente</option>
                <option value="agendado">Agendado</option>
            </select>

            <select
                value={filters.paymentMethod ?? ''}
                onChange={e => handleChange('paymentMethod', e.target.value)}
                className="px-4 py-2 rounded-full bg-surface-low text-text-secondary text-xs font-semibold focus:ring-0 focus:outline-none appearance-none cursor-pointer hover:bg-surface-card transition-colors"
            >
                <option value="">Forma</option>
                <option value="pix">PIX</option>
                <option value="boleto">Boleto</option>
                <option value="credito">Crédito</option>
                <option value="debito">Débito</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="transferencia">Transferência</option>
            </select>

            {hasFilters && (
                <button
                    onClick={handleClear}
                    className="text-xs font-bold text-text-secondary hover:text-text-primary transition-colors underline underline-offset-4"
                >
                    Limpar filtros
                </button>
            )}
        </div>
    )
}