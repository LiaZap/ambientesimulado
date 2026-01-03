import { UserForm } from "@/components/admin/users/user-form"
import { getUser } from "@/lib/actions"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

interface PageProps {
    params: Promise<{
        userId: string
    }>
}

export default async function EditUserPage(props: PageProps) {
    const params = await props.params;
    const user = await getUser(params.userId)

    if (!user) {
        notFound()
    }

    // Adapt user data for the form
    const formData = {
        name: user.name || "",
        email: user.email || "",
        role: user.role === "USER" || user.role === "PREMIUM" || user.role === "ADMIN" || user.role === "SUPER_ADMIN" ? user.role : "USER",
        credits: user.credits || 0,
        // Password is not passed back for security
        id: user.id
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Editar Usuário</h1>
                <p className="text-slate-400">Gerencie as informações de {user.name}.</p>
            </div>
            <UserForm initialData={formData} />
        </div>
    )
}
