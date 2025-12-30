'use client'

import { useState } from "react"
import { Send, Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function ChatInterface() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Olá! Sou seu assistente de estudos com IA. Pode me fazer qualquer pergunta sobre as matérias do concurso PRF!' }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSend = async () => {
        if (!input.trim()) return

        const userMessage = { role: 'user', content: input }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            // TODO: Connect to n8n webhook here
            // const response = await fetch('/api/chat', { ... })

            // Mock response for now
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: 'Esta é uma resposta simulada. A integração com o Webhook do n8n será configurada em breve.'
                }])
                setIsLoading(false)
            }, 1000)

        } catch (error) {
            console.error(error)
            setIsLoading(false)
        }
    }

    return (
        <Card className="bg-slate-950 border-slate-800 h-[600px] flex flex-col">
            <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                <div className="flex items-center gap-2 text-yellow-500 font-bold">
                    <Bot className="h-5 w-5" />
                    Assistente IA
                </div>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'assistant' && (
                                <Avatar className="h-8 w-8 border border-yellow-500/50">
                                    <AvatarFallback className="bg-yellow-500/10 text-yellow-500"><Bot className="h-4 w-4" /></AvatarFallback>
                                </Avatar>
                            )}

                            <div className={`rounded-lg p-3 max-w-[80%] text-sm ${msg.role === 'user'
                                ? 'bg-yellow-500 text-slate-950 font-medium'
                                : 'bg-slate-900 text-slate-200 border border-slate-800'
                                }`}>
                                {msg.content}
                            </div>

                            {msg.role === 'user' && (
                                <Avatar className="h-8 w-8 border border-slate-700">
                                    <AvatarFallback className="bg-slate-800 text-slate-400"><User className="h-4 w-4" /></AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3 justify-start">
                            <Avatar className="h-8 w-8 border border-yellow-500/50">
                                <AvatarFallback className="bg-yellow-500/10 text-yellow-500"><Bot className="h-4 w-4" /></AvatarFallback>
                            </Avatar>
                            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-400">
                                <span className="animate-pulse">Digitando...</span>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                <div className="space-y-4">
                    {/* Suggested Questions */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {["O que é o Art. 306 do CTB?", "Como calcular aceleração?", "Diferença dolo e culpa?"].map((q) => (
                            <button
                                key={q}
                                onClick={() => setInput(q)}
                                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-yellow-500 hover:border-yellow-500/50 transition-colors"
                            >
                                ✨ {q}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Digite sua dúvida..."
                            className="bg-slate-950 border-slate-800 focus:ring-yellow-500"
                        />
                        <Button onClick={handleSend} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    )
}
