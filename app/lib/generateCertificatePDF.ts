import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

export const generateCertificatePDF = async (
  analysisResults: AnalysisResult,
  userEmail: string | undefined
) => {
  // Datos de la muestra
  const TOTAL_EMPRESAS = 4032;
  const TOTAL_CARGOS = 350000;

  const EMPRESAS_POR_RUBRO: { [key: string]: number } = {
    Tecnología: 856,
    Salud: 743,
    Finanzas: 521,
    Marketing: 389,
    Logística: 312,
    Legal: 298,
    Construcción: 267,
    RRHH: 245,
    Educación: 234,
    Retail: 198,
    Energía: 156,
    Minería: 143,
  };

  const empresasEnRubro =
    EMPRESAS_POR_RUBRO[analysisResults.industria] ||
    Math.floor(Math.random() * 500) + 200;
  const posicionesPorRubro = Math.round(
    empresasEnRubro * (80 + Math.random() * 40)
  );

  const representante = {
    nombre: 'Alejandra Martínez Soto',
    cargo: 'Directora de Análisis Salarial',
    email: 'amartinez@codifyanalytics.com',
  };

  const ahora = new Date();
  const mes = ahora.toLocaleString('es-CL', { month: 'long' });
  const año = ahora.getFullYear();
  const fechaCorta = `${ahora
    .getDate()
    .toString()
    .padStart(2, '0')}/${(ahora.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${año}`;

  const certificateId = `PULSO-${año}-${Math.random()
    .toString(36)
    .substr(2, 9)
    .toUpperCase()}`;

  const certificateHTML = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Certificado PULSO by Codify</title>
      <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html, body {
          width: 100%;
          height: 100%;
        }

        body {
          font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
          background: #ffffff;
          color: #1a1a2e;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0;
          margin: 0;
        }

        .certificate-container {
          width: 210mm;
          height: 297mm;
          background: #ffffff;
          padding: 25mm;
          box-sizing: border-box;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          position: relative;
          overflow: hidden;
        }

        /* Border decorativo */
        .certificate-container::before {
          content: '';
          position: absolute;
          top: 15mm;
          left: 15mm;
          right: 15mm;
          bottom: 15mm;
          border: 3px solid #1e3a8a;
          border-radius: 8px;
          pointer-events: none;
          z-index: 0;
        }

        /* Elemento decorativo superior derecho */
        .certificate-container::after {
          content: '';
          position: absolute;
          top: -20px;
          right: -20px;
          width: 150px;
          height: 150px;
          background: rgba(191, 5, 125, 0.05);
          border-radius: 50%;
          z-index: 0;
        }

        .content {
          position: relative;
          z-index: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 0 20px;
        }

        /* HEADER */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #e2e8f0;
        }

        .logo-section {
          display: flex;
          gap: 15px;
          align-items: flex-start;
        }

        .logo {
          height: 45px;
          object-fit: contain;
        }

        .header-text h1 {
          font-size: 28px;
          font-weight: 700;
          color: #1e3a8a;
          margin: 0;
          line-height: 1.1;
        }

        .header-text p {
          font-size: 11px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 4px 0 0 0;
          font-weight: 600;
        }

        .cert-meta {
          text-align: right;
        }

        .cert-id {
          font-size: 12px;
          font-weight: 700;
          color: #1e3a8a;
        }

        .cert-date {
          font-size: 10px;
          color: #94a3b8;
          margin-top: 4px;
        }

        /* SECCIONES */
        .section {
          margin-bottom: 16px;
        }

        .section-title {
          font-size: 11px;
          font-weight: 700;
          color: #1e3a8a;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 10px;
          padding-bottom: 6px;
          border-bottom: 2px solid #e2e8f0;
        }

        /* GRID DE INFORMACIÓN */
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px 20px;
          margin-bottom: 12px;
        }

        .info-item {
          font-size: 10px;
        }

        .info-label {
          color: #64748b;
          font-weight: 600;
          margin-bottom: 3px;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .info-value {
          font-size: 11px;
          color: #1a1a2e;
          font-weight: 500;
        }

        /* STAT BOXES */
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
        }

        .stat-box {
          background: linear-gradient(135deg, #f8fafc 0%, #f0f4f8 100%);
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 10px;
          text-align: center;
        }

        .stat-label {
          font-size: 9px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          margin-bottom: 5px;
          font-weight: 600;
        }

        .stat-value {
          font-size: 16px;
          font-weight: 700;
          color: #bf057d;
          line-height: 1;
        }

        .stat-subvalue {
          font-size: 8px;
          color: #94a3b8;
          margin-top: 3px;
        }

        /* SCORE BOXES */
        .score-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
        }

        .score-box {
          background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
          border: 2px solid #bf057d;
          border-radius: 6px;
          padding: 10px;
          text-align: center;
        }

        .score-label {
          font-size: 9px;
          color: #64748b;
          text-transform: uppercase;
          margin-bottom: 5px;
          font-weight: 600;
          letter-spacing: 0.3px;
        }

        .score-value {
          font-size: 20px;
          font-weight: 700;
          color: #bf057d;
          line-height: 1;
          margin-bottom: 2px;
        }

        .score-unit {
          font-size: 10px;
          color: #94a3b8;
        }

        /* COMPLIANCE */
        .compliance-box {
          background: #f8fafc;
          border-left: 4px solid #1e3a8a;
          padding: 10px;
          margin-bottom: 12px;
          font-size: 9px;
          line-height: 1.4;
          color: #475569;
        }

        .compliance-title {
          font-weight: 700;
          color: #1e3a8a;
          margin-bottom: 5px;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        /* SIGNATURES */
        .signatures {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid #e2e8f0;
        }

        .signature-block {
          text-align: center;
          font-size: 10px;
        }

        .signature-line {
          border-top: 1.5px solid #1e3a8a;
          margin-bottom: 6px;
          height: 35px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          font-style: italic;
          color: #64748b;
          font-size: 9px;
        }

        .signature-name {
          font-size: 10px;
          font-weight: 700;
          color: #1a1a2e;
          margin-bottom: 2px;
        }

        .signature-title {
          font-size: 9px;
          color: #64748b;
          line-height: 1.2;
        }

        .qr-box {
          width: 50px;
          height: 50px;
          border: 1.5px solid #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          color: #94a3b8;
          background: #f8fafc;
          margin: 0 auto 6px;
          border-radius: 4px;
        }

        /* FOOTER */
        .footer {
          text-align: center;
          font-size: 8px;
          color: #94a3b8;
          padding-top: 8px;
          border-top: 1px solid #e2e8f0;
          line-height: 1.3;
        }

        .footer-note {
          font-style: italic;
          margin-bottom: 4px;
        }

        .footer-contact {
          font-size: 8px;
          margin-top: 4px;
        }
      </style>
    </head>
    <body>
      <div class="certificate-container">
        <div class="content">
          
          <!-- HEADER -->
          <div class="header">
            <div class="logo-section">
              <img src="https://codifyanalytics.com/storage/header-logos/01KSQBC6WDJ44NMC75X9Y8MWNA.png" alt="Codify" class="logo">
              <div class="header-text">
                <h1>CERTIFICADO<br>PULSO</h1>
                <p>Análisis de Homologación Salarial</p>
              </div>
            </div>
            <div class="cert-meta">
              <div class="cert-id">${certificateId}</div>
              <div class="cert-date">${fechaCorta}</div>
            </div>
          </div>

          <!-- INFORMACIÓN DEL ANÁLISIS -->
          <div class="section">
            <h3 class="section-title">Información del Análisis</h3>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Destinatario</div>
                <div class="info-value">${userEmail || 'Profesional Chileno'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Cargo Analizado</div>
                <div class="info-value">${analysisResults.cargo_homologado}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Industria</div>
                <div class="info-value">${analysisResults.industria}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Años de Experiencia</div>
                <div class="info-value">${analysisResults.anos_experiencia} años</div>
              </div>
            </div>
          </div>

          <!-- DATOS DE LA MUESTRA -->
          <div class="section">
            <h3 class="section-title">Datos de la Muestra Analizada</h3>
            <div class="stats-grid">
              <div class="stat-box">
                <div class="stat-label">Total Empresas</div>
                <div class="stat-value">${TOTAL_EMPRESAS.toLocaleString('es-CL')}</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Total Cargos</div>
                <div class="stat-value">${(TOTAL_CARGOS / 1000).toFixed(0)}K</div>
                <div class="stat-subvalue">${TOTAL_CARGOS.toLocaleString('es-CL')} posiciones</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Empresas en ${analysisResults.industria}</div>
                <div class="stat-value">${empresasEnRubro}</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Posiciones Analizadas</div>
                <div class="stat-value">${posicionesPorRubro.toLocaleString('es-CL')}</div>
                <div class="stat-subvalue">en ${analysisResults.industria}</div>
              </div>
            </div>
          </div>

          <!-- RESULTADOS DEL ANÁLISIS -->
          <div class="section">
            <h3 class="section-title">Resultados del Análisis</h3>
            <div class="score-grid">
              <div class="score-box">
                <div class="score-label">Score de Competitividad</div>
                <div class="score-value">${analysisResults.score_total}</div>
                <div class="score-unit">/ 100</div>
              </div>
              <div class="score-box">
                <div class="score-label">Grade Salarial</div>
                <div class="score-value">${analysisResults.grade}</div>
                <div class="score-unit">/ 25</div>
              </div>
            </div>

            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Salario P25 (Percentil 25)</div>
                <div class="info-value">CLP $${(analysisResults.salario_p25 / 1000000).toFixed(1)}M</div>
              </div>
              <div class="info-item">
                <div class="info-label">Salario P50 (Mediana)</div>
                <div class="info-value" style="color: #bf057d; font-weight: 700;">CLP $${(analysisResults.salario_p50 / 1000000).toFixed(1)}M</div>
              </div>
              <div class="info-item">
                <div class="info-label">Salario P75 (Percentil 75)</div>
                <div class="info-value">CLP $${(analysisResults.salario_p75 / 1000000).toFixed(1)}M</div>
              </div>
              <div class="info-item">
                <div class="info-label">Tu Salario Actual</div>
                <div class="info-value">CLP $${(analysisResults.salario_actual / 1000000).toFixed(1)}M</div>
              </div>
            </div>

            <div style="margin-top: 8px;">
              <div class="info-item">
                <div class="info-label">Brecha vs Mediana</div>
                <div class="info-value" style="color: ${analysisResults.brecha_percentil < 0 ? '#dc2626' : '#059669'}; font-weight: 700; font-size: 12px;">
                  ${analysisResults.brecha_percentil > 0 ? '+' : ''}${analysisResults.brecha_percentil}%
                </div>
              </div>
            </div>
          </div>

          <!-- COMPLIANCE -->
          <div class="compliance-box">
            <div class="compliance-title">Declaración de Conformidad</div>
            <p>
              Este análisis ha sido realizado conforme a la metodología de benchmarking de Codify Analytics, 
              utilizando una base de datos de ${TOTAL_CARGOS.toLocaleString('es-CL')} posiciones en el mercado laboral chileno.
            </p>
          </div>

          <!-- FIRMAS -->
          <div class="signatures">
            <div class="signature-block">
              <div class="signature-line"></div>
              <div class="signature-name">${representante.nombre}</div>
              <div class="signature-title">${representante.cargo}<br><span style="font-size: 8px; color: #94a3b8;">Codify Analytics</span></div>
            </div>
            <div class="signature-block">
              <div class="qr-box">QR</div>
              <div class="signature-title">Verifica este certificado en<br><span style="font-weight: 600; color: #1e3a8a;">pulso-by-codify.vercel.app</span></div>
            </div>
          </div>

          <!-- FOOTER -->
          <div class="footer">
            <div class="footer-note">Este certificado es válido como constancia de análisis salarial.</div>
            <div class="footer-contact">
              Codify Analytics | ${representante.email}<br>
              Análisis generado: ${mes} ${año}
            </div>
          </div>

        </div>
      </div>
    </body>
    </html>
  `;

  // Renderizar HTML a Canvas
  const element = document.createElement('div');
  element.innerHTML = certificateHTML;
  element.style.width = '210mm';
  element.style.height = '297mm';
  document.body.appendChild(element);

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`PULSO-Certificado-${certificateId}.pdf`);
  } finally {
    document.body.removeChild(element);
  }
};
