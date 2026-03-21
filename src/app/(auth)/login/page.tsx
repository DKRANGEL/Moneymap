import Image from 'next/image'
import { LoginButton } from '@/components/auth/LoginButton'

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center gap-8">
            {/* Logo */}
            <Image
                src="/logo.png"
                alt="Moneymap"
                width={64}
                height={64}
                priority
            />

            {/* Card */}
            <div className="bg-surface-card rounded-squircle p-8 w-full max-w-sm flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="font-display text-2xl text-text-primary">
                        Welcome back
                    </h1>
                    <p className="text-sm text-text-secondary">
                        Your financial map awaits.
                    </p>
                </div>

                <LoginButton />

                <p className="text-xs text-text-secondary text-center tracking-wider uppercase">
                    Secure access protocol
                </p>
            </div>
        </div>
    )
}