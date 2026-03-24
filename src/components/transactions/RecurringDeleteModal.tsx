'use client'

import {X} from 'lucide-react'

type Transaction = {
    id: string
    description: string
    isFixed: boolean
    installmentNumber: number | null
    installmentsTotal: number | null
}

type RecurringDeleteModalProps = {
    transaction: Transaction
    onConfirm: (deleteAll: boolean) => void
    onClose: () => void
    loading?: boolean
}

export function RecurringDeleteModal({
                                         transaction,
                                         onConfirm,
                                         onClose,
                                         loading = false,
                                     }: RecurringDeleteModalProps) {
    const isFixed = transaction.isFixed
    const label = isFixed ? 'conta fixa' : 'parcelamento'

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60 px-4">
            <div className="w-full max-w-md bg-surface-card rounded-2xl shadow-2xl border border-white/5 p-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-xl font-bold text-text-primary">Excluir transação</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition-colors">
                        <X size={20}/>
                    </button>
                </div>

                <p className="text-text-secondary text-sm mb-2">
                    <span className="text-text-primary font-semibold">{transaction.description}</span>
                    {!isFixed && transaction.installmentNumber && transaction.installmentsTotal && (
                        <span
                            className="text-text-secondary"> ({transaction.installmentNumber}/{transaction.installmentsTotal})</span>
                    )}
                </p>
                <p className="text-text-secondary text-sm mb-8">
                    Esta transação faz parte de uma {label}. O que deseja excluir?
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => onConfirm(false)}
                        disabled={loading}
                        className="w-full py-3 px-6 bg-surface-high text-text-primary rounded-lg font-medium text-sm hover:bg-surface-bright transition-colors disabled:opacity-50 text-left"
                    >
                        <p className="font-semibold">Só esta</p>
                        <p className="text-xs text-text-secondary mt-0.5">
                            {isFixed ? 'Remove apenas este mês' : 'Remove apenas esta parcela'}
                        </p>
                    </button>
                    <button
                        onClick={() => onConfirm(true)}
                        disabled={loading}
                        className="w-full py-3 px-6 bg-status-error/10 text-status-error rounded-lg font-medium text-sm hover:bg-status-error/20 transition-colors disabled:opacity-50 text-left"
                    >
                        <p className="font-semibold">
                            {isFixed ? 'Esta e todas as próximas' : 'Esta e as parcelas restantes'}
                        </p>
                        <p className="text-xs text-status-error/70 mt-0.5">
                            {isFixed ? 'Cancela a conta fixa a partir deste mês' : 'Remove este e todos os próximos parcelamentos'}
                        </p>
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="w-full mt-4 py-2.5 text-text-secondary hover:text-text-primary font-medium transition-colors text-sm"
                >
                    Cancelar
                </button>

            </div>
        </div>
    )
}