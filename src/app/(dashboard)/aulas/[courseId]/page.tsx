import { getCourse } from "@/lib/data"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { PlayCircle, CheckCircle, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface CoursePageProps {
    params: Promise<{
        courseId: string
    }>
}

export default async function CoursePage(props: CoursePageProps) {
    const params = await props.params;
    const course = await getCourse(params.courseId)

    if (!course) {
        notFound()
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <Link href="/aulas" className="text-sm text-slate-400 hover:text-yellow-500 transition-colors">
                    &larr; Voltar para cursos
                </Link>
                <h1 className="text-3xl font-bold text-white">{course.title}</h1>
                <p className="text-slate-400">{course.description}</p>
            </div>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-slate-100 flex items-center gap-2">
                        <PlayCircle className="h-5 w-5 text-yellow-500" />
                        Conteúdo do Curso
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {course.modules.map((module) => (
                            <AccordionItem key={module.id} value={module.id} className="border-slate-800">
                                <AccordionTrigger className="text-slate-200 hover:text-white hover:no-underline">
                                    <span className="text-left font-medium">{module.title}</span>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-1">
                                    {module.lessons.map((lesson) => {
                                        const isLocked = lesson.isLocked && !lesson.progress?.[0]?.completed // Simplified logic
                                        // For now, assume nothing is tightly locked to let user explore

                                        return (
                                            <Link
                                                key={lesson.id}
                                                href={`/aulas/${course.id}/${lesson.id}`}
                                                className="flex items-center justify-between p-2 rounded hover:bg-slate-800 group transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "h-8 w-8 rounded-full flex items-center justify-center border",
                                                        lesson.progress?.[0]?.completed
                                                            ? "bg-green-500/20 border-green-500 text-green-500"
                                                            : "bg-slate-800 border-slate-700 text-slate-400 group-hover:border-yellow-500 group-hover:text-yellow-500"
                                                    )}>
                                                        {lesson.progress?.[0]?.completed ? <CheckCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-300 group-hover:text-white">{lesson.title}</p>
                                                        <p className="text-xs text-slate-500">{Math.floor(lesson.videoDuration / 60)} min</p>
                                                    </div>
                                                </div>
                                                {/* Button to start */}
                                                <Button size="sm" variant="ghost" className="text-slate-400 group-hover:text-white">
                                                    Assistir
                                                </Button>
                                            </Link>
                                        )
                                    })}
                                    {module.lessons.length === 0 && (
                                        <div className="p-4 text-center text-slate-500 text-sm">Nenhuma aula neste módulo ainda.</div>
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    )
}
