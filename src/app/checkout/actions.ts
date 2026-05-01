'use server'

import { createClient } from '@/lib/supabase/server'

export async function processCheckout(items: any[], total: number, shippingCost: number, formData: FormData) {
  const supabase = await createClient()

  // Extraer datos del formulario de envío
  const address = formData.get('address') as string
  const city = formData.get('city') as string
  const zip = formData.get('zip') as string

  // Verificar si hay usuario logueado
  const { data: { user } } = await supabase.auth.getUser()

  // 1. Crear la Orden principal con datos de envío
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user ? user.id : null,
      total_amount: total,
      shipping_cost: shippingCost,
      shipping_address: address,
      city: city,
      zip_code: zip,
      status: 'pending', // Estado inicial de pago
      shipping_status: 'procesando' // Estado logístico inicial
    })
    .select()
    .single()

  if (orderError) {
    console.error("Error al crear la orden:", orderError)
    return { success: false, error: 'No se pudo crear la orden.' }
  }

  // 2. Preparar e insertar los items de la orden
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const validItems = items.filter(item => uuidRegex.test(item.id)).map(item => ({
    order_id: order.id,
    product_variant_id: item.id,
    quantity: item.quantity,
    price_at_time: item.price
  }))

  if (validItems.length > 0) {
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(validItems)

    if (itemsError) {
      console.error("Error insertando items:", itemsError)
    }
  }

  return { success: true, orderId: order.id }
}
