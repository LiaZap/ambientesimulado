import { UserForm } from "@/components/admin/users/user-form"

export default function NewUserPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Criar Novo Usuário</h1>
                <p className="text-slate-400">Adicione um novo usuário ao sistema manualmente.</p>
            </div>
            <UserForm />
        </div>
    )
}
