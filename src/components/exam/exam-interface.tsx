'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
// import { Badge } from "@/components/ui/badge" // Removed Badge to use custom "stamp" style
import { ChevronLeft, ChevronRight, Flag, Plus, Clock, FileText } from "lucide-react"
import { finishExamAttempt } from "@/lib/actions"
import { cn } from "@/lib/utils"

interface Question {
    id: string
    statement: string
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

    // Timer Logic
    const [elapsedSeconds, setElapsedSeconds] = useState(0)

    useEffect(() => {
        if (!showResult) {
            const timer = setInterval(() => {
                setElapsedSeconds(prev => prev + 1)
            }, 1000)
            return () => clearInterval(timer)
        }
    }, [showResult])

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
                                    "flex items-start space-x-4 p-4 rounded-lg border-2 transition-all cursor-pointer font-serif text-lg",
                                    selected
                                        ? "border-slate-900 bg-slate-100"
                                        : "border-transparent hover:bg-slate-50"
                                )}
                                onClick={() => handleAnswer(opt)}
                            >
                                <div className={cn(
                                    "flex-shrink-0 h-8 w-8 rounded-full border-2 border-slate-900 flex items-center justify-center font-bold text-slate-900",
                                    selected && "bg-slate-900 text-white"
                                )}>
                                    {opt}
                                </div>
                                <span className="text-slate-900 flex-1 pt-0.5">{text}</span>
                            </div>
                        )
                    })}
                </RadioGroup>
            )
        } else {
            // True/False (Cebraspe) - "Folha de Respostas" Style
            return (
                <div className="flex justify-center py-8">
                    <RadioGroup
                        value={answers[currentQuestion.id] || ''}
                        onValueChange={handleAnswer}
                        className="flex gap-12"
                    >
                        <div className="flex flex-col items-center gap-3 cursor-pointer group" onClick={() => handleAnswer('CERTO')}>
                            <div className={cn(
                                "h-8 w-8 rounded-full border-2 border-black flex items-center justify-center transition-all group-hover:scale-110",
                                answers[currentQuestion.id] === 'CERTO' ? "bg-black" : "bg-white"
                            )}>
                                {answers[currentQuestion.id] === 'CERTO' && <div className="h-4 w-4 rounded-full bg-white" />}
                            </div>
                            <Label className="font-serif font-bold text-xl cursor-pointer text-slate-900 tracking-wider">CERTO</Label>
                        </div>

                        <div className="flex flex-col items-center gap-3 cursor-pointer group" onClick={() => handleAnswer('ERRADO')}>
                            <div className={cn(
                                "h-8 w-8 rounded-full border-2 border-black flex items-center justify-center transition-all group-hover:scale-110",
                                answers[currentQuestion.id] === 'ERRADO' ? "bg-black" : "bg-white"
                            )}>
                                {answers[currentQuestion.id] === 'ERRADO' && <div className="h-4 w-4 rounded-full bg-white" />}
                            </div>
                            <Label className="font-serif font-bold text-xl cursor-pointer text-slate-900 tracking-wider">ERRADO</Label>
                        </div>
                    </RadioGroup>
                </div>
            )
        }
    }

    if (showResult && resultData) {
        return (
            <Card className="bg-white border-slate-200 text-slate-900 max-w-2xl mx-auto animate-in fade-in duration-500 shadow-xl font-serif">
                <CardHeader className="border-b border-slate-100 pb-8">
                    <div className="text-center space-y-2">
                        <div className="mx-auto w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mb-4">
                            <Flag className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight">Resultado Final</h2>
                        <p className="text-slate-500 font-sans">Simulado Encerrado</p>
                    </div>
                </CardHeader>
                <CardContent className="py-8 space-y-8">
                    <div className="grid grid-cols-2 gap-8 text-center font-sans">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-sm text-slate-500 uppercase tracking-widest font-bold mb-1">Nota Líquida</p>
                            <p className="text-5xl font-black text-slate-900">{resultData.score}</p>
                        </div>
                        <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                            <p className="text-sm text-yellow-700 uppercase tracking-widest font-bold mb-1">XP Ganho</p>
                            <div className="flex items-center justify-center gap-2">
                                <Plus className="h-5 w-5 text-yellow-600" />
                                <p className="text-5xl font-black text-yellow-600">{resultData.xpEarned}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between px-8 text-center font-sans">
                        <div>
                            <p className="text-2xl font-bold text-green-600">{resultData.correct}</p>
                            <p className="text-xs font-bold text-slate-400 uppercase">Certas</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-red-600">{resultData.wrong}</p>
                            <p className="text-xs font-bold text-slate-400 uppercase">Erradas</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-400">{totalQuestions - (resultData.correct + resultData.wrong)}</p>
                            <p className="text-xs font-bold text-slate-400 uppercase">Em Branco</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="bg-slate-50 border-t border-slate-100 p-6 justify-center">
                    <Button onClick={() => window.location.href = '/simulados'} className="font-sans font-bold bg-slate-900 text-white hover:bg-slate-800">
                        Voltar para Lista
                    </Button>
                </CardFooter>
            </Card>
        )
    }

    return (
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">

            {/* Main Question Paper */}
            <div className="space-y-6">

                {/* Header Info */}
                <div className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-lg shadow-lg lg:hidden">
                    <span className="font-bold flex items-center gap-2"><Clock className="h-4 w-4 text-yellow-500" /> {formatTime(elapsedSeconds)}</span>
                    <span className="text-sm text-slate-400">{currentIndex + 1}/{totalQuestions}</span>
                </div>

                <div className="relative bg-[#fdfbf7] text-slate-900 shadow-2xl rounded-sm min-h-[600px] flex flex-col print:shadow-none">
                    {/* Paper Texture/Header */}
                    <div className="h-2 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500" />

                    <div className="p-8 md:p-12 flex-1 flex flex-col">
                        {/* Question Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-black pb-4 mb-8 gap-4">
                            <div>
                                <h2 className="font-serif font-bold text-2xl uppercase tracking-wide">Questão {currentIndex + 1}</h2>
                                <p className="font-sans text-xs font-bold text-slate-500 uppercase mt-1 tracking-widest">
                                    {currentQuestion.subject.replace(/_/g, ' ')} • {currentQuestion.topic}
                                </p>
                            </div>
                            <div className="px-3 py-1 border-2 border-black font-bold font-sans text-xs uppercase">
                                {currentQuestion.difficulty}
                            </div>
                        </div>

                        {/* Question Statement */}
                        <div className="flex-1">
                            <p className="font-serif text-xl leading-loose text-justify text-slate-900 mb-12">
                                {currentQuestion.statement}
                            </p>

                            {/* Answer Area */}
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                {renderOptions()}
                            </div>
                        </div>
                    </div>

                    {/* Footer Navigation */}
                    <div className="bg-slate-100 p-6 border-t border-slate-200 flex justify-between items-center">
                        <Button
                            onClick={handlePrev}
                            disabled={currentIndex === 0}
                            variant="ghost"
                            className="text-slate-600 hover:text-slate-900 hover:bg-slate-200 font-sans"
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
                        </Button>

                        <div className="hidden md:block text-slate-400 font-serif italic text-sm">
                            Polícia Rodoviária Federal - Concurso 2025
                        </div>

                        {currentIndex === totalQuestions - 1 ? (
                            <Button
                                onClick={finishExam}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 shadow-lg font-sans"
                            >
                                <Flag className="mr-2 h-4 w-4" /> Entregar Prova
                            </Button>
                        ) : (
                            <Button
                                onClick={handleNext}
                                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 shadow-lg font-sans"
                            >
                                Próxima <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Sidebar / Answer Sheet (Gabarito) */}
            <div className="hidden lg:flex flex-col gap-6 sticky top-6">

                {/* Timer Card */}
                <Card className="bg-slate-900 border-slate-800 text-white shadow-xl">
                    <CardContent className="p-6 flex flex-col items-center">
                        <Label className="text-yellow-500 text-xs font-bold uppercase tracking-widest mb-2">Tempo de Prova</Label>
                        <div className="text-4xl font-mono font-bold tracking-wider">
                            {formatTime(elapsedSeconds)}
                        </div>
                    </CardContent>
                </Card>

                {/* Progress / Grid */}
                <Card className="bg-white border-slate-200 shadow-xl flex-1 max-h-[calc(100vh-250px)] overflow-hidden flex flex-col">
                    <div className="p-4 bg-slate-50 border-b border-slate-100">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-slate-600" />
                            Folha de Respostas
                        </h3>
                        <Progress value={progress} className="h-1 mt-3" />
                        <p className="text-xs text-right text-slate-600 font-medium mt-1">{Math.round(progress)}% Concluído</p>
                    </div>

                    <div className="p-2 overflow-y-auto flex-1 custom-scrollbar">
                        <div className="grid grid-cols-5 gap-2">
                            {questions.map((q, idx) => {
                                const isAnswered = answers[q.id]
                                const isCurrent = currentIndex === idx
                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={cn(
                                            "h-10 w-10 text-xs font-bold rounded-lg border flex items-center justify-center transition-all",
                                            isCurrent ? "border-slate-900 bg-slate-900 text-white ring-2 ring-yellow-500 ring-offset-2" :
                                                isAnswered ? "bg-slate-100 border-slate-300 text-slate-900 font-bold" :
                                                    "border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-900 bg-white"
                                        )}
                                    >
                                        {idx + 1}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </Card>
            </div>

        </div>
    )
}
