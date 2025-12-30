import { CourseForm } from "@/components/admin/courses/course-form"

export default function NewCoursePage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white">Criar Novo Curso</h1>
                <p className="text-slate-400">Adicione um novo curso à plataforma.</p>
            </div>

            <CourseForm />
        </div>
    )
}
