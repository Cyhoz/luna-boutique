'use server'

import { createClient } from '@/lib/supabase/server'
import { adminSupabase } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')

  const { data: profile } = await supabase
    .from('usuario')
    .select('role')
    .eq('id_usuario', user.id)
    .single()

  if (profile?.role !== 'admin') throw new Error('No autorizado')
  return { supabase, user }
}

export async function addProduct(formData: FormData) {
  try {
    const { supabase } = await checkAdmin()
    
    // 1. Datos del Producto
    const nombre = formData.get('nombre') as string
    const descripcionRaw = formData.get('descripcion')
    const descripcion = descripcionRaw ? (descripcionRaw as string) : 'Pieza exclusiva de Luna Boutique.'
    
    const id_categoria_raw = formData.get('id_categoria') as string
    const id_categoria = id_categoria_raw && id_categoria_raw !== '' ? id_categoria_raw : null
    
    const material = formData.get('material') as string || 'No especificado'
    const genero = formData.get('genero') as string || 'Unisex'
    const marca = formData.get('marca') as string || 'Luna'
    
    // 2. Datos de la Variante Inicial
    const tallaRaw = formData.get('talla') as string
    const tallas = tallaRaw ? tallaRaw.split(',').map(t => t.trim()).filter(Boolean) : ['Única']
    
    const id_color_raw = formData.get('id_color') as string
    const id_color = id_color_raw && id_color_raw !== '' ? id_color_raw : null
    
    const baseSku = formData.get('sku') as string || `LUNA-${Date.now()}`
    const precio = parseFloat(formData.get('precio') as string)
    const precio_descuento = parseFloat(formData.get('precio_descuento') as string) || 0
    const stock_actual = parseInt(formData.get('stock_actual') as string) || 0
    const stock_minimo = parseInt(formData.get('stock_minimo') as string) || 5
    
    // 3. Imagen
    const imagen_url = formData.get('imagen_url') as string
    
    // TRANSACCIÓN: Insertar Producto
    const { data: product, error: productError } = await adminSupabase
      .from('producto')
      .insert({ 
        nombre, 
        descripcion,
        id_categoria,
        material,
        genero,
        marca,
        estado: 'activo'
      })
      .select()
      .single()

    if (productError) throw new Error(`Error en Producto: ${productError.message}`)

    // Iterar y crear cada talla como una variante independiente
    for (const talla of tallas) {
      const variantSku = tallas.length > 1 ? `${baseSku}-${talla.toUpperCase()}` : baseSku;

      // Insertar Variante
      const { data: variant, error: variantError } = await adminSupabase
        .from('variante_producto')
        .insert({
          id_producto: product.id_producto,
          id_color: id_color,
          talla: talla,
          sku: variantSku,
          precio: precio,
          precio_descuento: precio_descuento,
          estado: 'activo'
        })
        .select()
        .single()

      if (variantError) throw new Error(`Error en Variante (${talla}): ${variantError.message}`)

      // Insertar Inventario Inicial para esta talla
      const { error: invError } = await adminSupabase
        .from('inventario')
        .insert({
          id_variante: variant.id_variante,
          stock_actual: stock_actual,
          stock_minimo: stock_minimo
        })

      if (invError) throw new Error(`Error en Inventario (${talla}): ${invError.message}`)
    }

    // Insertar Imagen Principal
    if (imagen_url && imagen_url.trim() !== '') {
      const { error: imgError } = await adminSupabase.from('imagen_producto').insert({
        id_producto: product.id_producto,
        url_imagen: imagen_url,
        es_principal: true,
        orden: 0
      })
      if (imgError) throw new Error(`Error en Imagen: ${imgError.message}`)
    }
    
    revalidatePath('/admin')
    revalidatePath('/')
  } catch (error: any) {
    console.error('CRITICAL ERROR ADDING PRODUCT:', error)
    throw new Error(`Fallo al añadir el producto a la base de datos: ${error.message}`)
  }
}

export async function getCategories() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('categoria').select('*').eq('estado', 'activo')
  if (error) return []
  return data
}

export async function getColors() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('color').select('*')
  if (error) return []
  return data
}

export async function addCategory(formData: FormData) {
  try {
    const { supabase } = await checkAdmin()
    const nombre = formData.get('nombre') as string
    const descripcion = formData.get('descripcion') as string

    const { error } = await supabase
      .from('categoria')
      .insert({ nombre, descripcion, estado: 'activo' })

    if (error) throw error
    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    console.error('Error adding category:', error)
    return { success: false, error: error.message }
  }
}

export async function addColor(formData: FormData) {
  try {
    const { supabase } = await checkAdmin()
    const nombre = formData.get('nombre') as string
    const codigo_hex = formData.get('codigo_hex') as string

    const { error } = await supabase
      .from('color')
      .insert({ nombre, codigo_hex })

    if (error) throw error
    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    console.error('Error adding color:', error)
    return { success: false, error: error.message }
  }
}

export async function addMedioPago(formData: FormData) {
  try {
    const { user } = await checkAdmin() // Solo para verificar que es admin
    const nombre = formData.get('nombre') as string
    const descripcion = formData.get('descripcion') as string
    const codigo_api = nombre.toLowerCase().replace(/\s+/g, '_') // Generar slug ej: "mercado_pago"

    const { error } = await adminSupabase // Usamos adminSupabase para saltar RLS
      .from('medio_pago')
      .insert({ 
        nombre, 
        descripcion, 
        codigo_api,
        estado: 'activo' 
      })

    if (error) throw error
    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    console.error('Error al añadir medio de pago:', error)
    return { success: false, error: error.message || 'Error de base de datos' }
  }
}

export async function getMediosPago() {
  const { data, error } = await adminSupabase
    .from('medio_pago')
    .select('*')
    .eq('estado', 'activo')
    .order('fecha_creacion', { ascending: false })
    
  if (error) return []
  return data
}

export async function updateMedioPago(formData: FormData) {
  try {
    await checkAdmin()
    const id = formData.get('id') as string
    const nombre = formData.get('nombre') as string
    const descripcion = formData.get('descripcion') as string
    const codigo_api = nombre.toLowerCase().replace(/\s+/g, '_')

    const { error } = await adminSupabase
      .from('medio_pago')
      .update({ nombre, descripcion, codigo_api })
      .eq('id_medio_pago', id)

    if (error) throw error
    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteMedioPago(id: string) {
  try {
    await checkAdmin()
    const { error } = await adminSupabase
      .from('medio_pago')
      .update({ estado: 'inactivo' })
      .eq('id_medio_pago', id)

    if (error) throw error
    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateProduct(formData: FormData) {
  try {
    const { supabase } = await checkAdmin()
    
    const id = formData.get('id') as string
    const nombre = formData.get('nombre') as string
    const descripcion = formData.get('descripcion') as string
    const id_categoria = formData.get('id_categoria') as string
    const material = formData.get('material') as string
    const genero = formData.get('genero') as string
    const marca = formData.get('marca') as string

    const { error } = await adminSupabase
      .from('producto')
      .update({ 
        nombre,
        descripcion,
        id_categoria,
        material,
        genero,
        marca
      })
      .eq('id_producto', id)

    if (error) throw error

    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function markAsShipped(orderId: string, formData: FormData) {
  console.log(`--- INICIANDO PROCESO DE DESPACHO E INVENTARIO PARA ${orderId} ---`)
  try {
    const { user } = await checkAdmin()
    const supabase = adminSupabase // IMPORTANTE: Usamos adminSupabase para saltar RLS al actualizar pedido y envio
    const numero_guia = formData.get('numero_guia') as string
    const paqueteria = formData.get('paqueteria') as string

    // 0. Protección: Si ya está enviado, no hacemos nada más
    const { data: checkOrder } = await supabase
      .from('pedido')
      .select('estado')
      .eq('id_pedido', orderId)
      .single()

    if (checkOrder?.estado === 'enviado') {
      console.log('Pedido ya enviado. Omitiendo.')
      redirect('/admin')
    }

    // 1. Obtener los detalles del pedido para saber qué descontar
    const { data: detalles, error: fetchError } = await supabase
      .from('detalle_pedido')
      .select('id_variante, cantidad')
      .eq('id_pedido', orderId)

    if (fetchError) throw new Error(`Error al obtener detalles: ${fetchError.message}`)

    // 2. Registrar movimientos de SALIDA para cada producto
    for (const item of detalles) {
      // Buscar el id_inventario de la variante (tolerante si no existe)
      const { data: inv } = await supabase
        .from('inventario')
        .select('id_inventario')
        .eq('id_variante', item.id_variante)
        .maybeSingle()

      if (inv) {
        await supabase.from('movimiento_inventario').insert({
          id_inventario: inv.id_inventario,
          tipo_movimiento: 'salida',
          cantidad: item.cantidad,
          motivo: `Despacho Pedido ORD-${orderId.split('-')[0]}`,
          referencia_id: orderId,
          referencia_tipo: 'pedido',
          id_usuario: user.id
        })
      }
    }

    // 3. Gestionar el envío sin usar UPSERT (para evitar errores si falta el UNIQUE en la DB real)
    const { data: existingEnvio } = await supabase
      .from('envio')
      .select('id_envio')
      .eq('id_pedido', orderId)
      .maybeSingle()

    if (existingEnvio) {
      // Si ya existe, actualizamos
      const { error: updateEnvioError } = await supabase
        .from('envio')
        .update({
          numero_guia: numero_guia,
          paqueteria: paqueteria,
          estado: 'enviado',
          fecha_envio: new Date().toISOString()
        })
        .eq('id_pedido', orderId)
        
      if (updateEnvioError) throw updateEnvioError
    } else {
      // Si no existe, insertamos
      const { error: insertEnvioError } = await supabase
        .from('envio')
        .insert({
          id_pedido: orderId,
          numero_guia: numero_guia,
          paqueteria: paqueteria,
          estado: 'enviado',
          fecha_envio: new Date().toISOString()
        })
        
      if (insertEnvioError) throw insertEnvioError
    }

    // 4. Actualizar el estado del pedido
    const { error: pedidoError } = await supabase
      .from('pedido')
      .update({ estado: 'enviado' })
      .eq('id_pedido', orderId)

    if (pedidoError) throw pedidoError

    console.log('--- DESPACHO COMPLETADO Y STOCK ACTUALIZADO ---')
  } catch (error: any) {
    console.error('ERROR EN DESPACHO:', error.message)
    // Lanzamos el error en lugar de devolverlo para que Next.js te muestre la pantalla roja con el fallo exacto
    throw new Error(`Fallo al despachar: ${error.message}`)
  }
  
  // IMPORTANTE: redirect() lanza un error interno en Next.js (NEXT_REDIRECT)
  // DEBE estar fuera del bloque try-catch para que funcione.
  revalidatePath('/admin')
  redirect('/admin')
}

export async function updateVariantStock(variantId: string, stock: number, motivo: string = 'Ajuste manual') {
  try {
    const { supabase, user } = await checkAdmin()
    
    // 1. Intentamos obtener el inventario o crearlo si no existe
    let { data: inv, error: fetchError } = await supabase
      .from('inventario')
      .select('id_inventario')
      .eq('id_variante', variantId)
      .maybeSingle()

    if (fetchError) throw fetchError

    let id_inventario = inv?.id_inventario

    if (!id_inventario) {
      // Si no existe, lo creamos
      const { data: newInv, error: createError } = await supabase
        .from('inventario')
        .insert({
          id_variante: variantId,
          stock_actual: 0,
          stock_minimo: 5
        })
        .select()
        .single()
      
      if (createError) throw createError
      id_inventario = newInv.id_inventario
    }

    // 2. Insertamos el movimiento (el trigger de la DB actualizará el stock_actual)
    const { error: moveError } = await supabase.from('movimiento_inventario').insert({
      id_inventario: id_inventario,
      tipo_movimiento: 'ajuste',
      cantidad: stock,
      motivo: motivo,
      id_usuario: user.id
    })

    if (moveError) throw moveError

    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    console.error('Error updating stock:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteProduct(productId: string) {
  try {
    await checkAdmin()
    
    // 1. Obtener todas las variantes del producto
    const { data: variants } = await adminSupabase
      .from('variante_producto')
      .select('id_variante')
      .eq('id_producto', productId)
      
    if (variants && variants.length > 0) {
      const variantIds = variants.map(v => v.id_variante)
      
      // 2. Obtener los inventarios de esas variantes
      const { data: inventories } = await adminSupabase
        .from('inventario')
        .select('id_inventario')
        .in('id_variante', variantIds)
        
      if (inventories && inventories.length > 0) {
        const invIds = inventories.map(i => i.id_inventario)
        // 3. Eliminar movimientos de inventario asociados
        await adminSupabase.from('movimiento_inventario').delete().in('id_inventario', invIds)
        // 4. Eliminar inventarios
        await adminSupabase.from('inventario').delete().in('id_variante', variantIds)
      }
      
      // 5. Eliminar detalles de pedido vinculados (peligroso en prod, pero necesario si no hay cascade y queremos borrar)
      await adminSupabase.from('detalle_pedido').delete().in('id_variante', variantIds)
      
      // 6. Eliminar variantes
      await adminSupabase.from('variante_producto').delete().eq('id_producto', productId)
    }

    // 7. Eliminar imágenes
    await adminSupabase.from('imagen_producto').delete().eq('id_producto', productId)

    // 8. Eliminar producto finalmente
    const { error } = await adminSupabase.from('producto').delete().eq('id_producto', productId)
    
    if (error) throw error
    
    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteOrder(orderId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No autenticado')

    // Verificar si es admin
    const { data: profile } = await supabase
      .from('usuario')
      .select('role')
      .eq('id_usuario', user.id)
      .single()

    const isAdmin = profile?.role === 'admin'

    // Si no es admin, verificar si el pedido le pertenece
    if (!isAdmin) {
      const { data: order } = await adminSupabase
        .from('pedido')
        .select('id_usuario')
        .eq('id_pedido', orderId)
        .single()
        
      if (order?.id_usuario !== user.id) {
        throw new Error('No autorizado para eliminar este pedido')
      }
    }

    // Borrado con privilegios elevados para saltar RLS si es necesario
    const { error } = await adminSupabase
      .from('pedido')
      .delete()
      .eq('id_pedido', orderId)

    if (error) throw error

    revalidatePath('/admin')
    revalidatePath('/mi-cuenta')
    return { success: true }

  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteMultipleOrders(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No autenticado')

    const { data: profile } = await supabase
      .from('usuario')
      .select('role')
      .eq('id_usuario', user.id)
      .single()

    const isAdmin = profile?.role === 'admin'
    
    // Obtener todos los IDs seleccionados
    const orderIds = formData.getAll('orderIds') as string[]
    if (!orderIds || orderIds.length === 0) {
      return { success: false, error: 'No se seleccionaron pedidos' }
    }

    if (!isAdmin) {
      // Verificar propiedad de cada pedido
      const { data: orders } = await adminSupabase
        .from('pedido')
        .select('id_pedido, id_usuario')
        .in('id_pedido', orderIds)
        
      for (const order of orders || []) {
        if (order.id_usuario !== user.id) {
          throw new Error('No autorizado para eliminar uno o más pedidos seleccionados')
        }
      }
    }

    // Borrado masivo
    const { error } = await adminSupabase
      .from('pedido')
      .delete()
      .in('id_pedido', orderIds)

    if (error) throw error

    revalidatePath('/admin')
    revalidatePath('/mi-cuenta')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
