'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Flag, Plus, Clock, FileText, Pause, Play, LogOut, LayoutGrid } from "lucide-react"
import { finishExamAttempt } from "@/lib/actions"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"

interface Question {
    id: string
    statement: string
    supportText?: string | null
    correctAnswer: string
    explanation: string | null
    difficulty: string
    subject: string
    topic: string
    options?: any // Prisma Json
}

interface ExamInterfaceProps {
    examId: string
    title: string
    questions: Question[]
}

export function ExamInterface({ examId, title, questions }: ExamInterfaceProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [showResult, setShowResult] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [resultData, setResultData] = useState<{ score: number, correct: number, wrong: number, xpEarned: number } | null>(null)
    const [isPaused, setIsPaused] = useState(false)
    const [showSidebar, setShowSidebar] = useState(false) // For mobile/toggle

    // Timer Logic
    const [elapsedSeconds, setElapsedSeconds] = useState(0)

    useEffect(() => {
        if (!showResult && !isPaused) {
            const timer = setInterval(() => {
                setElapsedSeconds(prev => prev + 1)
            }, 1000)
            return () => clearInterval(timer)
        }
    }, [showResult, isPaused])

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        const s = seconds % 60
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }

    const currentQuestion = questions[currentIndex]
    const totalQuestions = questions.length
    const answeredCount = Object.keys(answers).length
    const progress = (answeredCount / totalQuestions) * 100

    const handleAnswer = (value: string) => {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }))
    }

    const handleNext = () => {
        if (currentIndex < totalQuestions - 1) {
            setCurrentIndex(prev => prev + 1)
        }
    }

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1)
        }
    }

    const togglePause = () => {
        setIsPaused(prev => !prev)
    }

    const finishExam = async () => {
        if (!confirm("Tem certeza que deseja finalizar o simulado?")) return

        setIsLoading(true)
        try {
            const result = await finishExamAttempt(examId, answers, elapsedSeconds)

            if (result.success && result.score !== undefined) {
                setResultData({
                    score: result.score,
                    correct: result.correct!,
                    wrong: result.wrong!,
                    xpEarned: result.xpEarned!
                })
                setShowResult(true)
            } else {
                alert("Erro ao enviar simulado: " + (result.error || "Desconhecido"))
            }
        } catch (error) {
            console.error(error)
            alert("Erro ao finalizar.")
        } finally {
            setIsLoading(false)
        }
    }

    // Render Options Logic (Paper Style)
    const renderOptions = () => {
        const isSelected = (val: string) => answers[currentQuestion.id] === val

        if (currentQuestion.options && typeof currentQuestion.options === 'object' && Object.keys(currentQuestion.options).length > 0) {
            // Multiple Choice (A-E)
            return (
                <RadioGroup
                    value={answers[currentQuestion.id] || ''}
                    onValueChange={handleAnswer}
                    className="space-y-4"
                >
                    {['A', 'B', 'C', 'D', 'E'].map(opt => {
                        const text = (currentQuestion.options as any)[opt]
                        if (!text) return null
                        const selected = isSelected(opt)
                        return (
                            <div key={opt}
                                className={cn(
                                    "flex items-start space-x-6 p-6 rounded-xl border transition-all cursor-pointer group relative overflow-hidden",
                                    selected
                                        ? "border-slate-900 bg-slate-100 shadow-md"
                                        : "border-slate-200 hover:border-slate-400 hover:bg-white bg-white/50"
                                )}
                                onClick={() => handleAnswer(opt)}
                            >
                                <div className={cn(
                                    "flex-shrink-0 h-10 w-10 rounded-full border-2 flex items-center justify-center font-bold text-lg transition-colors z-10",
                                    selected ? "bg-slate-900 border-slate-900 text-white" : "border-slate-300 text-slate-500 group-hover:border-slate-900 group-hover:text-slate-900"
                                )}>
                                    {opt}
                                </div>
                                <span className={cn(
                                    "flex-1 pt-1 text-lg font-medium leading-relaxed z-10 font-serif",
                                    selected ? "text-slate-900" : "text-slate-700"
                                )}>{text}</span>
                            </div>
                        )
                    })}
                </RadioGroup>
            )
        } else {
            // True/False (Cebraspe) - "Folha de Respostas" Style
            return (
                <div className="flex justify-center py-12">
                    <RadioGroup
                        value={answers[currentQuestion.id] || ''}
                        onValueChange={handleAnswer}
                        className="flex gap-16 md:gap-24"
                    >
                        <div className="flex flex-col items-center gap-4 cursor-pointer group" onClick={() => handleAnswer('CERTO')}>
                            <div className={cn(
                                "h-16 w-16 rounded-full border-4 flex items-center justify-center transition-all shadow-sm group-hover:scale-110",
                                answers[currentQuestion.id] === 'CERTO' ? "bg-slate-900 border-slate-900" : "bg-white border-slate-300 group-hover:border-slate-900"
                            )}>
                                {answers[currentQuestion.id] === 'CERTO' && <div className="h-6 w-6 rounded-full bg-white" />}
                            </div>
                            <Label className="font-sans font-bold text-xl cursor-pointer text-slate-700 uppercase tracking-widest group-hover:text-slate-900">Certo</Label>
                        </div>

                        <div className="flex flex-col items-center gap-4 cursor-pointer group" onClick={() => handleAnswer('ERRADO')}>
                            <div className={cn(
                                "h-16 w-16 rounded-full border-4 flex items-center justify-center transition-all shadow-sm group-hover:scale-110",
                                answers[currentQuestion.id] === 'ERRADO' ? "bg-slate-900 border-slate-900" : "bg-white border-slate-300 group-hover:border-slate-900"
                            )}>
                                {answers[currentQuestion.id] === 'ERRADO' && <div className="h-6 w-6 rounded-full bg-white" />}
                            </div>
                            <Label className="font-sans font-bold text-xl cursor-pointer text-slate-700 uppercase tracking-widest group-hover:text-slate-900">Errado</Label>
                        </div>
                    </RadioGroup>
                </div>
            )
        }
    }

    if (showResult && resultData) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <Card className="bg-white border-none shadow-2xl max-w-2xl w-full mx-auto animate-in fade-in duration-500">
                    <CardHeader className="border-b border-slate-100 pb-8 pt-8">
                        <div className="text-center space-y-4">
                            <div className="mx-auto w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg transform -translate-y-2">
                                <Flag className="h-10 w-10 text-slate-900" />
                            </div>
                            <div>
                                <h2 className="text-4xl font-black tracking-tight text-slate-900">Resultado Final</h2>
                                <p className="text-slate-500 font-medium text-lg mt-2">Simulado Concluído com Sucesso</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="py-10 space-y-10">
                        <div className="grid grid-cols-2 gap-8 text-center font-sans">
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-sm text-slate-500 uppercase tracking-widest font-bold mb-2">Nota Líquida</p>
                                <p className="text-6xl font-black text-slate-900">{resultData.score}</p>
                            </div>
                            <div className="p-6 bg-yellow-50 rounded-2xl border border-yellow-100">
                                <p className="text-sm text-yellow-700 uppercase tracking-widest font-bold mb-2">XP Ganho</p>
                                <div className="flex items-center justify-center gap-2">
                                    <Plus className="h-6 w-6 text-yellow-600" />
                                    <p className="text-6xl font-black text-yellow-600">{resultData.xpEarned}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between px-12 text-center font-sans">
                            <div>
                                <p className="text-3xl font-bold text-green-600">{resultData.correct}</p>
                                <p className="text-xs font-bold text-slate-400 uppercase mt-1">Acertos</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-red-600">{resultData.wrong}</p>
                                <p className="text-xs font-bold text-slate-400 uppercase mt-1">Erros</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-slate-400">{totalQuestions - (resultData.correct + resultData.wrong)}</p>
                                <p className="text-xs font-bold text-slate-400 uppercase mt-1">Em Branco</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-slate-50 rounded-b-xl p-8 justify-center">
                        <Button onClick={() => window.location.href = '/simulados'} className="h-12 px-8 font-bold bg-slate-900 text-white hover:bg-slate-800 text-lg shadow-lg">
                            Voltar para Meus Simulados
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-yellow-200">
            {/* Top Bar - Minimalist */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-12 flex-shrink-0 shadow-sm z-20 relative">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => window.location.href = '/simulados'} className="text-slate-500 hover:text-slate-900">
                        <ChevronLeft className="h-5 w-5 mr-1" /> Sair
                    </Button>
                    <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block" />
                    <h1 className="font-bold text-slate-900 text-lg truncate max-w-[200px] sm:max-w-md hidden sm:block" title={title}>
                        {title}
                    </h1>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 bg-slate-100 py-1.5 px-4 rounded-full border border-slate-200 shadow-inner">
                        <Clock className="h-4 w-4 text-slate-500" />
                        <span className="font-mono font-bold text-slate-700 text-lg tabular-nums">
                            {formatTime(elapsedSeconds)}
                        </span>
                    </div>

                    <Button
                        size="sm"
                        variant="outline"
                        className={cn(
                            "gap-2 font-bold border-2 transition-all",
                            isPaused ? "bg-yellow-100 border-yellow-400 text-yellow-700 hover:bg-yellow-200" : "hover:bg-slate-100 hover:border-slate-300"
                        )}
                        onClick={togglePause}
                    >
                        {isPaused ? <Play className="h-4 w-4 fill-current" /> : <Pause className="h-4 w-4 fill-current" />}
                        <span className="hidden sm:inline">{isPaused ? "Continuar" : "Pausar"}</span>
                    </Button>

                    <Button
                        size="icon"
                        variant="ghost"
                        className="lg:hidden"
                        onClick={() => setShowSidebar(!showSidebar)}
                    >
                        <LayoutGrid className="h-5 w-5 text-slate-600" />
                    </Button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden relative">

                {/* Pause Overlay */}
                <AnimatePresence>
                    {isPaused && (
                        <motion.div
                            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
                            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                            className="absolute inset-0 z-50 bg-slate-900/30 flex items-center justify-center p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center space-y-6"
                            >
                                <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <Pause className="h-8 w-8 text-yellow-600 fill-current" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900">Simulado Pausado</h3>
                                    <p className="text-slate-500 mt-2">O cronômetro está parado. Respire fundo e continue quando estiver pronto!</p>
                                </div>
                                <Button size="lg" className="w-full font-bold text-lg bg-slate-900 text-white hover:bg-slate-800" onClick={togglePause}>
                                    <Play className="h-5 w-5 mr-2 fill-current" /> Retornar à Prova
                                </Button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Question Area */}
                <main className={cn(
                    "flex-1 overflow-y-auto p-4 md:p-8 transition-all duration-300",
                    isPaused && "opacity-0 pointer-events-none" // Hide content visually too if blur isn't enough, but blur is better for UX
                )}>
                    <div className="max-w-4xl mx-auto space-y-8 pb-20">
                        {/* Progress Bar */}
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${progress}%` }} />
                        </div>

                        {/* Question Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px] flex flex-col">
                            {/* Question Header */}
                            <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h2 className="font-serif font-bold text-2xl text-slate-900 flex items-center gap-3">
                                        <span className="bg-slate-900 text-white px-3 py-1 rounded text-base font-sans">Q{currentIndex + 1}</span>
                                        <span className="text-slate-400 text-lg font-sans font-medium">/ {totalQuestions}</span>
                                    </h2>
                                </div>
                                <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider">
                                    <span className="px-3 py-1 bg-white border border-slate-200 rounded text-slate-600">{currentQuestion.subject.replace(/_/g, ' ')}</span>
                                    <span className="px-3 py-1 bg-white border border-slate-200 rounded text-slate-600">{currentQuestion.topic}</span>
                                    <span className={cn(
                                        "px-3 py-1 rounded border",
                                        currentQuestion.difficulty === 'EASY' ? "bg-green-50 text-green-700 border-green-200" :
                                            currentQuestion.difficulty === 'MEDIUM' ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                                                "bg-red-50 text-red-700 border-red-200"
                                    )}>
                                        {currentQuestion.difficulty}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 md:p-12 flex-1 flex flex-col gap-10">
                                {/* Support Text */}
                                {currentQuestion.supportText && (
                                    <div className="p-8 bg-[#fffdf5] border-l-4 border-yellow-400 rounded-r-lg">
                                        <p className="font-serif text-lg leading-loose text-slate-800 italic">
                                            {currentQuestion.supportText}
                                        </p>
                                    </div>
                                )}

                                {/* Statement */}
                                <div className="prose prose-slate max-w-none">
                                    <p className="font-serif text-2xl leading-loose text-slate-900 text-justify">
                                        {currentQuestion.statement}
                                    </p>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-slate-100 w-full" />

                                {/* Answers */}
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {renderOptions()}
                                </div>
                            </div>

                            {/* Footer Navigation within Card */}
                            <div className="bg-slate-50 px-8 py-6 border-t border-slate-100 flex justify-between items-center">
                                <Button
                                    onClick={handlePrev}
                                    disabled={currentIndex === 0}
                                    variant="outline"
                                    className="border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400 font-bold px-6"
                                >
                                    <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
                                </Button>

                                {currentIndex === totalQuestions - 1 ? (
                                    <Button
                                        onClick={finishExam}
                                        className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 shadow-lg shadow-green-600/20 text-lg h-12"
                                    >
                                        <Flag className="mr-2 h-5 w-5" /> Entregar Prova
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleNext}
                                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 shadow-lg shadow-slate-900/20 text-lg h-12"
                                    >
                                        Próxima <ChevronRight className="ml-2 h-5 w-5" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </main>

                {/* Right Panel - Question Navigation (Gabarito) */}
                <aside className={cn(
                    "w-80 bg-white border-l border-slate-200 flex-col absolute inset-y-0 right-0 z-30 transform transition-transform duration-300 lg:relative lg:translate-x-0 shadow-xl lg:shadow-none lg:flex",
                    showSidebar ? "translate-x-0 flex" : "translate-x-full hidden"
                )}>
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <LayoutGrid className="h-5 w-5 text-slate-500" />
                            Navegação
                        </h3>
                        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setShowSidebar(false)}>
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        <div className="grid grid-cols-5 gap-3">
                            {questions.map((q, idx) => {
                                const isAnswered = answers[q.id]
                                const isCurrent = currentIndex === idx
                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => {
                                            setCurrentIndex(idx)
                                            setShowSidebar(false) // Close on mobile selection
                                        }}
                                        className={cn(
                                            "aspect-square rounded-lg flex items-center justify-center text-sm font-bold transition-all border-2",
                                            isCurrent ? "border-slate-900 bg-slate-900 text-white shadow-md scale-105 ring-2 ring-yellow-400 ring-offset-2" :
                                                isAnswered ? "bg-slate-100 border-slate-300 text-slate-600" :
                                                    "border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-600 bg-white"
                                        )}
                                    >
                                        {idx + 1}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="p-6 bg-slate-50 border-t border-slate-100">
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Respondidas</span>
                                <span className="font-bold text-slate-900">{answeredCount}/{totalQuestions}</span>
                            </div>
                            <Progress value={progress} className="h-2 rounded-full bg-slate-200" />
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}
