import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { getServerSession } from 'next-auth'
import authOptions from './api/auth/[...nextauth]/authOptions'
import AuthSessionProvider from '@/providers/AuthSessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Spotify Media Player',
  description: 'A windows media player ',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <AuthSessionProvider session={session}>
      <body className={inter.className}>{children}</body>
      </AuthSessionProvider>
    </html>
  )
}
