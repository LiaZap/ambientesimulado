import { Sidebar } from "@/components/shared/sidebar"
import { Header } from "@/components/shared/header"
import { getUserProfile } from "@/lib/data"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await getUserProfile()

    return (
        <div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
            <div className="hidden md:flex h-full">
                <Sidebar user={user ? { name: user.name, email: user.email, image: user.avatar, role: user.role } : undefined} />
            </div>
            <div className="flex flex-col flex-1 overflow-hidden">
                <Header user={user ? { name: user.name, image: user.avatar, role: user.role } : undefined} />
                <main className="flex-1 overflow-y-auto bg-background p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
