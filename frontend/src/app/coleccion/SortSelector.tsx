'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export function SortSelector({ currentSort }: { currentSort: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    const params = new URLSearchParams(searchParams.toString())
    
    if (value) {
      params.set('orden', value)
    } else {
      params.delete('orden')
    }
    
    router.push(`/coleccion?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Ordenar por</span>
      <select 
        value={currentSort || 'new'}
        onChange={handleSortChange}
        className="bg-transparent text-[11px] font-black uppercase tracking-widest border-none focus:ring-0 cursor-pointer text-[#db2777] outline-none"
      >
        <option value="new">Novedades</option>
        <option value="high">Precio: Mayor a Menor</option>
        <option value="low">Precio: Menor a Mayor</option>
      </select>
    </div>
  )
}
