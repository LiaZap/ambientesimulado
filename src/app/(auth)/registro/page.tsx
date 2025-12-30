import Link from "next/link"
import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-white">Crie sua conta</h1>
                <p className="text-slate-400 mt-2">Comece sua preparação hoje</p>
            </div>

            <div className="space-y-4">
                <RegisterForm />

                <div className="text-center text-sm text-slate-400">
                    Já tem uma conta?{" "}
                    <Link href="/login" className="text-yellow-500 hover:underline">
                        Entrar
                    </Link>
                </div>
            </div>
        </div>
    )
}
