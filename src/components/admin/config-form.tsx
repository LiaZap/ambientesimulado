'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Save, Loader2 } from "lucide-react"
import { updateSystemConfig } from "@/lib/actions"
import { toast } from "sonner"

interface AdminConfigFormProps {
    initialConfig: any
}

export function AdminConfigForm({ initialConfig }: AdminConfigFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [webhookUrl, setWebhookUrl] = useState(initialConfig?.n8nWebhookUrl || "")
    const [siteName, setSiteName] = useState(initialConfig?.siteName || "PRF Ambiente Simulado")
    const [maintenance, setMaintenance] = useState(initialConfig?.maintenanceMode || false)
    const [xpLesson, setXpLesson] = useState(initialConfig?.xpPerLesson || 50)
    const [xpExam, setXpExam] = useState(initialConfig?.xpBaseExam || 20)

    const handleSave = async (section: 'general' | 'gamification' | 'integration') => {
        setIsLoading(true)
        try {
            const data: any = {}
            if (section === 'general') {
                data.siteName = siteName
                data.maintenanceMode = maintenance
            } else if (section === 'gamification') {
                data.xpPerLesson = Number(xpLesson)
                data.xpBaseExam = Number(xpExam)
            } else if (section === 'integration') {
                data.n8nWebhookUrl = webhookUrl
            }

            const result = await updateSystemConfig(data)
            if (result.success) {
                // toast.success("Configurações salvas!")
                alert("Configurações salvas!")
            } else {
                // toast.error("Erro ao salvar.")
                alert("Erro ao salvar.")
            }
        } catch (error) {
            console.error(error)
            alert("Erro ao processar.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white">Configurações do Sistema</h1>
                <p className="text-slate-400">Gerencie parâmetros globais da plataforma.</p>
            </div>

            <div className="grid gap-6">

                {/* General Settings */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-xl text-slate-200">Geral</CardTitle>
                        <CardDescription className="text-slate-400">Configurações básicas do site.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="siteName" className="text-slate-300">Nome da Plataforma</Label>
                            <Input
                                id="siteName"
                                value={siteName}
                                onChange={(e) => setSiteName(e.target.value)}
                                className="bg-slate-950 border-slate-800 text-white"
                            />
                        </div>
                        <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg border-slate-800 bg-slate-950">
                            <div className="space-y-0.5">
                                <Label className="text-base text-slate-200">Manutenção</Label>
                                <p className="text-sm text-slate-500">Ativar modo de manutenção (apenas admins acessam).</p>
                            </div>
                            <Switch
                                checked={maintenance}
                                onCheckedChange={setMaintenance}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            onClick={() => handleSave('general')}
                            disabled={isLoading}
                            className="bg-yellow-500 text-slate-950 hover:bg-yellow-600 font-bold"
                        >
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Salvar Alterações
                        </Button>
                    </CardFooter>
                </Card>

                {/* Integration Settings */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-xl text-slate-200">Integrações (n8n)</CardTitle>
                        <CardDescription className="text-slate-400">Conecte com seus workflows de automação.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="webhookUrl" className="text-slate-300">Webhook URL (Chat IA)</Label>
                            <Input
                                id="webhookUrl"
                                value={webhookUrl}
                                onChange={(e) => setWebhookUrl(e.target.value)}
                                placeholder="https://seu-n8n.com/webhook/..."
                                className="bg-slate-950 border-slate-800 text-white"
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            onClick={() => handleSave('integration')}
                            disabled={isLoading}
                            className="bg-purple-600 text-white hover:bg-purple-700 font-bold"
                        >
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Salvar Webhook
                        </Button>
                    </CardFooter>
                </Card>

                {/* Gamification Settings */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-xl text-slate-200">Gamificação</CardTitle>
                        <CardDescription className="text-slate-400">Ajuste os valores de XP.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="xpLesson" className="text-slate-300">XP por Aula</Label>
                                <Input
                                    id="xpLesson"
                                    type="number"
                                    value={xpLesson}
                                    onChange={(e) => setXpLesson(e.target.value)}
                                    className="bg-slate-950 border-slate-800 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="xpExam" className="text-slate-300">XP Base Simulado</Label>
                                <Input
                                    id="xpExam"
                                    type="number"
                                    value={xpExam}
                                    onChange={(e) => setXpExam(e.target.value)}
                                    className="bg-slate-950 border-slate-800 text-white"
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            onClick={() => handleSave('gamification')}
                            disabled={isLoading}
                            className="bg-yellow-500 text-slate-950 hover:bg-yellow-600 font-bold"
                        >
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Salvar Alterações
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
