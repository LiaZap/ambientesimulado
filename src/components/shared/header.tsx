import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MobileSidebar } from "@/components/shared/mobile-sidebar"
import Image from "next/image"

interface HeaderProps {
    user?: {
        name?: string | null
        email?: string | null
        image?: string | null
        role?: string | null
    }
}

export function Header({ user }: HeaderProps) {
    return (
        <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6 transition-colors duration-300">
            <div className="flex items-center gap-4">
                <MobileSidebar user={user} />
                <div className="relative h-8 w-8 md:hidden">
                    <Image
                        src="/logo.png"
                        alt="PRF Logo"
                        fill
                        className="object-contain"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4 ml-auto">
                <Avatar className="h-9 w-9 border border-slate-700">
                    <AvatarImage src={user?.image || undefined} />
                    <AvatarFallback className="bg-yellow-500/20 text-yellow-500 font-bold text-sm">
                        {(user?.name || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </div>
        </header>
    )
}
