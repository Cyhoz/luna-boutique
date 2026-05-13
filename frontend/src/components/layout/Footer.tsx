import Link from 'next/link'
import { Globe, Send, Mail, Moon, Stars, Camera, X } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-white/5 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#db2777]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-8 py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* Brand Identity */}
          <div className="space-y-8">
            <Link href="/" className="group flex flex-col">
              <div className="flex items-center gap-3">
                <Moon className="h-6 w-6 text-[#eab308] pink-glow" />
                <span className="text-3xl font-serif font-medium text-white tracking-tighter">
                  LUNA <span className="gold-text italic">BOUTIQUE</span>
                </span>
              </div>
              <span className="text-[8px] font-black tracking-[0.6em] text-zinc-600 uppercase mt-2 ml-9">Confección de Élite</span>
            </Link>
            <p className="text-[11px] text-zinc-500 leading-loose font-medium uppercase tracking-widest max-w-xs">
              Elegancia etérea para quienes brillan con luz propia. Diseños que capturan la esencia del firmamento nocturno.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 glass rounded-xl border-white/5 flex items-center justify-center text-zinc-500 hover:text-[#db2777] transition-all">
                <Camera className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 glass rounded-xl border-white/5 flex items-center justify-center text-zinc-500 hover:text-[#eab308] transition-all">
                <X className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 glass rounded-xl border-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#eab308] mb-10">Manifiesto</h3>
            <ul className="space-y-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
              <li><Link href="/coleccion" className="hover:text-white transition-colors">La Galería</Link></li>
              <li><Link href="/sobre-nosotros" className="hover:text-white transition-colors">Nuestra Génesis</Link></li>
              <li><Link href="/sostenibilidad" className="hover:text-white transition-colors">Ética Circular</Link></li>
              <li><Link href="/tiendas" className="hover:text-white transition-colors">Puntos de Encuentro</Link></li>
            </ul>
          </div>

          {/* Concierge */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#db2777] mb-10">Conserjería</h3>
            <ul className="space-y-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
              <li><Link href="/mi-cuenta" className="hover:text-white transition-colors">Rastreo Estelar</Link></li>
              <li><Link href="/envios" className="hover:text-white transition-colors">Logística de Lujo</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">Interrogantes</Link></li>
              <li><Link href="/contacto" className="hover:text-white transition-colors">Canal Privado</Link></li>
            </ul>
          </div>

          {/* Newsletter / Stars */}
          <div className="space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white mb-10">Únete al Círculo</h3>
            <div className="relative">
              <input type="email" placeholder="TU CORREO..." className="w-full bg-white/5 border-b border-white/10 py-4 px-2 text-[10px] font-black tracking-widest text-white outline-none focus:border-[#eab308] transition-all" />
              <button className="absolute right-0 bottom-4 text-[#eab308] hover:scale-110 transition-transform">
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="text-[9px] text-zinc-700 italic font-serif">Suscríbete para recibir invitaciones a colecciones privadas.</p>
          </div>

        </div>

        <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col gap-2">
            <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.5em]">
              © 2026 LUNA BOUTIQUE. EL FIRMAMENTO ES NUESTRO.
            </p>
            <p className="text-[8px] text-zinc-800 font-bold uppercase tracking-widest">Hecho con polvo de estrellas en el taller central.</p>
          </div>
          <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
             <Link href="/privacidad" className="hover:text-white transition-all">Privacidad</Link>
             <Link href="/terminos" className="hover:text-white transition-all">Términos</Link>
             <Stars className="h-4 w-4 text-[#eab308]/20 animate-twinkle" />
          </div>
        </div>
      </div>
    </footer>
  )
}
