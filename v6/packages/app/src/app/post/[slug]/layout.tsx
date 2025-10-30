import React from 'react'

import 'react-notion-x/src/styles.css'
import 'prism-themes/themes/prism-dracula.css'

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => <>{children}</>

export default Layout
