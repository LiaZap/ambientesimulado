'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Home, BookOpen, Video, PenTool, ClipboardList, Trophy, Sparkles, UserCircle, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/ui/mode-toggle"

const routes = [
    { label: "Home", icon: Home, href: "/dashboard" },
    { label: "Meu Edital", icon: BookOpen, href: "/meu-edital" },
    { label: "Aulas", icon: Video, href: "/aulas" },
    { label: "Redação IA", icon: PenTool, href: "/redacao" },
    { label: "Simulados", icon: ClipboardList, href: "/simulados" },
    { label: "Ranking", icon: Trophy, href: "/ranking" },
    { label: "Perfil & Conquistas", icon: UserCircle, href: "/perfil" },
    { label: "IA Assistente", icon: Sparkles, href: "/ia-assistente" },
]

interface SidebarProps {
    user?: {
        name?: string | null
        email?: string | null
        image?: string | null
        role?: string | null
    }
}

export function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname()

    return (
        <div className="flex flex-col h-full w-64 bg-sidebar border-r border-sidebar-border text-sidebar-foreground font-sans transition-colors duration-300">
            {/* Logo Area */}
            <div className="h-24 flex items-center justify-center border-b border-sidebar-border bg-sidebar relative">
                <div className="relative h-20 w-full px-4 flex items-center justify-center">
                    <Image
                        src="/logo.png"
                        alt="PRF Ambiente Simulado"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </div>

            <nav className="flex-1 px-3 py-6 space-y-1">
                {routes.map((route) => {
                    const isActive = pathname === route.href || pathname?.startsWith(`${route.href}/`)

                    return (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "flex items-center gap-x-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                                isActive
                                    ? "bg-primary text-primary-foreground font-bold shadow-md shadow-yellow-500/10"
                                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                            )}
                        >
                            <route.icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                            <span className={cn("text-sm", isActive ? "font-bold" : "font-medium")}>{route.label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* Admin Link (Conditional) */}
            {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
                <div className="px-3 pb-2">
                    <Link
                        href="/admin"
                        className="flex items-center gap-x-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 border border-transparent hover:border-red-500/20"
                    >
                        <Shield className="h-5 w-5" />
                        <span className="text-sm font-bold">Painel Admin</span>
                    </Link>
                </div>
            )}

            {/* User Profile Footer */}
            <div className="p-4 border-t border-sidebar-border bg-sidebar flex items-center justify-between gap-2">
                <Link href="/perfil" className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors group">
                        <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border border-slate-600 group-hover:border-yellow-500 transition-colors shrink-0">
                            {user?.image ? (
                                <Image src={user.image} alt={user.name || "User"} width={40} height={40} className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-slate-400 font-bold bg-slate-800">
                                    {(user?.name || "U").charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold text-sidebar-foreground group-hover:text-yellow-500 transition-colors truncate">
                                {user?.name || "Futuro Policial"}
                            </span>
                            <span className="text-xs text-muted-foreground truncate">Configurar Perfil</span>
                        </div>
                    </div>
                </Link>
                <div className="shrink-0">
                    <ModeToggle />
                </div>
            </div>
        </div>
    )
}
