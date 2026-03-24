'use client'

import {X} from 'lucide-react'

type RecurringEditModalProps = {
    isFixed: boolean
    onConfirm: (editAll: boolean) => void
    onClose: () => void
}

export function RecurringEditModal({isFixed, onConfirm, onClose}: RecurringEditModalProps) {
    const label = isFixed ? 'conta fixa' : 'parcelamento'

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60 px-4">
            <div className="w-full max-w-md bg-surface-card rounded-2xl shadow-2xl border border-white/5 p-8">

                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-xl font-bold text-text-primary">Editar transação</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition-colors">
                        <X size={20}/>
                    </button>
                </div>

                <p className="text-text-secondary text-sm mb-8">
                    Esta transação faz parte de uma {label}. O que deseja editar?
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => onConfirm(false)}
                        className="w-full py-3 px-6 bg-surface-high text-text-primary rounded-lg font-medium text-sm hover:bg-surface-bright transition-colors text-left"
                    >
                        <p className="font-semibold">Só esta</p>
                        <p className="text-xs text-text-secondary mt-0.5">
                            {isFixed ? 'Edita apenas este mês' : 'Edita apenas esta parcela'}
                        </p>
                    </button>
                    <button
                        onClick={() => onConfirm(true)}
                        className="w-full py-3 px-6 bg-accent/10 text-accent rounded-lg font-medium text-sm hover:bg-accent/20 transition-colors text-left"
                    >
                        <p className="font-semibold">
                            {isFixed ? 'Esta e todas as próximas' : 'Esta e as parcelas restantes'}
                        </p>
                        <p className="text-xs text-accent/70 mt-0.5">
                            {isFixed ? 'Atualiza este e todos os meses seguintes' : 'Recalcula datas em cascata a partir desta parcela'}
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