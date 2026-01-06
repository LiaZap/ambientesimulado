
import { getExam } from "@/lib/data"
import { notFound } from "next/navigation"
import { ExamInterface } from "@/components/exam/exam-interface"

interface PageProps {
    params: {
        examId: string
    }
}

export default async function ExamPage({ params }: PageProps) {
    const exam = await getExam(params.examId)

    if (!exam) {
        notFound()
    }

    // Transform questions to match ExamInterface expectation if necessary
    // ExamInterface expects: id, statement, supportText, correctAnswer, explanation, difficulty, subject, topic, options (Json)
    // The DB model matches this mostly.

    return (
        <ExamInterface
            examId={exam.id}
            title={exam.title}
            questions={exam.questions}
        />
    )
}
