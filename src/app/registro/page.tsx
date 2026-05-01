import Link from 'next/link'
import { signup } from '@/app/login/actions'

export default function RegisterPage() {
  return (
    <div className="flex min-h-[80vh] flex-col justify-center px-6 py-12 lg:px-8 bg-white dark:bg-zinc-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-zinc-900 dark:text-white">
          Crear una cuenta
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Únete a la familia Antigravity
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action={signup}>
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-white">
              Nombre Completo
            </label>
            <div className="mt-2">
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                className="block w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent py-2 px-3 text-zinc-900 dark:text-white shadow-sm focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white sm:text-sm sm:leading-6 outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-white">
              Correo Electrónico
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent py-2 px-3 text-zinc-900 dark:text-white shadow-sm focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white sm:text-sm sm:leading-6 outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-white">
              Contraseña
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="block w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent py-2 px-3 text-zinc-900 dark:text-white shadow-sm focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white sm:text-sm sm:leading-6 outline-none"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-zinc-900 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
            >
              Registrarse
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-zinc-500">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className="font-semibold leading-6 text-zinc-900 hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300 transition-colors">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  )
}
