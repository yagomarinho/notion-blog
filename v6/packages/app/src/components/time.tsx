export interface TimeProps {
  value: Date
}

function month(value: number) {
  const m = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ]

  return m[value] ?? ''
}

function time(value: Date): string {
  const now = new Date()
  const diff = now.getTime() - value.getTime()

  if (diff < 2 * 60 * 1000) return 'Agora Pouco'

  if (diff < 60 * 60 * 1000)
    return `${(diff / 60 / 1000).toFixed(0)} minutos atrás`

  if (diff < 2 * 60 * 60 * 1000) return `1 hora atrás`

  if (diff < 24 * 60 * 60 * 1000)
    return `${(diff / 60 / 60 / 1000).toFixed(0)} horas atrás`

  if (diff < 2 * 24 * 60 * 60 * 1000) return `1 dia atrás`

  if (diff < 7 * 24 * 60 * 60 * 1000)
    return `${(diff / 24 / 60 / 60 / 1000).toFixed(0)} dias atrás`

  const year = now.getFullYear()
  const postYear = value.getFullYear()
  const postMonth = value.getMonth()
  const postDay = value.getDate()

  if (year === postYear) return `${postDay}, ${month(postMonth)}`

  return `${month(postMonth)}, ${postYear}`
}

export const Time = ({ value }: TimeProps) => (
  <time className="text-sm md:text-base text-[#A2A2A2] ">{time(value)}</time>
)
