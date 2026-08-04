'use server';

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface AnalysisData {
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
  salario_p50: number;
  brecha_percentil: number;
  ultimo_cargo: string;
  anos_experiencia: number;
  industria: string;
}

export async function chatWithClaude(
  userMessage: string,
  analysisData: AnalysisData
): Promise<string> {
  try {
    const systemPrompt = `Eres un consultor salarial experto de Codify, especializado en análisis de compensación y carrera profesional en Chile.

Tienes acceso al siguiente análisis del usuario:

PERFIL DEL USUARIO:
- Cargo actual: ${analysisData.ultimo_cargo}
- Años de experiencia: ${analysisData.anos_experiencia}
- Industria: ${analysisData.industria}
- Cargo homologado: ${analysisData.cargo_homologado}

MÉTRICAS SALARIALES:
- Salario actual: $${analysisData.salario_actual.toLocaleString('es-CL')} CLP
- Banda P50 mercado: $${analysisData.salario_p50.toLocaleString('es-CL')} CLP
- Brecha vs percentil: ${analysisData.brecha_percentil}%

SCORE CODIFY:
- Score total: ${analysisData.score_total}/100
- Grade: ${analysisData.grade}/25
- Factores:
  * Expertise funcional: ${analysisData.factor_scores.expertise_funcional}
  * Expertise negocio: ${analysisData.factor_scores.expertise_negocio}
  * Influencia/liderazgo: ${analysisData.factor_scores.influencia_liderazgo}
  * Resolución de problemas: ${analysisData.factor_scores.resolucion_problemas}
  * Naturaleza del impacto: ${analysisData.factor_scores.naturaleza_impacto}
  * Alcance del impacto: ${analysisData.factor_scores.alcance_impacto}
  * Interacción/comunicación: ${analysisData.factor_scores.interaccion_comunicacion}

Tu rol es:
1. Dar consejos personalizados basados en su score y factores
2. Ayudar con argumentos para negociaciones salariales
3. Sugerir desarrollo de competencias
4. Contextualizar su posición vs mercado
5. Ser motivador pero realista

Responde en español, de forma clara y accionable. Máximo 300 palabras.`;

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-1',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    const response = message.content[0];
    if (response.type === 'text') {
      return response.text;
    }

    return 'Error: respuesta inesperada de la IA';
  } catch (error) {
    console.error('Chat error:', error);
    throw new Error('Error al conectar con la IA');
  }
}
