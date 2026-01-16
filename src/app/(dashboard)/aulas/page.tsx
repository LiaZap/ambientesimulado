import { getCourses } from "@/lib/data"
import { CourseCard } from "@/components/course/course-card"
import { SubjectReferenceCard } from "@/components/dashboard/subject-reference-card"

export default async function AulasPage() {
    const courses = await getCourses()

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <SubjectReferenceCard />
                <h1 className="text-3xl font-bold text-white">Sala de Aulas</h1>
                <p className="text-slate-400">Todo o conteúdo que você precisa para ser aprovado.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </div>
    )
}
