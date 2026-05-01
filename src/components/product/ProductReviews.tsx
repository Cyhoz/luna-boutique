'use client'

import { useState, useEffect } from 'react'
import { Star, User, MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

interface Review {
  id: string
  rating: number
  comment: string
  user_name: string
  created_at: string
}

export function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [userName, setUserName] = useState('')
  
  const supabase = createClient()

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    const { data } = await supabase
      .from('product_reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
    
    setReviews(data || [])
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('product_reviews').insert({
      product_id: productId,
      user_id: user?.id,
      rating,
      comment,
      user_name: userName || 'Anónimo'
    })

    if (!error) {
      setComment('')
      setRating(5)
      fetchReviews()
    }
    setIsSubmitting(false)
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
    : 0

  return (
    <div className="mt-24 pt-16 border-t border-zinc-100 dark:border-zinc-900">
      <div className="grid lg:grid-cols-12 gap-16">
        
        {/* Left: Summary & Form */}
        <div className="lg:col-span-4">
          <h2 className="text-3xl font-bold font-display tracking-tight uppercase mb-2">Opiniones de Clientes</h2>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="flex text-amber-500">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`h-5 w-5 ${s <= Math.round(averageRating) ? 'fill-current' : 'text-zinc-200 dark:text-zinc-800'}`} />
              ))}
            </div>
            <span className="text-sm font-bold text-zinc-500">Basado en {reviews.length} reseñas</span>
          </div>

          <form onSubmit={handleSubmit} className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest mb-4">Deja tu reseña</h3>
            
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Puntuación</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button 
                    key={s} 
                    type="button"
                    onClick={() => setRating(s)}
                    className={`p-1 transition-colors ${s <= rating ? 'text-amber-500' : 'text-zinc-200 dark:text-zinc-800'}`}
                  >
                    <Star className={`h-6 w-6 ${s <= rating ? 'fill-current' : ''}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Nombre</label>
              <input 
                required
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Comentario</label>
              <textarea 
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500 h-24"
                placeholder="¿Qué te pareció el producto?"
              />
            </div>

            <button 
              disabled={isSubmitting}
              className="w-full premium-button bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
            >
              {isSubmitting ? 'Enviando...' : 'Publicar Reseña'}
            </button>
          </form>
        </div>

        {/* Right: Reviews List */}
        <div className="lg:col-span-8">
          {loading ? (
            <div className="space-y-8 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-zinc-100 dark:bg-zinc-900 rounded-3xl" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-zinc-50 dark:bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
              <MessageSquare className="h-10 w-10 text-zinc-300 mb-4" />
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No hay reseñas aún. Sé el primero en opinar.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {reviews.map((review) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  key={review.id} 
                  className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 p-8 rounded-[2rem] shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-zinc-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{review.user_name}</h4>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{new Date(review.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`h-3 w-3 ${s <= review.rating ? 'fill-current' : 'text-zinc-200 dark:text-zinc-800'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                    {review.comment}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
