import type { Metadata } from 'next'
import React from 'react'

import 'react-notion-x/src/styles.css'
import 'prism-themes/themes/prism-material-dark.css'

export const metadata: Metadata = {
  title: 'Notion Blog | Blog',
  description:
    'Blog Tech: Práticas modernas, arquiteturas escaláveis, testes, APIs e manutenção de aplicações web.',
}

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => <>{children}</>

export default Layout
