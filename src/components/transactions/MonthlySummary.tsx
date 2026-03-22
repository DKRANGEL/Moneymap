type Summary = {
    receitas: number
    despesas: number
    saldo: number
}

function formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
}

export function MonthlySummary({summary}: { summary: Summary }) {
    return (
        <div className="grid grid-cols-3 gap-4">
            <div className="bg-surface-card rounded-xl p-6 flex flex-col gap-2">
        <span className="text-[10px] font-bold tracking-[0.2em] text-text-secondary uppercase">
          Receitas
        </span>
                <span className="text-2xl font-display font-black text-status-success">
          {formatCurrency(summary.receitas)}
        </span>
            </div>
            <div className="bg-surface-card rounded-xl p-6 flex flex-col gap-2">
        <span className="text-[10px] font-bold tracking-[0.2em] text-text-secondary uppercase">
          Despesas
        </span>
                <span className="text-2xl font-display font-black text-status-error">
          {formatCurrency(summary.despesas)}
        </span>
            </div>
            <div className="bg-surface-card rounded-xl p-6 flex flex-col gap-2">
        <span
            className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase tracking-widest text-xs font-bold">
          Saldo
        </span>
                <span
                    className={`text-2xl font-display font-black ${summary.saldo >= 0 ? 'text-text-primary' : 'text-status-error'}`}>
          {formatCurrency(summary.saldo)}
        </span>
            </div>
        </div>
    )
}