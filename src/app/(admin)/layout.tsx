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
    // Role Guard DEBUG
    // if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    //     return (
    //         <div className="flex flex-col items-center justify-center h-screen text-white">
    //            <h1 className="text-2xl font-bold">Acesso Negado (Debug)</h1> 
    //            <p>Seu cargo atual é: {session.user.role || 'NENHUM'}</p>
    //            <p>ID: {session.user.id}</p>
    //            <a href="/dashboard" className="text-yellow-500 mt-4">Voltar</a>
    //         </div>
    //     )
    // }

    return (
        <div className="flex h-screen bg-[#020617] text-slate-100 overflow-hidden">
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
