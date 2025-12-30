import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }

    // Role Guard
    // if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    //     redirect("/dashboard")
    // }

    return (
        <div className="flex h-screen bg-[#020617] text-slate-100 overflow-hidden">
            {/* DEBUG BANNER */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white text-xs font-bold p-1 text-center">
                DEBUG: Role detected = [{session.user.role || 'UNDEFINED'}] - ID: {session.user.id}
            </div>

            {/* Admin Sidebar */}
            <aside className="hidden w-64 md:flex flex-col z-20">
                <AdminSidebar />
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
                    <div className="mx-auto max-w-6xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
