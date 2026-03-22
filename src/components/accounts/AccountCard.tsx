'use client'

import {Account} from '@prisma/client'
import {MoreVertical} from 'lucide-react'
import {useState} from 'react'

const BANK_LABELS: Record<string, string> = {
    nubank: 'Nubank',
    mercadopago: 'Mercado Pago',
    picpay: 'PicPay',
    btg: 'BTG Pactual',
    other: 'Outro',
}

const TYPE_LABELS: Record<string, string> = {
    conta_digital: 'Conta Digital',
    cartao_credito: 'Cartão de Crédito',
    cartao_debito: 'Cartão de Débito',
    investimento: 'Investimento',
}

const BANK_ICONS: Record<string, string> = {
    nubank: '💜',
    mercadopago: '💙',
    picpay: '💚',
    btg: '🏦',
    other: '🏛️',
}

type AccountCardProps = {
    account: Account
    onEdit: (account: Account) => void
    onToggleActive: (account: Account) => void
}

export function AccountCard({account, onEdit, onToggleActive}: AccountCardProps) {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <div
            className="group bg-surface-card rounded-xl p-6 relative overflow-hidden transition-all hover:-translate-y-1">
            {/* Barra teal à esquerda */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-l-xl"/>

            {/* Header do card */}
            <div className="flex justify-between items-start mb-8">
                <div className="p-2 bg-surface-low rounded-lg text-2xl">
                    {BANK_ICONS[account.bank]}
                </div>
                <span className={`
          px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase rounded
          ${account.isActive
                    ? 'bg-accent/10 text-accent'
                    : 'bg-surface-high text-text-secondary'
                }
        `}>
          {account.isActive ? 'Ativo' : 'Inativo'}
        </span>
            </div>

            {/* Dados */}
            <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                    {BANK_LABELS[account.bank]}
                </p>
                <h3 className="font-display text-lg font-bold text-text-primary">
                    {TYPE_LABELS[account.type]}
                </h3>
                <p className="text-sm text-text-secondary">{account.name}</p>
            </div>

            {/* Footer com menu */}
            <div className="mt-8 pt-4 border-t border-white/5 flex justify-end items-center">
                <div className="relative">
                    <button
                        onClick={() => setMenuOpen(prev => !prev)}
                        className="text-text-secondary group-hover:text-accent transition-colors"
                    >
                        <MoreVertical size={18}/>
                    </button>

                    {menuOpen && (
                        <div
                            className="absolute right-0 bottom-8 bg-surface-high rounded-lg shadow-xl border border-white/5 overflow-hidden z-10 min-w-[140px]">
                            <button
                                onClick={() => {
                                    onEdit(account);
                                    setMenuOpen(false)
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm text-text-primary hover:bg-surface-bright transition-colors"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => {
                                    onToggleActive(account);
                                    setMenuOpen(false)
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm hover:bg-surface-bright transition-colors text-text-secondary"
                            >
                                {account.isActive ? 'Desativar' : 'Ativar'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}