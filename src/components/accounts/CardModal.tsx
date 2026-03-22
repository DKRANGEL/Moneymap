'use client'

import {useState} from 'react'
import {Card, CardBrand} from '@prisma/client'
import {X} from 'lucide-react'

const BRAND_OPTIONS = [
    {value: 'visa', label: 'Visa'},
    {value: 'mastercard', label: 'Mastercard'},
    {value: 'elo', label: 'Elo'},
    {value: 'hipercard', label: 'Hipercard'},
    {value: 'amex', label: 'Amex'},
    {value: 'other', label: 'Outro'},
]

type CardModalProps = {
    accountId: string
    card: Card | null
    onClose: () => void
    onSaved: (card: Card) => void
}

export function CardModal({accountId, card, onClose, onSaved}: CardModalProps) {
    const [nickname, setNickname] = useState(card?.nickname ?? '')
    const [lastFour, setLastFour] = useState(card?.lastFour ?? '')
    const [brand, setBrand] = useState<CardBrand>(card?.brand ?? 'visa')
    const [closingDay, setClosingDay] = useState(card?.closingDay ?? 1)
    const [dueDay, setDueDay] = useState(card?.dueDay ?? 1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const isEditing = !!card

    async function handleSubmit() {
        if (!nickname.trim()) {
            setError('Apelido é obrigatório')
            return
        }
        if (!/^\d{4}$/.test(lastFour)) {
            setError('Informe os 4 últimos dígitos')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const url = isEditing ? `/api/cards/${card.id}` : '/api/cards'
            const method = isEditing ? 'PATCH' : 'POST'
            const body = isEditing
                ? {nickname, lastFour, brand, closingDay, dueDay}
                : {accountId, nickname, lastFour, brand, closingDay, dueDay}

            const res = await fetch(url, {
                method,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body),
            })

            if (!res.ok) {
                const data = await res.json()
                setError(data.error ?? 'Erro ao salvar cartão')
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
                            {isEditing ? 'Editar Cartão' : 'Novo Cartão'}
                        </h2>
                        <div className="h-1 w-12 bg-accent mt-2 rounded-full"/>
                    </div>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition-colors">
                        <X size={20}/>
                    </button>
                </div>

                {/* Campos */}
                <div className="flex flex-col gap-5">

                    {/* Apelido */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                            Apelido do cartão
                        </label>
                        <input
                            type="text"
                            value={nickname}
                            onChange={e => setNickname(e.target.value)}
                            placeholder="Ex: Nubank Ultravioleta"
                            className="w-full bg-surface-low border-0 border-l-2 border-accent rounded-lg px-4 py-3 text-text-primary placeholder:text-text-secondary focus:ring-0 focus:outline-none text-sm"
                        />
                    </div>

                    {/* Bandeira + Últimos 4 dígitos */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                                Bandeira
                            </label>
                            <select
                                value={brand}
                                onChange={e => setBrand(e.target.value as CardBrand)}
                                className="w-full bg-surface-low border-0 rounded-lg px-4 py-3 text-text-primary focus:ring-0 focus:outline-none text-sm appearance-none"
                            >
                                {BRAND_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                                Últimos 4 dígitos
                            </label>
                            <input
                                type="text"
                                value={lastFour}
                                onChange={e => setLastFour(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                placeholder="0000"
                                maxLength={4}
                                className="w-full bg-surface-low border-0 rounded-lg px-4 py-3 text-text-primary placeholder:text-text-secondary focus:ring-0 focus:outline-none text-sm"
                            />
                        </div>
                    </div>

                    {/* Dia de fechamento + vencimento */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                                Dia de fechamento
                            </label>
                            <input
                                type="number"
                                min={1}
                                max={31}
                                value={closingDay}
                                onChange={e => setClosingDay(Number(e.target.value))}
                                className="w-full bg-surface-low border-0 rounded-lg px-4 py-3 text-text-primary focus:ring-0 focus:outline-none text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                                Dia de vencimento
                            </label>
                            <input
                                type="number"
                                min={1}
                                max={31}
                                value={dueDay}
                                onChange={e => setDueDay(Number(e.target.value))}
                                className="w-full bg-surface-low border-0 rounded-lg px-4 py-3 text-text-primary focus:ring-0 focus:outline-none text-sm"
                            />
                        </div>
                    </div>

                    {error && <p className="text-status-error text-sm">{error}</p>}
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
                        {loading ? 'Salvando...' : isEditing ? 'Salvar' : 'Salvar Cartão'}
                    </button>
                </div>

            </div>
        </div>
    )
}