import { EssayForm } from "@/components/essay/essay-form"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export default async function NewEssayPage() {
    const session = await auth()

    // Fetch user current credits
    const user = session?.user?.id ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { credits: true }
    }) : null

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white">Nova Redação</h1>
                <p className="text-slate-400">Escreva sua redação abaixo para correção automática.</p>
            </div>

            <EssayForm userCredits={user?.credits ?? 0} />
        </div>
    )
}
