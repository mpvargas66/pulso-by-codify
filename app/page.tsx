'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div style={{ background: '#1C1B2E', color: '#F3F0FB', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* NAVBAR */}
      <nav style={{ background: '#2D1B5E', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(191, 5, 125, 0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="https://codifyanalytics.com/storage/header-logos/01KSQBC6WDJ44NMC75X9Y8MWNA.png" alt="Codify" style={{ height: '40px' }} />
          <div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#BF057D' }}>PULSO</div>
            <div style={{ fontSize: '11px', color: '#E8E4F4' }}>by Codify</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button onClick={() => router.push('/login')} style={{ background: 'transparent', color: '#F3F0FB', border: '1px solid #BF057D', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>Iniciar sesión</button>
          <button onClick={() => router.push('/login')} style={{ background: '#BF057D', color: '#FFF', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '700' }}>Descubre tu valor</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: '80px 40px', textAlign: 'center', background: 'linear-gradient(135deg, #2D1B5E 0%, #1C1B2E 100%)' }}>
        <h1 style={{ fontSize: '56px', fontWeight: '800', marginBottom: '20px', color: '#F3F0FB' }}>
          Conoce tu <span style={{ color: '#BF057D' }}>verdadero valor</span> en el mercado
        </h1>
        <p style={{ fontSize: '20px', color: '#E8E4F4', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px' }}>
          PULSO homologa tu cargo y compara tu salario con el benchmark del mercado laboral chileno. Descubre si estás alineado, y obtén un plan personalizado para crecer.
        </p>
        <button onClick={() => router.push('/login')} style={{ background: '#BF057D', color: '#FFF', border: 'none', padding: '16px 48px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '700', boxShadow: '0 8px 20px rgba(191, 5, 125, 0.3)' }}>
          Comenzar análisis
        </button>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '80px 40px', background: '#1C1B2E' }}>
        <h2 style={{ fontSize: '40px', fontWeight: '700', textAlign: 'center', marginBottom: '60px', color: '#F3F0FB' }}>
          ¿Cómo funciona <span style={{ color: '#BF057D' }}>PULSO</span>?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>
          {[
            { icon: '📋', title: 'Completa el cuestionario', desc: 'Responde 8 pasos sobre tu perfil profesional, experiencia y competencias.' },
            { icon: '🎯', title: 'Homologación automática', desc: 'Tu cargo se alinea con 350k+ posiciones de Codify en el mercado chileno.' },
            { icon: '💰', title: 'Benchmark salarial', desc: 'Compara tu salario actual con P25, P50 y P75 del mercado para tu perfil.' },
            { icon: '📊', title: 'Análisis profundo', desc: 'Recibe un score, grade y reporte detallado con recomendaciones personalizadas.' },
            { icon: '💬', title: 'Consultor IA', desc: 'Chatea con nuestro asistente para obtener consejos sobre salario y desarrollo.' },
            { icon: '📄', title: 'Certificado visado', desc: 'Descarga un reporte oficial firmado por Codify con QR verificable.' },
          ].map((feature, i) => (
            <div key={i} style={{ background: '#2D1B5E', padding: '30px', borderRadius: '12px', border: '1px solid rgba(191, 5, 125, 0.2)', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: '#BF057D' }}>{feature.title}</h3>
              <p style={{ fontSize: '14px', color: '#E8E4F4', lineHeight: '1.6' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PASOS */}
      <section style={{ padding: '80px 40px', background: '#2D1B5E' }}>
        <h2 style={{ fontSize: '40px', fontWeight: '700', textAlign: 'center', marginBottom: '60px', color: '#F3F0FB' }}>
          4 pasos hacia tu <span style={{ color: '#BF057D' }}>valor real</span>
        </h2>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {[
            { step: '1', title: 'Cuéntanos sobre ti', desc: 'Completa un cuestionario sencillo con tu experiencia, educación y habilidades.' },
            { step: '2', title: 'Análisis de datos', desc: 'Nuestro sistema compara tu perfil con 350k+ posiciones del mercado chileno.' },
            { step: '3', title: 'Recibe tu reporte', desc: 'Obtén un análisis completo con score, benchmark salarial y plan de acción.' },
            { step: '4', title: 'Acciona y crece', desc: 'Usa los insights para negociar salario, buscar oportunidades o crecer profesionalmente.' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
              <div style={{ width: '60px', height: '60px', background: '#BF057D', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '700', color: '#FFF', flexShrink: 0 }}>
                {item.step}
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#F3F0FB', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ fontSize: '15px', color: '#E8E4F4', lineHeight: '1.6' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section style={{ padding: '80px 40px', background: '#1C1B2E' }}>
        <h2 style={{ fontSize: '40px', fontWeight: '700', textAlign: 'center', marginBottom: '60px', color: '#F3F0FB' }}>
          Lo que dicen nuestros usuarios
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
          {[
            { name: 'Carla M.', role: 'Software Engineer', text: '"Descubrí que estaba 15% bajo el mercado. PULSO me dio los datos para negociar un aumento."', rating: '⭐⭐⭐⭐⭐' },
            { name: 'Diego R.', role: 'Product Manager', text: '"El benchmark salarial fue sorprendente. Ahora sé exactamente dónde estoy posicionado en la industria."', rating: '⭐⭐⭐⭐⭐' },
            { name: 'Javier L.', role: 'Coordinador Logístico', text: '"El plan de desarrollo que me sugirió PULSO me ayudó a identificar qué skills mejorar para crecer."', rating: '⭐⭐⭐⭐⭐' },
          ].map((testimonial, i) => (
            <div key={i} style={{ background: '#2D1B5E', padding: '30px', borderRadius: '12px', border: '1px solid rgba(191, 5, 125, 0.2)' }}>
              <div style={{ fontSize: '14px', marginBottom: '12px', color: '#E8E4F4' }}>{testimonial.rating}</div>
              <p style={{ fontSize: '15px', color: '#F3F0FB', marginBottom: '16px', lineHeight: '1.6', fontStyle: 'italic' }}>{testimonial.text}</p>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#BF057D' }}>{testimonial.name}</div>
                <div style={{ fontSize: '12px', color: '#E8E4F4' }}>{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: '80px 40px', textAlign: 'center', background: '#2D1B5E' }}>
        <h2 style={{ fontSize: '40px', fontWeight: '700', marginBottom: '20px', color: '#F3F0FB' }}>
          ¿Listo para descubrir tu valor?
        </h2>
        <p style={{ fontSize: '18px', color: '#E8E4F4', marginBottom: '40px' }}>
          Toma el control de tu carrera. Análisis completo en 5 minutos.
        </p>
        <button onClick={() => router.push('/login')} style={{ background: '#BF057D', color: '#FFF', border: 'none', padding: '16px 48px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '700', boxShadow: '0 8px 20px rgba(191, 5, 125, 0.3)' }}>
          Comenzar ahora
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#1C1B2E', padding: '40px', textAlign: 'center', borderTop: '1px solid rgba(191, 5, 125, 0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <img src="https://codifyanalytics.com/storage/header-logos/01KSQBC6WDJ44NMC75X9Y8MWNA.png" alt="Codify" style={{ height: '30px' }} />
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#F3F0FB' }}>PULSO by Codify</div>
        </div>
        <p style={{ fontSize: '14px', color: '#E8E4F4', marginBottom: '12px' }}>
          Soluciones de análisis salarial y posicionamiento en el mercado laboral chileno
        </p>
        <p style={{ fontSize: '12px', color: '#666' }}>
          © 2026 Codify Analytics. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  )
}
