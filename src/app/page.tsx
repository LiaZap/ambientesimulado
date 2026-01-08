import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Star, ArrowRight, Target, Zap, BookOpen, Trophy, ShieldCheck, Play } from "lucide-react"
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

  // Target date for pre-launch (Feb 1st, 2026)
  const targetDate = "2026-02-01T00:00:00"

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 flex flex-col font-sans selection:bg-[#C6A969]/30">

      {/* Sticky Countdown Timer */}
      <div className="fixed top-0 left-0 right-0 z-[60]">
        <CountdownTimer targetDate={targetDate} />
      </div>

      {/* Top Warning Banner - Optional VSL Element */}
      <div className="pt-[40px] bg-[#C6A969] text-black text-center text-xs md:text-sm font-bold py-2 uppercase tracking-wide">
        ⚠️ Atenção: Este vídeo sairá do ar em breve
      </div>

      <main className="flex-1 flex flex-col">

        {/* --- VSL HERO SECTION (Centralized) --- */}
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 overflow-hidden">
          {/* Background Ambient Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#C6A969]/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-4xl mx-auto relative z-10 text-center space-y-8">

            {/* Headline Group */}
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-white leading-[1.2]">
                Descubra Como Garantir Sua <br className="hidden md:block" />
                <span className="text-[#C6A969] font-bold">Aprovação na PRF</span> em 2026
              </h1>
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
                Assista ao vídeo abaixo para entender o método que une Tecnologia, Estratégia e Gamificação.
              </p>
            </div>

            {/* Video Wrapper with "Gold" Border and Shadow */}
            <div className="relative group mx-auto w-full max-w-4xl aspect-video rounded-xl shadow-2xl border border-[#C6A969]/30 bg-black overflow-hidden animate-in zoom-in-50 duration-1000 delay-200">
              {/* Pulse Effect behind video */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#C6A969] to-[#8a7238] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />

              <div className="relative w-full h-full bg-slate-900 rounded-xl overflow-hidden z-10">
                <iframe
                  className="w-full h-full"
                  src={videoUrl}
                  title="VSL Presentation"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            {/* CTA Interaction Area */}
            <div className="pt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
              <div className="flex flex-col items-center gap-6">
                {/* "Sound on" tip */}
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <span className="animate-pulse text-[#C6A969]">🔊</span> Verifique se seu som está ligado
                </div>

                <Link href="/registro" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto min-w-[300px] bg-gradient-to-b from-[#C6A969] to-[#9e8346] hover:from-[#d4b675] hover:to-[#b09454] text-black font-bold text-xl h-16 rounded-lg shadow-[0_0_30px_-5px_rgba(198,169,105,0.4)] hover:shadow-[0_0_50px_-10px_rgba(198,169,105,0.6)] hover:scale-[1.02] transition-all duration-300 uppercase tracking-wide border-t border-[#e8d19d]/50">
                    SIM, QUERO COMEÇAR AGORA
                  </Button>
                </Link>

                <div className="flex items-center gap-4 text-xs md:text-sm text-slate-500">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-[#C6A969]" /> Compra Segura</span>
                  <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-[#C6A969]" /> Acesso Imediato</span>
                  <span className="flex items-center gap-1"><Star className="w-4 h-4 text-[#C6A969]" /> 7 Dias de Garantia</span>
                </div>
              </div>
            </div>

          </div>
        </section>


        {/* --- SOCIAL PROOF / LOGOS --- */}
        <section className="py-10 border-y border-[#C6A969]/10 bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-xs font-bold text-[#C6A969] uppercase tracking-[0.2em] mb-8 opacity-80">Reconhecido pela excelência</p>
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Using Text as Logos to maintain clean look without external assets */}
              <h3 className="font-serif text-2xl text-white">PRF<span className="text-[#C6A969]">2026</span></h3>
              <h3 className="font-serif text-2xl text-white">TECH<span className="text-[#C6A969]">EDU</span></h3>
              <h3 className="font-serif text-2xl text-white">ELITE<span className="text-[#C6A969]">CONCURSOS</span></h3>
              <h3 className="font-serif text-2xl text-white">FUTURE<span className="text-[#C6A969]">LEARNING</span></h3>
            </div>
          </div>
        </section>


        {/* --- "WHY US" SECTION (Text heavy content reduced for VSL focus) --- */}
        <section className="py-24 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

            <div className="space-y-8">
              <div className="inline-block px-3 py-1 rounded-full border border-[#C6A969]/30 bg-[#C6A969]/10 text-[#C6A969] text-xs font-bold uppercase tracking-wider">
                Metodologia Exclusiva
              </div>
              <h2 className="text-3xl md:text-5xl font-serif text-white leading-tight">
                Não é apenas estudo.<br />
                É <span className="text-[#C6A969] italic">estratégia de guerra.</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                A maioria dos candidatos reprova por falta de organização e consistência. Nossa plataforma resolve isso automatizando seu planejamento e transformando o estudo em uma jornada viciante.
              </p>

              <ul className="space-y-4">
                {[
                  "Inteligência Artificial que personaliza seu ciclo.",
                  "Sistema de Gamificação com patentes reais da PRF.",
                  "Redação corrigida na hora com nota oficial.",
                  "Banco de Questões focado no Cebraspe."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#C6A969] flex-shrink-0" />
                    <span className="text-slate-200">{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/registro">
                <Button variant="link" className="text-[#C6A969] hover:text-[#e8d19d] p-0 font-bold text-lg mt-4 h-auto">
                  Conhecer os Planos <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>

            <div className="relative">
              {/* Abstract decorative cards */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#C6A969]/20 rounded-full blur-[80px]" />

              <div className="relative z-10 grid gap-6">
                <div className="bg-[#111] border border-white/5 p-6 rounded-xl hover:border-[#C6A969]/30 transition-colors duration-300">
                  <Trophy className="w-10 h-10 text-[#C6A969] mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Gamificação</h3>
                  <p className="text-slate-400 text-sm">Suba de nível, ganhe medalhas e mantenha a constância sem sofrimento.</p>
                </div>
                <div className="bg-[#111] border border-white/5 p-6 rounded-xl hover:border-[#C6A969]/30 transition-colors duration-300 translate-x-4 md:translate-x-8">
                  <Zap className="w-10 h-10 text-[#C6A969] mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">AI Boost</h3>
                  <p className="text-slate-400 text-sm">Nossa IA identifica suas fraquezas e monta revisões automáticas.</p>
                </div>
              </div>
            </div>

          </div>
        </section>


        {/* --- FAQ SECTION (Accordion style) --- */}
        <section className="py-24 bg-[#0A0A0A] border-t border-white/5">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-serif text-center text-white mb-16">Perguntas Frequentes</h2>

            <div className="space-y-4">
              {[
                { q: "O acesso é imediato?", a: "Sim! Assim que o pagamento é confirmado, você recebe seu login e senha por e-mail automaticamente." },
                { q: "Serve para iniciantes?", a: "Com certeza. O sistema cria um plano do zero, ideal para quem está começando e não sabe por onde iniciar." },
                { q: "Tem garantia?", a: "Você tem 7 dias para testar a plataforma. Se não gostar, devolvemos 100% do seu dinheiro, sem perguntas." },
                { q: "Funciona no celular?", a: "Sim, a plataforma é 100% responsiva e funciona perfeitamente em qualquer dispositivo móvel." }
              ].map((faq, i) => (
                <div key={i} className="border border-white/10 rounded-lg p-6 hover:border-[#C6A969]/30 transition-colors bg-[#0f0f0f]">
                  <h3 className="font-bold text-white text-lg mb-2">{faq.q}</h3>
                  <p className="text-slate-400">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* --- FINAL CTA --- */}
        <section className="py-24 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#C6A969]/10 to-transparent" />

          <div className="max-w-4xl mx-auto relative z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl font-serif text-white">
              Sua aprovação não pode esperar.
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              O tempo está passando. Junte-se à elite dos concurseiros e estude com a melhor tecnologia do mercado.
            </p>

            <div className="flex justify-center pt-8">
              <Link href="/registro">
                <Button className="bg-[#C6A969] hover:bg-[#b59a5e] text-black font-bold text-xl px-12 py-8 rounded-full shadow-lg hover:shadow-[#C6A969]/50 hover:scale-105 transition-all duration-300">
                  GARANTIR MEU ACESSO VIP
                </Button>
              </Link>
            </div>
            <p className="text-slate-500 text-sm mt-6">A oferta de pré-lançamento encerra em breve.</p>
          </div>
        </section>

      </main>

      {/* Minimal Footer */}
      <footer className="py-10 text-center text-slate-600 text-sm border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; 2026 PRF Ambiente Simulado. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-[#C6A969] transition-colors">Termos</Link>
            <Link href="#" className="hover:text-[#C6A969] transition-colors">Privacidade</Link>
            <Link href="#" className="hover:text-[#C6A969] transition-colors">Suporte</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
