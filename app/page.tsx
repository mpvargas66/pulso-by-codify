'use client';

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center' }}>
      <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, marginBottom: 24, boxShadow: '0 8px 30px rgba(34,197,94,0.3)' }}>📊</div>
      <h1 style={{ fontSize: 42, fontWeight: 800, color: '#f8fafc', letterSpacing: '-1px', marginBottom: 12 }}>Pulso <span style={{ color: '#22c55e' }}>by Codify</span></h1>
      <p style={{ fontSize: 16, color: '#94a3b8', maxWidth: 480, lineHeight: 1.6, marginBottom: 32 }}>
        La primera herramienta de pesaje de cargos diseñada para profesionales independientes.
        Homologa tu posición con la metodología que usan las empresas líderes de Chile.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => window.location.href = '/login'} style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', color: '#0f172a', borderRadius: 12, fontSize: 15, fontWeight: 800, textDecoration: 'none', boxShadow: '0 4px 20px rgba(34,197,94,0.25)', border: 'none', cursor: 'pointer' }}>Descubre tu valor</button>
        <button onClick={() => window.location.href = '/login'} style={{ padding: '14px 28px', background: 'rgba(30,41,59,0.6)', color: '#f8fafc', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none', border: '1px solid rgba(148,163,184,0.2)', cursor: 'pointer' }}>Iniciar sesión</button>
      </div>
    </main>
  )
}
