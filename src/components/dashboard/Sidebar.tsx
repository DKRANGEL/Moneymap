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

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false)
    const pathname = usePathname()

    return (
        <aside
            className={`
        relative flex flex-col h-screen bg-surface-card
        transition-all duration-300 ease-in-out shrink-0
        ${collapsed ? 'w-14' : 'w-56'}
      `}
        >
            {/* Logo */}
            <div className={`
        flex items-center gap-3 px-4 py-5 
        ${collapsed ? 'justify-center' : ''}
      `}>
                <Image
                    src="/logo.png"
                    alt="Moneymap"
                    width={28}
                    height={28}
                    className="shrink-0"
                />
                {!collapsed && (
                    <span className="font-display text-text-primary font-semibold tracking-tight">
            Moneymap
          </span>
                )}
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-1 px-2 flex-1">
                {NAV_ITEMS.map(({label, href, icon: Icon}) => {
                    const isActive = pathname === href

                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`
                flex items-center gap-3 px-3 py-2.5 rounded-md
                transition-colors duration-150
                ${collapsed ? 'justify-center' : ''}
                ${isActive
                                ? 'bg-surface-high text-text-primary'
                                : 'text-text-secondary hover:bg-surface-high hover:text-text-primary'
                            }
              `}
                            title={collapsed ? label : undefined}
                        >
                            <Icon size={18} className="shrink-0"/>
                            {!collapsed && (
                                <span className="text-sm font-body">{label}</span>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Toggle */}
            <button
                onClick={() => setCollapsed(prev => !prev)}
                className={`
          flex items-center justify-center mx-2 mb-4 py-2 rounded-md
          text-text-secondary hover:bg-surface-high hover:text-text-primary
          transition-colors duration-150
        `}
                aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
            >
                {collapsed
                    ? <ChevronRight size={16}/>
                    : <ChevronLeft size={16}/>
                }
            </button>
        </aside>
    )
}