'use client'

import {useState} from 'react'
import {
    ShoppingCart, Wallet, CreditCard, Home, Car,
    Utensils, Heart, Zap, TrendingUp, MoreHorizontal, MoreVertical
} from 'lucide-react'

type Transaction = {
    id: string
    description: string
    amount: number
    type: string
    date: string
    paymentMethod: string
    status: string
    notes: string | null
    recurringGroupId: string | null
    installmentNumber: number | null
    installmentsTotal: number | null
    isFixed: boolean
    account: { name: string; bank: string }
    card: { nickname: string; lastFour: string } | null
    category: { name: string; icon: string | null; color: string | null } | null
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    shopping: <ShoppingCart size={18}/>,
    wallet: <Wallet size={18}/>,
    credit: <CreditCard size={18}/>,
    home: <Home size={18}/>,
    car: <Car size={18}/>,
    food: <Utensils size={18}/>,
    health: <Heart size={18}/>,
    utilities: <Zap size={18}/>,
    investment: <TrendingUp size={18}/>,
}

const STATUS_LABELS: Record<string, string> = {
    pago: 'Pago',
    pendente: 'Pendente',
    agendado: 'Agendado',
}

const STATUS_STYLES: Record<string, string> = {
    pago: 'bg-accent/10 text-accent',
    pendente: 'bg-status-error/10 text-status-error',
    agendado: 'bg-surface-high text-text-secondary',
}

const PAYMENT_LABELS: Record<string, string> = {
    pix: 'PIX',
    boleto: 'Boleto',
    credito: 'Crédito',
    debito: 'Débito',
    dinheiro: 'Dinheiro',
    transferencia: 'Transferência',
}

type TransactionCardProps = {
    transaction: Transaction
    onEdit: (transaction: Transaction) => void
    onDuplicate: (transaction: Transaction) => void
    onDelete: (transaction: Transaction) => void
}

export function TransactionCard({transaction: tx, onEdit, onDuplicate, onDelete}: TransactionCardProps) {
    const [menuOpen, setMenuOpen] = useState(false)
    const isEntrada = tx.type === 'entrada'
    const icon = tx.category?.icon
        ? CATEGORY_ICONS[tx.category.icon] ?? <MoreHorizontal size={18}/>
        : <MoreHorizontal size={18}/>

    const iconBg = tx.category?.color ?? (isEntrada ? '#70D8C8' : '#FFB4AB')

    const subtitle = tx.card
        ? `${PAYMENT_LABELS[tx.paymentMethod]} · ${tx.card.nickname} ····${tx.card.lastFour}`
        : `${PAYMENT_LABELS[tx.paymentMethod]} · ${tx.account.name}`

    return (
        <div
            className="bg-surface-card rounded-xl p-4 flex items-center justify-between hover:bg-surface-high transition-colors">
            <div className="flex items-center gap-4">
                {/* Ícone */}
                <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-surface-base shrink-0"
                    style={{backgroundColor: iconBg}}
                >
                    {icon}
                </div>

                {/* Info */}
                <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-semibold text-text-primary">{tx.description}</p>
                    <p className="text-xs text-text-secondary">{subtitle}</p>
                </div>
            </div>

            {/* Valor, status e menu */}
            <div className="flex items-center gap-4">
                <div className="flex flex-col items-end gap-1">
          <span className={`font-display font-bold text-sm ${isEntrada ? 'text-status-success' : 'text-status-error'}`}>
            {isEntrada ? '+' : '-'} R$ {Math.abs(tx.amount).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
          </span>
                    <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${STATUS_STYLES[tx.status] ?? 'bg-surface-high text-text-secondary'}`}>
            {STATUS_LABELS[tx.status] ?? tx.status}
          </span>
                </div>

                {/* Menu */}
                <div className="relative">
                    <button
                        onClick={() => setMenuOpen(prev => !prev)}
                        className="text-text-secondary hover:text-text-primary transition-colors p-1"
                    >
                        <MoreVertical size={16}/>
                    </button>
                    {menuOpen && (
                        <div
                            className="absolute right-0 top-7 bg-surface-high rounded-lg shadow-xl border border-white/5 overflow-hidden z-10 min-w-[140px]">
                            <button
                                onClick={() => {
                                    onEdit(tx);
                                    setMenuOpen(false)
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm text-text-primary hover:bg-surface-bright transition-colors"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => {
                                    onDuplicate(tx);
                                    setMenuOpen(false)
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm text-text-primary hover:bg-surface-bright transition-colors"
                            >
                                Duplicar
                            </button>
                            <button
                                onClick={() => {
                                    onDelete(tx);
                                    setMenuOpen(false)
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm text-status-error hover:bg-surface-bright transition-colors"
                            >
                                Excluir
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}