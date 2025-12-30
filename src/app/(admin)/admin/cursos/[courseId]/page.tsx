import { getCourse } from "@/lib/data"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Trash2, Video, FileText, Clock } from "lucide-react"
import Link from "next/link"
import { ModuleForm } from "@/components/admin/courses/module-form"
import { LessonForm } from "@/components/admin/courses/lesson-form"
import { DeleteButton } from "@/components/admin/courses/delete-button"

interface AdminCourseDetailPageProps {
    params: Promise<{
        courseId: string
    }>
}

export default async function AdminCourseDetailPage(props: AdminCourseDetailPageProps) {
    const params = await props.params;
    const course = await getCourse(params.courseId)

    if (!course) {
        notFound()
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <Button asChild variant="ghost" className="mb-2 pl-0 text-slate-400 hover:text-white">
                        <Link href="/admin/cursos">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                        </Link>
                    </Button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-white">{course.title}</h1>
                        <Badge variant={course.isActive ? "default" : "destructive"}>
                            {course.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                    </div>
                    <p className="text-slate-400 mt-1">{course.description}</p>
                </div>
                <div className="flex items-center gap-2">
                    <DeleteButton id={course.id} type="course" />
                    <ModuleForm courseId={course.id} />
                </div>
            </div>

            <div className="space-y-6">
                {course.modules.length === 0 ? (
                    <Card className="bg-slate-900 border-slate-800 border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-10 text-slate-500">
                            <FileText className="h-10 w-10 mb-4 opacity-50" />
                            <p>Este curso ainda não tem módulos.</p>
                            <p className="text-sm">Crie um módulo para começar a adicionar aulas.</p>
                        </CardContent>
                    </Card>
                ) : (
                    course.modules.map(module => (
                        <Card key={module.id} className="bg-slate-900 border-slate-800">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-slate-950/50">
                                <div>
                                    <CardTitle className="text-lg text-slate-200">{module.title}</CardTitle>
                                    <CardDescription>{module.lessons.length} aulas</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <LessonForm moduleId={module.id} />
                                    <DeleteButton id={module.id} type="module" />
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-2">
                                {module.lessons.length === 0 ? (
                                    <div className="text-sm text-slate-500 italic pl-4">Nenhuma aula neste módulo.</div>
                                ) : (
                                    module.lessons.map(lesson => (
                                        <div key={lesson.id} className="flex items-center justify-between p-3 rounded-md bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors group">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-slate-500 border border-slate-800 group-hover:border-yellow-500/50 group-hover:text-yellow-500 transition-colors">
                                                    <Video className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-200 text-sm">{lesson.title}</p>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {Math.floor(lesson.videoDuration / 60)} min</span>
                                                        {lesson.videoUrl && (
                                                            <a href={lesson.videoUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Link MP4</a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <DeleteButton id={lesson.id} type="lesson" />
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
