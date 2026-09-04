'use client'

import { useState } from 'react'
import { Flower2, Plus } from 'lucide-react'
import { useTrackers } from '@/lib/use-trackers'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
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
    <main className="flex min-h-svh min-w-[360px] flex-col">
      {/* Topo / marca — logo sempre no topo */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <Flower2 className="size-5 text-accent" />
          <span className="text-lg font-bold tracking-tight">Streak</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground desktop:inline">
            Acompanhamento de 30 dias
          </span>
          <ThemeToggle />
        </div>
      </header>

      {/* Formulário para adicionar tracker — no mobile/tablet fica logo abaixo da logo */}
      <section className="order-1 mx-auto w-full max-w-lg px-6 pt-2 desktop:order-3 desktop:pt-0 desktop:mt-6">
        <form onSubmit={handleSubmit} className="flex gap-2 desktop:gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex.: 30 dias de código, lançar meu app..."
            aria-label="Nome do projeto para acompanhar"
            className="h-12 min-h-11 flex-1 rounded-xl border border-input bg-card px-4 text-base text-foreground shadow-sm outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
          />
          <Button
            type="submit"
            aria-label="Adicionar projeto"
            className="h-12 min-h-11 w-12 shrink-0 gap-2 px-0 text-base desktop:w-auto desktop:px-5"
            disabled={!name.trim()}
          >
            <Plus className="size-5" />
            <span className="hidden desktop:inline">Adicionar</span>
          </Button>
        </form>
      </section>

      {/* Hero — escondido no mobile/tablet */}
      <section className="order-2 mx-auto hidden max-w-3xl px-6 pb-4 pt-8 text-center desktop:block desktop:pt-14">
        <div className="mx-auto flex justify-center">
          <TrackingAnimation className="h-40 w-52 sm:h-48 sm:w-64" />
        </div>

        <h1 className="mt-2 text-balance text-[clamp(2rem,1.1rem+2.4vw,3.5rem)] font-extrabold leading-[1.1] tracking-tight text-foreground">
          Acompanhe seu projeto,
          <br />
          um dia de cada vez
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Dê um nome ao seu projeto e vá marcando os dias, um a um. Você tem 30
          no total. Anote o que fez, guarde o link, no seu ritmo.
        </p>
      </section>

      {/* Lista de trackers */}
      <section className="order-3 mx-auto w-full max-w-6xl px-6 pb-24 pt-10 desktop:order-4">
        {!loaded ? null : trackers.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
            <Flower2 className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              Nenhum projeto ainda. Adicione seu primeiro projeto acima para
              começar o acompanhamento de 30 dias.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 tablet:grid-cols-2 desktop:grid-cols-3">
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
