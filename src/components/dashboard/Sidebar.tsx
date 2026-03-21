'use client'

import {useState} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {usePathname} from 'next/navigation'
import {
    LayoutDashboard,
    ArrowLeftRight,
    Landmark,
    Upload,
    Tag,
    GitMerge,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react'

const NAV_ITEMS = [
    {label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard},
    {label: 'Transações', href: '/transactions', icon: ArrowLeftRight},
    {label: 'Contas', href: '/accounts', icon: Landmark},
    {label: 'Upload', href: '/upload', icon: Upload},
    {label: 'Categorias', href: '/categories', icon: Tag},
    {label: 'Review', href: '/review', icon: GitMerge},
]

type SidebarProps = {
    user: {
        name: string | null
        email: string
        avatarUrl: string | null
    }
}

export function Sidebar({user}: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false)
    const pathname = usePathname()

    return (
        <aside
            className={`
        relative flex flex-col h-screen
        bg-surface-low border-r border-white/5 shadow-2xl shadow-black/50
        transition-all duration-300 ease-in-out shrink-0
        ${collapsed ? 'w-20' : 'w-64'}
      `}
        >
            {/* Logo */}
            <div className={`
        flex items-center gap-3 px-4 py-6 mb-2
        ${collapsed ? 'justify-center' : ''}
      `}>
                <Image
                    src="/logo.png"
                    alt="Moneymap"
                    width={32}
                    height={32}
                    className="shrink-0 rounded-xl"
                />
                {!collapsed && (
                    <div className="flex flex-col">
            <span className="font-display text-base font-bold tracking-wider text-text-primary uppercase">
              Moneymap
            </span>
                    </div>
                )}
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-1 px-3 flex-1">
                {NAV_ITEMS.map(({label, href, icon: Icon}) => {
                    const isActive = pathname === href || pathname.startsWith(href)

                    return (
                        <Link
                            key={href}
                            href={href}
                            title={collapsed ? label : undefined}
                            className={`
                flex items-center gap-3 px-3 py-3 rounded-lg
                transition-all duration-150
                ${collapsed ? 'justify-center' : ''}
                ${isActive
                                ? 'bg-surface-card text-accent'
                                : 'text-text-secondary hover:bg-surface-card hover:text-text-primary'
                            }
              `}
                        >
                            <Icon size={20} className="shrink-0"/>
                            {!collapsed && (
                                <span className="text-sm">{label}</span>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Toggle */}
            <button
                onClick={() => setCollapsed(prev => !prev)}
                className="flex items-center justify-center mx-3 mb-4 py-2 rounded-lg
                   text-text-secondary hover:bg-surface-card hover:text-text-primary
                   transition-colors duration-150"
                aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
            >
                {collapsed ? <ChevronRight size={16}/> : <ChevronLeft size={16}/>}
            </button>

            {/* User */}
            <div className={`
        flex items-center gap-3 px-4 py-4 mt-auto
        border-t border-white/5
        ${collapsed ? 'justify-center' : ''}
      `}>
                {user.avatarUrl ? (
                    <Image
                        src={user.avatarUrl}
                        alt={user.name ?? 'Avatar'}
                        width={36}
                        height={36}
                        className="rounded-full shrink-0 border border-white/10"
                    />
                ) : (
                    <div
                        className="w-9 h-9 rounded-full bg-surface-card flex items-center justify-center shrink-0 border border-white/10">
            <span className="text-xs text-text-secondary font-medium">
              {user.name?.[0] ?? (user.email[0] ?? '?').toUpperCase()}
            </span>
                    </div>
                )}
                {!collapsed && (
                    <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-text-primary truncate">
              {user.name ?? 'Usuário'}
            </span>
                        <span className="text-xs text-text-secondary truncate">
              {user.email}
            </span>
                    </div>
                )}
            </div>
        </aside>
    )
}