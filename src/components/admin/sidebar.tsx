'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    BookOpen,
    FileText,
    Users,
    Settings,
    LogOut,
    Shield,
    ClipboardList
} from "lucide-react"
import { logout } from "@/lib/actions"

const routes = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { label: "Gerenciar Cursos", icon: BookOpen, href: "/admin/cursos" },
    { label: "Banco de Questões", icon: FileText, href: "/admin/questoes" },
    { label: "Simulados", icon: ClipboardList, href: "/admin/simulados" },
    { label: "Usuários", icon: Users, href: "/admin/usuarios" },
    { label: "Configurações", icon: Settings, href: "/admin/config" },
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <div className="flex flex-col h-full w-64 bg-slate-950 border-r border-slate-900 text-slate-100 font-sans">
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-slate-900 bg-slate-950">
                <div className="flex items-center gap-2 text-red-500">
                    <Shield className="h-6 w-6" />
                    <span className="text-lg font-bold text-white tracking-widest">ADMIN</span>
                </div>
            </div>

            <nav className="flex-1 px-3 py-6 space-y-1">
                {routes.map((route) => {
                    const isActive = pathname === route.href || pathname?.startsWith(`${route.href}/`)
                    const Icon = route.icon

                    return (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "flex items-center group px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                                isActive
                                    ? "bg-red-500/10 text-red-500"
                                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                            )}
                        >
                            <Icon className={cn("mr-3 h-5 w-5", isActive ? "text-red-500" : "text-slate-500 group-hover:text-white")} />
                            {route.label}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-slate-900">
                <Link
                    href="/dashboard"
                    className="flex items-center px-3 py-2 text-sm font-medium text-slate-400 rounded-lg hover:bg-slate-900 hover:text-white transition-colors mb-2"
                >
                    <LogOut className="mr-3 h-5 w-5 text-slate-500" />
                    Voltar ao Site
                </Link>

                <button
                    onClick={async () => {
                        await logout()
                    }}
                    className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-400 rounded-lg hover:bg-red-950/30 hover:text-red-300 transition-colors"
                >
                    <LogOut className="mr-3 h-5 w-5 text-red-400" />
                    Sair
                </button>
            </div>
        </div>
    )
}
