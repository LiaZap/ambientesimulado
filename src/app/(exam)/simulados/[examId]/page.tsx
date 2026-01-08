import { getExam } from "@/lib/data"
import { ExamInterface } from "@/components/exam/exam-interface"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { checkExamLimit } from "@/lib/actions"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ExamPageProps {
    params: Promise<{
        examId: string
    }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ExamPage(props: ExamPageProps) {
    const params = await props.params
    const searchParams = await props.searchParams
    const mode = (searchParams.mode as 'EXAM' | 'TRAINING') || 'EXAM'

    const session = await auth()

    if (!session?.user?.id) {
        redirect("/login")
    }

    const exam = await getExam(params.examId)

    if (!exam) {
        notFound()
    }

    // Check Weekly Limits (Skip limit check for custom exams or implement logic later)
    // Ideally we count custom exams too, but let's assume limit applies to everything
    const limitCheck = await checkExamLimit(session.user.id)

    if (!limitCheck.allowed) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-red-500/50 rounded-xl p-8 max-w-md text-center space-y-6">
                    <div className="mx-auto bg-red-500/10 p-4 rounded-full w-fit">
                        <AlertCircle className="h-12 w-12 text-red-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-2">Limite Atingido</h1>
                        <p className="text-slate-400">
                            {limitCheck.message}
                        </p>
                    </div>
                    <div className="space-y-4">
                        <Link href="/planos" className="block w-full">
                            <Button className="w-full bg-red-600 hover:bg-red-700 font-bold">
                                Fazer Upgrade de Plano
                            </Button>
                        </Link>
                        <Link href="/dashboard" className="block w-full">
                            <Button variant="outline" className="w-full border-slate-700 text-slate-300">
                                Voltar ao Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <ExamInterface
            examId={exam.id}
            title={exam.title}
            questions={exam.questions}
            mode={mode}
        />
    )
}
