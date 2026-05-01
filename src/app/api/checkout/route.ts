import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'

// Inicializar MercadoPago
// Usa tu Access Token de Producción o Prueba aquí (Recomendamos ponerlo en .env.local)
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-TU-ACCESS-TOKEN-AQUI' 
})

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID es requerido' }, { status: 400 })
    }

    const supabase = await createClient()

    // 1. Obtener los detalles de la orden y sus items desde Supabase para máxima seguridad (Anti-hackeos)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
    }

    // 2. Crear los "items" para MercadoPago
    // En una aplicación real deberías obtener el nombre del producto haciendo un JOIN con la tabla de productos,
    // pero para este ejemplo usaremos un nombre genérico o podrías guardar el nombre en order_items.
    const preferenceItems = order.order_items.map((item: any) => ({
      id: item.product_variant_id,
      title: `Producto Antigravity`, // Simplificado.
      quantity: item.quantity,
      unit_price: Number(item.price_at_time),
      currency_id: 'CLP', // Cambiar según tu país: CLP, MXN, ARS, COP, etc.
    }))

    // Agregar el costo de envío como un ítem adicional si existe
    if (order.shipping_cost && order.shipping_cost > 0) {
      preferenceItems.push({
        id: 'shipping',
        title: 'Costo de Envío',
        quantity: 1,
        unit_price: Number(order.shipping_cost),
        currency_id: 'CLP',
      })
    }

    // 3. Crear la Preferencia de Pago en MercadoPago
    const preference = new Preference(client)
    
    // Configurar la preferencia
    const body = {
      items: preferenceItems,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/mi-cuenta?status=success`,
        failure: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout?status=failure`,
        pending: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/mi-cuenta?status=pending`,
      },
      // auto_return: 'approved',
      external_reference: order.id, // VITAL: Para que el Webhook sepa qué orden pagar
    }

    // El SDK de MercadoPago versión 2+ requiere pasar el body de esta forma:
    const response = await preference.create({ body })

    // 4. Devolver la URL al Frontend para redirigir al usuario
    // init_point es la URL de pago de producción/real, sandbox_init_point es para pruebas
    return NextResponse.json({ 
      url: response.sandbox_init_point 
    })

  } catch (error) {
    console.error('Error al crear preferencia en MercadoPago:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
