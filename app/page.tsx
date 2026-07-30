'use client'

import { useState } from 'react'

const FACTORES = [
  {
    key: 'conocimiento',
    emoji: '🎓',
    nombre: 'Conocimiento & Expertise',
    peso: 25,
    desc: 'Formación académica, certificaciones, dominio técnico y años de experiencia relevante.',
    niveles: [
      'Sin formación formal. Conocimientos básicos autodidactas.',
      'Formación técnica o en curso. Conocimientos intermedios.',
      'Formación profesional completa. Dominio sólido del área.',
      'Formación avanzada + certificaciones. Expertise reconocido.',
      'Máster/PhD o equivalente. Referente técnico en la industria.',
    ],
  },
  {
    key: 'alcance',
    emoji: '🌐',
    nombre: 'Alcance & Complejidad',
    peso: 25,
    desc: 'Tamaño de proyectos, cantidad de stakeholders e interdependencias.',
    niveles: [
      'Tareas individuales simples. Sin dependencias externas.',
      'Proyectos pequeños con 1-2 stakeholders. Baja complejidad.',
      'Proyectos medianos con equipo reducido. Múltiples dependencias.',
      'Proyectos grandes cross-funcional. Coordinación de equipos.',
      'Iniciativas estratégicas empresa-wide. Alta incertidumbre.',
    ],
  },
  {
    key: 'impacto',
    emoji: '🎯',
    nombre: 'Impacto & Resultados',
    peso: 20,
    desc: 'Influencia directa en resultados de negocio del cliente, valor medible.',
    niveles: [
      'Impacto operacional menor. Métricas difíciles de medir.',
      'Mejoras tangibles en procesos. KPIs locales afectados.',
      'Impacto directo en objetivos de equipo. ROI medible.',
      'Impacto en objetivos de negocio del cliente. Revenue/Costos.',
      'Impacto estratégico. Transforma el modelo de negocio.',
    ],
  },
  {
    key: 'autonomia',
    emoji: '🚀',
    nombre: 'Autonomía & Decisión',
    peso: 15,
    desc: 'Nivel de independencia, supervisión requerida y definición de estrategia.',
    niveles: [
      'Alta supervisión. Instrucciones paso a paso.',
      'Supervisión regular. Revisa entregables clave.',
      'Autonomía en ejecución. Reporta avances periódicos.',
      'Autonomía total en proyecto. Define metodología.',
      'Define estrategia y roadmap. Cero supervisión.',
    ],
  },
  {
    key: 'comunicacion',
    emoji: '🗣️',
    nombre: 'Comunicación & Influencia',
    peso: 15,
    desc: 'Negociación, presentación a C-level, manejo de conflictos, liderazgo virtual.',
    niveles: [
      'Comunicación escrita básica. Reporta a 1 persona.',
      'Presentaciones a equipo. Coordina con pares.',
      'Presenta a clientes/líderes. Negocia alcances.',
      'Presenta a C-level. Influencia decisiones estratégicas.',
      'Speaker/Thought leader. Construye alianzas clave.',
    ],
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
  const [expandido, setExpandido] = useState<string | null>(null)
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
    <main style={{ maxWidth: 680, margin: '0 auto', padding: '32px 20px', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              boxShadow: '0 4px 12px rgba(34,197,94,0.3)',
            }}
          >
            📊
          </div>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: '#f8fafc',
              letterSpacing: '-0.5px',
            }}
          >
            Pulso <span style={{ color: '#22c55e' }}>by Codify</span>
          </h1>
        </div>
        <p style={{ fontSize: 15, color: '#94a3b8', maxWidth: 420, margin: '0 auto', lineHeight: 1.5 }}>
          Evalúa tu posición en el mercado laboral con la metodología de pesaje de cargos usada por las empresas líderes de Chile
        </p>
      </div>

      {/* Factores */}
      {FACTORES.map((f) => {
        const isExpanded = expandido === f.key
        return (
          <div
            key={f.key}
            style={{
              background: 'var(--glass)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
              border: '1px solid var(--border)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {f.emoji} {f.nombre}
                <span
                  style={{
                    color: '#22c55e',
                    fontSize: 11,
                    fontWeight: 800,
                    background: 'rgba(34,197,94,0.15)',
                    padding: '2px 8px',
                    borderRadius: 20,
                  }}
                >
                  {f.peso}%
                </span>
              </div>
              <button
                onClick={() => setExpandido(isExpanded ? null : f.key)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: 12,
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: 6,
                }}
              >
                {isExpanded ? 'Ocultar niveles ↑' : 'Ver niveles ↓'}
              </button>
            </div>

            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 14 }}>{f.desc}</div>

            {/* Descripción de niveles expandible */}
            {isExpanded && (
              <div
                style={{
                  marginBottom: 14,
                  padding: 12,
                  background: 'rgba(15,23,42,0.5)',
                  borderRadius: 10,
                  border: '1px solid rgba(148,163,184,0.1)',
                }}
              >
                {f.niveles.map((nivel, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 8,
                      padding: '6px 0',
                      borderBottom:
                        idx < f.niveles.length - 1 ? '1px solid rgba(148,163,184,0.08)' : 'none',
                    }}
                  >
                    <span
                      style={{
                        minWidth: 20,
                        height: 20,
                        borderRadius: '50%',
                        background:
                          selecciones[f.key] === idx + 1
                            ? '#22c55e'
                            : 'rgba(148,163,184,0.15)',
                        color: selecciones[f.key] === idx + 1 ? '#0f172a' : '#94a3b8',
                        fontSize: 10,
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 2,
                      }}
                    >
                      {idx + 1}
                    </span>
                    <span style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>{nivel}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Botones de nivel */}
            <div style={{ display: 'flex', gap: 6 }}>
              {[1, 2, 3, 4, 5].map((n) => {
                const active = selecciones[f.key] === n
                return (
                  <button
                    key={n}
                    onClick={() => handleSelect(f.key, n)}
                    style={{
                      flex: 1,
                      height: 44,
                      borderRadius: 10,
                      border: `2px solid ${active ? '#22c55e' : 'rgba(148,163,184,0.2)'}`,
                      background: active
                        ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                        : 'rgba(15,23,42,0.4)',
                      color: active ? '#0f172a' : '#94a3b8',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      boxShadow: active
                        ? '0 2px 12px rgba(34,197,94,0.35)'
                        : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.borderColor = 'rgba(34,197,94,0.5)'
                        e.currentTarget.style.color = '#e2e8f0'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.borderColor = 'rgba(148,163,184,0.2)'
                        e.currentTarget.style.color = '#94a3b8'
                      }
                    }}
                  >
                    {n}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Botón calcular */}
      <button
        onClick={calcular}
        style={{
          width: '100%',
          padding: '16px 24px',
          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
          color: '#0f172a',
          border: 'none',
          borderRadius: 14,
          fontSize: 16,
          fontWeight: 800,
          cursor: 'pointer',
          marginTop: 8,
          transition: 'all 0.2s',
          boxShadow: '0 4px 20px rgba(34,197,94,0.25)',
          letterSpacing: '-0.3px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(34,197,94,0.4)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(34,197,94,0.25)'
        }}
      >
        Calcular mi posición en el mercado
      </button>

      {/* Resultados */}
      {resultado && (
        <div id="resultado" className="animate-fade-in" style={{ marginTop: 32 }}>
          {/* Score Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(79,70,229,0.1) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: 20,
              padding: 32,
              textAlign: 'center',
              marginBottom: 20,
              border: '1px solid rgba(34,197,94,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              animation: 'pulse-glow 3s infinite',
            }}
          >
            <div style={{ fontSize: 14, color: '#22c55e', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 2 }}>
              Tu Score Pulso
            </div>
            <div style={{ fontSize: 56, fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>
              {resultado.score}
            </div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 6 }}>
              de 500 puntos posibles
            </div>
          </div>

          {/* Cargo */}
          <div
            style={{
              background: 'var(--glass)',
              backdropFilter: 'blur(20px)',
              borderRadius: 16,
              padding: 24,
              marginBottom: 16,
              border: '1px solid var(--border)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>
              Cargo homologado Codify
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#f8fafc', marginTop: 6 }}>
              {resultado.cargo.name}
            </div>
            <span
              style={{
                display: 'inline-block',
                background: 'rgba(34,197,94,0.15)',
                color: '#22c55e',
                fontSize: 12,
                fontWeight: 700,
                padding: '6px 14px',
                borderRadius: 20,
                marginTop: 10,
                border: '1px solid rgba(34,197,94,0.2)',
              }}
            >
              {resultado.cargo.grade}
            </span>
          </div>

          {/* Bandas */}
          <div
            style={{
              background: 'var(--glass)',
              backdropFilter: 'blur(20px)',
              borderRadius: 16,
              padding: 24,
              border: '1px solid var(--border)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc', marginBottom: 16 }}>
              Banda salarial de mercado
            </div>
            {[
              { label: 'P25 — Bajo', val: resultado.cargo.p25, highlight: false, color: '#ef4444' },
              { label: 'P50 — Mediana', val: resultado.cargo.p50, highlight: true, color: '#22c55e' },
              { label: 'P75 — Competitivo', val: resultado.cargo.p75, highlight: false, color: '#3b82f6' },
              { label: 'P90 — Top', val: resultado.cargo.p90, highlight: false, color: '#a855f7' },
            ].map((row) => (
              <div
                key={row.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: '1px solid rgba(148,163,184,0.1)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: row.color,
                      boxShadow: `0 0 8px ${row.color}`,
                    }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 600, color: row.highlight ? '#f8fafc' : '#94a3b8' }}>
                    {row.label}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: row.highlight ? 18 : 15,
                    fontWeight: 800,
                    color: row.highlight ? '#22c55e' : '#f8fafc',
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
                background: 'rgba(245,158,11,0.1)',
                borderLeft: '3px solid #f59e0b',
                padding: '16px 20px',
                borderRadius: '0 12px 12px 0',
                marginTop: 16,
                fontSize: 13,
                color: '#fbbf24',
                lineHeight: 1.6,
                backdropFilter: 'blur(10px)',
              }}
            >
              <strong>💡 Oportunidad detectada:</strong> Si subes{' '}
              <strong>{resultado.debiles.join(', ')}</strong> al nivel 3 o superior, tu cargo se
              rehomologaría a uno de grado superior, aumentando tu banda salarial entre un 25-40%.
            </div>
          )}

          {/* Certificado */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              borderRadius: 16,
              padding: 28,
              marginTop: 20,
              textAlign: 'center',
              border: '1px solid rgba(34,197,94,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)',
              }}
            />
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏅</div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: '#22c55e',
                opacity: 0.8,
              }}
            >
              Certificado Codify Individual
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginTop: 8 }}>
              {resultado.cargo.name}
            </div>
            <div
              style={{
                fontSize: 10,
                color: '#475569',
                marginTop: 12,
                fontFamily: 'monospace',
                letterSpacing: 1,
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
