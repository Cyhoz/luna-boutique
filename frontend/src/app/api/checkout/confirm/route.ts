import { NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase/admin'
import { commitWebpayTransaction } from '@/lib/transbank'

async function handleConfirmation(token: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  try {
    // 1. Confirmar transacción con Transbank
    const result = await commitWebpayTransaction(token)

    // 2. Verificar éxito (response_code === 0 en REST)
    if (result.response_code === 0) {
      const orderId = result.session_id // El UUID que guardamos en session_id

      // 3. Actualizar pedido a 'pagado' usando privilegios de ADMIN para saltar RLS
      const { error: updateError } = await adminSupabase
        .from('pedido')
        .update({ estado: 'pagado' })
        .eq('id_pedido', orderId)

      if (updateError) throw updateError

      return NextResponse.redirect(`${siteUrl}/mi-cuenta?status=success&order=${orderId}`)
    } else {
      return NextResponse.redirect(`${siteUrl}/checkout?status=failed&code=${result.response_code}`)
    }

  } catch (error: any) {
    console.error('Error en confirmación de Webpay:', error)
    return NextResponse.redirect(`${siteUrl}/checkout?status=error&msg=Error+confirmando+pago`)
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token_ws')
  
  if (!token) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    return NextResponse.redirect(`${siteUrl}/checkout?status=error&msg=No+se+recibio+el+token`)
  }

  return handleConfirmation(token)
}

export async function POST(request: Request) {
  const formData = await request.formData()
  const token = formData.get('token_ws') as string

  if (!token) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    return NextResponse.redirect(`${siteUrl}/checkout?status=error&msg=No+se+recibio+el+token+post`)
  }

  return handleConfirmation(token)
}
