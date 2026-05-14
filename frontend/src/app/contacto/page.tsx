import { Mail, MessageSquare, Phone, Send, Sparkles, Stars, Zap } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen lunar-gradient relative overflow-hidden pb-32">
      {/* Decorative Glows */}
      <div className="absolute top-40 -left-40 w-[600px] h-[600px] bg-[#3b0764]/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-40 -right-40 w-[500px] h-[500px] bg-[#db2777]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 pt-32 sm:px-8 max-w-7xl relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-24 space-y-8">
          <div className="flex justify-center items-center gap-4">
            <Stars className="h-5 w-5 text-[#f6ca56] animate-twinkle" />
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#f6ca56]">Canal Privado de Comunicación</span>
            <Stars className="h-5 w-5 text-[#f6ca56] animate-twinkle" />
          </div>
          <h1 className="text-6xl md:text-9xl font-serif font-medium text-white italic leading-none tracking-tighter">
            Hablemos <br />
            <span className="gold-text">del Futuro.</span>
          </h1>
          <p className="text-xl text-zinc-400 font-light leading-relaxed max-w-2xl mx-auto">
            Nuestro equipo de conserjería estelar y sistemas de asistencia automatizada 
            están a tu disposición para garantizar una experiencia sin fricciones.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Contact Info Cards */}
          <div className="space-y-8">
            <div className="glass rounded-[3.5rem] border-white/5 p-10 md:p-14 hover:border-white/10 transition-all group shadow-2xl">
              <div className="flex items-start gap-8">
                <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center text-[#eab308] group-hover:scale-110 transition-transform">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-serif text-white italic">Asistencia Automatizada</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    Nuestro concierge digital está disponible 24/7 para resolver dudas sobre pedidos, 
                    tallas y disponibilidad de piezas exclusivas.
                  </p>
                  <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#eab308]">
                    <Zap className="h-3 w-3 fill-[#eab308]" /> Sistema Activo
                  </div>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="glass rounded-[3rem] border-white/5 p-10 hover:border-white/10 transition-all group">
                <Mail className="h-6 w-6 text-[#db2777] mb-6 group-hover:animate-pulse" />
                <h4 className="text-lg font-serif text-white mb-2 italic">Correo Estelar</h4>
                <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-widest">concierge@lunaboutique.com</p>
              </div>
              <div className="glass rounded-[3rem] border-white/5 p-10 hover:border-white/10 transition-all group">
                <Phone className="h-6 w-6 text-white mb-6 group-hover:rotate-12 transition-transform" />
                <h4 className="text-lg font-serif text-white mb-2 italic">Línea Directa</h4>
                <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-widest">+56 9 LUNA 0000</p>
              </div>
            </div>
          </div>

          {/* Contact Form - High End */}
          <div className="glass rounded-[4rem] border-white/5 p-10 md:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
               <Sparkles className="h-6 w-6 text-white/10" />
            </div>
            
            <form className="space-y-10">
              <div className="grid sm:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-2">Nombre Completo</label>
                  <input 
                    type="text" 
                    placeholder="Escriba su nombre..."
                    className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl px-6 text-[12px] text-white outline-none focus:border-[#eab308] transition-all placeholder:text-zinc-800"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-2">Email Estelar</label>
                  <input 
                    type="email" 
                    placeholder="su@email.com"
                    className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl px-6 text-[12px] text-white outline-none focus:border-[#eab308] transition-all placeholder:text-zinc-800"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-2">Asunto del Mensaje</label>
                <select className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl px-6 text-[12px] text-white outline-none focus:border-[#eab308] transition-all appearance-none">
                  <option className="bg-zinc-950">Consulta sobre Pedido</option>
                  <option className="bg-zinc-950">Alta Costura & Medidas</option>
                  <option className="bg-zinc-950">Colaboraciones</option>
                  <option className="bg-zinc-950">Otro</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-2">Su Mensaje</label>
                <textarea 
                  rows={4}
                  placeholder="En qué podemos asistirle?"
                  className="w-full bg-white/5 border border-white/5 rounded-[2rem] p-6 text-[12px] text-white outline-none focus:border-[#eab308] transition-all placeholder:text-zinc-800 resize-none"
                />
              </div>

              <button className="w-full h-20 rounded-full bg-white text-black text-[11px] font-black uppercase tracking-[0.4em] hover:bg-[#eab308] hover:text-black transition-all flex items-center justify-center gap-4 group">
                Enviar Mensaje
                <Send className="h-4 w-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
