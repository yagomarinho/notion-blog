'use client'

import { PropsWithChildren } from 'react'

export interface ButtonProps {
  type: 'primary' | 'secondary'
  onClick?: () => any
}

export const Button = ({
  type,
  onClick,
  children,
}: PropsWithChildren<ButtonProps>) => {
  const styles = {
    primary: { color: '#FFF', backgroundColor: '#447FFD' },
    secondary: { color: '#000000', backgroundColor: '#D2D2D2' },
  }

  return (
    <button
      className={`flex justify-center items-center px-3 py-4 font-roboto font-medium text-sm rounded]`}
      style={styles[type]}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  )
}
