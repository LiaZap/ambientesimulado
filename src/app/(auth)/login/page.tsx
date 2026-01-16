import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
    return (
        <div className="flex min-h-screen w-full">
            {/* Left Side - Form Area */}
            <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-24 xl:px-32 bg-slate-950">
                <div className="mx-auto w-full max-w-sm lg:max-w-md">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Olá, bem-vindo(a)! 👋</h1>
                        <p className="text-slate-400">Entre com suas credenciais para acessar o painel.</p>
                    </div>

                    <LoginForm />

                    <div className="mt-6 text-center text-sm text-slate-400">
                        Não tem uma conta?{" "}
                        <Link href="/registro" className="text-yellow-500 hover:underline font-semibold">
                            Registre-se agora
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Side - Showcase Area */}
            <div className="hidden lg:flex w-1/2 flex-col justify-center items-center bg-gradient-to-br from-slate-900 to-slate-950 relative overflow-hidden border-l border-slate-800">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>

                <div className="relative z-10 p-12 text-center max-w-lg">
                    <div className="bg-slate-800/50 p-4 rounded-2xl inline-block mb-6 backdrop-blur-sm border border-slate-700/50">
                        <span className="text-4xl">👮‍♂️</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Ambiente Simulado PRF</h2>
                    <p className="text-slate-300 text-lg mb-12">
                        Controle total da sua preparação com simulados, estatísticas e cronogramas em um único lugar.
                    </p>

                    <div className="grid grid-cols-3 gap-8 border-t border-slate-800 pt-8">
                        <div>
                            <p className="text-2xl font-bold text-white">24/7</p>
                            <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Disponível</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">100%</p>
                            <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Focado</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">PRO</p>
                            <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Gestão</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
