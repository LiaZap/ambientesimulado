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
                <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 gap-4">
                        {/* Edital e Conteúdo */}
                        <a
                            href="/downloads/1 - EDITAL_PRF_2021_ABERTURA.pdf"
                            download
                            className="flex items-center p-4 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 transition-colors group"
                        >
                            <div className="h-10 w-10 rounded bg-red-500/10 flex items-center justify-center mr-4 group-hover:bg-red-500/20 transition-colors">
                                <FileText className="h-6 w-6 text-red-500" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-sm">Edital PRF 2021 (Abertura)</h4>
                                <p className="text-xs text-slate-400">Formato PDF • Oficial</p>
                            </div>
                            <Download className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
                        </a>

                        <a
                            href="/downloads/2 - CONTEUDO DA PROVA PRF 2021.docx"
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

                        {/* Provas e Gabaritos */}
                        <div className="pt-2 border-t border-slate-800">
                            <h5 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Prova & Gabaritos (2021)</h5>
                            <div className="grid gap-3">
                                <a href="/downloads/3 - Prova GERAL PRF objetiva PRF-2021 .pdf" download className="flex items-center justify-between p-3 rounded bg-slate-800/30 hover:bg-slate-800 border border-slate-700/50 transition-colors text-sm">
                                    <span className="flex items-center gap-2"><FileText className="h-4 w-4 text-slate-400" /> Caderno de Prova (Geral)</span>
                                    <Download className="h-4 w-4 text-slate-500" />
                                </a>
                                <a href="/downloads/4 - Gabarito Geral 9 ate 120 - PRF 2021.pdf" download className="flex items-center justify-between p-3 rounded bg-slate-800/30 hover:bg-slate-800 border border-slate-700/50 transition-colors text-sm">
                                    <span className="flex items-center gap-2"><FileText className="h-4 w-4 text-green-500" /> Gabarito Geral (9 a 120)</span>
                                    <Download className="h-4 w-4 text-slate-500" />
                                </a>
                                <div className="grid grid-cols-2 gap-3">
                                    <a href="/downloads/6 - Gabarito Inglês _PRF_2021.pdf" download className="flex items-center justify-between p-3 rounded bg-slate-800/30 hover:bg-slate-800 border border-slate-700/50 transition-colors text-sm">
                                        <span className="flex items-center gap-2"><FileText className="h-4 w-4 text-slate-400" /> Gab. Inglês</span>
                                        <Download className="h-4 w-4 text-slate-500" />
                                    </a>
                                    <a href="/downloads/8 - Gabarito Espanhol _PRF_2021.pdf" download className="flex items-center justify-between p-3 rounded bg-slate-800/30 hover:bg-slate-800 border border-slate-700/50 transition-colors text-sm">
                                        <span className="flex items-center gap-2"><FileText className="h-4 w-4 text-slate-400" /> Gab. Espanhol</span>
                                        <Download className="h-4 w-4 text-slate-500" />
                                    </a>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <a href="/downloads/5 - Prova INGLÊS_PRF_2021.pdf" download className="flex items-center justify-between p-3 rounded bg-slate-800/30 hover:bg-slate-800 border border-slate-700/50 transition-colors text-sm">
                                        <span className="flex items-center gap-2"><FileText className="h-4 w-4 text-slate-400" /> Prova Inglês</span>
                                        <Download className="h-4 w-4 text-slate-500" />
                                    </a>
                                    <a href="/downloads/7 - Prova ESPANHOL_PRF_2021.pdf" download className="flex items-center justify-between p-3 rounded bg-slate-800/30 hover:bg-slate-800 border border-slate-700/50 transition-colors text-sm">
                                        <span className="flex items-center gap-2"><FileText className="h-4 w-4 text-slate-400" /> Prova Espanhol</span>
                                        <Download className="h-4 w-4 text-slate-500" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Redação */}
                        <div className="pt-2 border-t border-slate-800">
                            <h5 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Redação Discursiva</h5>
                            <div className="grid gap-3">
                                <a href="/downloads/9 - REDAÇÃO PRF- prova 2021.pdf" download className="flex items-center justify-between p-3 rounded bg-slate-800/30 hover:bg-slate-800 border border-slate-700/50 transition-colors text-sm">
                                    <span className="flex items-center gap-2"><FileText className="h-4 w-4 text-purple-400" /> Folha da Redação (Prova)</span>
                                    <Download className="h-4 w-4 text-slate-500" />
                                </a>
                                <a href="/downloads/10 - REDAÇÃO - padrão resposta 2021.pdf" download className="flex items-center justify-between p-3 rounded bg-slate-800/30 hover:bg-slate-800 border border-slate-700/50 transition-colors text-sm">
                                    <span className="flex items-center gap-2"><FileText className="h-4 w-4 text-purple-400" /> Padrão de Resposta (Espelho)</span>
                                    <Download className="h-4 w-4 text-slate-500" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
