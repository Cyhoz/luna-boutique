'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // createClient espera devolver un supabase client (SSR).
  // La implementación de Supabase Next.js SSR maneja las cookies automáticamente.

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    // Redirigimos de vuelta a /login con un parámetro de error
    redirect('/login?error=Contraseña+incorrecta')
  }

  // Redirigir a la cuenta tras login exitoso
  revalidatePath('/', 'layout')
  redirect('/mi-cuenta')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('fullName') as string,
      }
    }
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/registro?error=Error+creando+cuenta')
  }

  revalidatePath('/', 'layout')
  redirect('/mi-cuenta')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
