import { getEditalData } from "@/lib/data"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { EditalClient } from "@/components/edital/edital-client"
import { seedEditalTopics } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { DownloadsDialog } from "@/components/edital/downloads-dialog"

export default async function MeuEditalPage() {
    const session = await auth()
    if (!session) redirect("/login")

    const topics = await getEditalData()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-foreground">Meu Edital Verticalizado</h1>
                        <span className="bg-yellow-500/10 text-yellow-500 text-xs font-bold px-2 py-1 rounded border border-yellow-500/20">
                            Baseado no Último Edital
                        </span>
                        <span className="bg-blue-500/10 text-blue-400 text-xs font-bold px-2 py-1 rounded border border-blue-500/20 animate-pulse">
                            Aguardando Edital 2026
                        </span>
                    </div>
                    <p className="text-muted-foreground">Acompanhe seu progresso ponto a ponto rumo à aprovação.</p>
                </div>
                <div className="flex items-center gap-2">
                    <DownloadsDialog />

                    <form action={async () => {
                        'use server'
                        await seedEditalTopics()
                    }}>
                        <Button variant="outline" className="border-border text-muted-foreground hover:bg-muted/50">
                            Restaurar Tópicos Padrão
                        </Button>
                    </form>
                </div>
            </div>

            <EditalClient topics={topics} />
        </div>
    )
}
