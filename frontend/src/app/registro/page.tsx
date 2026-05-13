'use client'

import Link from 'next/link'
import { signup } from '@/services/authService'
import { Moon, Stars, ArrowRight, User, Mail, Lock, Phone } from 'lucide-react'
import { motion } from 'framer-motion'

export default function RegisterPage() {
  return (
    <div className="min-h-screen lunar-gradient flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3b0764]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#db2777]/5 blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="flex justify-center mb-8">
          <div className="glass p-4 rounded-full border-white/10 animate-float">
            <Stars className="h-8 w-8 text-[#eab308]" />
          </div>
        </div>
        <h2 className="text-center text-5xl font-serif font-medium text-white italic tracking-tight">
          Únete al <span className="gold-text">Círculo.</span>
        </h2>
        <p className="mt-4 text-center text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">
          Crea tu perfil estelar en Luna Boutique
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-12 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="glass py-12 px-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[4rem] border-white/5 mx-4 sm:mx-0">
          <form className="space-y-8" action={signup}>
            <div className="space-y-3">
              <label htmlFor="fullName" className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">
                Nombre Completo
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-zinc-600 group-focus-within:text-[#eab308] transition-colors" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  placeholder="TU NOMBRE ESTELAR"
                  className="block w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-5 text-white placeholder-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#eab308]/30 focus:border-[#eab308]/50 transition-all text-xs font-bold tracking-widest"
                />
              </div>
            </div>

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
              <label htmlFor="telefono" className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">
                Teléfono de Contacto
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-zinc-600 group-focus-within:text-[#eab308] transition-colors" />
                </div>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  required
                  placeholder="+56 9 XXXX XXXX"
                  className="block w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-5 text-white placeholder-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#eab308]/30 focus:border-[#eab308]/50 transition-all text-xs font-bold tracking-widest"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="password" title="Mínimo 6 caracteres" className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">
                Contraseña
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-zinc-600 group-focus-within:text-[#db2777] transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
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
                Crear Identidad
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          <p className="mt-12 text-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
            ¿Ya eres parte del círculo?{' '}
            <Link href="/login" className="text-white hover:text-[#eab308] transition-colors ml-2">
              Inicia Sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
