const WEBPAY_API_KEY = process.env.WEBPAY_API_KEY || '597055555532' // Test Commerce Code
const WEBPAY_API_SECRET = process.env.WEBPAY_API_SECRET || '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C' // Test Secret
const WEBPAY_URL = 'https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.0/transactions'

export async function createWebpayTransaction(orderId: string, amount: number) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  const body = {
    buy_order: Date.now().toString().slice(-12),
    session_id: orderId, // Aquí enviamos el UUID real
    amount: Math.round(amount),
    return_url: `${siteUrl}/api/checkout/confirm`
  }

  const response = await fetch(WEBPAY_URL, {
    method: 'POST',
    headers: {
      'Tbk-Api-Key-Id': WEBPAY_API_KEY,
      'Tbk-Api-Key-Secret': WEBPAY_API_SECRET,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Error de Transbank:', errorText)
    throw new Error(`Transbank dice: ${errorText || 'Error desconocido'}`)
  }

  return await response.json() // { token, url }
}

export async function commitWebpayTransaction(token: string) {
  const response = await fetch(`${WEBPAY_URL}/${token}`, {
    method: 'PUT',
    headers: {
      'Tbk-Api-Key-Id': WEBPAY_API_KEY,
      'Tbk-Api-Key-Secret': WEBPAY_API_SECRET,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Error al confirmar transacción en Webpay')
  }

  return await response.json()
}
