import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import './wallet.css'  // Add this line
import Providers from './WalletConnectionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Token Gated Voting',
  description: 'A Solana token-gated voting platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 min-h-screen`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}