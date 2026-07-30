'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    })
    if (error) setError(error.message)
    else window.location.href = '/dashboard'
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 400, background: 'rgba(30,41,59,0.6)', backdropFilter: 'blur(20px)', borderRadius: 20, padding: 32, border: '1px solid rgba(148,163,184,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#f8fafc' }}>Crear cuenta</h1>
          <p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Empieza a tomar el pulso de tu carrera</p>
        </div>
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Nombre completo</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(148,163,184,0.2)', background: 'rgba(15,23,42,0.5)', color: '#f8fafc', fontSize: 14, outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(148,163,184,0.2)', background: 'rgba(15,23,42,0.5)', color: '#f8fafc', fontSize: 14, outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(148,163,184,0.2)', background: 'rgba(15,23,42,0.5)', color: '#f8fafc', fontSize: 14, outline: 'none' }} />
          </div>
          {error && <div style={{ color: '#ef4444', fontSize: 13, background: 'rgba(239,68,68,0.1)', padding: 10, borderRadius: 8 }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: 14, background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', color: '#0f172a', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#64748b' }}>
          ¿Ya tienes cuenta? <Link href="/login" style={{ color: '#22c55e', fontWeight: 700, textDecoration: 'none' }}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
