import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getErrorNotebook } from "@/lib/actions"
import { ErrorNotebookList } from "@/components/exam/error-notebook-list"
import { BookOpen } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function ErrorNotebookPage() {
    const session = await auth()
    if (!session?.user) redirect("/login")

    const { questions, error } = await getErrorNotebook()

    if (error) {
        return <div className="p-8 text-red-500">Erro: {error}</div>
    }

    return (
        <div className="container mx-auto p-6 md:p-8 max-w-5xl">
            <header className="mb-8">
                <h1 className="text-3xl font-black text-white flex items-center gap-3 mb-2">
                    <BookOpen className="h-8 w-8 text-yellow-500" />
                    Caderno de Erros
                </h1>
                <p className="text-slate-400 text-lg">
                    Revise suas falhas para transformá-las em acertos. O segredo da aprovação está aqui.
                </p>
            </header>

            <ErrorNotebookList questions={questions || []} />
        </div>
    )
}
