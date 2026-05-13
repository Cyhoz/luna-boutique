'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Filter, X, Sparkles } from 'lucide-react'

export function FilterSidebar({ categorias = [], tallas = [] }: { categorias?: string[], tallas?: string[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get('categoria') || ''
  const currentSize = searchParams.get('talla') || ''
  const currentPrice = searchParams.get('precio') || ''
  const currentStock = searchParams.get('stock') || ''
  
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      return params.toString()
    },
    [searchParams]
  )

  const handleFilter = (key: string, value: string) => {
    const currentValue = searchParams.get(key)
    const newValue = currentValue === value ? '' : value
    router.push('/coleccion?' + createQueryString(key, newValue), { scroll: false })
  }

  const clearFilters = () => {
    router.push('/coleccion', { scroll: false })
  }

  const hasFilters = currentCategory || currentSize || currentPrice || currentStock

  return (
    <div className="w-full lg:w-64 flex-shrink-0 bg-white dark:bg-[#0f172a] p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
      <div className="flex items-center justify-between mb-10 pb-6 border-b border-zinc-100 dark:border-zinc-800">
        <h2 className="text-[11px] font-sans font-black uppercase tracking-[0.3em] flex items-center gap-2 text-primary">
          <Sparkles className="w-4 h-4 text-accent" /> Filtros
        </h2>
        {hasFilters && (
          <button 
            onClick={clearFilters}
            className="text-[10px] font-bold text-muted-foreground hover:text-primary uppercase tracking-widest flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" /> Limpiar
          </button>
        )}
      </div>

      <div className="space-y-12">
        {/* Categorías */}
        {categorias.length > 0 && (
          <div>
            <h3 className="text-[10px] font-sans font-black uppercase tracking-[0.2em] text-muted-foreground mb-8">Categoría</h3>
            <ul className="space-y-5">
              {categorias.map((cat) => (
                <li key={cat}>
                  <button 
                    onClick={() => handleFilter('categoria', cat)}
                    className={`flex items-center justify-between w-full text-[11px] font-bold uppercase tracking-widest transition-all ${
                      currentCategory === cat 
                        ? 'text-primary translate-x-1' 
                        : 'text-muted-foreground hover:text-primary'
                    }`}
                  >
                    {cat}
                    {currentCategory === cat && <div className="w-1.5 h-1.5 bg-accent rounded-full" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tallas */}
        {tallas.length > 0 && (
          <div>
            <h3 className="text-[10px] font-sans font-black uppercase tracking-[0.2em] text-muted-foreground mb-8">Talla</h3>
            <div className="grid grid-cols-4 gap-2">
              {tallas.map((size) => (
                <button
                  key={size}
                  onClick={() => handleFilter('talla', size)}
                  className={`h-11 rounded-full text-[10px] font-black border transition-all ${
                    currentSize === size
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-transparent border-zinc-100 dark:border-zinc-800 text-muted-foreground hover:border-accent'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Rango de Precio */}
        <div>
          <h3 className="text-[10px] font-sans font-black uppercase tracking-[0.2em] text-muted-foreground mb-8">Presupuesto</h3>
          <ul className="space-y-5">
            {[50, 100, 200, 500].map((price) => (
              <li key={price}>
                <button 
                  onClick={() => handleFilter('precio', price.toString())}
                  className={`flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest transition-all ${
                    currentPrice === price.toString() 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                    currentPrice === price.toString() ? 'border-accent bg-accent/10' : 'border-zinc-200 dark:border-zinc-700'
                  }`}>
                    {currentPrice === price.toString() && <div className="w-1.5 h-1.5 bg-accent rounded-full" />}
                  </div>
                  Hasta ${price}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Disponibilidad */}
        <div>
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-[10px] font-sans font-black uppercase tracking-[0.2em] text-muted-foreground">En Stock</span>
            <div 
              onClick={() => handleFilter('stock', 'true')}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${currentStock === 'true' ? 'bg-primary' : 'bg-secondary'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${currentStock === 'true' ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </label>
        </div>
      </div>
    </div>
  )
}
