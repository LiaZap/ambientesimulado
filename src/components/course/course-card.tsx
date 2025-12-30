import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, PlayCircle, FileText } from "lucide-react"

interface CourseCardProps {
    course: {
        id: string
        title: string
        description: string
        subject: string
        _count?: {
            modules: number
        }
    }
}

export function CourseCard({ course }: CourseCardProps) {
    return (
        <Card className="bg-slate-900 border-slate-800 text-slate-100 hover:border-yellow-500/50 transition-all duration-300 group flex flex-col h-full">
            <CardHeader>
                <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-lg font-bold group-hover:text-yellow-500 transition-colors line-clamp-2">
                        {course.title}
                    </CardTitle>
                    <Badge variant="outline" className="border-slate-700 text-slate-400 text-[10px] whitespace-nowrap">
                        {course.subject.replace('_', ' ')}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-1">
                <p className="text-sm text-slate-400 line-clamp-3 mb-4">
                    {course.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                        <PlayCircle className="h-3 w-3" />
                        <span>{course._count?.modules || 0} Módulos</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full bg-slate-800 hover:bg-yellow-500 hover:text-slate-950 transition-colors">
                    <Link href={`/aulas/${course.id}`}>
                        Acessar Aula
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
