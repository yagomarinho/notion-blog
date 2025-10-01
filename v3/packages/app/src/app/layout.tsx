import type { Metadata } from 'next'
import React from 'react'
import { Roboto, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'

import '@/styles/global.css'
import 'react-notion-x/src/styles.css'

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  weight: ['400', '500'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'Yago Marinho | Blog',
  description:
    'Blog Tech: Práticas modernas, arquiteturas escaláveis, testes, APIs e manutenção de aplicações web.',
}

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => (
  <html lang="pt-BR">
    <body
      className={mergeNames(
        `bg-[#080808] text-white w-screen h-<1> min-h-screen`,
        roboto.variable,
        inter.variable,
      )}
    >
      {children}
      <Analytics />
    </body>
  </html>
)

export default RootLayout

function mergeNames(...names: (string | undefined | false)[]): string {
  return names.filter(Boolean).join(' ')
}
