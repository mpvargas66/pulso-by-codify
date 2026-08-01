'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { calculateGrading, type ProfileInput, type FactorScores } from '@/lib/grading'
import ChatWindow from '@/components/ChatWindow'

type Step = 1 | 2 | 3 | 4 | 5 | 'resultado'

const REGIONES = ['Santiago', 'Valparaíso', 'Concepción', 'Biobío', 'La Araucanía', 'Antofagasta', 'Coquimbo', 'Otra']
const INDUSTRIAS = ['Tecnología', 'Finanzas', 'Consultoría', 'Retail', 'Logística', 'Energía', 'Salud', 'Educación', 'Construcción', 'Minería', 'Legal', 'Marketing', 'Otra']
const TAMANOS = ['Startup', 'Pequeña', 'Mediana', 'Grande']
const NIVELES_EDUCACION = ['Media', 'Técnico', 'Profesional', 'Magíster', 'Doctorado']
const LIDERAZGOS = ['No', 'Líder de proyecto', 'Gerente', 'Director']

function fmt(n: number) {
  return '$' + Math.round(n).toLocaleString('es-CL') + ' CLP/mes'
}

function RadarChart({ scores }: { scores: FactorScores }) {
  const factors = [
    { key: 'expertise_funcional', label: 'Expertise Funcional', color: '#22c55e' },
    { key: 'expertise_negocio', label: 'Expertise Negocio', color: '#3b82f6' },
    { key: 'influencia_liderazgo', label: 'Liderazgo', color: '#a855f7' },
    { key: 'resolucion_problemas', label: 'Problemas', color: '#f59e0b' },
    { key: 'naturaleza_impacto', label: 'Impacto', color: '#ef4444' },
    { key: 'alcance_impacto', label: 'Alcance', color: '#06b6d4' },
    { key: 'interaccion_comunicacion', label: 'Comunicación', color: '#ec4899' },
  ]

  const size = 280
  const center = size / 2
  const radius = 100
  const angleStep = (Math.PI * 2) / factors.length

  const points = factors.map((f, i) => {
    const angle = i * angleStep - Math.PI / 2
    const value = scores[f.key as keyof FactorScores] || 0
    const r = (value / 100) * radius
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      labelX: center + (radius + 28) * Math.cos(angle),
      labelY: center + (radius + 28) * Math.sin(angle),
      value,
      color: f.color,
      label: f.label,
    }
  })

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
      <svg width={size} height={size}>
        {/* Grid circles */}
        {[25, 50, 75, 100].map((pct) => (
          <circle key={pct} cx={center} cy={center} r={(pct / 100) * radius} fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth={1} />
        ))}
        {/* Axis lines */}
        {factors.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2
          const x2 = center + radius * Math.cos(angle)
          const y2 = center + radius * Math.sin(angle)
          return <line key={i} x1={center} y1={center} x2={x2} y2={y2} stroke="rgba(148,163,184,0.15)" strokeWidth={1} />
        })}
        {/* Data polygon */}
        <path d={pathD} fill="rgba(34,197,94,0.15)" stroke="#22c55e" strokeWidth={2} />
        {/* Points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={4} fill={p.color} stroke="white" strokeWidth={2} />
        ))}
        {/* Labels */}
        {points.map((p, i) => (
          <text key={`label-${i}`} x={p.labelX} y={p.labelY} textAnchor="middle" dominantBaseline="middle" fontSize={9} fill="#94a3b8" fontWeight={600}>
            {p.label}
          </text>
        ))}
      </svg>
    </div>
  )
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState<any>(null)
  const [historial, setHistorial] = useState<any[]>([])
  const [tab, setTab] = useState<'analisis' | 'historial'>('analisis')

  // Form state
  const [form, setForm] = useState<Partial<ProfileInput>>({
    habilidades_tecnicas: [],
    certificaciones: [],
    idiomas: [],
    soft_skills: { comunicacion: 5, negociacion: 5, empatia: 5, resolucion_conflictos: 5 },
    personas_a_cargo: 0,
  })

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login')
      else {
        setUser(user)
        cargarHistorial(user.id)
      }
    })
  }, [router])

  const cargarHistorial = async (uid: string) => {
    const supabase = createClient()
    const { data } = await supabase.from('analyses').select('*').eq('user_id', uid).order('created_at', { ascending: false })
    if (data) setHistorial(data)
  }

  const updateForm = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCalcular = async () => {
    setLoading(true)
    const input = form as ProfileInput
    const grading = calculateGrading(input)

    const supabase = createClient()
    await supabase.from('analyses').insert({
      user_id: user.id,
      score_total: grading.score_total,
      grade: grading.grade,
      cargo_homologado: grading.cargo_homologado,
      factor_scores: grading.factor_scores,
      p25: grading.brecha_salarial ? grading.brecha_salarial.sugerido * 0.7 : 0,
      p50: grading.brecha_salarial ? grading.brecha_salarial.sugerido : 0,
      p75: grading.brecha_salarial ? grading.brecha_salarial.sugerido * 1.3 : 0,
      p90: grading.brecha_salarial ? grading.brecha_salarial.sugerido * 1.7 : 0,
    })

    setResultado(grading)
    setStep('resultado')
    cargarHistorial(user.id)
    setLoading(false)
  }

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) return null

  const progress = step === 'resultado' ? 100 : ((step as number) / 5) * 100

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '24px 20px', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 4px 12px rgba(34,197,94,0.3)' }}>📊</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f8fafc' }}>Pulso <span style={{ color: '#22c55e' }}>by Codify</span></h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: '#64748b' }}>{user.email}</span>
          <button onClick={logout} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(148,163,184,0.2)', background: 'rgba(15,23,42,0.5)', color: '#94a3b8', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Salir</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'rgba(30,41,59,0.4)', padding: 4, borderRadius: 12, border: '1px solid rgba(148,163,184,0.1)' }}>
        <button onClick={() => setTab('analisis')} style={{ flex: 1, padding: '10px', borderRadius: 10, border: 'none', background: tab === 'analisis' ? 'rgba(34,197,94,0.2)' : 'transparent', color: tab === 'analisis' ? '#22c55e' : '#64748b', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Nuevo Análisis</button>
        <button onClick={() => setTab('historial')} style={{ flex: 1, padding: '10px', borderRadius: 10, border: 'none', background: tab === 'historial' ? 'rgba(34,197,94,0.2)' : 'transparent', color: tab === 'historial' ? '#22c55e' : '#64748b', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Historial ({historial.length})</button>
      </div>

      {tab === 'analisis' ? (
        <>
          {step !== 'resultado' && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ height: 6, background: 'rgba(148,163,184,0.15)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #22c55e, #16a34a)', borderRadius: 3, transition: 'width 0.3s' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <span style={{ fontSize: 11, color: '#64748b' }}>Paso {step} de 5</span>
                <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 600 }}>{Math.round(progress)}%</span>
              </div>
            </div>
          )}

          {step === 1 && <Step1DatosPersonales form={form} updateForm={updateForm} onNext={() => setStep(2)} />}
          {step === 2 && <Step2Experiencia form={form} updateForm={updateForm} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
          {step === 3 && <Step3CompetenciasTecnicas form={form} updateForm={updateForm} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
          {step === 4 && <Step4CompetenciasBlandas form={form} updateForm={updateForm} onNext={() => setStep(5)} onBack={() => setStep(3)} />}
          {step === 5 && <Step5Salario form={form} updateForm={updateForm} onCalcular={handleCalcular} onBack={() => setStep(4)} loading={loading} />}
          {step === 'resultado' && resultado && (
            <>
              <Resultado grading={resultado} onNuevo={() => { setStep(1); setResultado(null); setForm({ habilidades_tecnicas: [], certificaciones: [], idiomas: [], soft_skills: { comunicacion: 5, negociacion: 5, empatia: 5, resolucion_conflictos: 5 }, personas_a_cargo: 0 }); }} />

              {/* Chat Section */}
              <div style={{ marginTop: '40px', paddingBottom: '40px' }}>
                <h2 style={{ color: '#22c55e', marginBottom: '16px', fontSize: '20px' }}>
                  💬 Consultor Salarial con IA
                </h2>
                <p style={{ color: '#94a3b8', marginBottom: '16px', fontSize: '14px' }}>
                  Haz preguntas sobre tu análisis, negociación salarial o desarrollo de skills.
                </p>
                <ChatWindow analysisData={{
                  score_total: resultado.score_total,
                  grade: resultado.grade,
                  cargo_homologado: resultado.cargo_homologado,
                  factor_scores: resultado.factor_scores,
                  salario_actual: form.salario_actual || 0,
                  banda_p50: resultado.brecha_salarial?.sugerido || 0,
                  brecha_percentil: resultado.brecha_salarial?.percentil || 0,
                  ultimo_cargo: form.ultimo_cargo || '',
                  anos_experiencia: form.anos_experiencia || 0,
                  industria: form.industria || '',
                }} />
              </div>
            </>
          )}
        </>
      ) : (
        <div>
          {historial.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#64748b', fontSize: 14 }}>Aún no tienes análisis guardados.</div>
          ) : (
            historial.map((h) => (
              <div key={h.id} style={{ background: 'rgba(30,41,59,0.6)', backdropFilter: 'blur(20px)', borderRadius: 14, padding: 20, marginBottom: 12, border: '1px solid rgba(148,163,184,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc' }}>{h.cargo_homologado}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Grade {h.grade} · Score: {h.score_total}</div>
                  <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{new Date(h.created_at).toLocaleDateString('es-CL')}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#22c55e' }}>{fmt(h.p50)}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>P50</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </main>
  )
}

// ==================== PASO 1: DATOS PERSONALES ====================
function Step1DatosPersonales({ form, updateForm, onNext }: any) {
  return (
    <div style={{ background: 'rgba(30,41,59,0.6)', backdropFilter: 'blur(20px)', borderRadius: 16, padding: 24, border: '1px solid rgba(148,163,184,0.15)' }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 4 }}>Datos Personales</h2>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>Información básica para calibrar tu perfil</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={labelStyle}>Edad</label>
          <input type="number" min={18} max={70} value={form.edad || ''} onChange={e => updateForm('edad', parseInt(e.target.value))} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Nivel de Educación</label>
          <select value={form.nivel_educacion || ''} onChange={e => updateForm('nivel_educacion', e.target.value)} style={inputStyle}>
            <option value="">Selecciona...</option>
            {NIVELES_EDUCACION.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Región / Ciudad</label>
          <select value={form.region || ''} onChange={e => updateForm('region', e.target.value)} style={inputStyle}>
            <option value="">Selecciona...</option>
            {REGIONES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <button onClick={onNext} disabled={!form.edad || !form.nivel_educacion || !form.region} style={{ ...btnPrimary, marginTop: 20, opacity: (!form.edad || !form.nivel_educacion || !form.region) ? 0.5 : 1 }}>Siguiente →</button>
    </div>
  )
}

// ==================== PASO 2: EXPERIENCIA LABORAL ====================
function Step2Experiencia({ form, updateForm, onNext, onBack }: any) {
  return (
    <div style={{ background: 'rgba(30,41,59,0.6)', backdropFilter: 'blur(20px)', borderRadius: 16, padding: 24, border: '1px solid rgba(148,163,184,0.15)' }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 4 }}>Experiencia Laboral</h2>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>Tu trayectoria profesional</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={labelStyle}>Años totales de experiencia</label>
          <input type="number" min={0} max={50} value={form.anos_experiencia || ''} onChange={e => updateForm('anos_experiencia', parseInt(e.target.value))} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Nombre del último cargo</label>
          <input type="text" placeholder="Ej: Coordinador Logístico Comercial" value={form.ultimo_cargo || ''} onChange={e => updateForm('ultimo_cargo', e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Tiempo en el último empleo (meses)</label>
          <input type="number" min={0} max={360} value={form.tiempo_ultimo_empleo_meses || ''} onChange={e => updateForm('tiempo_ultimo_empleo_meses', parseInt(e.target.value))} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Industria / Sector</label>
          <select value={form.industria || ''} onChange={e => updateForm('industria', e.target.value)} style={inputStyle}>
            <option value="">Selecciona...</option>
            {INDUSTRIAS.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Tamaño de la empresa</label>
          <select value={form.tamano_empresa || ''} onChange={e => updateForm('tamano_empresa', e.target.value)} style={inputStyle}>
            <option value="">Selecciona...</option>
            {TAMANOS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button onClick={onBack} style={btnSecondary}>← Atrás</button>
        <button onClick={onNext} disabled={!form.anos_experiencia || !form.ultimo_cargo || !form.tiempo_ultimo_empleo_meses || !form.industria || !form.tamano_empresa} style={{ ...btnPrimary, flex: 1, opacity: (!form.anos_experiencia || !form.ultimo_cargo || !form.tiempo_ultimo_empleo_meses || !form.industria || !form.tamano_empresa) ? 0.5 : 1 }}>Siguiente →</button>
      </div>
    </div>
  )
}

// ==================== PASO 3: COMPETENCIAS TÉCNICAS ====================
const SKILLS_BY_INDUSTRY = {
  'Tech': [
    'Python', 'JavaScript/TypeScript', 'SQL', 'React', 'Java', 'C++',
    'Node.js', 'Vue.js', 'AWS', 'Docker', 'Kubernetes', 'Git/GitHub',
    'Machine Learning', 'TensorFlow', 'API Development'
  ],
  'Data & Analytics': [
    'Excel Avanzado', 'Power BI', 'Tableau', 'Google Analytics',
    'Looker Studio', 'Apache Spark', 'R Programming', 'SQL Avanzado'
  ],
  'Finanzas': [
    'Financial Modeling', 'SAP Finance', 'Treasury Management',
    'Risk Analysis', 'Valuación Empresarial', 'Compliance & Auditoría'
  ],
  'Logística & Supply Chain': [
    'SAP Logistics', 'Procurement', 'Inventory Management',
    'Forecasting', 'Transportation Management'
  ],
  'Ventas & Marketing': [
    'Salesforce', 'HubSpot', 'Estrategia Digital', 'SEO/SEM',
    'Email Marketing', 'B2B Sales', 'CRM Strategy'
  ],
  'Legal & Compliance': [
    'Contract Management', 'Due Diligence', 'Legal Tech',
    'Compliance Management', 'Risk Management'
  ],
  'Transversal': [
    'Agile/Scrum', 'Project Management', 'Liderazgo',
    'Comunicación Escrita', 'Negociación', 'Pensamiento Crítico',
    'Inglés Técnico', 'Power Automate'
  ]
};

function Step3CompetenciasTecnicas({ form, updateForm, onNext, onBack }: any) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Tech': true,
    'Data & Analytics': false,
    'Finanzas': false,
    'Logística & Supply Chain': false,
    'Ventas & Marketing': false,
    'Legal & Compliance': false,
    'Transversal': true,
  });

  const selectedSkills = form.habilidades_tecnicas || [];

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      updateForm('habilidades_tecnicas', selectedSkills.filter((s: string) => s !== skill));
    } else {
      updateForm('habilidades_tecnicas', [...selectedSkills, skill]);
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <div style={{ background: '#16213e', borderRadius: '12px', padding: '30px', border: '1px solid #16213e' }}>
      <h2 style={{ color: '#00d084', marginBottom: '20px', fontSize: '18px' }}>
        Paso 3: Skills & Competencias
      </h2>
      <p style={{ color: '#aaa', marginBottom: '24px', fontSize: '13px' }}>
        Selecciona las skills que posees. {selectedSkills.length} seleccionadas.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {Object.entries(SKILLS_BY_INDUSTRY).map(([category, skills]) => (
          <div key={category} style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #16213e', backgroundColor: '#0f3460' }}>
            {/* Category Header */}
            <div
              onClick={() => toggleCategory(category)}
              style={{
                padding: '14px 16px',
                backgroundColor: '#16213e',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                userSelect: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#00d084', fontSize: '16px' }}>
                  {expandedCategories[category] ? '▼' : '▶'}
                </span>
                <span style={{ color: '#00d084', fontWeight: '600', fontSize: '14px' }}>
                  {category}
                </span>
              </div>
              <span style={{ color: '#666', fontSize: '12px' }}>
                {skills.filter((s) => selectedSkills.includes(s)).length}/{skills.length}
              </span>
            </div>

            {/* Skills Grid */}
            {expandedCategories[category] && (
              <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                {skills.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <label
                      key={skill}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        backgroundColor: isSelected ? 'rgba(0, 208, 132, 0.15)' : 'rgba(30, 41, 59, 0.6)',
                        border: isSelected ? '1px solid #00d084' : '1px solid #16213e',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = isSelected
                          ? 'rgba(0, 208, 132, 0.25)'
                          : 'rgba(30, 41, 59, 0.9)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = isSelected
                          ? 'rgba(0, 208, 132, 0.15)'
                          : 'rgba(30, 41, 59, 0.6)';
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSkill(skill)}
                        style={{
                          width: '18px',
                          height: '18px',
                          accentColor: '#00d084',
                          cursor: 'pointer',
                        }}
                      />
                      <span
                        style={{
                          color: isSelected ? '#00d084' : '#aaa',
                          fontSize: '13px',
                          fontWeight: isSelected ? '600' : '400',
                        }}
                      >
                        {skill}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '12px', backgroundColor: '#16213e', color: '#00d084', border: '1px solid #00d084', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          ← Atrás
        </button>
        <button onClick={onNext} style={{ flex: 1, padding: '12px', backgroundColor: '#00d084', color: '#1a1a2e', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          Siguiente →
        </button>
      </div>
    </div>
  );
}

// ==================== PASO 4: COMPETENCIAS BLANDAS ====================
function Step4CompetenciasBlandas({ form, updateForm, onNext, onBack }: any) {
  const updateSoft = (key: string, val: number) => {
    updateForm('soft_skills', { ...form.soft_skills, [key]: val })
  }

  const sliders = [
    { key: 'comunicacion', label: 'Comunicación' },
    { key: 'negociacion', label: 'Negociación' },
    { key: 'empatia', label: 'Empatía' },
    { key: 'resolucion_conflictos', label: 'Resolución de conflictos' },
  ]

  return (
    <div style={{ background: 'rgba(30,41,59,0.6)', backdropFilter: 'blur(20px)', borderRadius: 16, padding: 24, border: '1px solid rgba(148,163,184,0.15)' }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 4 }}>Competencias Blandas</h2>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>Autoevalúate del 1 al 10</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {sliders.map((s) => (
          <div key={s.key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>{s.label}</label>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#22c55e' }}>{form.soft_skills?.[s.key] || 5}/10</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={form.soft_skills?.[s.key] || 5}
              onChange={e => updateSoft(s.key, parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#22c55e' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#475569', marginTop: 2 }}>
              <span>Básico</span><span>Intermedio</span><span>Avanzado</span><span>Experto</span>
            </div>
          </div>
        ))}

        <div style={{ borderTop: '1px solid rgba(148,163,184,0.1)', paddingTop: 16 }}>
          <label style={labelStyle}>Experiencia en liderazgo</label>
          <select value={form.liderazgo_experiencia || ''} onChange={e => updateForm('liderazgo_experiencia', e.target.value)} style={inputStyle}>
            <option value="">Selecciona...</option>
            {LIDERAZGOS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Personas a cargo (si aplica)</label>
          <input type="number" min={0} max={100} value={form.personas_a_cargo || 0} onChange={e => updateForm('personas_a_cargo', parseInt(e.target.value))} style={inputStyle} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button onClick={onBack} style={btnSecondary}>← Atrás</button>
        <button onClick={onNext} disabled={!form.liderazgo_experiencia} style={{ ...btnPrimary, flex: 1, opacity: !form.liderazgo_experiencia ? 0.5 : 1 }}>Siguiente →</button>
      </div>
    </div>
  )
}

// ==================== PASO 5: SALARIO ====================
function Step5Salario({ form, updateForm, onCalcular, onBack, loading }: any) {
  return (
    <div style={{ background: 'rgba(30,41,59,0.6)', backdropFilter: 'blur(20px)', borderRadius: 16, padding: 24, border: '1px solid rgba(148,163,184,0.15)' }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 4 }}>Salario</h2>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>Para calcular tu brecha vs el mercado</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={labelStyle}>Salario actual bruto (CLP/mes)</label>
          <input type="number" min={0} placeholder="3200000" value={form.salario_actual || ''} onChange={e => updateForm('salario_actual', parseInt(e.target.value))} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Expectativa salarial (opcional)</label>
          <input type="number" min={0} placeholder="5200000" value={form.expectativa_salarial || ''} onChange={e => updateForm('expectativa_salarial', parseInt(e.target.value))} style={inputStyle} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button onClick={onBack} style={btnSecondary}>← Atrás</button>
        <button onClick={onCalcular} disabled={loading || !form.salario_actual} style={{ ...btnPrimary, flex: 1, opacity: (loading || !form.salario_actual) ? 0.5 : 1 }}>
          {loading ? 'Calculando...' : '📊 Calcular mi posición'}
        </button>
      </div>
    </div>
  )
}

// ==================== RESULTADO ====================
function Resultado({ grading, onNuevo }: { grading: any, onNuevo: () => void }) {
  const g = grading
  const banda = g.brecha_salarial ? {
    p25: Math.round(g.brecha_salarial.sugerido * 0.7),
    p50: g.brecha_salarial.sugerido,
    p75: Math.round(g.brecha_salarial.sugerido * 1.3),
    p90: Math.round(g.brecha_salarial.sugerido * 1.7),
  } : { p25: 0, p50: 0, p75: 0, p90: 0 }

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`}</style>

      {/* Score */}
      <div style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(79,70,229,0.1) 100%)', backdropFilter: 'blur(20px)', borderRadius: 20, padding: 32, textAlign: 'center', marginBottom: 20, border: '1px solid rgba(34,197,94,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        <div style={{ fontSize: 14, color: '#22c55e', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 2 }}>Tu Score Pulso</div>
        <div style={{ fontSize: 56, fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>{g.score_total}</div>
        <div style={{ fontSize: 13, color: '#64748b', marginTop: 6 }}>Grade {g.grade} · {g.cargo_homologado}</div>
      </div>

      {/* Radar Chart */}
      <div style={{ background: 'rgba(30,41,59,0.6)', backdropFilter: 'blur(20px)', borderRadius: 16, padding: 24, marginBottom: 16, border: '1px solid rgba(148,163,184,0.15)' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', textAlign: 'center', marginBottom: 16 }}>Perfil por Factores</div>
        <RadarChart scores={g.factor_scores} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {Object.entries(g.factor_scores).map(([key, val]: [string, any]) => {
            const labels: Record<string, string> = {
              expertise_funcional: 'Expertise Funcional',
              expertise_negocio: 'Expertise Negocio',
              influencia_liderazgo: 'Liderazgo',
              resolucion_problemas: 'Resolución Problemas',
              naturaleza_impacto: 'Naturaleza Impacto',
              alcance_impacto: 'Alcance Impacto',
              interaccion_comunicacion: 'Comunicación',
            }
            return (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '6px 0', borderBottom: '1px solid rgba(148,163,184,0.08)' }}>
                <span style={{ color: '#94a3b8' }}>{labels[key]}</span>
                <span style={{ color: '#f8fafc', fontWeight: 700 }}>{Math.round(val)}/100</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Cargo */}
      <div style={{ background: 'rgba(30,41,59,0.6)', backdropFilter: 'blur(20px)', borderRadius: 16, padding: 24, marginBottom: 16, border: '1px solid rgba(148,163,184,0.15)' }}>
        <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>Cargo homologado Codify</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#f8fafc', marginTop: 6 }}>{g.cargo_homologado}</div>
        <span style={{ display: 'inline-block', background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 20, marginTop: 10, border: '1px solid rgba(34,197,94,0.2)' }}>Grade {g.grade}</span>
      </div>

      {/* Banda */}
      <div style={{ background: 'rgba(30,41,59,0.6)', backdropFilter: 'blur(20px)', borderRadius: 16, padding: 24, border: '1px solid rgba(148,163,184,0.15)', marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc', marginBottom: 16 }}>Banda salarial de mercado</div>
        {[
          { label: 'P25 — Bajo', val: banda.p25, color: '#ef4444' },
          { label: 'P50 — Mediana', val: banda.p50, color: '#22c55e', highlight: true },
          { label: 'P75 — Competitivo', val: banda.p75, color: '#3b82f6' },
          { label: 'P90 — Top', val: banda.p90, color: '#a855f7' },
        ].map((row) => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: row.color, boxShadow: `0 0 8px ${row.color}` }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: row.highlight ? '#f8fafc' : '#94a3b8' }}>{row.label}</span>
            </div>
            <span style={{ fontSize: row.highlight ? 18 : 15, fontWeight: 800, color: row.highlight ? '#22c55e' : '#f8fafc' }}>{fmt(row.val)}</span>
          </div>
        ))}
      </div>

      {/* Brecha */}
      {g.brecha_salarial && (
        <div style={{ background: 'rgba(245,158,11,0.1)', borderLeft: '3px solid #f59e0b', padding: '16px 20px', borderRadius: '0 12px 12px 0', marginBottom: 16, fontSize: 13, color: '#fbbf24', lineHeight: 1.6 }}>
          <strong>💡 Análisis de brecha:</strong> Tu salario actual está en el <strong>percentil {g.brecha_salarial.percentil}</strong> del mercado para tu grade.
          La banda mediana (P50) para tu posición es <strong>{fmt(g.brecha_salarial.sugerido)}</strong>.
        </div>
      )}

      {/* Certificado */}
      <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: 16, padding: 28, marginTop: 20, textAlign: 'center', border: '1px solid rgba(34,197,94,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', position: 'relative', overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)' }} />
        <div style={{ fontSize: 40, marginBottom: 12 }}>🏅</div>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', color: '#22c55e', opacity: 0.8 }}>Certificado Codify Individual</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginTop: 8 }}>{g.cargo_homologado}</div>
        <div style={{ fontSize: 10, color: '#475569', marginTop: 12, fontFamily: 'monospace', letterSpacing: 1 }}>ID: PULSO-{g.grade}-{g.score_total}-{Date.now().toString(36).slice(-4).toUpperCase()}</div>
      </div>

      <button onClick={onNuevo} style={{ width: '100%', padding: '14px 24px', background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', color: '#0f172a', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 20px rgba(34,197,94,0.25)' }}>
        Nuevo análisis
      </button>
    </div>
  )
}

// ==================== ESTILOS ====================
const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }
const inputStyle = { width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(148,163,184,0.2)', background: 'rgba(15,23,42,0.5)', color: '#f8fafc', fontSize: 14, outline: 'none' }
const btnPrimary = { padding: '12px 20px', background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', color: '#0f172a', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: 'pointer' }
const btnSecondary = { padding: '12px 20px', background: 'rgba(30,41,59,0.6)', color: '#94a3b8', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer' }
