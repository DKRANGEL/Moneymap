'use client'

import {ChevronLeft, ChevronRight} from 'lucide-react'

const MONTH_NAMES = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

type MonthNavigatorProps = {
    month: number
    year: number
    onChange: (month: number, year: number) => void
}

export function MonthNavigator({month, year, onChange}: MonthNavigatorProps) {
    function handlePrev() {
        if (month === 1) onChange(12, year - 1)
        else onChange(month - 1, year)
    }

    function handleNext() {
        if (month === 12) onChange(1, year + 1)
        else onChange(month + 1, year)
    }

    return (
        <div className="flex items-center justify-center gap-6">
            <button
                onClick={handlePrev}
                className="p-2 text-text-secondary hover:text-text-primary transition-colors"
            >
                <ChevronLeft size={20}/>
            </button>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-text-primary">
                {MONTH_NAMES[month - 1]} {year}
            </h2>
            <button
                onClick={handleNext}
                className="p-2 text-text-secondary hover:text-text-primary transition-colors"
            >
                <ChevronRight size={20}/>
            </button>
        </div>
    )
}