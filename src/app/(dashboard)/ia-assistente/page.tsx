import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Calendar, Sparkles } from "lucide-react"
import { ChatInterface } from "@/components/ia/chat-interface"
import { StudyPlanner } from "@/components/ia/study-planner"

export default function IAAssistantPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-8 w-8 text-yellow-500" />
                    IA Assistente
                </h1>
                <p className="text-slate-400">Sua copiloto de estudos inteligente.</p>
            </div>

            <Tabs defaultValue="chat" className="w-full">
                <TabsList className="bg-slate-900 border border-slate-800">
                    <TabsTrigger value="chat" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-slate-950">
                        <Bot className="mr-2 h-4 w-4" />
                        Chat IA
                    </TabsTrigger>
                    <TabsTrigger value="planner" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-slate-950">
                        <Calendar className="mr-2 h-4 w-4" />
                        Planejamento
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="chat" className="mt-6">
                    <ChatInterface />
                </TabsContent>

                <TabsContent value="planner" className="mt-6">
                    <StudyPlanner />
                </TabsContent>
            </Tabs>
        </div>
    )
}
