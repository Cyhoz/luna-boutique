import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Proteger la ruta de administración
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      // No está logueado
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // Está logueado, verificamos su rol en la tabla profiles
    const { data: profile } = await supabase
      .from('usuario')
      .select('role')
      .eq('id_usuario', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      // Registrar intento no autorizado
      await supabase.from('security_logs').insert({
        event_type: 'unauthorized_admin_access',
        user_id: user.id,
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        details: { path: request.nextUrl.pathname }
      })
      
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Proteger la ruta de mi-cuenta
  if (request.nextUrl.pathname.startsWith('/mi-cuenta')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return supabaseResponse
}
