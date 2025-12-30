'use client'

import { useState } from 'react'
import { toggleLessonProgress } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { CheckCircle, Circle, PlayCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface VideoPlayerProps {
    lessonId: string
    videoUrl: string
    initialCompleted: boolean
    nextLessonId?: string
    courseId: string
}

export function VideoPlayer({ lessonId, videoUrl, initialCompleted, nextLessonId, courseId }: VideoPlayerProps) {
    const [completed, setCompleted] = useState(initialCompleted)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    // Extract YouTube ID if possible
    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    const videoId = getYoutubeId(videoUrl)

    async function handleToggleProgress() {
        setIsLoading(true)
        const newState = !completed
        setCompleted(newState) // Optimistic

        await toggleLessonProgress(lessonId, newState)
        setIsLoading(false)
        router.refresh()

        // Auto-advance logic could go here
    }

    return (
        <div className="space-y-4">
            <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-lg border border-slate-800">
                {videoId ? (
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-500">
                        <PlayCircle className="h-12 w-12 mr-2" />
                        Vídeo Indisponível
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between">
                <Button
                    variant={completed ? "default" : "outline"}
                    className={completed ? "bg-green-600 hover:bg-green-700 text-white" : "border-slate-700 hover:bg-slate-800 text-slate-300"}
                    onClick={handleToggleProgress}
                    disabled={isLoading}
                >
                    {completed ? (
                        <><CheckCircle className="mr-2 h-4 w-4" /> Concluído</>
                    ) : (
                        <><Circle className="mr-2 h-4 w-4" /> Marcar como Concluído</>
                    )}
                </Button>

                {nextLessonId && (
                    <Button
                        variant="ghost"
                        onClick={() => router.push(`/aulas/${courseId}/${nextLessonId}`)}
                        className="text-slate-300 hover:text-white"
                    >
                        Próxima Aula &rarr;
                    </Button>
                )}
            </div>
        </div>
    )
}
