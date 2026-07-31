// ============================================================
// PULSO PROFESSIONAL GRADING SYSTEM (PGS)
// Basado en WTW GGS + Homologable a Codify
// ============================================================

export interface ProfileInput {
  // Datos personales
  edad: number
  nivel_educacion: 'Media' | 'Técnico' | 'Profesional' | 'Magíster' | 'Doctorado'
  region: string

  // Experiencia laboral
  anos_experiencia: number
  ultimo_cargo: string
  tiempo_ultimo_empleo_meses: number
  industria: string
  tamano_empresa: 'Startup' | 'Pequeña' | 'Mediana' | 'Grande'

  // Competencias técnicas
  habilidades_tecnicas: string[]
  certificaciones: string[]
  idiomas: { idioma: string; nivel: 'Básico' | 'Intermedio' | 'Avanzado' | 'Nativo' }[]

  // Competencias blandas
  liderazgo_experiencia: 'No' | 'Líder de proyecto' | 'Gerente' | 'Director'
  personas_a_cargo: number
  soft_skills: {
    comunicacion: number
    negociacion: number
    empatia: number
    resolucion_conflictos: number
  }

  // Salario
  salario_actual: number
  expectativa_salarial?: number
}

export interface FactorScores {
  expertise_funcional: number      // 0-100
  expertise_negocio: number        // 0-100
  influencia_liderazgo: number     // 0-100
  resolucion_problemas: number     // 0-100
  naturaleza_impacto: number       // 0-100
  alcance_impacto: number          // 0-100
  interaccion_comunicacion: number // 0-100
}

export interface GradingResult {
  score_total: number
  grade: number
  cargo_homologado: string
  factor_scores: FactorScores
  brecha_salarial?: {
    percentil: number
    banda: 'P25' | 'P50' | 'P75' | 'P90'
    sugerido: number
  }
}

// Pesos de los 7 factores (deben sumar 1.0)
const PESOS = {
  expertise_funcional: 0.25,
  expertise_negocio: 0.15,
  influencia_liderazgo: 0.15,
  resolucion_problemas: 0.15,
  naturaleza_impacto: 0.10,
  alcance_impacto: 0.10,
  interaccion_comunicacion: 0.10,
}

// Mapeo de educación a puntos base
function scoreEducacion(nivel: string): number {
  const map: Record<string, number> = {
    'Media': 10,
    'Técnico': 30,
    'Profesional': 50,
    'Magíster': 75,
    'Doctorado': 90,
  }
  return map[nivel] || 30
}

// Mapeo de tamaño empresa
function scoreTamanoEmpresa(tamano: string): number {
  const map: Record<string, number> = {
    'Startup': 40,
    'Pequeña': 50,
    'Mediana': 70,
    'Grande': 85,
  }
  return map[tamano] || 50
}

// Mapeo de liderazgo
function scoreLiderazgo(liderazgo: string, personas: number): number {
  const base: Record<string, number> = {
    'No': 0,
    'Líder de proyecto': 40,
    'Gerente': 65,
    'Director': 85,
  }
  const baseScore = base[liderazgo] || 0
  // Bonus por cantidad de personas
  const bonus = Math.min(personas * 2, 15)
  return Math.min(baseScore + bonus, 100)
}

// Factor 1: Expertise Funcional (25%)
function calcExpertiseFuncional(p: ProfileInput): number {
  let score = scoreEducacion(p.nivel_educacion)

  // Años de experiencia (máx 30 pts)
  const expScore = Math.min(p.anos_experiencia * 3, 30)
  score += expScore

  // Habilidades técnicas (máx 25 pts)
  const skillCount = p.habilidades_tecnicas.length
  const skillScore = Math.min(skillCount * 5, 25)
  score += skillScore

  // Certificaciones (máx 15 pts)
  const certScore = Math.min(p.certificaciones.length * 7, 15)
  score += certScore

  // Idiomas (máx 10 pts)
  let idiomaScore = 0
  for (const idioma of p.idiomas) {
    if (idioma.nivel === 'Nativo') idiomaScore += 5
    else if (idioma.nivel === 'Avanzado') idiomaScore += 4
    else if (idioma.nivel === 'Intermedio') idiomaScore += 2
    else idiomaScore += 1
  }
  score += Math.min(idiomaScore, 10)

  return Math.min(score, 100)
}

// Factor 2: Expertise de Negocio (15%)
function calcExpertiseNegocio(p: ProfileInput): number {
  let score = 0

  // Industria (máx 40 pts) - industrias maduras = más puntos
  const industriasMaduras = ['Finanzas', 'Energía', 'Minería', 'Salud', 'Legal']
  const industriasEmergentes = ['Tecnología', 'Startup', 'Crypto', 'IA']
  if (industriasMaduras.includes(p.industria)) score += 40
  else if (industriasEmergentes.includes(p.industria)) score += 35
  else score += 30

  // Tamaño empresa (máx 30 pts)
  score += scoreTamanoEmpresa(p.tamano_empresa) * 0.3

  // Años de experiencia en industria (proxy: años totales, máx 30 pts)
  score += Math.min(p.anos_experiencia * 3, 30)

  return Math.min(score, 100)
}

// Factor 3: Influencia & Liderazgo (15%)
function calcInfluenciaLiderazgo(p: ProfileInput): number {
  return scoreLiderazgo(p.liderazgo_experiencia, p.personas_a_cargo)
}

// Factor 4: Resolución de Problemas (15%)
function calcResolucionProblemas(p: ProfileInput): number {
  let score = 0

  // Años de experiencia (máx 40 pts)
  score += Math.min(p.anos_experiencia * 4, 40)

  // Tiempo en último empleo = profundidad (máx 25 pts)
  const tiempoAnios = p.tiempo_ultimo_empleo_meses / 12
  if (tiempoAnios >= 5) score += 25
  else if (tiempoAnios >= 3) score += 20
  else if (tiempoAnios >= 1) score += 12
  else score += 5

  // Edad como proxy de madurez (máx 15 pts)
  if (p.edad >= 45) score += 15
  else if (p.edad >= 35) score += 12
  else if (p.edad >= 28) score += 8
  else score += 4

  // Soft skills - resolución de conflictos (máx 20 pts)
  score += (p.soft_skills.resolucion_conflictos / 10) * 20

  return Math.min(score, 100)
}

// Factor 5: Naturaleza del Impacto (10%)
function calcNaturalezaImpacto(p: ProfileInput): number {
  let score = 0

  // Cargo determina nivel de impacto (máx 50 pts)
  const cargoLower = p.ultimo_cargo.toLowerCase()
  if (cargoLower.includes('director') || cargoLower.includes('c-level') || cargoLower.includes('socio')) score += 50
  else if (cargoLower.includes('gerente') || cargoLower.includes('manager')) score += 40
  else if (cargoLower.includes('senior') || cargoLower.includes('lead') || cargoLower.includes('jefe')) score += 30
  else if (cargoLower.includes('analista') || cargoLower.includes('especialista')) score += 20
  else score += 10

  // Salario como proxy de impacto (máx 30 pts)
  // Asumiendo rangos CLP
  if (p.salario_actual >= 8000000) score += 30
  else if (p.salario_actual >= 5000000) score += 24
  else if (p.salario_actual >= 3000000) score += 18
  else if (p.salario_actual >= 1500000) score += 12
  else score += 6

  // Industria de alto impacto (máx 20 pts)
  const altoImpacto = ['Tecnología', 'Finanzas', 'Consultoría', 'Energía']
  if (altoImpacto.includes(p.industria)) score += 20
  else score += 12

  return Math.min(score, 100)
}

// Factor 6: Alcance del Impacto (10%)
function calcAlcanceImpacto(p: ProfileInput): number {
  let score = 0

  // Tamaño empresa = alcance (máx 40 pts)
  score += scoreTamanoEmpresa(p.tamano_empresa) * 0.4

  // Región (máx 30 pts)
  if (p.region.toLowerCase().includes('santiago')) score += 30
  else if (['valparaíso', 'concepción', 'biobío'].some(r => p.region.toLowerCase().includes(r))) score += 22
  else score += 15

  // Habilidades técnicas = versatilidad (máx 30 pts)
  score += Math.min(p.habilidades_tecnicas.length * 5, 30)

  return Math.min(score, 100)
}

// Factor 7: Interacción & Comunicación (10%)
function calcInteraccionComunicacion(p: ProfileInput): number {
  let score = 0

  // Soft skills promedio (máx 60 pts)
  const softAvg = (
    p.soft_skills.comunicacion +
    p.soft_skills.negociacion +
    p.soft_skills.empatia +
    p.soft_skills.resolucion_conflictos
  ) / 4
  score += (softAvg / 10) * 60

  // Idiomas adicionales (máx 25 pts)
  const idiomasExtra = p.idiomas.filter(i => i.idioma.toLowerCase() !== 'español').length
  score += Math.min(idiomasExtra * 10, 25)

  // Liderazgo implica comunicación (máx 15 pts)
  if (p.liderazgo_experiencia === 'Director') score += 15
  else if (p.liderazgo_experiencia === 'Gerente') score += 12
  else if (p.liderazgo_experiencia === 'Líder de proyecto') score += 8
  else score += 3

  return Math.min(score, 100)
}

// Mapeo de score (0-100) a Grade (1-25)
function scoreToGrade(score: number): number {
  if (score >= 91) return 25
  if (score >= 88) return 24
  if (score >= 85) return 23
  if (score >= 82) return 22
  if (score >= 79) return 21
  if (score >= 76) return 20
  if (score >= 73) return 19
  if (score >= 70) return 18
  if (score >= 67) return 17
  if (score >= 64) return 16
  if (score >= 61) return 15
  if (score >= 58) return 14
  if (score >= 55) return 13
  if (score >= 52) return 12
  if (score >= 49) return 11
  if (score >= 46) return 10
  if (score >= 43) return 9
  if (score >= 40) return 8
  if (score >= 37) return 7
  if (score >= 34) return 6
  if (score >= 31) return 5
  if (score >= 28) return 4
  if (score >= 25) return 3
  if (score >= 20) return 2
  return 1
}

// Cargo homologado según grade
function gradeToCargo(grade: number): string {
  if (grade >= 23) return 'C-Level / Socio'
  if (grade >= 20) return 'Director Senior / VP'
  if (grade >= 16) return 'Gerente / Director'
  if (grade >= 13) return 'Jefe de Proyecto / Lead'
  if (grade >= 10) return 'Consultor Senior / Coordinador'
  if (grade >= 7) return 'Analista / Especialista'
  if (grade >= 4) return 'Analista Junior'
  return 'Practicante / Trainee'
}

// Bandas salariales por grade (CLP mensual)
function gradeToBanda(grade: number) {
  const bandas: Record<number, { p25: number; p50: number; p75: number; p90: number }> = {
    1: { p25: 350000, p50: 450000, p75: 550000, p90: 700000 },
    2: { p25: 400000, p50: 550000, p75: 700000, p90: 900000 },
    3: { p25: 500000, p50: 650000, p75: 850000, p90: 1100000 },
    4: { p25: 650000, p50: 850000, p75: 1100000, p90: 1400000 },
    5: { p25: 750000, p50: 1000000, p75: 1300000, p90: 1700000 },
    6: { p25: 850000, p50: 1150000, p75: 1500000, p90: 1950000 },
    7: { p25: 1000000, p50: 1350000, p75: 1800000, p90: 2300000 },
    8: { p25: 1150000, p50: 1550000, p75: 2050000, p90: 2650000 },
    9: { p25: 1300000, p50: 1750000, p75: 2300000, p90: 3000000 },
    10: { p25: 1500000, p50: 2000000, p75: 2650000, p90: 3450000 },
    11: { p25: 1650000, p50: 2200000, p75: 2900000, p90: 3800000 },
    12: { p25: 1800000, p50: 2400000, p75: 3150000, p90: 4100000 },
    13: { p25: 2100000, p50: 2800000, p75: 3700000, p90: 4800000 },
    14: { p25: 2300000, p50: 3100000, p75: 4100000, p90: 5300000 },
    15: { p25: 2500000, p50: 3400000, p75: 4500000, p90: 5800000 },
    16: { p25: 2900000, p50: 3900000, p75: 5200000, p90: 6800000 },
    17: { p25: 3200000, p50: 4300000, p75: 5700000, p90: 7500000 },
    18: { p25: 3500000, p50: 4700000, p75: 6200000, p90: 8200000 },
    19: { p25: 3900000, p50: 5200000, p75: 6900000, p90: 9100000 },
    20: { p25: 4500000, p50: 6000000, p75: 8000000, p90: 10500000 },
    21: { p25: 5000000, p50: 6700000, p75: 8900000, p90: 11700000 },
    22: { p25: 5600000, p50: 7500000, p75: 10000000, p90: 13200000 },
    23: { p25: 7000000, p50: 9500000, p75: 12800000, p90: 17000000 },
    24: { p25: 8500000, p50: 11500000, p75: 15500000, p90: 20500000 },
    25: { p25: 11000000, p50: 15000000, p75: 20500000, p90: 28000000 },
  }
  return bandas[grade] || bandas[1]
}

// Función principal
export function calculateGrading(input: ProfileInput): GradingResult {
  const factor_scores: FactorScores = {
    expertise_funcional: calcExpertiseFuncional(input),
    expertise_negocio: calcExpertiseNegocio(input),
    influencia_liderazgo: calcInfluenciaLiderazgo(input),
    resolucion_problemas: calcResolucionProblemas(input),
    naturaleza_impacto: calcNaturalezaImpacto(input),
    alcance_impacto: calcAlcanceImpacto(input),
    interaccion_comunicacion: calcInteraccionComunicacion(input),
  }

  // Score ponderado
  let score_total = 0
  for (const [factor, peso] of Object.entries(PESOS)) {
    score_total += factor_scores[factor as keyof FactorScores] * peso
  }
  score_total = Math.round(score_total)

  const grade = scoreToGrade(score_total)
  const cargo_homologado = gradeToCargo(grade)
  const banda = gradeToBanda(grade)

  // Calcular brecha salarial
  let brecha = undefined
  if (input.salario_actual > 0) {
    let percentil = 25
    if (input.salario_actual >= banda.p90) percentil = 90
    else if (input.salario_actual >= banda.p75) percentil = 75
    else if (input.salario_actual >= banda.p50) percentil = 50
    else if (input.salario_actual >= banda.p25) percentil = 25
    else percentil = 10

    let bandaLabel: 'P25' | 'P50' | 'P75' | 'P90' = 'P25'
    if (percentil >= 90) bandaLabel = 'P90'
    else if (percentil >= 75) bandaLabel = 'P75'
    else if (percentil >= 50) bandaLabel = 'P50'

    brecha = {
      percentil,
      banda: bandaLabel,
      sugerido: banda.p50,
    }
  }

  return {
    score_total,
    grade,
    cargo_homologado,
    factor_scores,
    brecha_salarial: brecha,
  }
}
