'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addAddress(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No autenticado')

    const alias = formData.get('alias') as string
    const nombre_destinatario = formData.get('nombre_destinatario') as string
    const direccion_linea1 = formData.get('direccion_linea1') as string
    const direccion_linea2 = formData.get('direccion_linea2') as string
    const ciudad = formData.get('ciudad') as string
    const estado_provincia = formData.get('estado_provincia') as string
    const codigo_postal = formData.get('codigo_postal') as string
    const pais = formData.get('pais') as string || 'Chile'
    const telefono = formData.get('telefono') as string
    const es_principal = formData.get('es_principal') === 'on'

    // Si es principal, quitamos el flag a las demás
    if (es_principal) {
      await supabase
        .from('direccion')
        .update({ es_principal: false })
        .eq('id_usuario', user.id)
    }

    const { error } = await supabase.from('direccion').insert({
      id_usuario: user.id,
      alias,
      nombre_destinatario,
      direccion_linea1,
      direccion_linea2,
      ciudad,
      estado_provincia,
      codigo_postal,
      pais,
      telefono,
      es_principal
    })

    if (error) throw error

    revalidatePath('/mi-cuenta')
    return { success: true }
  } catch (error: any) {
    console.error('Error adding address:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteAddress(addressId: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('direccion').delete().eq('id_direccion', addressId)
    if (error) throw error
    revalidatePath('/mi-cuenta')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateProfile(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No autenticado')

    const nombre = formData.get('nombre') as string
    const telefono = formData.get('telefono') as string

    const { error } = await supabase
      .from('usuario')
      .update({ nombre, telefono })
      .eq('id_usuario', user.id)

    if (error) throw error

    revalidatePath('/mi-cuenta')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
