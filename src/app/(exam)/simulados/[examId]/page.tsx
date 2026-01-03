import { getExam } from "@/lib/data"
import { ExamInterface } from "@/components/exam/exam-interface"
import { notFound } from "next/navigation"

interface ExamPageProps {
    params: Promise<{
        examId: string
    }>
}

export default async function ExamPage(props: ExamPageProps) {
    const params = await props.params
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
