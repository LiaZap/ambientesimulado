import { QuestionForm } from "@/components/admin/questions/question-form"

export default function NewQuestionPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white">Criar Nova Questão</h1>
                <p className="text-slate-400">Adicione uma questão ao banco de dados.</p>
            </div>

            <QuestionForm />
        </div>
    )
}
