import './globals.css'

export const metadata = {
  title: 'Crypto AI Analyst',
  description: 'AI-powered cryptocurrency analysis tool',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}