'use client'

import {useState} from 'react'
import {Account} from '@prisma/client'
import {X} from 'lucide-react'

type Card = {
    id: string
    nickname: string
    lastFour: string
}

type Transaction = {
    id: string
    description: string
    amount: number
    type: string
    date: string
    paymentMethod: string
    status: string
    notes: string | null
    accountId?: string
    cardId?: string | null
    account: { name: string; bank: string }
    card: { nickname: string; lastFour: string } | null
    category: { name: string; icon: string | null; color: string | null } | null
}

type TransactionModalProps = {
    accounts: Account[]
    transaction?: Transaction | null
    duplicateFrom?: Transaction | null
    editAll?: boolean
    onClose: () => void
    onSaved: () => void
}

const PAYMENT_OPTIONS = [
    {value: 'pix', label: 'PIX'},
    {value: 'boleto', label: 'Boleto'},
    {value: 'credito', label: 'Cartão de Crédito'},
    {value: 'debito', label: 'Cartão de Débito'},
    {value: 'dinheiro', label: 'Dinheiro'},
    {value: 'transferencia', label: 'Transferência'},
]

export function TransactionModal({ accounts, transaction, duplicateFrom, editAll = false, onClose, onSaved }: TransactionModalProps) {
    const isEditing = !!transaction
    const source = transaction ?? duplicateFrom ?? null

    const [type, setType] = useState<'entrada' | 'saida'>((source?.type as 'entrada' | 'saida') ?? 'saida')
    const [description, setDescription] = useState(source?.description ?? '')
    const [amount, setAmount] = useState(source?.amount ? String(source.amount) : '')
    const [date, setDate] = useState(
        transaction?.date
            ? new Date(transaction.date).toISOString().split('T')[0]!
            : new Date().toISOString().split('T')[0]!
    )
    const [paymentMethod, setPaymentMethod] = useState(source?.paymentMethod ?? 'pix')
    const [accountId, setAccountId] = useState(source?.accountId ?? accounts[0]?.id ?? '')
    const [cardId, setCardId] = useState(source?.cardId ?? '')
    const [status, setStatus] = useState(source?.status ?? 'pendente')
    const [notes, setNotes] = useState(source?.notes ?? '')
    const [cards, setCards] = useState<Card[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Fixas e parceladas — só na criação
    const [isFixed, setIsFixed] = useState(false)
    const [fixedDay, setFixedDay] = useState(new Date().getDate())
    const [isInstallment, setIsInstallment] = useState(false)
    const [installmentsTotal, setInstallmentsTotal] = useState(2)
    const [installmentNumberStart, setInstallmentNumberStart] = useState(1)

    function handleToggleFixed(val: boolean) {
        setIsFixed(val)
        if (val) setIsInstallment(false)
    }

    function handleToggleInstallment(val: boolean) {
        setIsInstallment(val)
        if (val) setIsFixed(false)
    }

    async function handleAccountChange(id: string) {
        setAccountId(id)
        setCardId('')
        if (paymentMethod === 'credito') {
            const res = await fetch(`/api/cards?accountId=${id}`)
            if (res.ok) {
                const data = await res.json()
                setCards(data)
            }
        }
    }

    async function handlePaymentMethodChange(method: string) {
        setPaymentMethod(method)
        if (method === 'credito' && accountId) {
            const res = await fetch(`/api/cards?accountId=${accountId}`)
            if (res.ok) {
                const data = await res.json()
                setCards(data)
                if (data.length > 0) setCardId(data[0].id)
            }
        } else {
            setCardId('')
            setCards([])
        }
    }

    async function handleSubmit() {
        if (!description.trim()) {
            setError('Descrição é obrigatória');
            return
        }
        if (!amount || Number(amount) <= 0) {
            setError('Valor deve ser maior que zero');
            return
        }
        if (!accountId) {
            setError('Selecione uma conta');
            return
        }
        if (paymentMethod === 'credito' && !cardId) {
            setError('Selecione um cartão');
            return
        }
        if (isFixed && (!fixedDay || fixedDay < 1 || fixedDay > 31)) {
            setError('Informe o dia do mês válido');
            return
        }
        if (isInstallment && installmentsTotal < 2) {
            setError('Parcelamento mínimo de 2x');
            return
        }
        if (isInstallment && installmentNumberStart > installmentsTotal) {
            setError('Parcela inicial não pode ser maior que o total');
            return
        }

        setLoading(true)
        setError(null)

        try {
            const url = isEditing
                ? `/api/transactions/${transaction.id}${editAll ? '?editAll=true' : ''}`
                : '/api/transactions'
            const method = isEditing ? 'PATCH' : 'POST'

            const body: Record<string, unknown> = {
                type,
                description,
                amount: Number(amount),
                date: new Date(date + 'T12:00:00').toISOString(),
                paymentMethod,
                accountId,
                cardId: cardId || undefined,
                status,
                notes: notes || undefined,
            }

            if (!isEditing) {
                if (isFixed) {
                    body.isFixed = true
                    body.fixedDay = fixedDay
                }
                if (isInstallment) {
                    body.installmentsTotal = installmentsTotal
                    body.installmentNumberStart = installmentNumberStart
                }
            }

            const res = await fetch(url, {
                method,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body),
            })

            if (!res.ok) {
                const data = await res.json()
                setError(data.error ?? 'Erro ao salvar transação')
                return
            }

            await res.json()
            onSaved()
        } catch {
            setError('Erro inesperado. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60 px-4">
            <div
                className="w-full max-w-lg bg-surface-card rounded-2xl shadow-2xl border border-white/5 flex flex-col max-h-[90vh]">

                {/* Header fixo */}
                <div className="flex items-center justify-between p-8 pb-6 border-b border-white/5">
                    <div>
                        <h2 className="font-display text-2xl font-bold text-text-primary">
                            {isEditing ? 'Editar Transação' : duplicateFrom ? 'Duplicar Transação' : 'Nova Transação'}
                        </h2>
                        <div className="h-1 w-12 bg-accent mt-2 rounded-full"/>
                    </div>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition-colors">
                        <X size={20}/>
                    </button>
                </div>

                {/* Conteúdo com scroll */}
                <div className="overflow-y-auto flex-1 p-8 pt-6 flex flex-col gap-5">

                    {/* Toggle Entrada/Saída */}
                    <div className="flex rounded-xl overflow-hidden border border-white/5">
                        <button
                            onClick={() => setType('saida')}
                            className={`flex-1 py-3 text-sm font-bold transition-colors ${type === 'saida' ? 'bg-status-error text-white' : 'bg-surface-low text-text-secondary hover:bg-surface-high'}`}
                        >
                            Saída
                        </button>
                        <button
                            onClick={() => setType('entrada')}
                            className={`flex-1 py-3 text-sm font-bold transition-colors ${type === 'entrada' ? 'bg-status-success text-white' : 'bg-surface-low text-text-secondary hover:bg-surface-high'}`}
                        >
                            Entrada
                        </button>
                    </div>

                    {/* Descrição */}
                    <div className="flex flex-col gap-2">
                        <label
                            className="text-xs font-medium text-text-secondary uppercase tracking-wider">Descrição</label>
                        <input
                            type="text"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Ex: Supermercado, Salário..."
                            className="w-full bg-surface-low border-0 border-l-2 border-accent rounded-lg px-4 py-3 text-text-primary placeholder:text-text-secondary focus:ring-0 focus:outline-none text-sm"
                        />
                    </div>

                    {/* Valor + Data */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label
                                className="text-xs font-medium text-text-secondary uppercase tracking-wider">Valor</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                placeholder="0,00"
                                className="w-full bg-surface-low border-0 rounded-lg px-4 py-3 text-text-primary placeholder:text-text-secondary focus:ring-0 focus:outline-none text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label
                                className="text-xs font-medium text-text-secondary uppercase tracking-wider">Data</label>
                            <input
                                type="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className="w-full bg-surface-low border-0 rounded-lg px-4 py-3 text-text-primary focus:ring-0 focus:outline-none text-sm"
                            />
                        </div>
                    </div>

                    {/* Forma de pagamento */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Forma de
                            Pagamento</label>
                        <select
                            value={paymentMethod}
                            onChange={e => handlePaymentMethodChange(e.target.value)}
                            className="w-full bg-surface-low border-0 rounded-lg px-4 py-3 text-text-primary focus:ring-0 focus:outline-none text-sm appearance-none"
                        >
                            {PAYMENT_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Conta */}
                    <div className="flex flex-col gap-2">
                        <label
                            className="text-xs font-medium text-text-secondary uppercase tracking-wider">Conta</label>
                        <select
                            value={accountId}
                            onChange={e => handleAccountChange(e.target.value)}
                            className="w-full bg-surface-low border-0 rounded-lg px-4 py-3 text-text-primary focus:ring-0 focus:outline-none text-sm appearance-none"
                        >
                            {accounts.map(acc => (
                                <option key={acc.id} value={acc.id}>{acc.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Cartão — só aparece se crédito */}
                    {paymentMethod === 'credito' && (
                        <div className="flex flex-col gap-2">
                            <label
                                className="text-xs font-medium text-text-secondary uppercase tracking-wider">Cartão</label>
                            {cards.length === 0 ? (
                                <p className="text-xs text-status-error">Nenhum cartão cadastrado para esta conta.</p>
                            ) : (
                                <select
                                    value={cardId}
                                    onChange={e => setCardId(e.target.value)}
                                    className="w-full bg-surface-low border-0 rounded-lg px-4 py-3 text-text-primary focus:ring-0 focus:outline-none text-sm appearance-none"
                                >
                                    <option value="">Selecione um cartão</option>
                                    {cards.map(card => (
                                        <option key={card.id} value={card.id}>
                                            {card.nickname} ···· {card.lastFour}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    )}

                    {/* Status */}
                    <div className="flex flex-col gap-2">
                        <label
                            className="text-xs font-medium text-text-secondary uppercase tracking-wider">Status</label>
                        <select
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                            className="w-full bg-surface-low border-0 rounded-lg px-4 py-3 text-text-primary focus:ring-0 focus:outline-none text-sm appearance-none"
                        >
                            <option value="pendente">Pendente</option>
                            <option value="pago">Pago</option>
                            <option value="agendado">Agendado</option>
                        </select>
                    </div>

                    {/* Fixas e parceladas — só na criação */}
                    {!isEditing && (
                        <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
                            <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">Recorrência</p>

                            {/* Conta fixa */}
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-text-primary">Conta fixa</p>
                                        <p className="text-xs text-text-secondary">Repete todo mês no mesmo dia</p>
                                    </div>
                                    <button
                                        onClick={() => handleToggleFixed(!isFixed)}
                                        className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${isFixed ? 'bg-accent' : 'bg-surface-high'}`}
                                    >
                                        <span
                                            className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${isFixed ? 'translate-x-5' : 'translate-x-0'}`}/>
                                    </button>
                                </div>
                                {isFixed && (
                                    <div className="flex flex-col gap-2">
                                        <label
                                            className="text-xs font-medium text-text-secondary uppercase tracking-wider">Dia
                                            do mês</label>
                                        <input
                                            type="number"
                                            min={1}
                                            max={31}
                                            value={fixedDay}
                                            onChange={e => setFixedDay(Number(e.target.value))}
                                            className="w-full bg-surface-low border-0 rounded-lg px-4 py-3 text-text-primary focus:ring-0 focus:outline-none text-sm"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Parcelado */}
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-text-primary">Parcelado</p>
                                        <p className="text-xs text-text-secondary">Divide em múltiplas parcelas</p>
                                    </div>
                                    <button
                                        onClick={() => handleToggleInstallment(!isInstallment)}
                                        className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${isInstallment ? 'bg-accent' : 'bg-surface-high'}`}
                                    >
                                        <span
                                            className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${isInstallment ? 'translate-x-5' : 'translate-x-0'}`}/>
                                    </button>
                                </div>
                                {isInstallment && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label
                                                className="text-xs font-medium text-text-secondary uppercase tracking-wider">Total
                                                de parcelas</label>
                                            <input
                                                type="number"
                                                min={2}
                                                value={installmentsTotal}
                                                onChange={e => setInstallmentsTotal(Number(e.target.value))}
                                                className="w-full bg-surface-low border-0 rounded-lg px-4 py-3 text-text-primary focus:ring-0 focus:outline-none text-sm"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label
                                                className="text-xs font-medium text-text-secondary uppercase tracking-wider">Parcela
                                                inicial</label>
                                            <input
                                                type="number"
                                                min={1}
                                                max={installmentsTotal}
                                                value={installmentNumberStart}
                                                onChange={e => setInstallmentNumberStart(Number(e.target.value))}
                                                className="w-full bg-surface-low border-0 rounded-lg px-4 py-3 text-text-primary focus:ring-0 focus:outline-none text-sm"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Notas */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Notas
                            (opcional)</label>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Observações..."
                            rows={2}
                            className="w-full bg-surface-low border-0 rounded-lg px-4 py-3 text-text-primary placeholder:text-text-secondary focus:ring-0 focus:outline-none text-sm resize-none"
                        />
                    </div>

                    {error && <p className="text-status-error text-sm">{error}</p>}
                </div>

                {/* Footer fixo */}
                <div className="flex items-center justify-end gap-4 p-8 pt-6 border-t border-white/5">
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
                        {loading ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Salvar'}
                    </button>
                </div>

            </div>
        </div>
    )
}