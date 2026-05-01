export default function CareersPage() {
  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-7xl font-bold font-display uppercase tracking-tight mb-4">Únete al Equipo</h1>
        <p className="text-zinc-500 font-medium mb-20">Estamos construyendo el futuro del uniforme urbano.</p>

        <div className="space-y-6">
          <div className="p-8 border border-zinc-100 dark:border-zinc-900 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
            <div>
              <h2 className="text-lg font-bold uppercase tracking-tight mb-1">Senior Textile Engineer</h2>
              <p className="text-xs font-bold text-amber-500 uppercase tracking-widest">Remoto / Santiago</p>
            </div>
            <button className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">
              Postular
            </button>
          </div>

          <div className="p-8 border border-zinc-100 dark:border-zinc-900 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
            <div>
              <h2 className="text-lg font-bold uppercase tracking-tight mb-1">E-commerce Manager</h2>
              <p className="text-xs font-bold text-amber-500 uppercase tracking-widest">Santiago, Chile</p>
            </div>
            <button className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">
              Postular
            </button>
          </div>

          <div className="mt-20 text-center">
            <p className="text-sm text-zinc-400">¿No ves una posición para ti? Envíanos tu portafolio a <span className="text-zinc-900 dark:text-white font-bold">talent@antigravity.cl</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}
