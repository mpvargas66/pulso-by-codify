import './globals.css'

export const metadata = {
  title: 'Pulso by Codify',
  description: 'Toma el pulso del mercado salarial con la metodología Codify',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
