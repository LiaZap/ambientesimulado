import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, ArrowRight, ShieldCheck, Target, Zap, BookOpen, Trophy } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-yellow-500/30">

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="PRF Ambiente Simulado" className="h-12 w-auto object-contain" />
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:block text-slate-300 hover:text-white transition-colors text-sm font-medium">
              Área do Aluno
            </Link>
            <Link href="/registro">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold rounded-full px-6">
                Começar Agora
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col pt-16">

        {/* HERO SECTION */}
        <section className="relative py-20 lg:py-32 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-yellow-500/10 via-slate-950 to-slate-950 pointer-events-none" />

          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-yellow-500 text-xs font-bold uppercase tracking-wider">
                <Zap className="h-3 w-3" /> Método Validado
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                Está difícil <span className="text-red-500">organizar</span> os estudos para a PRF?
              </h1>

              <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
                Saber por onde começar, com pouco tempo e muita cobrança, é o maior desafio.
                Nossa plataforma organiza sua rota até a aprovação com Inteligência Artificial e Gamificação.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/registro" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-bold text-lg h-14 px-8 rounded-xl shadow-lg shadow-yellow-500/20">
                    Quero ser Policial Federal
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-8 w-8 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-[10px] font-bold text-slate-300">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <p>Junte-se a mais de 2.000 alunos focados.</p>
              </div>
            </div>

            <div className="relative hidden lg:block">
              {/* Abstract Visual Representation of 'Organization' */}
              {/* VSL Video Section */}
              <div className="relative z-10 group cursor-pointer">
                {/* Video Container */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 aspect-video group-hover:shadow-yellow-500/20 transition-all duration-300 transform group-hover:-translate-y-1">

                  {/* Thumbnail / Video Placeholder */}
                  <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                    {/* You can replace this with an actual video tag or iframe later */}
                    <div className="absolute inset-0 bg-[url('/prf-officer.png')] bg-cover bg-center opacity-50" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent" />

                    {/* Play Button */}
                    <div className="relative z-20 h-20 w-20 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30 group-hover:scale-110 transition-transform duration-300">
                      <div className="h-0 w-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-slate-950 border-b-[12px] border-b-transparent ml-1" />
                    </div>
                  </div>

                  {/* Progress Bar (Fake) */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
                    <div className="h-full w-1/3 bg-red-600" />
                  </div>
                </div>

                {/* Video Caption */}
                <div className="mt-4 text-center">
                  <p className="text-sm font-medium text-slate-400">
                    <span className="text-red-500 font-bold animate-pulse mr-2">● AO VIVO</span>
                    Veja como ser aprovado na PRF em 2025
                  </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -z-10" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* PAIN POINTS SECTION */}
        <section className="py-24 bg-slate-950 border-t border-slate-900">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
            <h2 className="text-3xl md:text-5xl font-bold">
              Talvez, nesse exato momento, <br />
              <span className="text-slate-500">você esteja...</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-red-500/50 transition-colors group">
                <XCircle className="h-8 w-8 text-red-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-2">Perdido no conteúdo</h3>
                <p className="text-slate-400">Sem saber se estuda teoria ou faz questões, pulando de um material para outro sem estratégia.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-red-500/50 transition-colors group">
                <XCircle className="h-8 w-8 text-red-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-2">Procrastinando</h3>
                <p className="text-slate-400">Sentindo culpa por não estudar, mas sem energia para começar quando sobra um tempo livre.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-red-500/50 transition-colors group">
                <XCircle className="h-8 w-8 text-red-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-2">Sozinho na jornada</h3>
                <p className="text-slate-400">Sem ninguém para tirar dúvidas ou corrigir suas redações de forma rápida e precisa.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-red-500/50 transition-colors group">
                <XCircle className="h-8 w-8 text-red-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-2">Com medo da reprovação</h3>
                <p className="text-slate-400">Vendo o tempo passar e sentindo que não está evoluindo na velocidade necessária.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SOLUTION / FEATURES */}
        <section className="py-24 px-6 bg-slate-900/20">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold">
                Como funciona na <span className="text-yellow-500">Prática?</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                A única plataforma que une o conteúdo que cai na prova com a tecnologia que você precisa.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 hover:border-yellow-500/50 transition-all hover:-translate-y-1">
                <div className="h-12 w-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-6">
                  <Target className="h-6 w-6 text-yellow-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Ciclo de Estudos Automático</h3>
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm"><CheckCircle2 className="inline h-4 w-4 text-green-500 mr-2" />Cronograma adaptativo</p>
                  <p className="text-slate-400 text-sm"><CheckCircle2 className="inline h-4 w-4 text-green-500 mr-2" />Metas diárias claras</p>
                  <p className="text-slate-400 text-sm"><CheckCircle2 className="inline h-4 w-4 text-green-500 mr-2" />Edital verticalizado</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 hover:border-blue-500/50 transition-all hover:-translate-y-1">
                <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Gamificação & Ranking</h3>
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm"><CheckCircle2 className="inline h-4 w-4 text-green-500 mr-2" />Ganhe XP por estudar</p>
                  <p className="text-slate-400 text-sm"><CheckCircle2 className="inline h-4 w-4 text-green-500 mr-2" />Suba de Nível</p>
                  <p className="text-slate-400 text-sm"><CheckCircle2 className="inline h-4 w-4 text-green-500 mr-2" />Dispute no Ranking Global</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 hover:border-purple-500/50 transition-all hover:-translate-y-1">
                <div className="h-12 w-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6">
                  <BookOpen className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Correção de Redação IA</h3>
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm"><CheckCircle2 className="inline h-4 w-4 text-green-500 mr-2" />Correção em segundos</p>
                  <p className="text-slate-400 text-sm"><CheckCircle2 className="inline h-4 w-4 text-green-500 mr-2" />Critérios Cebraspe</p>
                  <p className="text-slate-400 text-sm"><CheckCircle2 className="inline h-4 w-4 text-green-500 mr-2" />Sugestões de melhoria</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MENTOR / CTA SECTION */}
        <section className="py-24 px-6 bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="max-w-5xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid md:grid-cols-2">
              <div className="p-12 flex flex-col justify-center space-y-6">
                <h2 className="text-3xl font-bold text-white">
                  Você não precisa estudar <span className="text-yellow-500">sozinho.</span>
                </h2>
                <p className="text-slate-400 leading-relaxed">
                  Tenha acesso à plataforma que simula exatamente o que você vai enfrentar no dia da prova.
                  Questões, simulados, tempo de prova e pressão, tudo controlado para garantir sua performance máxima.
                </p>
                <Link href="/registro">
                  <Button className="bg-white text-slate-950 hover:bg-slate-200 font-bold px-8 h-12 w-full md:w-auto">
                    Garantir minha vaga
                  </Button>
                </Link>
                <p className="text-xs text-slate-500 text-center md:text-left">
                  *Acesso imediato após cadastro.
                </p>
              </div>
              <div className="bg-slate-950 relative h-64 md:h-auto overflow-hidden">
                <div className="absolute inset-0 bg-[url('/prf-officer.png')] bg-cover bg-center opacity-40 mix-blend-luminosity" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-slate-900/80 backdrop-blur-sm p-4 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-yellow-500 flex items-center justify-center font-bold text-slate-900">
                        <Trophy className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Aprovado na PRF</p>
                        <p className="text-xs text-slate-400">O próximo pode ser você.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-12 bg-slate-950 border-t border-slate-900 text-center md:text-left">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <img src="/logo.png" alt="PRF Ambiente Simulado" className="h-8 w-auto object-contain" />
              </div>
              <p className="text-sm text-slate-500">
                Tecnologia a serviço da sua aprovação.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Plataforma</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="#" className="hover:text-yellow-500">Planos</Link></li>
                <li><Link href="#" className="hover:text-yellow-500">Funcionalidades</Link></li>
                <li><Link href="/login" className="hover:text-yellow-500">Área do Aluno</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="#" className="hover:text-yellow-500">Central de Ajuda</Link></li>
                <li><Link href="#" className="hover:text-yellow-500">Termos de Uso</Link></li>
                <li><Link href="#" className="hover:text-yellow-500">Privacidade</Link></li>
              </ul>
            </div>

            <div className="text-sm text-slate-500">
              &copy; 2025 Solitary Eclipse. <br /> Todos os direitos reservados.
            </div>
          </div>
        </footer>

      </main>
    </div>
  )
}
