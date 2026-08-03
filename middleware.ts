import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  console.log(`[Middleware] ${request.method} ${request.nextUrl.pathname}`)

  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.log('[Middleware] Supabase not configured, allowing all requests')
    return response
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        const value = request.cookies.get(name)?.value
        console.log(`[Cookie GET] ${name}: ${value ? 'exists' : 'missing'}`)
        return value
      },
      set(name: string, value: string, options: CookieOptions) {
        console.log(`[Cookie SET] ${name}`)
        request.cookies.set({ name, value, ...options })
        response = NextResponse.next({ request: { headers: request.headers } })
        response.cookies.set({ name, value, ...options })
      },
      remove(name: string, options: CookieOptions) {
        console.log(`[Cookie REMOVE] ${name}`)
        request.cookies.set({ name, value: '', ...options })
        response = NextResponse.next({ request: { headers: request.headers } })
        response.cookies.set({ name, value: '', ...options })
      },
    },
  })

  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    console.log(`[Auth Check] User: ${user?.email || 'null'}, Error: ${error?.message || 'none'}`)

    const pathname = request.nextUrl.pathname

    // Rutas públicas (sin protección)
    if (pathname === '/' || pathname === '/login' || pathname === '/register') {
      if (user) {
        console.log(`[Redirect] User logueado intenta acceder a ${pathname} → /dashboard`)
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      return response
    }

    // Rutas protegidas (requieren login)
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/auth/callback')) {
      if (!user) {
        console.log(`[Redirect] Sin usuario intenta acceder a ${pathname} → /login`)
        return NextResponse.redirect(new URL('/login', request.url))
      }
      console.log(`[Allow] Usuario ${user.email} accede a ${pathname}`)
      return response
    }

    return response
  } catch (error) {
    console.error(`[Middleware Error]`, error)
    return response
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
