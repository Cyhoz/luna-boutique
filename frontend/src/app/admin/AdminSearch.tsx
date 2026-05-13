'use client'

import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState, useEffect } from 'react'

export function AdminSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '')

  // Debounce the search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (searchTerm) {
        params.set('q', searchTerm)
      } else {
        params.delete('q')
      }
      router.push('/admin?' + params.toString(), { scroll: false })
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, router, searchParams])

  return (
    <div className="glass px-6 py-4 rounded-2xl flex items-center gap-4 border-white/5">
      <Search className="h-4 w-4 text-zinc-600" />
      <input 
        type="text" 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="BUSCAR PIEZA..." 
        className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest text-white placeholder:text-zinc-700 w-32 md:w-48" 
      />
    </div>
  )
}
