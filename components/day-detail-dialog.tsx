'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ExternalLink, Trash2, X } from 'lucide-react'
import type { DayEntry } from '@/lib/types'
import { Button } from '@/components/ui/button'

type Props = {
  open: boolean
  dayNumber: number
  entry: DayEntry
  onClose: () => void
  onSave: (patch: Partial<DayEntry>) => void
  onToggleDone: () => void
}

export function DayDetailDialog({
  open,
  dayNumber,
  entry,
  onClose,
  onSave,
  onToggleDone,
}: Props) {
  const [note, setNote] = useState(entry.note)
  const [link, setLink] = useState(entry.link)
  const dialogRef = useRef<HTMLDivElement>(null)

  // Sincroniza os campos ao abrir um dia diferente
  useEffect(() => {
    if (open) {
      setNote(entry.note)
      setLink(entry.link)
    }
  }, [open, entry.note, entry.link])

  // Fecha com Escape
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  if (!open) return null

  function handleClose() {
    onSave({ note: note.trim(), link: link.trim() })
    onClose()
  }

  function handleClear() {
    setNote('')
    setLink('')
    onSave({ note: '', link: '' })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Detalhes do dia ${dayNumber}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-md rounded-t-2xl border border-border bg-card p-6 shadow-xl sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Dia {dayNumber} de 30
            </p>
            <h2 className="mt-1 text-xl font-bold text-card-foreground">
              {entry.done ? 'Dia concluído' : 'Registrar este dia'}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Fechar"
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={onToggleDone}
          className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
            entry.done
              ? 'border-accent bg-accent text-accent-foreground'
              : 'border-border bg-secondary text-secondary-foreground hover:border-accent/60'
          }`}
        >
          <Check className="size-4" />
          {entry.done ? 'Concluído — clique para desmarcar' : 'Marcar como feito'}
        </button>

        <div className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="day-note"
              className="mb-1.5 block text-sm font-medium text-card-foreground"
            >
              Nota
            </label>
            <textarea
              id="day-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="O que você fez hoje?"
              className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
            />
          </div>

          <div>
            <label
              htmlFor="day-link"
              className="mb-1.5 block text-sm font-medium text-card-foreground"
            >
              Link (opcional)
            </label>
            <input
              id="day-link"
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
            />
            {link.trim() ? (
              <a
                href={link.trim()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
              >
                <ExternalLink className="size-3" />
                Abrir link
              </a>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-destructive"
          >
            <Trash2 className="size-3.5" />
            Limpar
          </button>
          <Button onClick={handleClose}>Salvar e fechar</Button>
        </div>
      </div>
    </div>
  )
}
