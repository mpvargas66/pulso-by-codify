'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [tab, setTab] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabase = supabaseUrl && supabaseKey ? createClient() : null

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
      } else {
        setMessage('¡Verifica tu email para confirmar tu cuenta!')
        setEmail('')
        setPassword('')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) setError(error.message)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420, background: 'rgba(30,41,59,0.6)', backdropFilter: 'blur(20px)', borderRadius: 20, padding: 32, border: '1px solid rgba(148,163,184,0.15)' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 20px', boxShadow: '0 8px 30px rgba(34,197,94,0.3)' }}>📊</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#f8fafc', marginBottom: 8 }}>Bienvenido a Pulso</h1>
          <p style={{ fontSize: 14, color: '#64748b' }}>Inicia sesión para evaluar tu posición en el mercado</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, background: 'rgba(148,163,184,0.1)', padding: 4, borderRadius: 12 }}>
          <button
            onClick={() => { setTab('login'); setError(''); setMessage(''); }}
            style={{
              flex: 1,
              padding: '12px',
              background: tab === 'login' ? 'rgba(34,197,94,0.2)' : 'transparent',
              color: tab === 'login' ? '#22c55e' : '#64748b',
              border: 'none',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => { setTab('signup'); setError(''); setMessage(''); }}
            style={{
              flex: 1,
              padding: '12px',
              background: tab === 'signup' ? 'rgba(34,197,94,0.2)' : 'transparent',
              color: tab === 'signup' ? '#22c55e' : '#64748b',
              border: 'none',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          >
            Crear Cuenta
          </button>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={tab === 'login' ? handleEmailLogin : handleEmailSignup} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 8, fontWeight: 500 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 10,
                border: '1px solid rgba(148,163,184,0.2)',
                background: 'rgba(15,23,42,0.5)',
                color: '#f8fafc',
                fontSize: 14,
                outline: 'none',
                transition: 'border-color 0.3s',
                opacity: loading ? 0.6 : 1,
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(34,197,94,0.5)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.2)'; }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 8, fontWeight: 500 }}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 10,
                border: '1px solid rgba(148,163,184,0.2)',
                background: 'rgba(15,23,42,0.5)',
                color: '#f8fafc',
                fontSize: 14,
                outline: 'none',
                transition: 'border-color 0.3s',
                opacity: loading ? 0.6 : 1,
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(34,197,94,0.5)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.2)'; }}
            />
          </div>

          {/* Error Message */}
          {error && <div style={{ padding: 12, background: 'rgba(239,68,68,0.15)', borderRadius: 8, color: '#fca5a5', fontSize: 13, border: '1px solid rgba(239,68,68,0.3)' }}>⚠️ {error}</div>}

          {/* Success Message */}
          {message && <div style={{ padding: 12, background: 'rgba(34,197,94,0.15)', borderRadius: 8, color: '#86efac', fontSize: 13, border: '1px solid rgba(34,197,94,0.3)' }}>✓ {message}</div>}

          <button
            type="submit"
            disabled={loading || !email || !password}
            style={{
              width: '100%',
              padding: '14px 24px',
              background: loading || !email || !password ? '#666' : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              color: '#1a1a2e',
              border: 'none',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 4px 15px rgba(34,197,94,0.25)',
            }}
          >
            {loading ? 'Cargando...' : tab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(148,163,184,0.2)' }} />
          <span style={{ fontSize: 12, color: '#64748b' }}>O continúa con</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(148,163,184,0.2)' }} />
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px 24px',
            background: 'white',
            color: '#1f2937',
            border: 'none',
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            opacity: loading ? 0.6 : 1,
            transition: 'all 0.3s',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuar con Google
        </button>
      </div>
    </div>
  )
}
