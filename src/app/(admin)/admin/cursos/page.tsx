import Link from "next/link"
import { getAllCourses } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, BookOpen } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DeleteButton } from "@/components/admin/courses/delete-button"

export default async function AdminCoursesPage() {
    const courses = await getAllCourses()

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Gerenciar Cursos</h1>
                    <p className="text-slate-400">Crie cursos e organize seus módulos.</p>
                </div>
                <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold">
                    <Link href="/admin/cursos/novo">
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Curso
                    </Link>
                </Button>
            </div>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input
                            placeholder="Buscar cursos..."
                            className="pl-9 bg-slate-950 border-slate-800 focus:ring-yellow-500"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {courses.length === 0 ? (
                            <div className="text-center py-10 text-slate-500">
                                Nenhum curso encontrado.
                            </div>
                        ) : (
                            courses.map((course) => (
                                <div key={course.id} className="p-4 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors flex justify-between gap-4">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="border-slate-700 text-slate-400">
                                                {course.subject?.replace('_', ' ') || 'Geral'}
                                            </Badge>
                                            <Badge variant={course.isActive ? "default" : "destructive"} className={course.isActive ? "bg-green-500/10 text-green-500" : ""}>
                                                {course.isActive ? "Ativo" : "Inativo"}
                                            </Badge>
                                        </div>
                                        <Link href={`/admin/cursos/${course.id}`} className="hover:underline">
                                            <h3 className="text-lg font-bold text-slate-200">{course.title}</h3>
                                        </Link>
                                        <p className="text-slate-400 text-sm line-clamp-1">{course.description}</p>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <span>{course._count?.modules || 0} Módulos</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button asChild size="icon" variant="ghost" className="text-slate-500 hover:text-white" title="Gerenciar Aulas">
                                            <Link href={`/admin/cursos/${course.id}`}>
                                                <BookOpen className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <DeleteButton id={course.id} type="course" />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
