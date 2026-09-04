import { TOTAL_DAYS, type Tracker } from '@/lib/types'

/**
 * Gera um PNG do calendário de 30 dias do projeto, desenhado num canvas.
 * Desenhar manualmente evita problemas de CORS/fontes e garante um
 * resultado consistente para compartilhar.
 */
export function generateTrackerImage(tracker: Tracker): Promise<Blob> {
  // Paleta (light) alinhada ao tema da página — brand #17B7AB
  const BG = '#f9fbfb'
  const CARD = '#eef1f1'
  const BORDER = '#d9dfde'
  const CELL_BG = '#e3e7e7'
  const ACCENT = '#17b7ab'
  const ACCENT_FG = '#ffffff'
  const FG = '#1f2e2d'
  const MUTED = '#5b6664'

  const scale = 2 // exporta em 2x para nitidez
  const W = 1080
  const padding = 64
  const cols = 6
  const rows = 5
  const gap = 20
  const gridW = W - padding * 2
  const cell = (gridW - gap * (cols - 1)) / cols

  const headerH = 210
  const gridTop = headerH
  const gridH = cell * rows + gap * (rows - 1)
  const footerH = 90
  const H = gridTop + gridH + footerH

  const canvas = document.createElement('canvas')
  canvas.width = W * scale
  canvas.height = H * scale
  const ctx = canvas.getContext('2d')!
  ctx.scale(scale, scale)

  const doneCount = tracker.days.filter((d) => d.done).length
  const progress = Math.round((doneCount / TOTAL_DAYS) * 100)
  let currentStreak = 0
  for (const day of tracker.days) {
    if (day.done) currentStreak++
    else break
  }

  function roundRect(
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
  ) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + w, y, x + w, y + h, r)
    ctx.arcTo(x + w, y + h, x, y + h, r)
    ctx.arcTo(x, y + h, x, y, r)
    ctx.arcTo(x, y, x + w, y, r)
    ctx.closePath()
  }

  const font = (size: number, weight = '400') =>
    `${weight} ${size}px Inter, ui-sans-serif, system-ui, sans-serif`

  // Fundo
  ctx.fillStyle = BG
  ctx.fillRect(0, 0, W, H)

  // Cabeçalho
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = ACCENT
  ctx.font = font(20, '700')
  ctx.fillText('STREAK · ACOMPANHAMENTO DE 30 DIAS', padding, 64)

  ctx.fillStyle = FG
  ctx.font = font(52, '800')
  const title =
    tracker.name.length > 34
      ? tracker.name.slice(0, 33) + '…'
      : tracker.name
  ctx.fillText(title, padding, 122)

  ctx.fillStyle = MUTED
  ctx.font = font(24, '500')
  const streakLabel =
    currentStreak > 0 ? `${currentStreak} dias em sequência` : 'em andamento'
  ctx.fillText(
    `${doneCount} de ${TOTAL_DAYS} dias · ${progress}% · ${streakLabel}`,
    padding,
    162,
  )

  // Grade de 30 dias
  for (let i = 0; i < TOTAL_DAYS; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    const x = padding + col * (cell + gap)
    const y = gridTop + row * (cell + gap)
    const day = tracker.days[i]
    const hasMeta = Boolean(day.note.trim() || day.link.trim())

    if (day.done) {
      ctx.fillStyle = ACCENT
      roundRect(x, y, cell, cell, 18)
      ctx.fill()

      // marca de check
      ctx.strokeStyle = ACCENT_FG
      ctx.lineWidth = 8
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      const cx = x + cell / 2
      const cy = y + cell / 2
      const s = cell * 0.22
      ctx.beginPath()
      ctx.moveTo(cx - s, cy)
      ctx.lineTo(cx - s * 0.15, cy + s * 0.8)
      ctx.lineTo(cx + s, cy - s * 0.7)
      ctx.stroke()
    } else {
      ctx.fillStyle = CELL_BG
      roundRect(x, y, cell, cell, 18)
      ctx.fill()
      ctx.strokeStyle = BORDER
      ctx.lineWidth = 2
      roundRect(x, y, cell, cell, 18)
      ctx.stroke()

      ctx.fillStyle = MUTED
      ctx.font = font(34, '700')
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(String(i + 1), x + cell / 2, y + cell / 2 + 2)
      ctx.textAlign = 'left'
      ctx.textBaseline = 'alphabetic'
    }

    // marcador de nota/link
    if (hasMeta) {
      ctx.fillStyle = day.done ? ACCENT_FG : ACCENT
      ctx.beginPath()
      ctx.arc(x + cell - 16, y + 16, 5, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Rodapé
  ctx.fillStyle = MUTED
  ctx.font = font(22, '500')
  ctx.fillText('Feito com Streak · 30 dias de consistência', padding, H - 40)

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Falha ao gerar imagem'))
    }, 'image/png')
  })
}

export function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 40) || 'projeto'
  )
}
