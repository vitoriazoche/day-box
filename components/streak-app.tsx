'use client'

import { useState } from 'react'
import { Flower2, Plus } from 'lucide-react'
import { useTrackers } from '@/lib/use-trackers'
import { Button } from '@/components/ui/button'
import { TrackerCard } from '@/components/tracker-card'
import { TrackingAnimation } from '@/components/tracking-animation'

export function StreakApp() {
  const {
    trackers,
    loaded,
    addTracker,
    removeTracker,
    updateDay,
    toggleDay,
  } = useTrackers()
  const [name, setName] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    addTracker(name)
    setName('')
  }

  return (
    <main className="min-h-svh">
      {/* Topo / marca */}
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <Flower2 className="size-5 text-accent" />
          <span className="text-lg font-bold tracking-tight">Streak</span>
        </div>
        <span className="text-sm text-muted-foreground">
          Acompanhamento de 30 dias
        </span>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pb-4 pt-8 text-center sm:pt-14">
        <div className="mx-auto flex justify-center">
          <TrackingAnimation className="size-40 sm:size-48" />
        </div>

        <h1 className="mt-2 text-balance text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
          Acompanhe seu projeto,
          <br />
          um dia de cada vez
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Dê um nome ao projeto que você quer acompanhar e registre cada dia de
          trabalho. São 30 casas para 30 dias de acompanhamento — marque, anote
          o que fez e guarde o link, no seu ritmo, seguidos ou não.
        </p>

        {/* Formulário para adicionar tracker */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex.: 30 dias de código, lançar meu app..."
            aria-label="Nome do projeto para acompanhar"
            className="h-12 flex-1 rounded-xl border border-input bg-card px-4 text-base text-foreground shadow-sm outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
          />
          <Button
            type="submit"
            className="h-12 gap-2 px-5 text-base"
            disabled={!name.trim()}
          >
            <Plus className="size-5" />
            Adicionar
          </Button>
        </form>
      </section>

      {/* Lista de trackers */}
      <section className="mx-auto max-w-5xl px-6 pb-24 pt-10">
        {!loaded ? null : trackers.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
            <Flower2 className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              Nenhum projeto ainda. Adicione seu primeiro projeto acima para
              começar o acompanhamento de 30 dias.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {trackers.map((tracker) => (
              <TrackerCard
                key={tracker.id}
                tracker={tracker}
                onToggleDay={(dayIndex) => toggleDay(tracker.id, dayIndex)}
                onUpdateDay={(dayIndex, patch) =>
                  updateDay(tracker.id, dayIndex, patch)
                }
                onRemove={() => removeTracker(tracker.id)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
