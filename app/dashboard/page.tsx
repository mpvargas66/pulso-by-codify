import ChatWindow from '@/components/ChatWindow';
{/* Chat Section */}
        <div style={{ marginTop: '40px', paddingBottom: '40px' }}>
          <h2 style={{ color: '#00d084', marginBottom: '16px', fontSize: '20px' }}>
            💬 Consultor Salarial con IA
          </h2>
          <p style={{ color: '#aaa', marginBottom: '16px', fontSize: '14px' }}>
            Haz preguntas sobre tu análisis, negociación salarial o desarrollo de skills.
          </p>
          <ChatWindow analysisData={{
            score_total: analysisData.score_total,
            grade: analysisData.grade,
            cargo_homologado: analysisData.cargo_homologado,
            factor_scores: analysisData.factor_scores,
            salario_actual: analysisData.salario_actual,
            banda_p50: analysisData.banda_p50,
            brecha_percentil: analysisData.brecha_percentil,
            ultimo_cargo: analysisData.ultimo_cargo,
            anos_experiencia: analysisData.anos_experiencia,
            industria: analysisData.industria,
          }} />
        </div>
