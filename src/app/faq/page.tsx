'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    question: '¿Cómo elijo mi talla correcta?',
    answer: 'Cada producto tiene una guía de tallas específica en su descripción. Recomendamos medir una prenda similar que ya tengas y comparar las medidas. Si estás entre dos tallas, generalmente recomendamos la más grande para un look oversize técnico.'
  },
  {
    question: '¿Qué materiales utilizan?',
    answer: 'Utilizamos principalmente algodones de alto gramaje (400 GSM+), nylon técnico ripstop y tejidos elásticos de grado industrial. Todos nuestros materiales son seleccionados por su durabilidad y textura.'
  },
  {
    question: '¿Hacen envíos internacionales?',
    answer: 'Sí, enviamos a más de 50 países a través de DHL Express. El costo se calcula automáticamente al momento del checkout.'
  },
  {
    question: '¿Puedo cancelar mi pedido?',
    answer: 'Puedes cancelar tu pedido dentro de las primeras 2 horas después de realizarlo. Una vez que entra en proceso de preparación, ya no es posible cancelarlo, pero puedes iniciar una devolución al recibirlo.'
  }
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold font-display uppercase tracking-tight mb-4 text-center">FAQ</h1>
        <p className="text-zinc-500 font-medium mb-16 text-center">Preguntas Frecuentes y Soporte Técnico.</p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-zinc-100 dark:border-zinc-900 rounded-2xl overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/30"
            >
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-zinc-100 dark:hover:bg-zinc-900/50 transition-colors"
              >
                <span className="font-bold text-sm uppercase tracking-tight">{faq.question}</span>
                {openIndex === index ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed border-t border-zinc-100/50 dark:border-zinc-900/50 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-20 p-8 rounded-3xl bg-zinc-950 text-white text-center">
          <h3 className="font-bold mb-2">¿No encuentras lo que buscas?</h3>
          <p className="text-sm text-zinc-400 mb-6">Nuestro equipo de soporte está disponible 24/7.</p>
          <a href="mailto:support@antigravity.cl" className="inline-block bg-white text-zinc-950 px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px]">
            Contactar Soporte
          </a>
        </div>
      </div>
    </div>
  )
}
