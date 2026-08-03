'use client'

import {Account, Card} from '@prisma/client'
import {useState} from 'react'
import {ArrowLeft} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {AccountModal} from './AccountModal'
import {CardSection} from './CardSection'

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

type AccountDetailClientProps = {
    account: Account
    initialCards: Card[]
}

export function AccountDetailClient({account: initialAccount, initialCards}: AccountDetailClientProps) {
    const router = useRouter()
    const [account, setAccount] = useState(initialAccount)
    const [modalOpen, setModalOpen] = useState(false)

    async function handleToggleActive() {
        const res = await fetch(`/api/accounts/${account.id}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({isActive: !account.isActive}),
        })

        if (res.ok) {
            const updated = await res.json()
            setAccount(updated)
        }
    }

    return (
        <div className="flex flex-col gap-8 max-w-2xl">

            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="text-text-secondary hover:text-text-primary transition-colors"
                >
                    <ArrowLeft size={20}/>
                </button>
                <div>
                    <h1 className="font-display text-3xl font-bold text-text-primary">
                        {account.name}
                    </h1>
                    <p className="text-text-secondary text-sm mt-1">
                        Detalhes da conta
                    </p>
                </div>
            </div>

            {/* Card de detalhes */}
            <div className="bg-surface-card rounded-2xl p-8 flex flex-col gap-6 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-l-2xl"/>

                {/* Banco e status */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{BANK_ICONS[account.bank]}</span>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-text-secondary">
                                {BANK_LABELS[account.bank]}
                            </p>
                            <p className="font-display text-xl font-bold text-text-primary">
                                {account.name}
                            </p>
                        </div>
                    </div>
                    <span className={`
            px-3 py-1 text-xs font-bold tracking-widest uppercase rounded-lg
            ${account.isActive
                        ? 'bg-accent/10 text-accent'
                        : 'bg-surface-high text-text-secondary'
                    }
          `}>
            {account.isActive ? 'Ativo' : 'Inativo'}
          </span>
                </div>

                {/* Informações */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div>
                        <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Tipo</p>
                        <p className="text-text-primary font-medium">{TYPE_LABELS[account.type]}</p>
                    </div>
                    <div>
                        <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Criada em</p>
                        <p className="text-text-primary font-medium">
                            {new Date(account.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Seção Cartões */}
            <CardSection accountId={account.id} initialCards={initialCards}/>

            {/* Ações */}
            <div className="flex gap-3">
                <button
                    onClick={() => setModalOpen(true)}
                    className="px-6 py-2.5 bg-accent text-accent-dark rounded-lg font-medium text-sm hover:bg-accent/90 transition-colors"
                >
                    Editar conta
                </button>
                <button
                    onClick={handleToggleActive}
                    className="px-6 py-2.5 bg-surface-card border border-white/10 text-text-secondary rounded-lg font-medium text-sm hover:bg-surface-high hover:text-text-primary transition-colors"
                >
                    {account.isActive ? 'Desativar conta' : 'Ativar conta'}
                </button>
            </div>

            {/* Modal de edição */}
            {modalOpen && (
                <AccountModal
                    account={account}
                    onClose={() => setModalOpen(false)}
                    onSaved={updated => {
                        setAccount(updated)
                        setModalOpen(false)
                    }}
                />
            )}

        </div>
    )
}