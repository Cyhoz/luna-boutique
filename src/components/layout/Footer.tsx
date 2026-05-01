import Link from 'next/link'
import { Globe, Send, Mail, Moon } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900">
      <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="group flex items-center gap-2">
              <span className="text-4xl font-serif font-black tracking-widest text-primary">
                LUNA
              </span>
              <span className="text-[10px] font-sans font-bold tracking-[0.4em] opacity-40 uppercase pt-2">Boutique</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              Curaduría exclusiva de moda atemporal. Elegancia etérea para el hombre y la mujer contemporáneos.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-3 rounded-full bg-muted hover:bg-primary hover:text-white transition-all">
                <Globe className="h-4 w-4" />
              </a>
              <a href="#" className="p-3 rounded-full bg-muted hover:bg-primary hover:text-white transition-all">
                <Send className="h-4 w-4" />
              </a>
              <a href="#" className="p-3 rounded-full bg-muted hover:bg-primary hover:text-white transition-all">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-8">Compañía</h3>
            <ul className="space-y-4 text-sm font-medium text-muted-foreground">
              <li><Link href="/sobre-nosotros" className="hover:text-primary transition-colors">Nuestra Historia</Link></li>
              <li><Link href="/sostenibilidad" className="hover:text-primary transition-colors">Consciencia Luna</Link></li>
              <li><Link href="/tiendas" className="hover:text-primary transition-colors">Boutiques</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition-colors">Carreras</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-8">Asistencia</h3>
            <ul className="space-y-4 text-sm font-medium text-muted-foreground">
              <li><Link href="/mi-cuenta" className="hover:text-primary transition-colors">Seguimiento</Link></li>
              <li><Link href="/envios" className="hover:text-primary transition-colors">Envíos & Tiempos</Link></li>
              <li><Link href="/devoluciones" className="hover:text-primary transition-colors">Devoluciones</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-8">Privacidad</h3>
            <ul className="space-y-4 text-sm font-medium text-muted-foreground">
              <li><Link href="/terminos" className="hover:text-primary transition-colors">Términos</Link></li>
              <li><Link href="/privacidad" className="hover:text-primary transition-colors">Privacidad</Link></li>
              <li><Link href="/cookies" className="hover:text-primary transition-colors">Cookies</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-12 border-t border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">
            © 2026 LUNA BOUTIQUE. TODOS LOS DERECHOS RESERVADOS.
          </p>
          <div className="flex items-center gap-4 text-accent/40 italic font-serif text-sm">
            <span>By Appointment Only</span>
            <Moon className="h-4 w-4" />
          </div>
        </div>
      </div>
    </footer>
  )
}
