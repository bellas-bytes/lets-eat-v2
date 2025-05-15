import './globals.css'
import { Inter } from 'next/font/google'
import SessionProviderWrapper from './_components/SessionProviderWripper'
import Navbar from './_components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Club Site',
  description: 'Member-only club portal with events, team, and resources.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="cupcake">
      <body className={inter.className}>
        <SessionProviderWrapper>
          <Navbar />
          <main className="p-4 max-w-6xl mx-auto">{children}</main>
        </SessionProviderWrapper>
      </body>
    </html>
  )
}
