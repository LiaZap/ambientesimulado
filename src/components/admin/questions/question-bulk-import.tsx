'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Upload, Loader2, FileJson } from "lucide-react"
import { createQuestionsBulk } from "@/lib/actions"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function QuestionBulkImport() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [result, setResult] = useState<string | null>(null)
    const router = useRouter()

    async function handleUpload() {
        if (!file) return
        setIsLoading(true)
        setResult(null)

        const reader = new FileReader()
        reader.onload = async (e) => {
            const content = e.target?.result as string
            const response = await createQuestionsBulk(content)

            if (response.error) {
                setResult("Erro: " + response.error)
            } else {
                setResult(`Sucesso! ${response.count} questões importadas.`)
                router.refresh()
                setTimeout(() => setOpen(false), 2000)
            }
            setIsLoading(false)
        }
        reader.readAsText(file)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
                    <Upload className="mr-2 h-4 w-4" /> Importar JSON
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-950 border-slate-800 text-slate-100">
                <DialogHeader>
                    <DialogTitle>Importar Questões em Massa</DialogTitle>
                    <DialogDescription>
                        Envie um arquivo JSON contendo um array de questões.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="file">Arquivo JSON</Label>
                        <Input
                            id="file"
                            type="file"
                            accept=".json"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="bg-slate-900 border-slate-700"
                        />
                    </div>

                    <div className="text-xs text-slate-500 bg-slate-900 p-3 rounded border border-slate-800 font-mono">
                        Exemplo de formato:<br />
                        [<br />
                        &nbsp;&nbsp;{'{'}<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;"statement": "Questão teste...",<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;"subject": "PORTUGUES",<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;"topic": "Crase",<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;"correctAnswer": "A",<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;"options": {'{'}"A": "...", "B": "..."{'}'}<br />
                        &nbsp;&nbsp;{'}'}<br />
                        ]
                    </div>

                    {result && (
                        <div className={`text-sm p-2 rounded ${result.includes('Sucesso') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            {result}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button onClick={handleUpload} disabled={!file || isLoading} className="bg-purple-600 text-white hover:bg-purple-700">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Importar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
