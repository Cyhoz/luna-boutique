'use client'

import Link from 'next/link'
import { login } from '@/services/authService'
import { Moon, Stars, ArrowRight, Mail, Lock } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LoginPage() {
  return (
    <div className="min-h-screen lunar-gradient flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#3b0764]/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-[#db2777]/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="flex justify-center mb-8">
          <div className="glass p-4 rounded-full border-white/10 animate-float">
            <Moon className="h-8 w-8 text-[#eab308]" />
          </div>
        </div>
        <h2 className="text-center text-5xl font-serif font-medium text-white italic tracking-tight">
          Bienvenido a <span className="gold-text">Luna.</span>
        </h2>
        <p className="mt-4 text-center text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">
          Identifícate para entrar al círculo
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-12 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="glass py-12 px-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[3rem] border-white/5 mx-4 sm:mx-0">
          <form className="space-y-8" action={login}>
            <div className="space-y-3">
              <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">
                Correo Electrónico
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-zinc-600 group-focus-within:text-[#eab308] transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="TU@EMAIL_ESTELAR.COM"
                  className="block w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-5 text-white placeholder-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#eab308]/30 focus:border-[#eab308]/50 transition-all text-xs font-bold tracking-widest"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between ml-2">
                <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Contraseña
                </label>
                <Link href="/recuperar-password" title="Recuperar Contraseña" className="text-[10px] font-bold text-[#db2777] hover:text-pink-400 transition-colors">
                  ¿Olvidaste tu clave?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-zinc-600 group-focus-within:text-[#db2777] transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="block w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-5 text-white placeholder-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#db2777]/30 focus:border-[#db2777]/50 transition-all text-xs font-bold tracking-widest"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-4 py-5 px-4 rounded-2xl bg-[#db2777] text-white text-[12px] font-black uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(219,39,119,0.3)] hover:bg-pink-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-500"
              >
                Entrar al Firmamento
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="mt-12 text-center relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-6 bg-transparent text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600">O ÚNETE AHORA</span>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link href="/registro" className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-white hover:text-[#eab308] transition-all">
              Crear Cuenta Estelar
              <Stars className="h-4 w-4 animate-twinkle" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
