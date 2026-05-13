'use client'

import { User, Calendar, Mail, ShieldCheck } from 'lucide-react'

export function CustomerList({ clientes }: { clientes: any[] }) {
  return (
    <div className="glass rounded-[3rem] border-white/5 overflow-hidden shadow-2xl">
      <div className="px-10 py-8 border-b border-white/5 bg-white/[0.02]">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-[#eab308]">
              <User className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-serif font-medium text-white italic">Usuarios del Sistema</h2>
         </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500 bg-white/[0.01]">
              <th className="px-10 py-6">Identidad</th>
              <th className="px-10 py-6">Contacto</th>
              <th className="px-10 py-6">Rol</th>
              <th className="px-10 py-6">Registro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {clientes.map((c) => (
              <tr key={c.id_cliente} className="group hover:bg-white/[0.01] transition-all">
                <td className="px-10 py-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 glass rounded-full flex items-center justify-center text-xs font-serif gold-text border-white/10">
                      {c.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-black text-white uppercase tracking-widest">{c.nombre}</p>
                      <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest">ID: {c.id_cliente.split('-')[0]}</p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Mail className="h-3 w-3" />
                      <span className="text-[10px] font-medium tracking-tight">{c.email}</span>
                    </div>
                    {c.telefono && (
                       <p className="text-[9px] text-zinc-600 font-bold ml-5">{c.telefono}</p>
                    )}
                  </div>
                </td>
                <td className="px-10 py-8">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                    c.role === 'admin' ? 'bg-[#eab308]/10 text-[#eab308]' : 'bg-white/5 text-zinc-500'
                  }`}>
                    {c.role === 'admin' && <ShieldCheck className="h-3 w-3" />}
                    {c.role || 'cliente'}
                  </span>
                </td>
                <td className="px-10 py-8">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Calendar className="h-3 w-3" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">
                      {new Date(c.fecha_registro).toLocaleDateString()}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
