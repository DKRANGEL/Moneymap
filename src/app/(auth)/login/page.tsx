import {LoginButton} from '@/components/auth/LoginButton'
import Image from 'next/image'

export default function LoginPage() {
    return (
        <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden p-6">

            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#1c2026_0%,#10141a_100%)] opacity-50"/>
                <div
                    className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px]"/>
                <div
                    className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] bg-surface-low/40 rounded-full blur-[100px]"/>
            </div>

            {/* Container */}
            <div className="relative z-10 w-full max-w-[420px]">

                {/* Branding */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-3">
                        <Image
                            src="/logo.png"
                            alt="Moneymap"
                            width={36}
                            height={36}
                            priority
                            className="rounded-xl"
                        />
                        <h1 className="font-display text-2xl font-extrabold tracking-wider text-text-primary uppercase">
                            Moneymap
                        </h1>
                    </div>
                </div>

                {/* Card */}
                <div
                    className="bg-surface-card/60 backdrop-blur-[40px] p-10 rounded-2xl shadow-2xl ring-1 ring-white/5">
                    <div className="flex flex-col gap-8">

                        {/* Texto */}
                        <div className="space-y-2">
                            <h2 className="font-display text-3xl font-bold text-text-primary tracking-tight">
                                Bem-vindo!
                            </h2>
                            <p className="text-text-secondary text-sm leading-relaxed">
                                Seu mapa financeiro aguarda.
                            </p>
                        </div>

                        {/* Botão */}
                        <div className="mt-4">
                            <LoginButton/>
                        </div>

                        {/* Footer */}
                        <div className="pt-6 border-t border-outline/15 flex flex-col gap-4 text-center">
                            <p className="text-[11px] text-text-secondary uppercase tracking-[0.2em]">
                                Protocolo de acesso seguro
                            </p>
                        </div>

                    </div>
                </div>

                {/* Elemento assimétrico */}
                <div className="mt-12 pl-4 border-l-2 border-accent/20">
                    <p className="text-[10px] text-text-secondary leading-tight max-w-[280px] uppercase tracking-widest">
                        Seus dados financeiros protegidos com criptografia de ponta a ponta.
                    </p>
                </div>

            </div>
        </main>
    )
}