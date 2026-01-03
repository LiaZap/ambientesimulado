import { getExam } from "@/lib/data"
import { ExamInterface } from "@/components/exam/exam-interface"
import { notFound } from "next/navigation"

interface ExamPageProps {
    params: {
        examId: string
    }
}

export default async function ExamPage({ params }: ExamPageProps) {
    const exam = await getExam(params.examId)

    if (!exam) {
        notFound()
    }

    return (
        <ExamInterface
            examId={exam.id}
            title={exam.title}
            questions={exam.questions}
        />
    )
}
