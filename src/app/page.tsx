import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, ArrowRight, Target, Zap, BookOpen, Trophy } from "lucide-react"
import { prisma } from "@/lib/db"
import { getEmbedUrl } from "@/lib/utils"
import { CountdownTimer } from "@/components/landing/countdown-timer"

export const dynamic = "force-dynamic"

export default async function LandingPage() {
  let videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ?si=adS8vU7ZgC_8jXy2"

  try {
    const config = await prisma.systemConfig.findFirst()
    if (config?.landingPageVideoUrl) {
      videoUrl = getEmbedUrl(config.landingPageVideoUrl)
    }
  } catch (error) {
    console.error("Failed to load system config:", error)
  }

  // Define target date for pre-launch (e.g., Feb 1st, 2026)
  const targetDate = "2026-02-01T00:00:00"

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-yellow-500/30">

      {/* Sticky Countdown Timer */}
      <div className="fixed top-0 left-0 right-0 z-[60]">
        <CountdownTimer targetDate={targetDate} />
      </div>

      {/* Header */}
      <header className="fixed top-[72px] md:top-[88px] w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="PRF Ambiente Simulado" className="h-10 md:h-14 w-auto object-contain hover:scale-105 transition-transform" />
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:block text-slate-300 hover:text-white transition-colors text-sm font-medium">
              Área do Aluno
            </Link>
            <Link href="/registro">
              <Button className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold rounded-full px-8 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 transition-all">
                Começar Agora
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col pt-[140px] md:pt-[168px]">

        {/* HERO SECTION */}
        <section className="relative py-20 lg:py-32 px-6 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 pointer-events-none" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">

            {/* Left Content */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/50 border border-yellow-500/30 text-yellow-500 text-xs md:text-sm font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm animate-fade-in-up">
                <Zap className="h-4 w-4 fill-yellow-500" /> Método Validado
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
                Sua farda da <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-600 drop-shadow-sm">
                  PRF em 2026
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                A única plataforma que une <strong>Inteligência Artificial</strong>, <strong>Gamificação</strong> e <strong>Simulados Reais</strong> para garantir sua aprovação com menos tempo de estudo.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/registro" className="w-full sm:w-auto contents">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-bold text-lg h-14 px-8 rounded-xl shadow-xl shadow-yellow-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                    Quero ser Policial Federal
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#como-funciona" className="w-full sm:w-auto contents">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-slate-700 hover:bg-slate-800 text-slate-300 font-medium text-lg h-14 px-8 rounded-xl backdrop-blur-sm">
                    Ver como funciona
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-slate-500 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-10 w-10 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${10 + i}`} alt="Aluno" className="h-full w-full object-cover opacity-80" />
                    </div>
                  ))}
                  <div className="h-10 w-10 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-xs font-bold text-white">
                    +2k
                  </div>
                </div>
                <p>Alunos já estão estudando hoje.</p>
              </div>
            </div>

            {/* Right Visual / VSL */}
            <div className="relative group perspective-1000">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />

              <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 aspect-video group-hover:shadow-yellow-500/10 transition-all duration-500 transform group-hover:rotate-y-2 group-hover:scale-[1.01]">
                <iframe
                  className="w-full h-full"
                  src={videoUrl}
                  title="Vídeo de Apresentação"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>

                {/* Live Badge Overlay */}
                <div className="absolute top-4 right-4 bg-red-600/90 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse flex items-center gap-2 shadow-lg backdrop-blur-sm">
                  <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                  AO VIVO
                </div>
              </div>

              <div className="mt-6 text-center lg:text-right">
                <p className="inline-block bg-slate-900/80 backdrop-blur border border-slate-800 px-4 py-2 rounded-lg text-sm font-medium text-slate-400">
                  <span className="text-yellow-500 font-bold mr-1">⚠️</span>
                  Vídeo obrigatório para iniciantes
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* LOGOS / SOCIAL PROOF */}
        <section className="py-10 border-y border-slate-900/50 bg-slate-950/50">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm font-medium text-slate-600 uppercase tracking-widest mb-6">Metodologia baseada nas melhores práticas</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Placeholders for logos (e.g., tech stacks, methodologies like pomodoro, spaced repetition) */}
              <span className="font-bold text-xl md:text-2xl">POMODORO</span>
              <span className="font-bold text-xl md:text-2xl">FLASHCARDS</span>
              <span className="font-bold text-xl md:text-2xl">IA GENERATIVA</span>
              <span className="font-bold text-xl md:text-2xl">ANÁLISE DE DADOS</span>
            </div>
          </div>
        </section>

        {/* PAIN POINTS SECTION */}
        <section className="py-24 bg-slate-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/5 to-transparent pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 space-y-16 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Por que a maioria <span className="text-red-500">reprova na PRF?</span>
              </h2>
              <p className="text-slate-400 text-lg">
                Não é falta de capacidade. É falta de estratégia e organização. Identifique o inimigo:
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Desorganização", desc: "Acordar sem saber o que estudar e perder tempo escolhendo materia.", icon: XCircle },
                { title: "Procrastinação", desc: "Sentir culpa por não estudar, mas travar na hora de começar.", icon: Zap },
                { title: "Material Infinito", desc: "PDFs gigantescos que você nunca vai conseguir ler até a prova.", icon: BookOpen },
                { title: "Solidão", desc: "Não ter parâmetros para saber se você está evoluindo ou estagnado.", icon: Target }
              ].map((item, idx) => (
                <div key={idx} className="group p-8 rounded-2xl bg-slate-900/40 border border-slate-800 hover:bg-slate-900 hover:border-red-500/30 transition-all duration-300">
                  <div className="w-14 h-14 bg-slate-950 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg border border-slate-800">
                    <item.icon className="h-7 w-7 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SOLUTION / FEATURES - "How it works" */}
        <section id="como-funciona" className="py-24 px-6 bg-slate-900/30 border-y border-slate-900">
          <div className="max-w-7xl mx-auto space-y-20">
            <div className="text-center mb-16">
              <span className="text-yellow-500 font-bold tracking-wider text-sm uppercase">Solução Completa</span>
              <h2 className="text-3xl md:text-5xl font-bold mt-4">
                Tecnologia de ponta para sua <span className="text-yellow-500">Aprovação</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-1 overflow-hidden hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-500 group">
                <div className="bg-slate-950 rounded-[22px] p-8 h-full flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Target className="w-32 h-32 text-yellow-500" />
                  </div>
                  <div className="h-14 w-14 bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-8 border border-yellow-500/20">
                    <Target className="h-7 w-7 text-yellow-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Ciclo Automático</h3>
                  <p className="text-slate-400 mb-8 flex-1">
                    Esqueça as planilhas. Nossa IA cria seu cronograma diário baseado nas suas dificuldades e tempo disponível.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center text-sm text-slate-300"><CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" /> Adaptação diária</li>
                    <li className="flex items-center text-sm text-slate-300"><CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" /> Revisão espaçada</li>
                  </ul>
                </div>
              </div>

              {/* Feature 2 (Highlighted) */}
              <div className="bg-gradient-to-b from-yellow-500 to-amber-600 rounded-3xl p-[1px] transform md:-translate-y-4 hover:-translate-y-6 transition-transform duration-500 shadow-2xl">
                <div className="bg-slate-950 rounded-[23px] p-8 h-full flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-yellow-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-bl-xl">MAIS POPULAR</div>
                  <div className="h-14 w-14 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-yellow-500/20">
                    <Trophy className="h-7 w-7 text-slate-900" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Gamificação Real</h3>
                  <p className="text-slate-400 mb-8 flex-1">
                    Transforme o estudo chato em um jogo viciante. Ganhe XP, suba de patente e conquiste medalhas.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center text-sm text-slate-300"><CheckCircle2 className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0" /> Ranking Global</li>
                    <li className="flex items-center text-sm text-slate-300"><CheckCircle2 className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0" /> Patentes (PRF)</li>
                    <li className="flex items-center text-sm text-slate-300"><CheckCircle2 className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0" /> Missões Diárias</li>
                  </ul>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-1 overflow-hidden hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 group">
                <div className="bg-slate-950 rounded-[22px] p-8 h-full flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <BookOpen className="w-32 h-32 text-purple-500" />
                  </div>
                  <div className="h-14 w-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8 border border-purple-500/20">
                    <BookOpen className="h-7 w-7 text-purple-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Redação com IA</h3>
                  <p className="text-slate-400 mb-8 flex-1">
                    Correção instantânea nos critérios do Cebraspe. Saiba sua nota exata em segundos, não em dias.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center text-sm text-slate-300"><CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" /> Feedback detalhado</li>
                    <li className="flex items-center text-sm text-slate-300"><CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" /> Temas atualizados</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-32 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-black z-0" />

          <div className="max-w-5xl mx-auto relative z-10">
            <div className="bg-gradient-to-r from-yellow-500 to-amber-600 rounded-3xl p-[1px] shadow-2xl shadow-yellow-500/20">
              <div className="bg-slate-950 rounded-[23px] overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

                <div className="grid md:grid-cols-2 gap-10 p-10 md:p-16 relative z-10">
                  <div className="space-y-8 flex flex-col justify-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                      Comece sua preparação <span className="text-yellow-500">hoje mesmo.</span>
                    </h2>
                    <p className="text-lg text-slate-400">
                      Não deixe para a última hora. A concorrência já está estudando. Garanta acesso a todas as ferramentas premium.
                    </p>

                    <div className="flex flex-col gap-4">
                      <Link href="/registro">
                        <Button className="w-full h-16 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xl rounded-xl shadow-lg transition-transform hover:scale-[1.02]">
                          Quero Garantir Minha Vaga
                        </Button>
                      </Link>
                      <p className="text-center text-sm text-slate-500">7 dias de garantia incondicional.</p>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full" />
                    <img src="/logo.png" alt="Emblema" className="relative z-10 w-64 opacity-90 drop-shadow-2xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-16 bg-black border-t border-slate-900 text-center md:text-left">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <img src="/logo.png" alt="PRF Ambiente Simulado" className="h-10 w-auto object-contain mx-auto md:mx-0" />
              <p className="text-sm text-slate-500 leading-relaxed">
                A plataforma mais completa para sua aprovação na Polícia Rodoviária Federal. Tecnologia, estratégia e resultado.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Plataforma</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><Link href="/registro" className="hover:text-yellow-500 transition-colors">Planos e Preços</Link></li>
                <li><Link href="/login" className="hover:text-yellow-500 transition-colors">Área do Aluno</Link></li>
                <li><Link href="#" className="hover:text-yellow-500 transition-colors">Funcionalidades</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Legal</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><Link href="#" className="hover:text-yellow-500 transition-colors">Termos de Uso</Link></li>
                <li><Link href="#" className="hover:text-yellow-500 transition-colors">Política de Privacidade</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Contato</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li>suporte@solitaryeclipse.com</li>
                <li className="flex gap-4 justify-center md:justify-start mt-4">
                  {/* Social Icons Placeholder */}
                  <div className="w-8 h-8 bg-slate-800 rounded-lg hover:bg-yellow-500 hover:text-slate-900 transition-colors cursor-pointer flex items-center justify-center transition-all">
                    <span className="font-bold text-xs">IG</span>
                  </div>
                  <div className="w-8 h-8 bg-slate-800 rounded-lg hover:bg-blue-500 hover:text-white transition-colors cursor-pointer flex items-center justify-center transition-all">
                    <span className="font-bold text-xs">TW</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-slate-900 text-center text-xs text-slate-600">
            &copy; 2026 Solitary Eclipse. Todos os direitos reservados.
          </div>
        </footer>

      </main>
    </div>
  )
}
