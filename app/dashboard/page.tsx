'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import ChatWindow from '@/components/ChatWindow'

// ==================== CONSTANTS ====================
const GENDERS = ['Femenino', 'Masculino', 'Otra identidad de género', 'Prefiero no decir']
const REGIONS = ['Metropolitana', 'Valparaíso', 'Biobío', 'La Araucanía']
const EDUCATIONS = ['Ingeniería en Informática', 'Ingeniería Comercial', 'Contador', 'Abogado', 'Otro']
const INDUSTRIES = ['Tecnología', 'Finanzas', 'Retail', 'Logística', 'Legal', 'RRHH', 'Marketing']
const COMPANY_SIZES = ['Micro (1-9)', 'Pequeña (10-49)', 'Mediana (50-149)', 'Grande (200-500)', 'Corporativo (500+)']
const CONTRACT_TYPES = ['Indefinido', 'Plazo Fijo', 'Honorarios', 'Subcontratación', 'Otro']
const WORK_MODALITIES = ['Presencial', 'Híbrido', 'Remoto']
const SKILLS_BY_CATEGORY = {
  'Tech': ['Python', 'JavaScript', 'SQL', 'React', 'AWS', 'Docker'],
  'Data & Analytics': ['Excel', 'Power BI', 'Tableau', 'Google Analytics'],
  'Finanzas': ['Financial Modeling', 'SAP Finance', 'Treasury Management'],
  'Transversal': ['Agile/Scrum', 'Project Management', 'Liderazgo'],
}

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 'resultado'

interface UserForm {
  edad?: number
  genero?: string
  region?: string
  educacion?: string
  anos_experiencia?: number
  industria?: string
  tamano_empresa?: string
  anos_empresa?: number
  cargo?: string
  anos_cargo?: number
  modalidad?: string
  tipo_contrato?: string
  salario_bruto?: number
  habilidades_tecnicas?: string[]
  soft_skills?: Record<string, number>
}

// ==================== STEP 1 ====================
function Step1Basic({ form, updateForm, onNext }: any) {
  return (
    <div style={{ background: '#16213e', borderRadius: '12px', padding: '30px', border: '1px solid #16213e' }}>
      <h2 style={{ color: '#00d084', marginBottom: '20px', fontSize: '18px' }}>Paso 1 de 8: Datos Básicos</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Edad</label>
          <input type="number" min="18" max="70" value={form.edad || ''} onChange={(e) => updateForm('edad', parseInt(e.target.value))} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #16213e', backgroundColor: '#1a1a2e', color: '#fff' }} />
        </div>
        <div>
          <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Género</label>
          <select value={form.genero || ''} onChange={(e) => updateForm('genero', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #16213e', backgroundColor: '#1a1a2e', color: '#fff' }}>
            <option value="">Selecciona...</option>
            {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Región</label>
          <select value={form.region || ''} onChange={(e) => updateForm('region', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #16213e', backgroundColor: '#1a1a2e', color: '#fff' }}>
            <option value="">Selecciona...</option>
            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>
      <button onClick={onNext} disabled={!form.edad || !form.genero || !form.region} style={{ width: '100%', padding: '12px', marginTop: '20px', backgroundColor: form.edad && form.genero && form.region ? '#00d084' : '#666', color: '#1a1a2e', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Siguiente →</button>
    </div>
  )
}

// ==================== STEP 2 ====================
function Step2Education({ form, updateForm, onNext, onBack }: any) {
  return (
    <div style={{ background: '#16213e', borderRadius: '12px', padding: '30px', border: '1px solid #16213e' }}>
      <h2 style={{ color: '#00d084', marginBottom: '20px', fontSize: '18px' }}>Paso 2 de 8: Educación</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <select value={form.educacion || ''} onChange={(e) => updateForm('educacion', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #16213e', backgroundColor: '#1a1a2e', color: '#fff' }}>
          <option value="">Selecciona tu carrera...</option>
          {EDUCATIONS.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>
      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '12px', backgroundColor: '#16213e', color: '#00d084', border: '1px solid #00d084', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>← Atrás</button>
        <button onClick={onNext} disabled={!form.educacion} style={{ flex: 1, padding: '12px', backgroundColor: form.educacion ? '#00d084' : '#666', color: '#1a1a2e', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Siguiente →</button>
      </div>
    </div>
  )
}

// ==================== STEP 3 ====================
function Step3Experience({ form, updateForm, onNext, onBack }: any) {
  return (
    <div style={{ background: '#16213e', borderRadius: '12px', padding: '30px', border: '1px solid #16213e' }}>
      <h2 style={{ color: '#00d084', marginBottom: '20px', fontSize: '18px' }}>Paso 3 de 8: Experiencia</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: '8px' }}>Años: {form.anos_experiencia || 0}</label>
          <input type="range" min="0" max="50" value={form.anos_experiencia || 0} onChange={(e) => updateForm('anos_experiencia', parseInt(e.target.value))} style={{ width: '100%' }} />
        </div>
        <select value={form.industria || ''} onChange={(e) => updateForm('industria', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #16213e', backgroundColor: '#1a1a2e', color: '#fff' }}>
          <option value="">Selecciona industria...</option>
          {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
      </div>
      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '12px', backgroundColor: '#16213e', color: '#00d084', border: '1px solid #00d084', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>← Atrás</button>
        <button onClick={onNext} disabled={!form.industria} style={{ flex: 1, padding: '12px', backgroundColor: form.industria ? '#00d084' : '#666', color: '#1a1a2e', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Siguiente →</button>
      </div>
    </div>
  )
}

// ==================== STEP 4 ====================
function Step4Company({ form, updateForm, onNext, onBack }: any) {
  return (
    <div style={{ background: '#16213e', borderRadius: '12px', padding: '30px', border: '1px solid #16213e' }}>
      <h2 style={{ color: '#00d084', marginBottom: '20px', fontSize: '18px' }}>Paso 4 de 8: Empresa</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <select value={form.tamano_empresa || ''} onChange={(e) => updateForm('tamano_empresa', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #16213e', backgroundColor: '#1a1a2e', color: '#fff' }}>
          <option value="">Selecciona tamaño...</option>
          {COMPANY_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <div>
          <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: '8px' }}>Años en empresa: {form.anos_empresa || 0}</label>
          <input type="range" min="0" max="40" value={form.anos_empresa || 0} onChange={(e) => updateForm('anos_empresa', parseInt(e.target.value))} style={{ width: '100%' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '12px', backgroundColor: '#16213e', color: '#00d084', border: '1px solid #00d084', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>← Atrás</button>
        <button onClick={onNext} disabled={!form.tamano_empresa} style={{ flex: 1, padding: '12px', backgroundColor: form.tamano_empresa ? '#00d084' : '#666', color: '#1a1a2e', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Siguiente →</button>
      </div>
    </div>
  )
}

// ==================== STEP 5 ====================
function Step5Job({ form, updateForm, onNext, onBack }: any) {
  return (
    <div style={{ background: '#16213e', borderRadius: '12px', padding: '30px', border: '1px solid #16213e' }}>
      <h2 style={{ color: '#00d084', marginBottom: '20px', fontSize: '18px' }}>Paso 5 de 8: Cargo</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <input type="text" placeholder="Tu cargo actual..." value={form.cargo || ''} onChange={(e) => updateForm('cargo', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #16213e', backgroundColor: '#1a1a2e', color: '#fff' }} />
        <div>
          <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: '8px' }}>Años en cargo: {form.anos_cargo || 0}</label>
          <input type="range" min="0" max="30" value={form.anos_cargo || 0} onChange={(e) => updateForm('anos_cargo', parseInt(e.target.value))} style={{ width: '100%' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '12px', backgroundColor: '#16213e', color: '#00d084', border: '1px solid #00d084', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>← Atrás</button>
        <button onClick={onNext} disabled={!form.cargo} style={{ flex: 1, padding: '12px', backgroundColor: form.cargo ? '#00d084' : '#666', color: '#1a1a2e', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Siguiente →</button>
      </div>
    </div>
  )
}

// ==================== STEP 6 ====================
function Step6WorkConditions({ form, updateForm, onNext, onBack }: any) {
  return (
    <div style={{ background: '#16213e', borderRadius: '12px', padding: '30px', border: '1px solid #16213e' }}>
      <h2 style={{ color: '#00d084', marginBottom: '20px', fontSize: '18px' }}>Paso 6 de 8: Condiciones de Trabajo</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <select value={form.modalidad || ''} onChange={(e) => updateForm('modalidad', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #16213e', backgroundColor: '#1a1a2e', color: '#fff' }}>
          <option value="">Modalidad...</option>
          {WORK_MODALITIES.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={form.tipo_contrato || ''} onChange={(e) => updateForm('tipo_contrato', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #16213e', backgroundColor: '#1a1a2e', color: '#fff' }}>
          <option value="">Tipo de contrato...</option>
          {CONTRACT_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '12px', backgroundColor: '#16213e', color: '#00d084', border: '1px solid #00d084', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>← Atrás</button>
        <button onClick={onNext} disabled={!form.modalidad || !form.tipo_contrato} style={{ flex: 1, padding: '12px', backgroundColor: form.modalidad && form.tipo_contrato ? '#00d084' : '#666', color: '#1a1a2e', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Siguiente →</button>
      </div>
    </div>
  )
}

// ==================== STEP 7 ====================
function Step7Skills({ form, updateForm, onNext, onBack }: any) {
  const selectedSkills = form.habilidades_tecnicas || []

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      updateForm('habilidades_tecnicas', selectedSkills.filter((s: string) => s !== skill))
    } else {
      updateForm('habilidades_tecnicas', [...selectedSkills, skill])
    }
  }

  return (
    <div style={{ background: '#16213e', borderRadius: '12px', padding: '30px', border: '1px solid #16213e' }}>
      <h2 style={{ color: '#00d084', marginBottom: '20px', fontSize: '18px' }}>Paso 7 de 8: Skills</h2>
      <p style={{ color: '#aaa', marginBottom: '20px', fontSize: '13px' }}>{selectedSkills.length} seleccionadas</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {Object.entries(SKILLS_BY_CATEGORY).map(([category, skills]) => (
          <div key={category}>
            <div style={{ color: '#00d084', fontWeight: '600', marginBottom: '8px' }}>{category}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {skills.map((skill) => {
                const isSelected = selectedSkills.includes(skill)
                return (
                  <button key={skill} onClick={() => toggleSkill(skill)} style={{ padding: '8px 12px', borderRadius: '6px', backgroundColor: isSelected ? '#00d084' : '#16213e', color: isSelected ? '#1a1a2e' : '#00d084', border: isSelected ? 'none' : '1px solid #00d084', cursor: 'pointer', fontSize: '12px', fontWeight: isSelected ? '600' : '400' }}>
                    {isSelected ? '✓ ' : ''}{skill}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '12px', backgroundColor: '#16213e', color: '#00d084', border: '1px solid #00d084', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>← Atrás</button>
        <button onClick={onNext} style={{ flex: 1, padding: '12px', backgroundColor: '#00d084', color: '#1a1a2e', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Siguiente →</button>
      </div>
    </div>
  )
}

// ==================== STEP 8 ====================
function Step8SoftSkills({ form, updateForm, onNext, onBack }: any) {
  const softSkillsOptions = [
    { key: 'liderazgo', label: 'Liderazgo' },
    { key: 'comunicacion', label: 'Comunicación' },
    { key: 'negociacion', label: 'Negociación' },
    { key: 'resolucion_problemas', label: 'Resolución de problemas' },
  ]

  const updateSoftSkill = (key: string, value: number) => {
    updateForm('soft_skills', { ...form.soft_skills, [key]: value })
  }

  return (
    <div style={{ background: '#16213e', borderRadius: '12px', padding: '30px', border: '1px solid #16213e' }}>
      <h2 style={{ color: '#00d084', marginBottom: '20px', fontSize: '18px' }}>Paso 8 de 8: Competencias Blandas</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {softSkillsOptions.map((s) => (
          <div key={s.key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#94a3b8' }}>{s.label}</label>
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#00d084' }}>{form.soft_skills?.[s.key] || 5}/10</span>
            </div>
            <input type="range" min={1} max={10} value={form.soft_skills?.[s.key] || 5} onChange={(e) => updateSoftSkill(s.key, parseInt(e.target.value))} style={{ width: '100%', accentColor: '#00d084' }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '12px', backgroundColor: '#16213e', color: '#00d084', border: '1px solid #00d084', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>← Atrás</button>
        <button onClick={onNext} style={{ flex: 1, padding: '12px', backgroundColor: '#00d084', color: '#1a1a2e', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Calcular →</button>
      </div>
    </div>
  )
}

// ==================== MAIN ====================
export default function Dashboard() {
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState<UserForm>({
    soft_skills: { liderazgo: 5, comunicacion: 5, negociacion: 5, resolucion_problemas: 5 },
  })
  const [resultado, setResultado] = useState<any>(null)
  const [user, setUser] = useState<any>({ id: 'test', email: 'test@example.com' })

  const updateForm = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCalcular = () => {
    setResultado({ score: 85, cargo: form.cargo })
    setStep('resultado')
  }

  const progress = step === 'resultado' ? 100 : ((step as number) / 8) * 100

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '24px 20px', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f8fafc', marginBottom: 8 }}>Pulso <span style={{ color: '#22c55e' }}>by Codify</span></h1>
      </div>

      {step !== 'resultado' && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ height: 6, background: 'rgba(148,163,184,0.15)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #22c55e, #16a34a)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 11, color: '#64748b' }}>Paso {step} de 8</span>
            <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 600 }}>{Math.round(progress)}%</span>
          </div>
        </div>
      )}

      {step === 1 && <Step1Basic form={form} updateForm={updateForm} onNext={() => setStep(2)} />}
      {step === 2 && <Step2Education form={form} updateForm={updateForm} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
      {step === 3 && <Step3Experience form={form} updateForm={updateForm} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
      {step === 4 && <Step4Company form={form} updateForm={updateForm} onNext={() => setStep(5)} onBack={() => setStep(3)} />}
      {step === 5 && <Step5Job form={form} updateForm={updateForm} onNext={() => setStep(6)} onBack={() => setStep(4)} />}
      {step === 6 && <Step6WorkConditions form={form} updateForm={updateForm} onNext={() => setStep(7)} onBack={() => setStep(5)} />}
      {step === 7 && <Step7Skills form={form} updateForm={updateForm} onNext={() => setStep(8)} onBack={() => setStep(6)} />}
{step === 8 && <Step8SoftSkills form={form} updateForm={updateForm} onNext={handleCalcular} onBack={() => setStep(7)} />}
{step === 'resultado' && analysisResults && (
  <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%)', padding: '40px 20px' }}>
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ background: 'linear-gradient(135deg, #16213e 0%, #0f3460 100%)', border: '2px solid #00d084', borderRadius: '16px', padding: '40px', marginBottom: '40px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0, 208, 132, 0.2)' }}>
        <p style={{ color: '#aaa', fontSize: '14px', margin: '0 0 20px 0' }}>Tu Puntuación Codify</p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', marginBottom: '30px' }}>
          <div style={{ position: 'relative', width: '120px', height: '120px' }}>
            <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle cx="60" cy="60" r="55" fill="none" stroke="#16213e" strokeWidth="8" />
              <circle cx="60" cy="60" r="55" fill="none" stroke="#00d084" strokeWidth="8" strokeDasharray={`${(analysisResults.score_total / 100) * 345} 345`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 2s ease-in-out', filter: 'drop-shadow(0 0 8px rgba(0, 208, 132, 0.5))' }} />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#00d084' }}>{analysisResults.score_total}</div>
              <div style={{ fontSize: '12px', color: '#aaa' }}>/100</div>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #00d084 0%, #00a85c 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0, 208, 132, 0.3)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', color: '#fff', marginBottom: '4px' }}>Grade</div>
                <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#fff' }}>{analysisResults.grade}</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #16213e' }}>
          <p style={{ color: '#00d084', fontSize: '16px', fontWeight: '600' }}>
            {analysisResults.score_total >= 80 ? '🌟 Excelente posicionamiento' : analysisResults.score_total >= 60 ? '✅ Buen desempeño' : analysisResults.score_total >= 40 ? '📈 Potencial de crecimiento' : '🚀 Oportunidad de desarrollo'}
          </p>
          <p style={{ color: '#aaa', fontSize: '13px', marginTop: '10px' }}>Cargo: {analysisResults.cargo_homologado} | Industria: {analysisResults.industria}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ background: '#16213e', border: '1px solid #16213e', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ color: '#00d084', marginBottom: '16px' }}>💰 Banda Salarial</h3>
          <div><p style={{ color: '#aaa', fontSize: '12px', margin: '0' }}>P25</p><p style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold', margin: '4px 0' }}>${(analysisResults.banda_p25 / 1000000).toFixed(1)}M</p></div>
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #16213e' }}><p style={{ color: '#aaa', fontSize: '12px', margin: '0' }}>P50 (Promedio)</p><p style={{ color: '#00d084', fontSize: '18px', fontWeight: 'bold', margin: '4px 0' }}>${(analysisResults.banda_p50 / 1000000).toFixed(1)}M</p></div>
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #16213e' }}><p style={{ color: '#aaa', fontSize: '12px', margin: '0' }}>P75</p><p style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold', margin: '4px 0' }}>${(analysisResults.banda_p75 / 1000000).toFixed(1)}M</p></div>
        </div>

        <div style={{ background: '#16213e', border: '1px solid #16213e', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ color: '#00d084', marginBottom: '16px' }}>📊 Tu Salario</h3>
          <p style={{ color: '#aaa', fontSize: '12px', margin: '0' }}>Salario Actual</p>
          <p style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold', margin: '8px 0' }}>${(analysisResults.salario_actual / 1000000).toFixed(1)}M</p>
          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #16213e' }}>
            <p style={{ color: '#aaa', fontSize: '12px', margin: '0' }}>Brecha vs P50</p>
            <p style={{ color: analysisResults.brecha_percentil < 0 ? '#ff6b6b' : '#00d084', fontSize: '18px', fontWeight: 'bold', margin: '8px 0' }}>
              {analysisResults.brecha_percentil > 0 ? '+' : ''}{analysisResults.brecha_percentil}%
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '40px', paddingBottom: '40px' }}>
        <h2 style={{ color: '#00d084', marginBottom: '16px', fontSize: '20px' }}>💬 Consultor Salarial con IA</h2>
        <p style={{ color: '#aaa', marginBottom: '16px', fontSize: '14px' }}>Haz preguntas sobre tu análisis.</p>
        <ChatWindow analysisData={{
          score_total: analysisResults.score_total,
          grade: analysisResults.grade,
          cargo_homologado: analysisResults.cargo_homologado,
          factor_scores: analysisResults.factor_scores,
          salario_actual: analysisResults.salario_actual,
          banda_p50: analysisResults.banda_p50,
          brecha_percentil: analysisResults.brecha_percentil,
          ultimo_cargo: analysisResults.ultimo_cargo,
          anos_experiencia: analysisResults.anos_experiencia,
          industria: analysisResults.industria,
        }} />
      </div>

      <div style={{ textAlign: 'center', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => { setAnalysisResults(null); setStep(1); setForm({ soft_skills: { comunicacion: 5, liderazgo: 5, resolucion_conflictos: 5, negociacion: 5, trabajo_equipo: 5 }, habilidades_tecnicas: [] }); }} style={{ padding: '12px 32px', backgroundColor: '#00d084', color: '#1a1a2e', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>← Nuevo Análisis</button>
        <button onClick={logout} style={{ padding: '12px 32px', backgroundColor: '#666', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>Salir</button>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}
