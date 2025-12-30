import { EssayForm } from "@/components/essay/essay-form"

export default function NewEssayPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white">Nova Redação</h1>
                <p className="text-slate-400">Escreva sua redação abaixo para correção automática.</p>
            </div>

            <EssayForm />
        </div>
    )
}
