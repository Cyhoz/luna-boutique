import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'

// Inicializar MercadoPago
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '' 
})

export async function POST(request: Request) {
  try {
    // MercadoPago envía el ID del pago en la URL (ej: ?data.id=12345678) o en el body
    // Extraemos la información del webhook
    const url = new URL(request.url)
    const topic = url.searchParams.get('topic') || url.searchParams.get('type')
    const paymentIdStr = url.searchParams.get('data.id')

    const body = await request.json().catch(() => null)
    
    // Obtener el ID del pago (puede venir en URL o en el Body dependiendo de la versión de webhook)
    const paymentId = paymentIdStr || (body?.data?.id)
    const actionType = topic || (body?.type)

    // Solo nos interesa procesar cuando un pago es creado o actualizado
    if (actionType !== 'payment' || !paymentId) {
      return NextResponse.json({ status: 'ignored' }, { status: 200 })
    }

    // 1. Consultar el estado REAL del pago en MercadoPago por seguridad
    const payment = new Payment(client)
    const paymentData = await payment.get({ id: paymentId })

    const status = paymentData.status // 'approved', 'rejected', 'in_process', 'cancelled', etc.
    const orderId = paymentData.external_reference // Este es el ID de Supabase que le pasamos en la Fase 2

    if (!orderId) {
      console.error('El pago no tiene external_reference (Order ID)')
      return NextResponse.json({ error: 'Falta external_reference' }, { status: 400 })
    }

    const supabase = await createClient()

    // 2. Traducir el estado de MercadoPago a nuestro estado de base de datos
    let newStatus = 'pending'
    if (status === 'approved') {
      newStatus = 'paid'
    } else if (status === 'rejected' || status === 'cancelled') {
      newStatus = 'cancelled'
    }

    // 3. Actualizar la orden en Supabase
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (error) {
      console.error('Error actualizando orden en Supabase:', error)
      return NextResponse.json({ error: 'Error actualizando BD' }, { status: 500 })
    }

    // Retornamos 200 OK a MercadoPago para que sepa que recibimos la notificación
    return NextResponse.json({ status: 'success' }, { status: 200 })

  } catch (error) {
    console.error('Error procesando el Webhook de MercadoPago:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
