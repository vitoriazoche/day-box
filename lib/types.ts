export type DayEntry = {
  /** dia 1..30 marcado como concluído */
  done: boolean
  /** nota livre sobre o que foi feito */
  note: string
  /** link opcional (commit, arquivo, post, etc.) */
  link: string
  /** timestamp ISO de quando foi concluído */
  completedAt: string | null
}

export type Tracker = {
  id: string
  name: string
  createdAt: string
  /** 30 posições, indexadas de 0 a 29 */
  days: DayEntry[]
}

export const TOTAL_DAYS = 30

export function createEmptyDays(): DayEntry[] {
  return Array.from({ length: TOTAL_DAYS }, () => ({
    done: false,
    note: '',
    link: '',
    completedAt: null,
  }))
}

export function createTracker(name: string): Tracker {
  return {
    id:
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2),
    name: name.trim(),
    createdAt: new Date().toISOString(),
    days: createEmptyDays(),
  }
}
