export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="font-display text-3xl font-bold text-text-primary">
                    Dashboard
                </h1>
                <p className="text-text-secondary text-sm mt-1">
                    Visão geral das suas finanças.
                </p>
            </div>

            {/* Placeholder — conteúdo real na v0.6 */}
            <div className="bg-surface-card rounded-2xl p-8 flex items-center justify-center min-h-[200px]">
                <p className="text-text-secondary text-sm">
                    Conteúdo do dashboard em breve.
                </p>
            </div>
        </div>
    )
}