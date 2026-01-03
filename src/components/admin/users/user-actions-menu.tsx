'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { deleteUser } from "@/lib/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface UserActionsMenuProps {
    userId: string
    userName: string
}

export function UserActionsMenu({ userId, userName }: UserActionsMenuProps) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleDelete() {
        if (!confirm(`Tem certeza que deseja excluir o usuário ${userName}?`)) return

        setLoading(true)
        try {
            const result = await deleteUser(userId)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success("Usuário excluído com sucesso!")
                router.refresh()
            }
        } catch (error) {
            toast.error("Erro ao excluir usuário.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="text-slate-500 hover:text-white" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-white">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuItem asChild className="focus:bg-slate-800 cursor-pointer">
                    <Link href={`/admin/usuarios/${userId}`} className="flex items-center w-full">
                        <Edit className="mr-2 h-4 w-4" /> Editar
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem onClick={handleDelete} className="text-red-500 focus:text-red-400 focus:bg-red-950/20 cursor-pointer">
                    <Trash className="mr-2 h-4 w-4" /> Excluir
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
