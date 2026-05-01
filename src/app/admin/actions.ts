'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProduct(formData: FormData) {
  const supabase = await createClient()
  
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const base_price = parseFloat(formData.get('base_price') as string)
  const is_new = formData.get('is_new') === 'on'
  const is_on_sale = formData.get('is_on_sale') === 'on'
  const sale_price = formData.get('sale_price') ? parseFloat(formData.get('sale_price') as string) : null

  const { error } = await supabase
    .from('products')
    .update({ 
      name, 
      base_price, 
      is_new, 
      is_on_sale, 
      sale_price 
    })
    .eq('id', id)

  if (error) {
    console.error("Error actualizando producto:", error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/')
  return { success: true }
}

export async function updateVariantStock(variantId: string, stock: number) {
  const supabase = await createClient()
  await supabase.from('product_variants').update({ stock_quantity: stock }).eq('id', variantId)
  revalidatePath('/admin')
}
