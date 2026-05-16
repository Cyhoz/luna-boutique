'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Obtiene el carrito activo del usuario o crea uno nuevo si no existe.
 */
async function getOrCreateCart(userId: string, supabase: any) {
  const { data: cart, error } = await supabase
    .from('carrito')
    .select('id_carrito')
    .eq('id_usuario', userId)
    .eq('estado', 'activo')
    .maybeSingle()

  if (cart) return cart.id_carrito

  const { data: newCart, error: createError } = await supabase
    .from('carrito')
    .insert({ id_usuario: userId, estado: 'activo' })
    .select()
    .single()

  if (createError) throw createError
  return newCart.id_carrito
}

/**
 * Sincroniza los items locales con la base de datos.
 */
export async function syncCartToDB(userId: string, items: any[]) {
  const supabase = await createClient()
  
  try {
    const cartId = await getOrCreateCart(userId, supabase)

    // 1. Limpiar el detalle actual para este carrito (Estrategia de reemplazo simple)
    // Esto asegura que la DB sea espejo fiel del estado de Zustand
    await supabase
      .from('detalle_carrito')
      .delete()
      .eq('id_carrito', cartId)

    // 2. Insertar los nuevos items
    if (items.length > 0) {
      const details = items.map(item => ({
        id_carrito: cartId,
        id_variante: item.id,
        cantidad: Number(item.quantity),
        precio_unitario: item.price
      }))

      const { error: insertError } = await supabase
        .from('detalle_carrito')
        .insert(details)

      if (insertError) throw insertError
    }

    return { success: true }
  } catch (error: any) {
    console.error('Error sincronizando carrito:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Carga el carrito de la base de datos al iniciar sesión.
 */
export async function loadCartFromDB(userId: string) {
  const supabase = await createClient()
  
  const { data: cart } = await supabase
    .from('carrito')
    .select('id_carrito')
    .eq('id_usuario', userId)
    .eq('estado', 'activo')
    .maybeSingle()

  if (!cart) return []

  const { data: details } = await supabase
    .from('detalle_carrito')
    .select(`
      cantidad,
      precio_unitario,
      variante_producto (
        id_variante,
        id_producto,
        talla,
        precio,
        color (nombre),
        producto (nombre),
        inventario (stock_actual),
        imagen_producto (url_imagen)
      )
    `)
    .eq('id_carrito', cart.id_carrito)

  if (!details) return []

  return details.map((d: any) => {
    const v = d.variante_producto
    const img = v.imagen_producto?.find((i: any) => i.es_principal) || v.imagen_producto?.[0]
    
    return {
      id: v.id_variante,
      productId: v.id_producto,
      name: v.producto.nombre,
      price: Number(d.precio_unitario),
      size: v.talla,
      color: v.color.nombre,
      quantity: d.cantidad,
      imageUrl: img?.url_imagen || '',
      stock: v.inventario?.stock_actual || 0
    }
  })
}
