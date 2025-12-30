'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, FileText, File } from "lucide-react"

export function DownloadsDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10 gap-2">
                    <Download className="h-4 w-4" />
                    Material Edital 2021
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Download className="h-5 w-5 text-yellow-500" />
                        Materiais para Download
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Baixe os arquivos de referência para seus estudos.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 gap-4">
                        <a
                            href="/downloads/edital-prf-2021.pdf"
                            download
                            className="flex items-center p-4 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 transition-colors group"
                        >
                            <div className="h-10 w-10 rounded bg-red-500/10 flex items-center justify-center mr-4 group-hover:bg-red-500/20 transition-colors">
                                <FileText className="h-6 w-6 text-red-500" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-sm">Edital PRF 2021 (Completo)</h4>
                                <p className="text-xs text-slate-400">Formato PDF • Oficial</p>
                            </div>
                            <Download className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
                        </a>

                        <a
                            href="/downloads/conteudo-programatico.docx"
                            download
                            className="flex items-center p-4 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 transition-colors group"
                        >
                            <div className="h-10 w-10 rounded bg-blue-500/10 flex items-center justify-center mr-4 group-hover:bg-blue-500/20 transition-colors">
                                <File className="h-6 w-6 text-blue-500" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-sm">Conteúdo Programático Verticalizado</h4>
                                <p className="text-xs text-slate-400">Formato Word • Editável</p>
                            </div>
                            <Download className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
                        </a>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
