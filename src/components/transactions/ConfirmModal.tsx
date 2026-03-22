'use client'

import { X } from 'lucide-react'

type ConfirmModalProps = {
    title: string
    message: string
    confirmLabel?: string
    onConfirm: () => void
    onClose: () => void
    loading?: boolean
}

export function ConfirmModal({
                                 title,
                                 message,
                                 confirmLabel = 'Confirmar',
                                 onConfirm,
                                 onClose,
                                 loading = false,
                             }: ConfirmModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60 px-4">
            <div className="w-full max-w-md bg-surface-card rounded-2xl shadow-2xl border border-white/5 p-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-xl font-bold text-text-primary">{title}</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <p className="text-text-secondary text-sm mb-8">{message}</p>

                <div className="flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-text-secondary hover:text-text-primary font-medium transition-colors text-sm"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="bg-status-error text-white px-6 py-2.5 rounded-lg font-bold hover:opacity-90 transition-colors text-sm disabled:opacity-50"
                    >
                        {loading ? 'Excluindo...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}