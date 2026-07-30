'use client'

import { useState } from 'react'

const FACTORES = [
  {
    key: 'conocimiento',
    emoji: '🎓',
    nombre: 'Conocimiento & Expertise',
    peso: 25,
    desc: 'Formación, certificaciones, dominio técnico y años de experiencia relevante.',
  },
  {
    key: 'alcance',
    emoji: '🌐',
    nombre: 'Alcance & Complejidad',
    peso: 25,
    desc: 'Tamaño de proyectos, cantidad de stakeholders e interdependencias.',
  },
  {
    key: 'impacto',
    emoji: '🎯',
    nombre: 'Impacto & Resultados',
    peso: 20,
    desc: 'Influencia directa en resultados de negocio del cliente, valor medible.',
  },
  {
    key: 'autonomia',
    emoji: '🚀',
    nombre: 'Autonomía & Decisión',
    peso: 15,
    desc: 'Nivel de independencia, supervisión requerida y definición de estrategia.',
  },
  {
    key: 'comunicacion',
    emoji: '🗣️',
    nombre: 'Comunicación & Influencia',
    peso: 15,
    desc: 'Negociación, presentación a C-level, manejo de conflictos, liderazgo virtual.',
  },
]

const CARGOS = [
  { min: 0, max: 80, name: 'Practicante / Trainee', grade: 'Grade 1–3', p25: 450000, p50: 650000, p75: 850000, p90: 1100000 },
  { min: 81, max: 140, name: 'Analista Junior', grade: 'Grade 4–6', p25: 800000, p50: 1100000, p75: 1400000, p90: 1800000 },
  { min: 141, max: 200, name: 'Analista / Especialista', grade: 'Grade 7–9', p25: 1200000, p50: 1600000, p75: 2100000, p90: 2700000 },
  { min: 201, max: 260, name: 'Consultor Senior / Coordinador', grade: 'Grade 10–12', p25: 1800000, p50: 2400000, p75: 3100000, p90: 4000000 },
  { min: 261, max: 320, name: 'Jefe de Proyecto / Lead', grade: 'Grade 13–15', p25: 2500000, p50: 3400000, p75: 4500000, p90: 5800000 },
  { min: 321, max: 380, name: 'Gerente / Director', grade: 'Grade 16–19', p25: 3500000, p50: 4800000, p75: 6400000, p90: 8500000 },
  { min: 381, max: 440, name: 'Director Senior / VP', grade: 'Grade 20–22', p25: 5000000, p50: 7000000, p75: 9500000, p90: 13000000 },
  { min: 441, max: 500, name: 'C-Level / Socio', grade: 'Grade 23–25', p25: 8000000, p50: 12000000, p75: 18000000, p90: 28000000 },
]

function fmt(n: number) {
  return '$' + Math.round(n).toLocaleString('es-CL') + ' CLP/mes'
}

export default function Home() {
  const [selecciones, setSelecciones] = useState<Record<string, number>>({})
  const [resultado, setResultado] = useState<{
    score: number
    cargo: (typeof CARGOS)[0]
    debiles: string[]
    certId: string
  } | null>(null)

  const handleSelect = (key: string, val: number) => {
    setSelecciones((prev) => ({ ...prev, [key]: val }))
  }

  const calcular = () => {
    const keys = FACTORES.map((f) => f.key)
    if (keys.some((k) => !selecciones[k])) {
      alert('Selecciona un nivel para cada factor.')
      return
    }

    let score = 0
    FACTORES.forEach((f) => {
      score += (selecciones[f.key] || 0) * 20 * (f.peso / 100)
    })
    score = Math.round(score)

    const cargo = CARGOS.find((c) => score >= c.min && score <= c.max) || CARGOS[CARGOS.length - 1]

    const debiles = FACTORES.filter((f) => (selecciones[f.key] || 0) <= 2).map((f) => f.nombre)

    const certId =
      'PULSO-' +
      Math.random().toString(36).substring(2, 10).toUpperCase() +
      '-' +
      Date.now().toString(36).slice(-4).toUpperCase()

    setResultado({ score, cargo, debiles, certId })
    setTimeout(() => {
      document.getElementById('resultado')?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  return (
    <main
      style={{
        maxWidth: 640,
        margin: '0 auto',
        padding: '24px 16px',
        minHeight: '100vh',
        background: '#fafafa',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: '#1a1a2e',
            letterSpacing: '-0.5px',
          }}
        >
          Pulso <span style={{ color: '#4f46e5' }}>by Codify</span>
        </h1>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
          Evalúa tu posición en el mercado laboral con la metodología Codify
        </p>
      </div>

      {/* Factores */}
      {FACTORES.map((f) => (
        <div
          key={f.key}
          style={{
            background: 'white',
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            border: '1px solid #f3f4f6',
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#1f2937',
              marginBottom: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {f.emoji} {f.nombre}{' '}
            <span style={{ color: '#4f46e5', fontSize: 11 }}>{f.peso}%</span>
          </div>
          <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>{f.desc}</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[1, 2, 3, 4, 5].map((n) => {
              const active = selecciones[f.key] === n
              return (
                <button
                  key={n}
                  onClick={() => handleSelect(f.key, n)}
                  style={{
                    flex: 1,
                    height: 40,
                    borderRadius: 8,
                    border: `2px solid ${active ? '#4f46e5' : '#e5e7eb'}`,
                    background: active ? '#4f46e5' : 'white',
                    color: active ? 'white' : '#6b7280',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    boxShadow: active ? '0 2px 8px rgba(79,70,229,0.25)' : 'none',
                  }}
                >
                  {n}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {/* Botón */}
      <button
        onClick={calcular}
        style={{
          width: '100%',
          padding: 14,
          background: '#4f46e5',
          color: 'white',
          border: 'none',
          borderRadius: 12,
          fontSize: 15,
          fontWeight: 700,
          cursor: 'pointer',
          marginTop: 8,
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#4338ca'
          e.currentTarget.style.transform = 'translateY(-1px)'
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(79,70,229,0.3)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#4f46e5'
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        Calcular mi posición en el mercado
      </button>

      {/* Resultado */}
      {resultado && (
        <div id="resultado" style={{ marginTop: 24, animation: 'fadeIn 0.4s ease' }}>
          <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`}</style>

          {/* Score */}
          <div
            style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              borderRadius: 16,
              padding: 24,
              color: 'white',
              textAlign: 'center',
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 48, fontWeight: 800, lineHeight: 1 }}>{resultado.score}</div>
            <div
              style={{
                fontSize: 12,
                opacity: 0.85,
                marginTop: 6,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Puntos / 500
            </div>
          </div>

          {/* Cargo */}
          <div
            style={{
              background: 'white',
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
              border: '1px solid #e5e7eb',
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                fontWeight: 600,
              }}
            >
              Cargo homologado Codify
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1f2937', marginTop: 4 }}>
              {resultado.cargo.name}
            </div>
            <span
              style={{
                display: 'inline-block',
                background: '#ecfdf5',
                color: '#047857',
                fontSize: 11,
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 20,
                marginTop: 8,
              }}
            >
              {resultado.cargo.grade}
            </span>
          </div>

          {/* Banda */}
          <div
            style={{
              background: 'white',
              borderRadius: 12,
              padding: 16,
              border: '1px solid #e5e7eb',
            }}
          >
            {[
              { label: 'P25 (Bajo)', val: resultado.cargo.p25, highlight: false },
              { label: 'P50 (Mediana)', val: resultado.cargo.p50, highlight: true },
              { label: 'P75 (Competitivo)', val: resultado.cargo.p75, highlight: false },
              { label: 'P90 (Top)', val: resultado.cargo.p90, highlight: false },
            ].map((row) => (
              <div
                key={row.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: '1px solid #f3f4f6',
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280' }}>{row.label}</span>
                <span
                  style={{
                    fontSize: row.highlight ? 16 : 14,
                    fontWeight: 700,
                    color: row.highlight ? '#4f46e5' : '#1f2937',
                  }}
                >
                  {fmt(row.val)}
                </span>
              </div>
            ))}
          </div>

          {/* Alerta */}
          {resultado.debiles.length > 0 && (
            <div
              style={{
                background: '#fef3c7',
                borderLeft: '3px solid #f59e0b',
                padding: '12px 14px',
                borderRadius: '0 8px 8px 0',
                marginTop: 12,
                fontSize: 12,
                color: '#92400e',
              }}
            >
              💡 Oportunidad: si subes{' '}
              <strong>{resultado.debiles.join(', ')}</strong> al nivel 3, podrías rehomologar a un
              cargo superior y aumentar tu banda salarial.
            </div>
          )}

          {/* Certificado */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #312e81 100%)',
              borderRadius: 12,
              padding: 20,
              color: 'white',
              marginTop: 16,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>🏅</div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: 'uppercase',
                opacity: 0.7,
              }}
            >
              Certificado Codify Individual
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>{resultado.cargo.name}</div>
            <div
              style={{
                fontSize: 10,
                opacity: 0.5,
                marginTop: 8,
                fontFamily: 'monospace',
              }}
            >
              ID: {resultado.certId}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
