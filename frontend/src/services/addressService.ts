'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteAddress(formData: FormData) {
  const addressId = formData.get('addressId') as string
  const supabase = await createClient()

  const { error } = await supabase
    .from('direccion')
    .delete()
    .eq('id_direccion', addressId)

  if (error) {
    console.error('Error al borrar dirección:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/mi-cuenta')
  return { success: true }
}
