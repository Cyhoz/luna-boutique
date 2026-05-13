import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function RecuperarPasswordPage() {
  return (
    <div className="flex min-h-[80vh] flex-col justify-center px-6 py-12 lg:px-8 bg-white dark:bg-zinc-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
        <div className="flex justify-center mb-6">
           <Link href="/login" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-[#db2777] transition-colors">
            <ArrowLeft className="h-4 w-4" /> Volver al Login
           </Link>
        </div>
        <h2 className="text-center text-3xl font-serif italic font-medium leading-9 tracking-tight text-zinc-900 dark:text-white">
          Recuperar <span className="text-[#db2777]">Acceso</span>
        </h2>
        <p className="mt-4 text-sm text-zinc-500 max-w-xs mx-auto">
          Introduce tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-transparent py-4 px-6 text-zinc-900 dark:text-white shadow-sm focus:ring-2 focus:ring-[#db2777] outline-none transition-all placeholder:text-zinc-500"
              placeholder="tu@email.com"
            />
          </div>

          <button
            type="submit"
            className="premium-button flex w-full justify-center rounded-full bg-zinc-900 px-6 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-all"
          >
            Enviar Instrucciones
          </button>
        </form>

        <p className="mt-10 text-center text-xs text-zinc-500">
          ¿Recordaste tu contraseña?{' '}
          <Link href="/login" className="font-black text-[#db2777] hover:text-pink-400 transition-colors uppercase tracking-widest">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
