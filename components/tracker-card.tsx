'use client'

import { useState } from 'react'
import {
  Check,
  Link2,
  Loader2,
  Share2,
  StickyNote,
  Trash2,
} from 'lucide-react'
import { TOTAL_DAYS, type DayEntry, type Tracker } from '@/lib/types'
import { DayDetailDialog } from '@/components/day-detail-dialog'
import { generateTrackerImage, slugify } from '@/lib/share-image'

type Props = {
  tracker: Tracker
  onToggleDay: (dayIndex: number) => void
  onUpdateDay: (dayIndex: number, patch: Partial<DayEntry>) => void
  onRemove: () => void
}

export function TrackerCard({
  tracker,
  onToggleDay,
  onUpdateDay,
  onRemove,
}: Props) {
  const [openDay, setOpenDay] = useState<number | null>(null)
  const [sharing, setSharing] = useState(false)

  async function handleShare() {
    if (sharing) return
    setSharing(true)
    try {
      const blob = await generateTrackerImage(tracker)
      const file = new File([blob], `${slugify(tracker.name)}-30-dias.png`, {
        type: 'image/png',
      })

      // Usa o compartilhamento nativo quando disponível (celular)
      if (
        typeof navigator !== 'undefined' &&
        navigator.canShare?.({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title: tracker.name,
          text: `Meu acompanhamento de 30 dias: ${tracker.name}`,
        })
      } else {
        // Fallback: baixa o PNG
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = file.name
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
      }
    } catch (err) {
      // usuário cancelou o share nativo ou ocorreu erro — ignora
      console.log('[v0] share cancelado/erro:', err)
    } finally {
      setSharing(false)
    }
  }

  const doneCount = tracker.days.filter((d) => d.done).length
  const progress = Math.round((doneCount / TOTAL_DAYS) * 100)

  // Sequência atual: dias consecutivos concluídos a partir do início
  let currentStreak = 0
  for (const day of tracker.days) {
    if (day.done) currentStreak++
    else break
  }

  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold text-card-foreground">
            {tracker.name}
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {doneCount} de {TOTAL_DAYS} dias · {progress}% ·{' '}
            {currentStreak > 0
              ? `${currentStreak} em sequência`
              : 'comece hoje'}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={handleShare}
            disabled={sharing}
            aria-label={`Compartilhar calendário de ${tracker.name} em PNG`}
            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-accent disabled:opacity-60"
          >
            {sharing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Share2 className="size-4" />
            )}
            <span className="hidden sm:inline">
              {sharing ? 'Gerando…' : 'PNG'}
            </span>
          </button>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remover ${tracker.name}`}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </header>

      {/* Barra de progresso */}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Grade de 30 dias */}
      <div className="mt-5 grid grid-cols-6 gap-2 sm:grid-cols-10">
        {tracker.days.map((day, i) => {
          const hasMeta = Boolean(day.note.trim() || day.link.trim())
          return (
            <button
              key={i}
              type="button"
              onClick={() => setOpenDay(i)}
              aria-label={`Dia ${i + 1}${day.done ? ', concluído' : ''}`}
              aria-pressed={day.done}
              className={`group relative flex aspect-square items-center justify-center rounded-lg border text-sm font-semibold transition-all ${
                day.done
                  ? 'border-accent bg-accent text-accent-foreground'
                  : 'border-border bg-secondary/60 text-muted-foreground hover:border-accent/50 hover:bg-secondary'
              }`}
            >
              {day.done ? (
                <Check className="size-4" />
              ) : (
                <span>{i + 1}</span>
              )}
              {hasMeta ? (
                <span
                  className={`absolute right-1 top-1 flex size-1.5 rounded-full ${
                    day.done ? 'bg-accent-foreground/70' : 'bg-accent'
                  }`}
                  aria-hidden="true"
                />
              ) : null}
            </button>
          )
        })}
      </div>

      {/* Legenda */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <StickyNote className="size-3.5" /> Toque num dia para registrar
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Link2 className="size-3.5" /> Adicione nota ou link
        </span>
      </div>

      {openDay !== null ? (
        <DayDetailDialog
          open={openDay !== null}
          dayNumber={openDay + 1}
          entry={tracker.days[openDay]}
          onClose={() => setOpenDay(null)}
          onSave={(patch) => onUpdateDay(openDay, patch)}
          onToggleDone={() => onToggleDay(openDay)}
        />
      ) : null}
    </article>
  )
}
