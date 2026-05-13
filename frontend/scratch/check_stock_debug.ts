import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkStock() {
  const { data: products, error } = await supabase
    .from('producto')
    .select(`
      id_producto,
      nombre,
      variante_producto (
        id_variante,
        talla,
        inventario (stock_actual)
      )
    `)
    .in('nombre', ['Chaqueta Galáctica', 'Pantalón Órbita', 'Bolso Constelación'])

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log('--- ESTADO DE STOCK EN DB ---')
  products.forEach(p => {
    console.log(`\nProducto: ${p.nombre}`)
    p.variante_producto.forEach((v: any) => {
      const stock = Array.isArray(v.inventario) ? v.inventario[0]?.stock_actual : v.inventario?.stock_actual
      console.log(`  - Variante [${v.talla}]: Stock = ${stock ?? 'SIN REGISTRO EN INVENTARIO'}`)
    })
  })
}

checkStock()
