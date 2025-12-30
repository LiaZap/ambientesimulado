import { getExam } from "@/lib/data"
import { notFound } from "next/navigation"
import { ExamInterface } from "@/components/exam/exam-interface"

interface ExamPageProps {
    params: Promise<{
        examId: string
    }>
}

export default async function ExamPage(props: ExamPageProps) {
    const params = await props.params;
    const exam = await getExam(params.examId)

    if (!exam) {
        notFound()
    }

    return (
        <div className="animate-in fade-in duration-500 py-6">
            <ExamInterface
                examId={exam.id}
                title={exam.title}
                questions={exam.questions}
            />
        </div>
    )
}
