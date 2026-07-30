export const metadata = {
  title: 'Pulso by Codify',
  description: 'Evalúa tu posición en el mercado laboral con la metodología Codify',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
