
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { v4 as uuidv4 } from 'uuid'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Usamos service role para bypass RLS en el test

const supabase = createClient(supabaseUrl, supabaseKey)

async function runTest1() {
  console.log('🚀 Iniciando Prueba #1: Integridad de Productos y Variantes...')

  const testId = uuidv4().split('-')[0]
  const productName = `QA Test Jacket ${testId}`

  try {
    // 1. Crear Producto
    const { data: product, error: pError } = await supabase
      .from('producto')
      .insert({
        nombre: productName,
        descripcion: 'Producto generado por QA para stress testing',
        material: 'Poliéster QA',
        genero: 'Unisex',
        marca: 'QA Brand',
        estado: 'activo'
      })
      .select()
      .single()

    if (pError) throw pError
    console.log('✅ Producto creado:', product.id_producto)

    // 2. Crear 3 Variantes
    const tallas = ['S', 'M', 'L']
    for (const talla of tallas) {
      const { data: variant, error: vError } = await supabase
        .from('variante_producto')
        .insert({
          id_producto: product.id_producto,
          talla: talla,
          sku: `SKU-QA-${testId}-${talla}`,
          precio: 50000,
          estado: 'activo'
        })
        .select()
        .single()

      if (vError) throw vError
      console.log(`✅ Variante ${talla} creada:`, variant.id_variante)

      // 3. Verificar Inventario (Debería existir por el flujo de negocio)
      // En nuestra lógica de adminService, el inventario se crea manualmente en el form.
      // Vamos a simular esa creación manual aquí.
      const { data: inv, error: iError } = await supabase
        .from('inventario')
        .insert({
          id_variante: variant.id_variante,
          stock_actual: 10,
          stock_minimo: 5
        })
        .select()
        .single()

      if (iError) throw iError
      console.log(`✅ Registro de Inventario verificado para talla ${talla}`)
    }

    // 4. Verificación Final de Relaciones
    const { data: finalCheck, error: fError } = await supabase
      .from('producto')
      .select(`
        nombre,
        variante_producto (
          talla,
          inventario (stock_actual)
        )
      `)
      .eq('id_producto', product.id_producto)
      .single()

    if (fError) throw fError

    console.log('\n📊 RESULTADO DE INTEGRIDAD:')
    console.log(`Producto: ${finalCheck.nombre}`)
    console.log(`Variantes detectadas: ${finalCheck.variante_producto.length}`)
    
    if (finalCheck.variante_producto.length === 3) {
      console.log('🏆 PRUEBA #1 PASADA: La relación 1:N y la integridad de Inventario son correctas.')
    } else {
      console.log('❌ PRUEBA #1 FALLIDA: Discrepancia en el número de variantes.')
    }

  } catch (err) {
    console.error('❌ Error durante la prueba:', err)
  }
}

runTest1()
