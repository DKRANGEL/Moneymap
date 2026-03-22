'use client'

import {Card} from '@prisma/client'
import {useState} from 'react'
import {Plus, MoreVertical} from 'lucide-react'
import {CardModal} from './CardModal'

const BRAND_LABELS: Record<string, string> = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    elo: 'Elo',
    hipercard: 'Hipercard',
    amex: 'Amex',
    other: 'Outro',
}

type CardSectionProps = {
    accountId: string
    initialCards: Card[]
}

export function CardSection({accountId, initialCards}: CardSectionProps) {
    const [cards, setCards] = useState(initialCards)
    const [modalOpen, setModalOpen] = useState(false)
    const [editingCard, setEditingCard] = useState<Card | null>(null)
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null)

    async function handleToggleActive(card: Card) {
        const res = await fetch(`/api/cards/${card.id}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({isActive: !card.isActive}),
        })
        if (res.ok) {
            const updated = await res.json()
            setCards(prev => prev.map(c => c.id === updated.id ? updated : c))
        }
        setMenuOpenId(null)
    }

    function handleEdit(card: Card) {
        setEditingCard(card)
        setModalOpen(true)
        setMenuOpenId(null)
    }

    function handleModalClose() {
        setModalOpen(false)
        setEditingCard(null)
    }

    function handleCardSaved(card: Card) {
        setCards(prev => {
            const exists = prev.find(c => c.id === card.id)
            return exists
                ? prev.map(c => c.id === card.id ? card : c)
                : [card, ...prev]
        })
        handleModalClose()
    }

    return (
        <div className="bg-surface-card rounded-2xl p-8 flex flex-col gap-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-6 w-1 bg-accent rounded-full"/>
                    <h2 className="font-display text-lg font-bold text-text-primary">Cartões</h2>
                    {cards.length > 0 && (
                        <span
                            className="bg-surface-high px-2 py-0.5 rounded text-[10px] font-bold text-text-secondary uppercase tracking-widest">
              {cards.filter(c => c.isActive).length} ativo{cards.filter(c => c.isActive).length !== 1 ? 's' : ''}
            </span>
                    )}
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 text-accent text-sm font-medium hover:brightness-110 transition-all px-3 py-1.5 rounded-lg bg-accent/10"
                >
                    <Plus size={14}/>
                    Novo Cartão
                </button>
            </div>

            {/* Lista de cartões */}
            {cards.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <span className="text-3xl mb-3">💳</span>
                    <p className="text-text-secondary text-sm">Nenhum cartão cadastrado</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4" style={{maxWidth: '600px'}}>
                    {cards.map(card => (
                        <div
                            key={card.id}
                            className="relative rounded-2xl p-5 flex flex-col justify-between overflow-hidden cursor-pointer"
                            style={{backgroundColor: card.color, aspectRatio: '1.586'}}
                        >
                            {/* Círculos decorativos */}
                            <div
                                className="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-20"
                                style={{backgroundColor: 'rgba(255,255,255,0.3)'}}
                            />
                            <div
                                className="absolute -right-6 -bottom-10 w-36 h-36 rounded-full opacity-10"
                                style={{backgroundColor: 'rgba(255,255,255,0.3)'}}
                            />

                            {/* Header */}
                            <div className="flex items-start justify-between relative z-10">
        <span className="text-white/80 text-xs font-medium uppercase tracking-widest leading-relaxed max-w-[80%]">
          {card.nickname}
        </span>
                                <div className="relative">
                                    <button
                                        onClick={() => setMenuOpenId(menuOpenId === card.id ? null : card.id)}
                                        className="text-white/60 hover:text-white transition-colors"
                                    >
                                        <MoreVertical size={16}/>
                                    </button>
                                    {menuOpenId === card.id && (
                                        <div
                                            className="absolute right-0 top-6 bg-surface-high rounded-lg shadow-xl border border-white/5 overflow-hidden z-[100] min-w-[140px]">
                                            <button
                                                onClick={() => handleEdit(card)}
                                                className="w-full text-left px-4 py-2.5 text-sm text-text-primary hover:bg-surface-bright transition-colors"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleToggleActive(card)}
                                                className="w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-bright transition-colors"
                                            >
                                                {card.isActive ? 'Desativar' : 'Ativar'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer do cartão */}
                            <div className="flex items-end justify-between relative z-10">
                                <div className="flex flex-col gap-1">
          <span className="text-white font-mono text-base tracking-[0.2em]">
            •••• •••• •••• {card.lastFour}
          </span>
                                    <span className="text-white/60 text-xs">
            {BRAND_LABELS[card.brand]} · Fecha {card.closingDay} · Vence {card.dueDay}
          </span>
                                </div>
                                {!card.isActive && (
                                    <span
                                        className="bg-black/30 text-white/60 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">
            Inativo
          </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <CardModal
                    accountId={accountId}
                    card={editingCard}
                    onClose={handleModalClose}
                    onSaved={handleCardSaved}
                />
            )}
        </div>
    )
}