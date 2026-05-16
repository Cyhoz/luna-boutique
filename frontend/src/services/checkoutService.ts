'use server'

import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

export async function processCheckout(
  items: any[], 
  total: number, 
  shippingCost: number, 
  formData: FormData, 
  metodoPago: string,
  envioData: {
    modo_entrega: string,
    paqueteria: string,
    zona_destino: string
  }
) {
  const serverSupabase = await createServerClient()
  
  // Cliente privilegiado para bypass RLS
  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 1. Extraer datos del formulario
  const email = formData.get('email') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const address = formData.get('address') as string
  const city = formData.get('city') as string
  const province = formData.get('province') as string || 'RM'
  const zip = formData.get('zip') as string
  const phone = formData.get('phone') as string || ''

  const { data: { user } } = await serverSupabase.auth.getUser()
  const usuarioId = user?.id || null

  // 2. Buscar si la dirección ya existe para evitar duplicados
  let direccionId = null;

  if (usuarioId) {
    const { data: existingDir } = await adminSupabase
      .from('direccion')
      .select('id_direccion')
      .eq('id_usuario', usuarioId)
      .eq('direccion_linea1', address)
      .eq('ciudad', city)
      .maybeSingle()

    if (existingDir) {
      direccionId = existingDir.id_direccion
    }
  }

  // Si no existe, la creamos
  if (!direccionId) {
    const { data: nuevaDireccion, error: dirError } = await adminSupabase
      .from('direccion')
      .insert({
        id_usuario: usuarioId,
        alias: 'Dirección de Pedido',
        nombre_destinatario: `${firstName} ${lastName}`,
        direccion_linea1: address,
        ciudad: city,
        estado_provincia: province,
        codigo_postal: zip,
        pais: 'Chile',
        telefono: phone,
        es_principal: false
      })
      .select()
      .single()

    if (dirError) {
      console.error("Error al crear dirección:", dirError)
      return { success: false, error: 'No se pudo registrar la dirección de envío.' }
    }
    direccionId = nuevaDireccion.id_direccion
  }

  // 3. Crear el Pedido (PEDIDO) - MER: id_direccion_envio está aquí
  const { data: order, error: orderError } = await adminSupabase
    .from('pedido')
    .insert({
      id_usuario: usuarioId,
      id_direccion_envio: direccionId,
      total: total,
      estado: 'pendiente',
      fecha_pedido: new Date().toISOString()
    })
    .select()
    .single()

  if (orderError) {
    console.error("Error al crear la orden:", orderError)
    return { success: false, error: `Error DB: ${orderError.message} (${orderError.details || 'sin detalles'})` }
  }

  // 4. Crear el Registro de Envío (ENVIO) coincidiendo con la nueva tabla SQL
  const { error: envioError } = await adminSupabase
    .from('envio')
    .insert({
      id_pedido: order.id_pedido,
      paqueteria: envioData.paqueteria,
      zona_destino: envioData.zona_destino,
      modo_entrega: envioData.modo_entrega,
      costo_total_envio: shippingCost,
      estado: 'Pendiente'
    })

  if (envioError) console.error("Error al crear envío:", envioError)

  // 5. Insertar Detalles del Pedido (DETALLE_PEDIDO)
  const detailItems = items.map(item => ({
    id_pedido: order.id_pedido,
    id_variante: item.id,
    cantidad: item.quantity,
    precio_unitario: item.price,
    descuento: 0,
    subtotal: item.price * item.quantity
  }))

  const { error: itemsError } = await adminSupabase
    .from('detalle_pedido')
    .insert(detailItems)

  if (itemsError) {
    console.error("Error insertando items:", itemsError)
    return { success: false, error: `Error Detalles: ${itemsError.message} (${itemsError.details || 'sin detalles'})` }
  }

  // 6. Registrar el Pago (PAGO)
  const { error: pagoError } = await adminSupabase
    .from('pago')
    .insert({
      id_pedido: order.id_pedido,
      metodo_pago: metodoPago,
      monto: total,
      estado: 'pendiente'
    })

  if (pagoError) console.error("Error al registrar pago:", pagoError)

  return { success: true, orderId: order.id_pedido }
}
