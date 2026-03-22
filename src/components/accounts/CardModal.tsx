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

const COLOR_OPTIONS = [
    {value: '#820AD1', label: 'Nubank'},
    {value: '#009EE3', label: 'Mercado Pago'},
    {value: '#11C76F', label: 'PicPay'},
    {value: '#002868', label: 'BTG'},
    {value: '#EC7000', label: 'Itaú'},
    {value: '#CC092F', label: 'Bradesco'},
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
    const [color, setColor] = useState(card?.color ?? '#820AD1')
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
                ? {nickname, lastFour, brand, closingDay, dueDay, color}
                : {accountId, nickname, lastFour, brand, closingDay, dueDay, color}

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

                <div className="flex flex-col gap-5">

                    {/* Preview do cartão */}
                    <div
                        className="w-full h-32 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden transition-colors duration-300"
                        style={{backgroundColor: color}}
                    >
                        <div className="flex justify-between items-start">
              <span className="text-white/80 text-xs font-medium uppercase tracking-widest">
                {nickname || 'Apelido do cartão'}
              </span>
                            <span className="text-white/60 text-xs">
                {BRAND_OPTIONS.find(b => b.value === brand)?.label}
              </span>
                        </div>
                        <div className="flex justify-between items-end">
              <span className="text-white font-mono text-sm tracking-widest">
                •••• •••• •••• {lastFour || '0000'}
              </span>
                            <span className="text-white/60 text-xs">
                Fecha {closingDay} · Vence {dueDay}
              </span>
                        </div>
                    </div>

                    {/* Seleção de cor */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                            Cor do cartão
                        </label>
                        <div className="flex gap-3">
                            {COLOR_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => setColor(opt.value)}
                                    title={opt.label}
                                    className={`w-8 h-8 rounded-full transition-all ${color === opt.value ? 'ring-2 ring-offset-2 ring-offset-surface-card ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}
                                    style={{backgroundColor: opt.value}}
                                />
                            ))}
                        </div>
                    </div>

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