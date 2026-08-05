'use client';

interface TermsModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export function TermsModal({ isOpen, onAccept, onDecline }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '12px',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'auto',
        padding: '40px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
      }}>
        <h2 style={{ color: '#BF057D', marginBottom: '20px', fontSize: '24px', fontWeight: '700' }}>
          Términos y Condiciones
        </h2>

        <div style={{ marginBottom: '30px', color: '#334155', lineHeight: '1.6', fontSize: '14px' }}>
          <section style={{ marginBottom: '20px' }}>
            <h3 style={{ fontWeight: '600', marginBottom: '8px', color: '#0F172A' }}>1. Aceptación de Términos</h3>
            <p>Al utilizar PULSO by Codify, aceptas estos términos y condiciones. Si no estás de acuerdo, no uses el servicio.</p>
          </section>

          <section style={{ marginBottom: '20px' }}>
            <h3 style={{ fontWeight: '600', marginBottom: '8px', color: '#0F172A' }}>2. Descripción del Servicio</h3>
            <p>PULSO proporciona análisis salarial basado en benchmarking del mercado laboral chileno, homologación de cargos, y recomendaciones personalizadas.</p>
          </section>

          <section style={{ marginBottom: '20px' }}>
            <h3 style={{ fontWeight: '600', marginBottom: '8px', color: '#0F172A' }}>3. Responsabilidades del Usuario</h3>
            <ul style={{ marginLeft: '20px' }}>
              <li>Proporcionar información exacta y veraz</li>
              <li>Mantener la confidencialidad de tu cuenta</li>
              <li>Usar el servicio de manera legal y ética</li>
            </ul>
          </section>

          <section style={{ marginBottom: '20px' }}>
            <h3 style={{ fontWeight: '600', marginBottom: '8px', color: '#0F172A' }}>4. Protección de Datos</h3>
            <p>Cumplimos con la LPDP 19.628 y adoptamos medidas de seguridad para proteger tus datos personales.</p>
          </section>

          <section>
            <h3 style={{ fontWeight: '600', marginBottom: '8px', color: '#0F172A' }}>5. Limitación de Responsabilidad</h3>
            <p>PULSO proporciona análisis basados en datos disponibles. No garantizamos exactitud absoluta ni nos responsabilizamos por decisiones basadas en nuestros análisis.</p>
          </section>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onDecline}
            style={{
              padding: '12px 24px',
              background: '#E2E8F0',
              color: '#334155',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#CBD5E1'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#E2E8F0'}
          >
            Rechazar
          </button>
          <button
            onClick={onAccept}
            style={{
              padding: '12px 24px',
              background: '#BF057D',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#9A0462'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#BF057D'}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
