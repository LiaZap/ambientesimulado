import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-white">Bem-vindo de volta</h1>
                <p className="text-slate-400 mt-2">Entre na sua conta para continuar</p>
            </div>

            <div className="space-y-4">
                <LoginForm />

                <div className="text-center text-sm text-slate-400">
                    Não tem uma conta?{" "}
                    <Link href="/registro" className="text-yellow-500 hover:underline">
                        Registre-se
                    </Link>
                </div>
            </div>
        </div>
    )
}
