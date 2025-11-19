import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  title: 'AFHS Football Inventory',
  description: 'American Fork High School Football Equipment Inventory Tracker',
  manifest: '/manifest.json',
  themeColor: '#DC2626',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        {children}
        <Analytics />
      </body>
    </html>
  )
}

