export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ color: '#BF057D', marginBottom: '20px' }}>Política de Privacidad</h1>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>1. Información que Recopilamos</h2>
        <p>Recopilamos información personal como nombre, email, y datos de salario para proporcionar nuestros servicios de análisis salarial.</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>2. Cómo Utilizamos la Información</h2>
        <p>Utilizamos tu información para: proporcionar análisis salarial personalizado, mejorar nuestros servicios, y cumplir con obligaciones legales.</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>3. Protección de Datos</h2>
        <p>Cumplimos con la LPDP 19.628 y adoptamos medidas de seguridad para proteger tus datos personales.</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>4. Derechos del Usuario</h2>
        <p>Tienes derecho a acceder, rectificar, o eliminar tus datos personales contactando a amartinez@codifyanalytics.com</p>
      </section>

      <p style={{ color: '#64748B', fontSize: '12px', marginTop: '40px' }}>Última actualización: {new Date().toLocaleDateString('es-CL')}</p>
    </div>
  );
}
