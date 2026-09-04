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
  const [showError, setShowError] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)

  // Sincroniza os campos ao abrir um dia diferente
  useEffect(() => {
    if (open) {
      setNote(entry.note)
      setLink(entry.link)
      setShowError(false)
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

  const isEmpty = !entry.done && !note.trim() && !link.trim()

  function handleSaveAndClose() {
    if (isEmpty) {
      setShowError(true)
      return
    }
    handleClose()
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
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={handleClose}
              aria-label="Fechar sem registrar"
              aria-describedby={showError ? 'close-hint' : undefined}
              className={`rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground ${
                showError ? 'bg-secondary text-foreground ring-2 ring-ring/50' : ''
              }`}
            >
              <X className="size-5" />
            </button>
            {showError ? (
              <div
                id="close-hint"
                role="status"
                className="pointer-events-none absolute right-0 top-full z-10 mt-2 w-44 rounded-lg border border-border bg-card px-3 py-2 text-xs leading-relaxed text-muted-foreground shadow-lg"
              >
                <span
                  aria-hidden="true"
                  className="absolute -top-1 right-3 size-2 rotate-45 border-l border-t border-border bg-card"
                />
                Para fechar sem salvar, use o{' '}
                <span className="font-semibold text-foreground">X</span> acima.
              </div>
            ) : null}
          </div>
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
              onChange={(e) => {
                setNote(e.target.value)
                if (showError) setShowError(false)
              }}
              rows={3}
              placeholder="O que você fez hoje?"
              aria-invalid={showError || undefined}
              className={`w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 ${
                showError
                  ? 'border-destructive focus:ring-destructive/30'
                  : 'border-input focus:ring-ring/40'
              }`}
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
              onChange={(e) => {
                setLink(e.target.value)
                if (showError) setShowError(false)
              }}
              placeholder="https://..."
              aria-invalid={showError || undefined}
              className={`w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 ${
                showError
                  ? 'border-destructive focus:ring-destructive/30'
                  : 'border-input focus:ring-ring/40'
              }`}
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

        {showError ? (
          <p role="alert" className="mt-4 text-sm text-destructive">
            Escreva uma nota ou adicione um link para salvar este dia.
          </p>
        ) : null}

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-destructive"
          >
            <Trash2 className="size-3.5" />
            Limpar
          </button>
          <Button onClick={handleSaveAndClose}>Salvar e fechar</Button>
        </div>
      </div>
    </div>
  )
}
