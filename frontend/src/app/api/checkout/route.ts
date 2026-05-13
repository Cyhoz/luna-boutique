import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createWebpayTransaction } from '@/lib/transbank'
import { stripe } from '@/lib/stripe'
import { MercadoPagoConfig, Preference } from 'mercadopago'

export async function POST(request: Request) {
  console.log('--- NUEVA PETICIÓN DE CHECKOUT ---')
  try {
    const { orderId, gateway } = await request.json()
    console.log('Datos recibidos:', { orderId, gateway })

    if (!orderId) {
      console.error('Error: Falta orderId')
      return NextResponse.json({ error: 'Order ID es requerido' }, { status: 400 })
    }

    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 1. Obtener los detalles de la orden (PEDIDO)
    console.log('Buscando orden en Supabase...')
    const { data: order, error: orderError } = await adminSupabase
      .from('pedido')
      .select('total, id_cliente')
      .eq('id_pedido', orderId)
      .single()

    if (orderError || !order) {
      console.error('Error al buscar orden:', orderError)
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
    }
    console.log('Orden encontrada. Total:', order.total)

    const gatewayLower = gateway?.toLowerCase() || 'webpay'
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    console.log('Usando pasarela:', gatewayLower, 'Site URL:', siteUrl)

    // 2. Iniciar transacción según la pasarela
    
    // --- CASO STRIPE ---
    if (gatewayLower.includes('stripe')) {
      try {
        console.log('Iniciando sesión de Stripe...')
        if (!process.env.STRIPE_SECRET_KEY) {
          throw new Error('STRIPE_SECRET_KEY no está configurada en .env.local')
        }
        
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'clp',
                product_data: {
                  name: `Pedido #${orderId.split('-')[0].toUpperCase()}`,
                  description: 'Compra en Luna Boutique',
                },
                unit_amount: Math.round(order.total),
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${siteUrl}/checkout/success?orderId=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${siteUrl}/checkout`,
          metadata: { orderId: orderId },
        })

        console.log('Sesión de Stripe creada con éxito. URL:', session.url)
        return NextResponse.json({ url: session.url })
      } catch (stripeError: any) {
        console.error('FALLÓ STRIPE:', stripeError.message)
        return NextResponse.json({ error: `Stripe Error: ${stripeError.message}` }, { status: 500 })
      }
    } 

    // --- CASO MERCADO PAGO ---
    if (gatewayLower.includes('mercado')) {
      const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! })
      const preference = new Preference(client)

      const result = await preference.create({
        body: {
          items: [
            {
              id: orderId,
              title: `Pedido Luna Boutique #${orderId.split('-')[0].toUpperCase()}`,
              quantity: 1,
              unit_price: Math.round(order.total),
              currency_id: 'CLP'
            }
          ],
          back_urls: {
            success: `${siteUrl}/checkout/success?orderId=${orderId}`,
            failure: `${siteUrl}/checkout`,
            pending: `${siteUrl}/checkout`
          },
          external_reference: orderId
        }
      })

      return NextResponse.json({ url: result.init_point })
    }
    
    // --- DEFAULT: WEBPAY PLUS ---
    const { token, url } = await createWebpayTransaction(orderId, order.total)
    return NextResponse.json({ 
      url: `${url}?token_ws=${token}` 
    })

  } catch (error: any) {
    console.error('Error en pasarela de pago:', error)
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 })
  }
}
