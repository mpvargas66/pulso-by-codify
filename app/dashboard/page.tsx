'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ChatWindow from '@/components/ChatWindow';

function CustomSelect({ value, onChange, options, label, help, error }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <label style={{ color: '#0F172A', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
        {label}
        {help && <span style={{ color: '#64748B', fontSize: '11px', marginLeft: '4px' }}>{help}</span>}
      </label>
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '100%',
            padding: '12px',
            background: '#F8FAFC',
            color: '#BF057D',
            border: `1px solid ${error ? '#ff6b6b' : '#BF057D'}`,
            borderRadius: '8px',
            textAlign: 'left',
            fontSize: '14px',
            cursor: 'pointer',
            fontWeight: '500',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {options.find((o: any) => o.value === value)?.label || 'Selecciona...'}
          <span style={{ color: '#BF057D', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
        </button>

        {isOpen && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: '0',
            right: '0',
            background: '#F8FAFC',
            border: '1px solid #BF057D',
            borderRadius: '8px',
            zIndex: '10',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(191, 5, 125, 0.2)'
          }}>
            {options.map((opt: any) => (
              <div
                key={opt.value}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                style={{
                  padding: '12px',
                  cursor: 'pointer',
                  color: value === opt.value ? '#BF057D' : '#E8E4F4',
                  background: value === opt.value ? 'rgba(191, 5, 125, 0.1)' : 'transparent',
                  borderBottom: '1px solid rgba(191, 5, 125, 0.1)',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                  fontWeight: value === opt.value ? '500' : '400'
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(191, 5, 125, 0.1)'; e.currentTarget.style.color = '#BF057D'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = value === opt.value ? 'rgba(191, 5, 125, 0.1)' : 'transparent'; e.currentTarget.style.color = value === opt.value ? '#BF057D' : '#E8E4F4'; }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <div style={{ color: '#ff6b6b', fontSize: '11px', marginTop: '4px' }}>⚠️ {error}</div>}
    </div>
  );
}

const EDUCATIONS = ['Ingeniería en Informática', 'Ingeniería en Computación', 'Ingeniería en Sistemas', 'Ingeniería en Software', 'Ingeniería Comercial', 'Ingeniería Industrial', 'Técnico en Informática', 'Técnico en Programación', 'Administración de Empresas', 'Contador/a', 'Abogado/a', 'Especialista en RRHH', 'Especialista en Marketing', 'Especialista en Logística', 'Data Scientist', 'Product Manager', 'UX/UI Designer', 'Profesor/a'];

const INDUSTRIES = ['Tecnología', 'Finanzas', 'Retail', 'Logística & Supply Chain', 'Legal', 'Recursos Humanos', 'Marketing', 'Educación', 'Salud', 'Construcción', 'Energía', 'Minería'];

const JOBS_BY_INDUSTRY: Record<string, string[]> = {
  'Tecnología': ['Software Engineer', 'Frontend Engineer', 'Backend Engineer', 'Full Stack Engineer', 'DevOps Engineer', 'Cloud Architect', 'Product Manager', 'Data Scientist', 'Data Engineer', 'ML Engineer', 'AI Engineer', 'QA Engineer', 'QA Automation', 'Tech Lead', 'Engineering Manager', 'Security Engineer', 'Cybersecurity Analyst', 'Solutions Architect', 'System Administrator', 'Database Administrator', 'Network Engineer', 'IT Support', 'UX/UI Designer', 'Product Designer', 'UX Researcher', 'Scrum Master', 'Product Owner'],
  'Finanzas': ['Analista Financiero', 'Gerente Financiero', 'Controller', 'CFO', 'Trader', 'Analista Bursátil', 'Asesor Financiero', 'Especialista en Tesorería', 'Auditor', 'Contador/a', 'Especialista en Impuestos', 'Analista de Crédito', 'Risk Manager', 'Investment Banker', 'Analista de Cartera', 'Especialista en Seguros'],
  'Retail': ['Gerente de Tienda', 'Sub-Gerente', 'Coordinador de Tienda', 'Vendedor/a', 'Merchandiser', 'Visual Merchandiser', 'Cajero/a', 'Recepcionista', 'Gerente de Operaciones', 'Especialista en Inventario', 'Gerente de Categoría'],
  'Logística & Supply Chain': ['Coordinador Logístico', 'Gerente de Logística', 'Especialista en Procurement', 'Jefe de Almacén', 'Operario de Almacén', 'Especialista en Distribución', 'Planificador de Demanda', 'Supply Chain Manager', 'Especialista en Aduanas', 'Traffic Manager', 'Especialista en Transporte', 'Analista Logístico'],
  'Legal': ['Abogado/a Junior', 'Abogado/a Senior', 'General Counsel', 'Asesor Legal', 'Especialista en Cumplimiento', 'Notario/a', 'Procurador/a', 'Abogado/a Corporativo', 'Abogado/a Laboral', 'Abogado/a Litigante', 'Abogado/a Tributario', 'Mediador/a'],
  'Recursos Humanos': ['Especialista en RRHH', 'Gerente de RRHH', 'Especialista en Reclutamiento', 'Jefe de Reclutamiento', 'Especialista en Compensación', 'Especialista en Capacitación', 'Coordinador/a de Recursos Humanos', 'HR Business Partner', 'Especialista en Cultura', 'Especialista en Relaciones Laborales', 'Psicólogo/a Organizacional'],
  'Marketing': ['Especialista en Marketing', 'Gerente de Marketing', 'Community Manager', 'Social Media Manager', 'Content Manager', 'Especialista SEO/SEM', 'Marketing Manager', 'Brand Manager', 'Product Marketing Manager', 'Marketing Analytics', 'Especialista en Email Marketing', 'Growth Manager', 'Marketing Operations'],
  'Educación': ['Profesor/a', 'Capacitador/a', 'Instructor/a', 'Director de Carrera', 'Coordinador/a Académico', 'Diseñador Instruccional', 'Especialista en E-Learning', 'Tutor/a', 'Jefe de Estudios', 'Rector/a', 'Vicerrector/a'],
  'Salud': ['Médico/a General', 'Médico/a Especialista', 'Cirujano/a', 'Pediatra', 'Internista', 'Cardiólogo/a', 'Neurólogo/a', 'Psiquiatra', 'Dermatólogo/a', 'Oftalmólogo/a', 'Otorrinolaringólogo/a', 'Enfermero/a', 'Enfermero/a Especialista', 'Dentista', 'Higienista Dental', 'Psicólogo/a', 'Fisioterapeuta', 'Kinesiólogo/a', 'Nutricionista', 'Farmacéutico/a', 'Técnico en Salud', 'Paramédico/a', 'Especialista en Seguridad Ocupacional', 'Coordinador/a de Salud', 'Médico/a Forense'],
  'Construcción': ['Ingeniero de Proyecto', 'Supervisor de Obras', 'Jefe de Proyecto', 'Maestro de Obra', 'Capataz', 'Arquitecto', 'Arquitecto Técnico', 'Especialista en HSE', 'Topógrafo', 'Calculista', 'Inspector de Obras', 'Especialista en Estructuras'],
  'Energía': ['Ingeniero de Operaciones', 'Gestor de Energía', 'Especialista en HSE', 'Técnico de Mantenimiento', 'Operario', 'Ingeniero de Proyectos', 'Especialista en Sostenibilidad', 'Especialista en Eficiencia Energética', 'Electricista Industrial'],
  'Minería': ['Ingeniero de Mina', 'Supervisor de Mina', 'Gestor de Procesos', 'Técnico de Mina', 'Especialista en Seguridad', 'Operario de Mina', 'Ingeniero de Ventilación', 'Geólogo', 'Especialista en Medio Ambiente'],
};

const REGIONS = ['Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 'Coquimbo', 'Valparaíso', 'Metropolitana', 'Libertador General Bernardo O\'Higgins', 'Maule', 'Ñuble', 'Biobío', 'La Araucanía', 'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes'];

const EDUCATION_LEVELS = [
  { value: 'basica', label: 'Educación Básica' },
  { value: 'media', label: 'Educación Media (Secundaria)' },
  { value: 'tecnico', label: 'Técnico (2-3 años)' },
  { value: 'profesional', label: 'Profesional/Licenciado (4+ años)' },
  { value: 'magister', label: 'Magister' },
  { value: 'doctorado', label: 'Doctorado' },
];

const CONTRACT_TYPES = ['Indefinido', 'Plazo Fijo', 'Honorarios', 'Artículo 22', 'Otro'];
const COMPANY_SIZES = [{ value: 'Micro', label: 'Micro (1-9)' }, { value: 'Pequeña', label: 'Pequeña (10-49)' }, { value: 'Mediana', label: 'Mediana (50-149)' }, { value: 'Grande', label: 'Grande (200-500)' }, { value: 'Corporativo', label: 'Corporativo (500+)' }];
const WORK_MODALITIES = ['Presencial', 'Híbrido', 'Remoto'];
const GENDERS = ['Femenino', 'Masculino', 'Otra identidad de género', 'Prefiero no decir'];

const formatSalary = (value: number | string): string => {
  if (!value) return '';
  const num = typeof value === 'string' ? parseInt(value.replace(/\D/g, '')) : value;
  return num.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const SKILLS_BY_CATEGORY: Record<string, string[]> = {
  'Tech': ['Python', 'JavaScript/TypeScript', 'SQL', 'React', 'Java', 'C++', 'Node.js', 'Vue.js', 'AWS', 'Docker', 'Kubernetes', 'Git/GitHub', 'Machine Learning', 'TensorFlow', 'API Development'],
  'Data & Analytics': ['Excel Avanzado', 'Power BI', 'Tableau', 'Google Analytics', 'Looker Studio', 'Apache Spark', 'R Programming', 'SQL Avanzado'],
  'Finanzas': ['Financial Modeling', 'SAP Finance', 'Treasury Management', 'Risk Analysis', 'Valuación Empresarial'],
  'Logística & Supply Chain': ['SAP Logistics', 'Procurement', 'Inventory Management', 'Forecasting', 'Transportation Management'],
  'Ventas & Marketing': ['Salesforce', 'HubSpot', 'Estrategia Digital', 'SEO/SEM', 'Email Marketing'],
  'Legal & Compliance': ['Contract Management', 'Due Diligence', 'Legal Tech', 'Compliance Management'],
  'Transversal': ['Agile/Scrum', 'Project Management', 'Liderazgo', 'Comunicación Escrita', 'Negociación', 'Pensamiento Crítico', 'Inglés Técnico'],
};

const FIELD_HELP = {
  edad: '💡 Tu edad actual (18-70 años)',
  genero: '💡 Selecciona tu identidad de género',
  region: '💡 Región donde trabajas actualmente',
  educacion: '💡 Tu formación académica más alta',
  anos_experiencia: '💡 Años totales trabajando en tu industria',
  industria: '💡 Industria principal donde trabajas',
  tamano_empresa: '💡 Número de empleados de tu empresa',
  anos_empresa: '💡 Tiempo que llevas en esta empresa',
  cargo: '💡 Tu cargo actual o último cargo',
  anos_cargo: '💡 Tiempo en este cargo',
  modalidad: '💡 Tipo de jornada (presencial/híbrido/remoto)',
  tipo_contrato: '💡 Tipo de contratación',
  salario_bruto: '💡 Sueldo mensual ANTES de impuestos',
  salario_liquido: '💡 Lo que recibes en tu cuenta cada mes',
};

const SKILLS_HELP = {
  'Tech': '💡 Lenguajes, frameworks y herramientas de programación',
  'Data & Analytics': '💡 Análisis de datos, business intelligence y reportes',
  'Finanzas': '💡 Modelos financieros, análisis y gestión',
  'Logística & Supply Chain': '💡 Procesos logísticos y supply chain',
  'Ventas & Marketing': '💡 Herramientas de CRM y marketing digital',
  'Legal & Compliance': '💡 Gestión legal y normativa',
  'Transversal': '💡 Habilidades aplicables en cualquier industria',
};

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 'resultado';

interface UserForm {
  edad?: number;
  genero?: string;
  region?: string;
  nivel_educacion?: string;
  educacion?: string;
  anos_experiencia?: number;
  industria?: string;
  tamano_empresa?: string;
  anos_empresa?: number;
  cargo?: string;
  anos_cargo?: number;
  modalidad?: string;
  tipo_contrato?: string;
  salario_bruto?: number;
  salario_liquido?: number;
  habilidades_tecnicas?: string[];
  soft_skills?: Record<string, number>;
}

interface AnalysisResult {
  score_total: number;
  grade: number;
  cargo_homologado: string;
  factor_scores: {
    expertise_funcional: number;
    expertise_negocio: number;
    influencia_liderazgo: number;
    resolucion_problemas: number;
    naturaleza_impacto: number;
    alcance_impacto: number;
    interaccion_comunicacion: number;
  };
  salario_actual: number;
  salario_p25: number;
  salario_p50: number;
  salario_p75: number;
  brecha_percentil: number;
  ultimo_cargo: string;
  anos_experiencia: number;
  industria: string;
}

const searchEducations = (query: string): string[] => {
  if (!query.trim()) return EDUCATIONS;
  const lower = query.toLowerCase();
  return EDUCATIONS.filter(e => e.toLowerCase().includes(lower)).slice(0, 10);
};

const searchJobs = (industry: string, query: string): string[] => {
  const jobs = JOBS_BY_INDUSTRY[industry] || [];
  if (!query.trim()) return jobs;
  const lower = query.toLowerCase();
  return jobs.filter(j => j.toLowerCase().includes(lower)).slice(0, 10);
};

function Step1Basic({ form, updateForm, onNext }: any) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.edad) newErrors.edad = 'Requerido';
    if (form.edad && (form.edad < 18 || form.edad > 99)) newErrors.edad = 'Debe estar entre 18-99';
    if (!form.genero) newErrors.genero = 'Requerido';
    if (!form.region) newErrors.region = 'Requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '30px', border: '1px solid #E2E8F0' }}>
      <h2 style={{ color: '#BF057D', marginBottom: '20px', fontSize: '18px' }}>Paso 1: Datos Básicos</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ color: '#0F172A', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
            Edad
            <span style={{ color: '#64748B', fontSize: '11px', marginLeft: '4px' }}>{FIELD_HELP.edad}</span>
          </label>
          <input
            type="number"
            min="18"
            max="99"
            value={form.edad || ''}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (!isNaN(val)) updateForm('edad', val);
            }}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: `1px solid ${errors.edad ? '#ff6b6b' : '#E2E8F0'}`,
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              fontSize: '14px'
            }}
          />
          {errors.edad && <div style={{ color: '#ff6b6b', fontSize: '11px', marginTop: '4px' }}>⚠️ {errors.edad}</div>}
        </div>
        <CustomSelect
          value={form.genero}
          onChange={(val: string) => updateForm('genero', val)}
          options={[{ value: '', label: 'Selecciona...' }, ...GENDERS.map(g => ({ value: g, label: g }))]}
          label="Género"
          help={FIELD_HELP.genero}
          error={errors.genero}
        />
        <CustomSelect
          value={form.region}
          onChange={(val: string) => updateForm('region', val)}
          options={[{ value: '', label: 'Selecciona...' }, ...REGIONS.map(r => ({ value: r, label: r }))]}
          label="Región"
          help={FIELD_HELP.region}
          error={errors.region}
        />
      </div>
      <button onClick={() => validate() && onNext()} style={{ width: '100%', padding: '12px', marginTop: '20px', backgroundColor: '#BF057D', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', opacity: Object.keys(errors).length > 0 ? 0.5 : 1 }}>Siguiente →</button>
    </div>
  );
}

function Step2Education({ form, updateForm, onNext, onBack }: any) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.nivel_educacion) newErrors.nivel_educacion = 'Requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '30px', border: '1px solid #E2E8F0' }}>
      <h2 style={{ color: '#BF057D', marginBottom: '20px', fontSize: '18px' }}>Paso 2: Nivel Educación</h2>
      <p style={{ color: '#0F172A', marginBottom: '24px', fontSize: '13px' }}>💡 Selecciona tu nivel educativo más alto</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {EDUCATION_LEVELS.map((level) => (
          <label
            key={level.value}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px',
              borderRadius: '8px',
              border: form.nivel_educacion === level.value ? '2px solid #BF057D' : '1px solid #16213e',
              backgroundColor: form.nivel_educacion === level.value ? 'rgba(191, 5, 125, 0.15)' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <input
              type="radio"
              name="nivel_educacion"
              value={level.value}
              checked={form.nivel_educacion === level.value}
              onChange={() => updateForm('nivel_educacion', level.value)}
              style={{ accentColor: '#BF057D', cursor: 'pointer' }}
            />
            <span style={{ color: form.nivel_educacion === level.value ? '#BF057D' : '#E8E4F4', fontWeight: form.nivel_educacion === level.value ? '600' : '400', fontSize: '14px' }}>
              {level.label}
            </span>
          </label>
        ))}
      </div>
      {errors.nivel_educacion && <div style={{ color: '#ff6b6b', fontSize: '11px', marginTop: '12px' }}>⚠️ {errors.nivel_educacion}</div>}
      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '12px', backgroundColor: '#F8FAFC', color: '#BF057D', border: '1px solid #BF057D', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>← Atrás</button>
        <button onClick={() => validate() && onNext()} style={{ flex: 1, padding: '12px', backgroundColor: '#BF057D', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', opacity: !form.nivel_educacion ? 0.5 : 1 }}>Siguiente →</button>
      </div>
    </div>
  );
}

function Step2Carrera({ form, updateForm, onNext, onBack }: any) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.educacion) newErrors.educacion = 'Requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '30px', border: '1px solid #E2E8F0' }}>
      <h2 style={{ color: '#BF057D', marginBottom: '20px', fontSize: '18px' }}>Paso 3: Carrera/Especialidad</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ color: '#0F172A', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
            Educación
            <span style={{ color: '#64748B', fontSize: '11px', marginLeft: '4px' }}>{FIELD_HELP.educacion}</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Busca tu carrera..."
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                const query = e.target.value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
                if (!query.trim()) {
                  setSuggestions([]);
                } else {
                  const allProfessions = Object.values(JOBS_BY_INDUSTRY).flat();
                  const filtered = allProfessions.filter(p => p.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').includes(query)).slice(0, 10);
                  setSuggestions(filtered);
                }
              }}
              style={{
                width: '100%',
                padding: '12px 36px 12px 12px',
                borderRadius: '8px',
                border: `1px solid ${errors.educacion ? '#ff6b6b' : '#16213e'}`,
                backgroundColor: '#FFFFFF',
                color: '#fff',
                fontSize: '14px'
              }}
            />
            {suggestions.length > 0 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderTop: 'none', borderRadius: '0 0 8px 8px', maxHeight: '300px', overflowY: 'auto', zIndex: 10 }}>
                {suggestions.map((s, i) => (
                  <div key={i} onClick={() => { updateForm('educacion', s); setInput(''); setSuggestions([]); }} style={{ padding: '10px 12px', cursor: 'pointer', borderBottom: '1px solid #16213e', color: '#0F172A', fontSize: '13px' }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#16213e'; e.currentTarget.style.color = '#BF057D'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#1a1a2e'; e.currentTarget.style.color = '#E8E4F4'; }}>{s}</div>
                ))}
              </div>
            )}
          </div>
        </div>
        {form.educacion && <div style={{ padding: '12px', backgroundColor: 'rgba(191, 5, 125, 0.15)', borderRadius: '8px', color: '#BF057D', fontSize: '13px' }}>✓ {form.educacion}</div>}
        {errors.educacion && <div style={{ color: '#ff6b6b', fontSize: '11px' }}>⚠️ {errors.educacion}</div>}
      </div>
      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '12px', backgroundColor: '#F8FAFC', color: '#BF057D', border: '1px solid #BF057D', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>← Atrás</button>
        <button onClick={() => validate() && onNext()} style={{ flex: 1, padding: '12px', backgroundColor: '#BF057D', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', opacity: !form.educacion ? 0.5 : 1 }}>Siguiente →</button>
      </div>
    </div>
  );
}

function Step3Experience({ form, updateForm, onNext, onBack }: any) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (form.anos_experiencia === undefined) newErrors.anos_experiencia = 'Requerido';
    if (!form.industria) newErrors.industria = 'Requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '30px', border: '1px solid #E2E8F0' }}>
      <h2 style={{ color: '#BF057D', marginBottom: '20px', fontSize: '18px' }}>Paso 4: Experiencia</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ color: '#0F172A', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
            Años totales
            <span style={{ color: '#64748B', fontSize: '11px', marginLeft: '4px' }}>{FIELD_HELP.anos_experiencia}</span>
          </label>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input type="number" min="0" max="50" value={form.anos_experiencia || 0} onChange={(e) => updateForm('anos_experiencia', parseInt(e.target.value) || 0)} style={{ width: '70px', padding: '10px 8px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', color: '#fff',  fontSize: '14px', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 16 16%22 fill=%22none%22%3E%3Cpath d=%22M3 6l5 5 5-5%22 stroke=%22%23BF057D%22 stroke-width=%222%22 stroke-linecap=%22round%22/  %3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', cursor: 'pointer' }} />
            <span style={{ color: '#0F172A', fontSize: '12px' }}>años</span>
            <input type="range" min="0" max="50" value={form.anos_experiencia || 0} onChange={(e) => updateForm('anos_experiencia', parseInt(e.target.value))} style={{ flex: 1, accentColor: '#BF057D' }} />
          </div>
        </div>
        <CustomSelect
          value={form.industria}
          onChange={(val: string) => updateForm('industria', val)}
          options={[{ value: '', label: 'Selecciona...' }, ...INDUSTRIES.map(i => ({ value: i, label: i }))]}
          label="Industria"
          help={FIELD_HELP.industria}
          error={errors.industria}
        />
      </div>
      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '12px', backgroundColor: '#F8FAFC', color: '#BF057D', border: '1px solid #BF057D', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>← Atrás</button>
        <button onClick={() => validate() && onNext()} style={{ flex: 1, padding: '12px', backgroundColor: '#BF057D', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', opacity: Object.keys(errors).length > 0 ? 0.5 : 1 }}>Siguiente →</button>
      </div>
    </div>
  );
}

function Step4Company({ form, updateForm, onNext, onBack }: any) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.tamano_empresa) newErrors.tamano_empresa = 'Requerido';
    if (form.anos_empresa === undefined) newErrors.anos_empresa = 'Requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '30px', border: '1px solid #E2E8F0' }}>
      <h2 style={{ color: '#BF057D', marginBottom: '20px', fontSize: '18px' }}>Paso 4: Empresa</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <CustomSelect
          value={form.tamano_empresa}
          onChange={(val: string) => updateForm('tamano_empresa', val)}
          options={[{ value: '', label: 'Selecciona...' }, ...COMPANY_SIZES]}
          label="Tamaño"
          help={FIELD_HELP.tamano_empresa}
          error={errors.tamano_empresa}
        />
        <div>
          <label style={{ color: '#0F172A', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
            Años en empresa
            <span style={{ color: '#64748B', fontSize: '11px', marginLeft: '4px' }}>{FIELD_HELP.anos_empresa}</span>
          </label>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input type="number" min="0" max="40" value={form.anos_empresa || 0} onChange={(e) => updateForm('anos_empresa', parseInt(e.target.value) || 0)} style={{ width: '70px', padding: '10px 8px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', color: '#fff',  fontSize: '14px', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 16 16%22 fill=%22none%22%3E%3Cpath d=%22M3 6l5 5 5-5%22 stroke=%22%23BF057D%22 stroke-width=%222%22 stroke-linecap=%22round%22/  %3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', cursor: 'pointer' }} />
            <span style={{ color: '#0F172A', fontSize: '12px' }}>años</span>
            <input type="range" min="0" max="40" value={form.anos_empresa || 0} onChange={(e) => updateForm('anos_empresa', parseInt(e.target.value))} style={{ flex: 1, accentColor: '#BF057D' }} />
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '12px', backgroundColor: '#F8FAFC', color: '#BF057D', border: '1px solid #BF057D', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>← Atrás</button>
        <button onClick={() => validate() && onNext()} style={{ flex: 1, padding: '12px', backgroundColor: '#BF057D', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', opacity: Object.keys(errors).length > 0 ? 0.5 : 1 }}>Siguiente →</button>
      </div>
    </div>
  );
}

function Step5Job({ form, updateForm, onNext, onBack }: any) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const jobsForIndustry = JOBS_BY_INDUSTRY[form.industria] || [];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.cargo) newErrors.cargo = 'Requerido';
    if (form.anos_cargo === undefined) newErrors.anos_cargo = 'Requerido';
    if (!form.modalidad) newErrors.modalidad = 'Requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '30px', border: '1px solid #E2E8F0' }}>
      <h2 style={{ color: '#BF057D', marginBottom: '20px', fontSize: '18px' }}>Paso 5: Cargo</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ color: '#0F172A', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
            Cargo
            <span style={{ color: '#64748B', fontSize: '11px', marginLeft: '4px' }}>{FIELD_HELP.cargo}</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input type="text" placeholder="Busca tu cargo..." value={input} onChange={(e) => {
              setInput(e.target.value);
              const jobs = JOBS_BY_INDUSTRY[form.industria] || [];
              const filtered = jobs.filter(j => j.toLowerCase().includes(e.target.value.toLowerCase())).slice(0, 10);
              setSuggestions(filtered);
            }} style={{ width: '100%', padding: '12px 36px 12px 12px', borderRadius: '8px', border: `1px solid ${errors.cargo ? '#ff6b6b' : '#16213e'}`, backgroundColor: '#FFFFFF', color: '#fff',  fontSize: '14px', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 16 16%22 fill=%22none%22%3E%3Cpath d=%22M3 6l5 5 5-5%22 stroke=%22%23BF057D%22 stroke-width=%222%22 stroke-linecap=%22round%22/  %3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', cursor: 'pointer' }} />
            {suggestions.length > 0 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderTop: 'none', borderRadius: '0 0 8px 8px', maxHeight: '250px', overflowY: 'auto', zIndex: 10 }}>
                {suggestions.map((s, i) => (
                  <div key={i} onClick={() => { updateForm('cargo', s); setInput(''); setSuggestions([]); }} style={{ padding: '10px 12px', cursor: 'pointer', borderBottom: '1px solid #16213e', color: '#0F172A', fontSize: '13px' }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#16213e'; e.currentTarget.style.color = '#BF057D'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#1a1a2e'; e.currentTarget.style.color = '#E8E4F4'; }}>{s}</div>
                ))}
              </div>
            )}
          </div>
          {errors.cargo && <div style={{ color: '#ff6b6b', fontSize: '11px', marginTop: '4px' }}>⚠️ {errors.cargo}</div>}
        </div>
        {form.cargo && <div style={{ padding: '12px', backgroundColor: 'rgba(191, 5, 125, 0.15)', borderRadius: '8px', color: '#BF057D', fontSize: '13px' }}>✓ {form.cargo}</div>}
        <div>
          <label style={{ color: '#0F172A', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
            Años en cargo
            <span style={{ color: '#64748B', fontSize: '11px', marginLeft: '4px' }}>{FIELD_HELP.anos_cargo}</span>
          </label>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input type="number" min="0" max="40" value={form.anos_cargo || 0} onChange={(e) => updateForm('anos_cargo', parseInt(e.target.value) || 0)} style={{ width: '70px', padding: '10px 8px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', color: '#fff',  fontSize: '14px', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 16 16%22 fill=%22none%22%3E%3Cpath d=%22M3 6l5 5 5-5%22 stroke=%22%23BF057D%22 stroke-width=%222%22 stroke-linecap=%22round%22/  %3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', cursor: 'pointer' }} />
            <span style={{ color: '#0F172A', fontSize: '12px' }}>años</span>
            <input type="range" min="0" max="40" value={form.anos_cargo || 0} onChange={(e) => updateForm('anos_cargo', parseInt(e.target.value))} style={{ flex: 1, accentColor: '#BF057D' }} />
          </div>
        </div>
        <CustomSelect
          value={form.modalidad}
          onChange={(val: string) => updateForm('modalidad', val)}
          options={[{ value: '', label: 'Selecciona...' }, ...WORK_MODALITIES.map(m => ({ value: m, label: m }))]}
          label="Modalidad"
          help={FIELD_HELP.modalidad}
          error={errors.modalidad}
        />
      </div>
      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '12px', backgroundColor: '#F8FAFC', color: '#BF057D', border: '1px solid #BF057D', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>← Atrás</button>
        <button onClick={() => validate() && onNext()} style={{ flex: 1, padding: '12px', backgroundColor: '#BF057D', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', opacity: Object.keys(errors).length > 0 ? 0.5 : 1 }}>Siguiente →</button>
      </div>
    </div>
  );
}

function Step6Contract({ form, updateForm, onNext, onBack }: any) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.tipo_contrato) newErrors.tipo_contrato = 'Requerido';
    if (!form.salario_bruto) newErrors.salario_bruto = 'Requerido';
    if (!form.salario_liquido) newErrors.salario_liquido = 'Requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '30px', border: '1px solid #E2E8F0' }}>
      <h2 style={{ color: '#BF057D', marginBottom: '20px', fontSize: '18px' }}>Paso 6: Contrato</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <CustomSelect
          value={form.tipo_contrato}
          onChange={(val: string) => updateForm('tipo_contrato', val)}
          options={[{ value: '', label: 'Selecciona...' }, ...CONTRACT_TYPES.map(c => ({ value: c, label: c }))]}
          label="Tipo contrato"
          help={FIELD_HELP.tipo_contrato}
          error={errors.tipo_contrato}
        />
        <div>
          <label style={{ color: '#0F172A', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
            Salario bruto (actual)
            <span style={{ color: '#64748B', fontSize: '11px', marginLeft: '4px' }}>{FIELD_HELP.salario_bruto}</span>
          </label>
          <input type="text" placeholder="$3.000.000" value={form.salario_bruto ? formatSalary(form.salario_bruto) : ''} onChange={(e) => updateForm('salario_bruto', parseInt(e.target.value.replace(/\D/g, '')) || 0)} style={{ width: '100%', padding: '12px 36px 12px 12px', borderRadius: '8px', border: `1px solid ${errors.salario_bruto ? '#ff6b6b' : '#16213e'}`, backgroundColor: '#FFFFFF', color: '#fff',  fontSize: '14px', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 16 16%22 fill=%22none%22%3E%3Cpath d=%22M3 6l5 5 5-5%22 stroke=%22%23BF057D%22 stroke-width=%222%22 stroke-linecap=%22round%22/  %3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', cursor: 'pointer' }} />
          {errors.salario_bruto && <div style={{ color: '#ff6b6b', fontSize: '11px', marginTop: '4px' }}>⚠️ {errors.salario_bruto}</div>}
        </div>
        <div>
          <label style={{ color: '#0F172A', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
            Salario líquido (actual)
            <span style={{ color: '#64748B', fontSize: '11px', marginLeft: '4px' }}>{FIELD_HELP.salario_liquido}</span>
          </label>
          <input type="text" placeholder="$2.100.000" value={form.salario_liquido ? formatSalary(form.salario_liquido) : ''} onChange={(e) => updateForm('salario_liquido', parseInt(e.target.value.replace(/\D/g, '')) || 0)} style={{ width: '100%', padding: '12px 36px 12px 12px', borderRadius: '8px', border: `1px solid ${errors.salario_liquido ? '#ff6b6b' : '#16213e'}`, backgroundColor: '#FFFFFF', color: '#fff',  fontSize: '14px', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 16 16%22 fill=%22none%22%3E%3Cpath d=%22M3 6l5 5 5-5%22 stroke=%22%23BF057D%22 stroke-width=%222%22 stroke-linecap=%22round%22/  %3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', cursor: 'pointer' }} />
          {errors.salario_liquido && <div style={{ color: '#ff6b6b', fontSize: '11px', marginTop: '4px' }}>⚠️ {errors.salario_liquido}</div>}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '12px', backgroundColor: '#F8FAFC', color: '#BF057D', border: '1px solid #BF057D', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>← Atrás</button>
        <button onClick={() => validate() && onNext()} style={{ flex: 1, padding: '12px', backgroundColor: '#BF057D', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', opacity: Object.keys(errors).length > 0 ? 0.5 : 1 }}>Siguiente →</button>
      </div>
    </div>
  );
}

function Step7Skills({ form, updateForm, onNext, onBack }: any) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({ 'Tech': false, 'Data & Analytics': false, 'Finanzas': false, 'Logística & Supply Chain': false, 'Ventas & Marketing': false, 'Legal & Compliance': false, 'Transversal': false });
  const [searchQuery, setSearchQuery] = useState('');

  const selectedSkills = form.habilidades_tecnicas || [];

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      updateForm('habilidades_tecnicas', selectedSkills.filter((s: string) => s !== skill));
    } else {
      updateForm('habilidades_tecnicas', [...selectedSkills, skill]);
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const allSkills = Object.values(SKILLS_BY_CATEGORY).flat();
  const matchingSkills = allSkills.filter(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
  const categoriesWithMatches = Object.keys(SKILLS_BY_CATEGORY).filter(cat =>
    SKILLS_BY_CATEGORY[cat].some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  useEffect(() => {
    const newExpanded = { ...expandedCategories };
    Object.keys(expandedCategories).forEach(cat => {
      newExpanded[cat] = searchQuery.length > 0 && categoriesWithMatches.includes(cat);
    });
    setExpandedCategories(newExpanded);
  }, [searchQuery]);

  return (
    <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '30px', border: '1px solid #E2E8F0' }}>
      <h2 style={{ color: '#BF057D', marginBottom: '20px', fontSize: '18px' }}>Paso 8: Skills Técnicos</h2>
      <p style={{ color: '#0F172A', marginBottom: '16px', fontSize: '13px' }}>💡 {selectedSkills.length} seleccionadas</p>

      <input
        type="text"
        placeholder="🔍 Busca un skill (ej: Python, React, SQL...)"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid #BF057D',
          backgroundColor: '#FFFFFF',
          color: '#0F172A',
          fontSize: '14px',
          marginBottom: '24px'
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {Object.entries(SKILLS_BY_CATEGORY).filter(([category]) => searchQuery.length === 0 || categoriesWithMatches.includes(category)).map(([category, skills]) => (
          <div key={category} style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #E2E8F0', backgroundColor: '#F1F5F9' }}>
            <div onClick={() => toggleCategory(category)} style={{ padding: '14px 16px', backgroundColor: '#F8FAFC', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                <span style={{ color: '#BF057D', fontSize: '16px' }}>{expandedCategories[category] ? '▼' : '▶'}</span>
                <div>
                  <div style={{ color: '#BF057D', fontWeight: '600', fontSize: '14px' }}>{category}</div>
                  <div style={{ color: '#64748B', fontSize: '11px', marginTop: '2px' }}>{SKILLS_HELP[category as keyof typeof SKILLS_HELP]}</div>
                </div>
              </div>
              <span style={{ color: '#64748B', fontSize: '12px' }}>{skills.filter((s) => selectedSkills.includes(s)).length}/{skills.length}</span>
            </div>
            {expandedCategories[category] && (
              <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                {skills.filter(skill => searchQuery.length === 0 || skill.toLowerCase().includes(searchQuery.toLowerCase())).map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <label key={skill} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', backgroundColor: isSelected ? 'rgba(191, 5, 125, 0.15)' : 'rgba(30, 41, 59, 0.6)', border: isSelected ? '1px solid #BF057D' : '1px solid #16213e', cursor: 'pointer' }}>
                      <input type="checkbox" checked={isSelected} onChange={() => toggleSkill(skill)} style={{ width: '18px', height: '18px', accentColor: '#BF057D', cursor: 'pointer' }} />
                      <span style={{ color: isSelected ? '#BF057D' : '#E8E4F4', fontSize: '13px', fontWeight: isSelected ? '600' : '400' }}>{skill}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '12px', backgroundColor: '#F8FAFC', color: '#BF057D', border: '1px solid #BF057D', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>← Atrás</button>
        <button onClick={onNext} style={{ flex: 1, padding: '12px', backgroundColor: '#BF057D', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Siguiente →</button>
      </div>
    </div>
  );
}

function Step8SoftSkills({ form, updateForm, onNext, onBack }: any) {
  const sliders = [{ key: 'comunicacion', label: 'Comunicación' }, { key: 'liderazgo', label: 'Liderazgo' }, { key: 'resolucion_conflictos', label: 'Resolución de Conflictos' }, { key: 'negociacion', label: 'Negociación' }, { key: 'trabajo_equipo', label: 'Trabajo en Equipo' }];

  return (
    <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '30px', border: '1px solid #E2E8F0' }}>
      <h2 style={{ color: '#BF057D', marginBottom: '20px', fontSize: '18px' }}>Paso 9: Soft Skills</h2>
      <p style={{ color: '#0F172A', marginBottom: '24px', fontSize: '13px' }}>💡 Evalúate del 1 al 10 en cada competencia</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {sliders.map((s) => (
          <div key={s.key}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A', marginBottom: '8px', display: 'block' }}>{s.label}</label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input type="number" min="1" max="10" value={form.soft_skills?.[s.key] || 5} onChange={(e) => updateForm('soft_skills', { ...form.soft_skills, [s.key]: Math.max(1, Math.min(10, parseInt(e.target.value) || 5)) })} style={{ width: '60px', padding: '10px 8px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', color: '#BF057D', fontSize: '14px', fontWeight: '600', textAlign: 'center' }} />
              <span style={{ color: '#0F172A', fontSize: '12px' }}>/10</span>
              <input type="range" min="1" max="10" value={form.soft_skills?.[s.key] || 5} onChange={(e) => updateForm('soft_skills', { ...form.soft_skills, [s.key]: parseInt(e.target.value) })} style={{ flex: 1, accentColor: '#BF057D' }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '12px', backgroundColor: '#F8FAFC', color: '#BF057D', border: '1px solid #BF057D', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>← Atrás</button>
        <button onClick={onNext} style={{ flex: 1, padding: '12px', backgroundColor: '#BF057D', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Calcular →</button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [form, setForm] = useState<UserForm>({
    soft_skills: { comunicacion: 5, liderazgo: 5, resolucion_conflictos: 5, negociacion: 5, trabajo_equipo: 5 },
    habilidades_tecnicas: [],
  });

  // Auto-save progreso
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('pulso_form_autosave', JSON.stringify({ form, step }));
      console.log('✅ Progreso guardado automáticamente');
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [form, step]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!supabase) {
          console.log('Supabase not configured, using test account');
          setUser({ id: 'test-dev', email: 'dev@test.local' });
          
          // Cargar progreso guardado
          const saved = localStorage.getItem('pulso_form_autosave');
          if (saved) {
            try {
              const { form: savedForm, step: savedStep } = JSON.parse(saved);
              setForm(savedForm);
              setStep(savedStep);
              console.log('📂 Progreso recuperado del navegador');
            } catch (err) {
              console.log('No hay progreso guardado');
            }
          }
          return;
        }

        const { data, error } = await supabase.auth.getUser();
        console.log('Auth check:', { data, error });

        if (error || !data.user) {
          console.log('Development mode: No user, using test account');
          setUser({ id: 'test-dev', email: 'dev@test.local' });
        } else {
          console.log('User found:', data.user.email);
          setUser(data.user);
        }

        // Cargar progreso guardado
        const saved = localStorage.getItem('pulso_form_autosave');
        if (saved) {
          try {
            const { form: savedForm, step: savedStep } = JSON.parse(saved);
            setForm(savedForm);
            setStep(savedStep);
            console.log('📂 Progreso recuperado del navegador');
          } catch (err) {
            console.log('No hay progreso guardado');
          }
        }
      } catch (error) {
        console.error('Auth error:', error);
        setUser({ id: 'test-dev', email: 'dev@test.local' });
      }
    };
    loadUser();
  }, [router]);

  const updateForm = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleCalcular = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      let bandaData = { p25: 2000000, p50: 3500000, p75: 5000000 };

      try {
        let benchmarkData = null;
        let benchmarkError = null;

        if (supabase) {
          const result = await supabase
            .from('codify_benchmarks')
            .select('salario_p25, salario_p50, salario_p75')
            .eq('cargo', form.cargo || '')
            .eq('industria', form.industria || '')
            .lte('anos_experiencia_min', form.anos_experiencia || 0)
            .gte('anos_experiencia_max', form.anos_experiencia || 0)
            .order('salario_p50', { ascending: false })
            .limit(1);
          benchmarkData = result.data;
          benchmarkError = result.error;
        }

        if (benchmarkData && benchmarkData.length > 0 && !benchmarkError) {
          const benchmark = benchmarkData[0];
          bandaData = {
            p25: benchmark.salario_p25 || bandaData.p25,
            p50: benchmark.salario_p50 || bandaData.p50,
            p75: benchmark.salario_p75 || bandaData.p75,
          };
          console.log('Benchmark encontrado:', benchmark);
        } else {
          console.log('Usando valores por defecto de benchmark');
        }
      } catch (err) {
        console.log('Error al consultar benchmarks, usando valores por defecto', err);
      }

      const baseScore = 50;
      const experienceBonus = Math.min(30, (form.anos_experiencia || 0) * 2);
      const skillsBonus = Math.min(10, (form.habilidades_tecnicas?.length || 0) * 0.5);
      const softSkillsBonus = (((form.soft_skills?.comunicacion || 0) + (form.soft_skills?.liderazgo || 0) + (form.soft_skills?.resolucion_conflictos || 0) + (form.soft_skills?.negociacion || 0) + (form.soft_skills?.trabajo_equipo || 0)) / 50) * 10;

      const totalScore = Math.min(100, baseScore + experienceBonus + skillsBonus + softSkillsBonus);
      const grade = Math.min(25, Math.max(1, Math.round((totalScore / 100) * 25)));

      const factorScores = {
        expertise_funcional: Math.min(10, (form.habilidades_tecnicas?.length || 0) / 6),
        expertise_negocio: Math.min(10, (form.anos_experiencia || 0) / 2),
        influencia_liderazgo: form.soft_skills?.liderazgo || 5,
        resolucion_problemas: form.soft_skills?.resolucion_conflictos || 5,
        naturaleza_impacto: Math.min(10, 6 + (form.anos_cargo || 0) / 2),
        alcance_impacto: Math.min(10, 5 + (form.anos_empresa || 0) / 3),
        interaccion_comunicacion: form.soft_skills?.comunicacion || 5,
      };

      const brecha = form.salario_liquido! - bandaData.p50;
      const brechaPercentil = ((brecha / form.salario_liquido!) * 100).toFixed(1);

      const results: AnalysisResult = {
        score_total: Math.round(totalScore),
        grade,
        cargo_homologado: form.cargo || 'N/A',
        factor_scores: factorScores,
        salario_actual: form.salario_liquido || 0,
        salario_p25: bandaData.p25,
        salario_p50: bandaData.p50,
        salario_p75: bandaData.p75,
        brecha_percentil: parseFloat(brechaPercentil as string),
        ultimo_cargo: form.cargo || '',
        anos_experiencia: form.anos_experiencia || 0,
        industria: form.industria || '',
      };

      // Limpiar localStorage después de calcular
      localStorage.removeItem('pulso_form_autosave');

      setAnalysisResults(results);
      setStep('resultado');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
    // Limpiar localStorage
    localStorage.removeItem('pulso_form_autosave');
    // Resetear state
    setForm({
      soft_skills: { comunicacion: 5, liderazgo: 5, resolucion_conflictos: 5, negociacion: 5, trabajo_equipo: 5 },
      habilidades_tecnicas: [],
    });
    setStep(1);
    setAnalysisResults(null);
    setUser(null);
    router.push('/login');
  };

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: '#1C1B2E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#0F172A' }}>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ color: '#BF057D', marginBottom: '20px' }}>🎯 Analizando tu perfil...</h1>
          <p style={{ color: '#0F172A' }}>Calculando tu score...</p>
        </div>
      </div>
    );
  }

  if (analysisResults) {
    return (
      <div style={{ minHeight: '100vh', background: '#FFFFFF', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)', border: '2px solid #BF057D', borderRadius: '16px', padding: '40px', marginBottom: '40px', textAlign: 'center', boxShadow: '0 8px 32px rgba(191, 5, 125, 0.2)' }}>
            <p style={{ color: '#0F172A', fontSize: '14px', margin: '0 0 20px 0' }}>Tu Puntuación Codify</p>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', marginBottom: '30px' }}>
              <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <circle cx="60" cy="60" r="55" fill="none" stroke="#16213e" strokeWidth="8" />
                  <circle cx="60" cy="60" r="55" fill="none" stroke="#BF057D" strokeWidth="8" strokeDasharray={`${(analysisResults.score_total / 100) * 345} 345`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 2s ease-in-out', filter: 'drop-shadow(0 0 8px rgba(191, 5, 125, 0.5))' }} />
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#BF057D' }}>{analysisResults.score_total}</div>
                  <div style={{ fontSize: '12px', color: '#0F172A' }}>/100</div>
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #BF057D 0%, #9A0462 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(191, 5, 125, 0.3)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', color: '#fff', marginBottom: '4px' }}>Grade</div>
                    <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#fff' }}>{analysisResults.grade}</div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #16213e' }}>
              <p style={{ color: '#BF057D', fontSize: '16px', fontWeight: '600' }}>
                {analysisResults.score_total >= 80 ? '🌟 Excelente posicionamiento' : analysisResults.score_total >= 60 ? '✅ Buen desempeño' : analysisResults.score_total >= 40 ? '📈 Potencial de crecimiento' : '🚀 Oportunidad de desarrollo'}
              </p>
              <p style={{ color: '#0F172A', fontSize: '13px', marginTop: '10px' }}>Cargo: {analysisResults.cargo_homologado} | Industria: {analysisResults.industria}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ color: '#BF057D', marginBottom: '16px' }}>💰 Banda Salarial</h3>
              <div><p style={{ color: '#0F172A', fontSize: '12px', margin: '0' }}>P25</p><p style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold', margin: '4px 0' }}>${(analysisResults.salario_p25 / 1000000).toFixed(1)}M</p></div>
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #16213e' }}><p style={{ color: '#0F172A', fontSize: '12px', margin: '0' }}>P50 (Promedio)</p><p style={{ color: '#BF057D', fontSize: '18px', fontWeight: 'bold', margin: '4px 0' }}>${(analysisResults.salario_p50 / 1000000).toFixed(1)}M</p></div>
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #16213e' }}><p style={{ color: '#0F172A', fontSize: '12px', margin: '0' }}>P75</p><p style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold', margin: '4px 0' }}>${(analysisResults.salario_p75 / 1000000).toFixed(1)}M</p></div>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ color: '#BF057D', marginBottom: '16px' }}>📊 Tu Salario</h3>
              <p style={{ color: '#0F172A', fontSize: '12px', margin: '0' }}>Salario Actual</p>
              <p style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold', margin: '8px 0' }}>${(analysisResults.salario_actual / 1000000).toFixed(1)}M</p>
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #16213e' }}>
                <p style={{ color: '#0F172A', fontSize: '12px', margin: '0' }}>Brecha vs P50</p>
                <p style={{ color: analysisResults.brecha_percentil < 0 ? '#ff6b6b' : '#BF057D', fontSize: '18px', fontWeight: 'bold', margin: '8px 0' }}>
                  {analysisResults.brecha_percentil > 0 ? '+' : ''}{analysisResults.brecha_percentil}%
                </p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '40px', paddingBottom: '40px' }}>
            <h2 style={{ color: '#BF057D', marginBottom: '16px', fontSize: '20px' }}>💬 Consultor Salarial con IA</h2>
            <ChatWindow analysisData={{
              score_total: analysisResults.score_total,
              grade: analysisResults.grade,
              cargo_homologado: analysisResults.cargo_homologado,
              factor_scores: analysisResults.factor_scores,
              salario_actual: analysisResults.salario_actual,
              salario_p50: analysisResults.salario_p50,
              brecha_percentil: analysisResults.brecha_percentil,
              ultimo_cargo: analysisResults.ultimo_cargo,
              anos_experiencia: analysisResults.anos_experiencia,
              industria: analysisResults.industria,
            }} />
          </div>

          <div style={{ textAlign: 'center', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => { setAnalysisResults(null); setStep(1); setForm({ soft_skills: { comunicacion: 5, liderazgo: 5, resolucion_conflictos: 5, negociacion: 5, trabajo_equipo: 5 }, habilidades_tecnicas: [] }); }} style={{ padding: '12px 32px', backgroundColor: '#BF057D', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>← Nuevo Análisis</button>
            <button onClick={logout} style={{ padding: '12px 32px', backgroundColor: '#999', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>Salir</button>
          </div>
        </div>
      </div>
    );
  }

  const progress = step === 'resultado' ? 100 : ((step as number) / 8) * 100;

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF', padding: '40px 20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#BF057D', fontSize: '24px', margin: 0 }}>PULSO by Codify 🎯</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: '#0F172A' }}>👤 {user?.email || 'usuario'}</span>
            <button onClick={logout} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #BF057D', background: 'transparent', color: '#BF057D', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Salir</button>
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <div style={{ height: '6px', background: 'rgba(148,163,184,0.15)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #BF057D, #9A0462)', borderRadius: '3px', transition: 'width 0.3s' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Paso {step} de 8</span>
            <span style={{ fontSize: '11px', color: '#BF057D', fontWeight: '600' }}>{Math.round(progress)}%</span>
          </div>
        </div>

        {step === 1 && <Step1Basic form={form} updateForm={updateForm} onNext={() => setStep(2)} />}
        {step === 2 && <Step2Education form={form} updateForm={updateForm} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
        {step === 3 && <Step2Carrera form={form} updateForm={updateForm} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
        {step === 4 && <Step3Experience form={form} updateForm={updateForm} onNext={() => setStep(5)} onBack={() => setStep(3)} />}
        {step === 5 && <Step4Company form={form} updateForm={updateForm} onNext={() => setStep(6)} onBack={() => setStep(4)} />}
        {step === 6 && <Step5Job form={form} updateForm={updateForm} onNext={() => setStep(7)} onBack={() => setStep(5)} />}
        {step === 7 && <Step6Contract form={form} updateForm={updateForm} onNext={() => setStep(8)} onBack={() => setStep(6)} />}
        {step === 8 && <Step7Skills form={form} updateForm={updateForm} onNext={() => setStep(9)} onBack={() => setStep(7)} />}
        {step === 9 && <Step8SoftSkills form={form} updateForm={updateForm} onNext={handleCalcular} onBack={() => setStep(8)} />}
      </div>
    </div>
  );
}
// Force rebuild
