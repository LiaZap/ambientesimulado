'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Check, Loader2 } from "lucide-react"
import { createCreditsCheckoutSession } from "@/lib/stripe-actions"
import { useState } from "react"
import { toast } from "sonner"

const creditPackages = [
    { credits: 10, price: 29.90, label: "Iniciante" },
    { credits: 30, price: 69.90, label: "Focado", popular: true },
    { credits: 50, price: 99.90, label: "Avançado" },
]

export default function CreditsPage() {
    const [loading, setLoading] = useState<number | null>(null)

    async function handlePurchase(credits: number, price: number) {
        try {
            setLoading(credits)
            await createCreditsCheckoutSession(credits, price)
        } catch (error) {
            console.error(error)
            toast.error("Erro ao iniciar compra.")
            setLoading(null)
        }
    }

    return (
        <div className="space-y-8 p-6">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Comprar Créditos</h1>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    Adquira mais créditos para correções de redação com IA e planejamentos de estudo personalizados.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {creditPackages.map((pkg) => (
                    <Card key={pkg.credits} className={`bg-slate-900 border-slate-800 relative ${pkg.popular ? 'border-yellow-500/50 shadow-lg shadow-yellow-900/20' : ''}`}>
                        {pkg.popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-slate-950 text-xs font-bold px-3 py-1 rounded-full">
                                MAIS POPULAR
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle className="text-white text-xl">{pkg.label}</CardTitle>
                            <CardDescription>{pkg.credits} créditos</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline mb-4">
                                <span className="text-3xl font-bold text-white">R$ {pkg.price.toFixed(2)}</span>
                            </div>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li className="flex items-center">
                                    <Check className="h-4 w-4 mr-2 text-green-500" />
                                    {pkg.credits} Correções de Redação
                                </li>
                                <li className="flex items-center">
                                    <Check className="h-4 w-4 mr-2 text-green-500" />
                                    Planejamento Personalizado
                                </li>
                                <li className="flex items-center">
                                    <Check className="h-4 w-4 mr-2 text-green-500" />
                                    Sem validade
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className={`w-full font-bold ${pkg.popular ? 'bg-yellow-500 hover:bg-yellow-600 text-slate-900' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}
                                onClick={() => handlePurchase(pkg.credits, pkg.price)}
                                disabled={loading !== null}
                            >
                                {loading === pkg.credits ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                                Comprar Agora
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
