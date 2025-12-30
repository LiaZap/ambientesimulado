import { getLesson, getCourse } from "@/lib/data"
import { notFound } from "next/navigation"
import Link from "next/link"
import { VideoPlayer } from "@/components/course/video-player"
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { PlayCircle, CheckCircle, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface LessonPageProps {
    params: Promise<{
        courseId: string
        lessonId: string
    }>
}

export default async function LessonPage(props: LessonPageProps) {
    const params = await props.params;
    const lesson = await getLesson(params.lessonId)
    const course = await getCourse(params.courseId)

    if (!lesson || !course) {
        notFound()
    }

    // Determine next lesson logic (simplified flattened list)
    const allLessons = course.modules.flatMap(m => m.lessons)
    const currentIndex = allLessons.findIndex(l => l.id === lesson.id)
    const nextLesson = allLessons[currentIndex + 1]

    return (
        <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in duration-500 h-[calc(100vh-100px)]">
            {/* Main Content: Video & Info */}
            <div className="flex-1 space-y-6 overflow-y-auto pr-2">
                <Link href={`/aulas/${params.courseId}`} className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Voltar para o curso
                </Link>

                <div className="space-y-4">
                    <h1 className="text-2xl font-bold text-white">{lesson.title}</h1>
                    <VideoPlayer
                        lessonId={lesson.id}
                        videoUrl={lesson.videoUrl}
                        initialCompleted={lesson.progress?.[0]?.completed || false}
                        nextLessonId={nextLesson?.id}
                        courseId={params.courseId}
                    />

                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                        <h3 className="font-semibold text-slate-200 mb-2">Sobre esta aula</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {lesson.description || "Sem descrição disponível para esta aula."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Sidebar: Playlist */}
            <div className="w-full lg:w-96 shrink-0 flex flex-col gap-4">
                <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
                    <CardHeader className="pb-3 border-b border-slate-800">
                        <CardTitle className="text-sm font-medium text-slate-400">Conteúdo do Curso</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 overflow-y-auto">
                        <Accordion type="single" collapsible className="w-full" defaultValue={lesson.module.id}>
                            {course.modules.map((module) => (
                                <AccordionItem key={module.id} value={module.id} className="border-slate-800">
                                    <AccordionTrigger className="px-4 py-3 text-slate-200 hover:text-white hover:no-underline hover:bg-slate-800/50">
                                        <span className="text-left font-medium text-sm line-clamp-1">{module.title}</span>
                                    </AccordionTrigger>
                                    <AccordionContent className="p-0">
                                        {module.lessons.map((l) => {
                                            const isActive = l.id === lesson.id
                                            return (
                                                <Link
                                                    key={l.id}
                                                    href={`/aulas/${course.id}/${l.id}`}
                                                    className={cn(
                                                        "flex items-center gap-3 px-4 py-3 border-l-2 transition-colors",
                                                        isActive
                                                            ? "bg-yellow-500/10 border-yellow-500"
                                                            : "border-transparent hover:bg-slate-800"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "h-5 w-5 rounded-full flex items-center justify-center shrink-0",
                                                        l.progress?.[0]?.completed
                                                            ? "text-green-500"
                                                            : (isActive ? "text-yellow-500" : "text-slate-600")
                                                    )}>
                                                        {l.progress?.[0]?.completed ? <CheckCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={cn(
                                                            "text-sm font-medium truncate",
                                                            isActive ? "text-yellow-500" : "text-slate-400 group-hover:text-white"
                                                        )}>
                                                            {l.title}
                                                        </p>
                                                        <p className="text-[10px] text-slate-600 self-end">
                                                            {Math.floor(l.videoDuration / 60)} min
                                                        </p>
                                                    </div>
                                                </Link>
                                            )
                                        })}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
