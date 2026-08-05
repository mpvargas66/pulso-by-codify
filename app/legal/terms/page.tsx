export default function TermsPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ color: '#BF057D', marginBottom: '20px' }}>Términos y Condiciones</h1>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>1. Aceptación de Términos</h2>
        <p>Al utilizar PULSO by Codify, aceptas estos términos y condiciones. Si no estás de acuerdo, no uses el servicio.</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>2. Descripción del Servicio</h2>
        <p>PULSO proporciona análisis salarial basado en benchmarking del mercado laboral chileno, homologación de cargos, y recomendaciones personalizadas.</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>3. Responsabilidades del Usuario</h2>
        <ul style={{ marginLeft: '20px' }}>
          <li>Proporcionar información exacta y veraz</li>
          <li>Mantener la confidencialidad de tu cuenta</li>
          <li>Usar el servicio de manera legal y ética</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>4. Limitación de Responsabilidad</h2>
        <p>PULSO proporciona análisis basados en datos disponibles. No garantizamos exactitud absoluta ni nos responsabilizamos por decisiones basadas en nuestros análisis.</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>5. Modificaciones de Términos</h2>
        <p>Nos reservamos el derecho de modificar estos términos. Se notificará a los usuarios de cambios significativos.</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>6. Contacto</h2>
        <p>Para consultas sobre estos términos, contacta a: amartinez@codifyanalytics.com</p>
      </section>

      <p style={{ color: '#64748B', fontSize: '12px', marginTop: '40px' }}>Última actualización: {new Date().toLocaleDateString('es-CL')}</p>
    </div>
  );
}
