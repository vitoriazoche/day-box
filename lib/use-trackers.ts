'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  createTracker,
  type DayEntry,
  type Tracker,
} from '@/lib/types'

const STORAGE_KEY = 'streak.trackers.v1'

export function useTrackers() {
  const [trackers, setTrackers] = useState<Tracker[]>([])
  const [loaded, setLoaded] = useState(false)

  // Carrega do localStorage no mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Tracker[]
        if (Array.isArray(parsed)) setTrackers(parsed)
      }
    } catch {
      // ignora dados corrompidos
    }
    setLoaded(true)
  }, [])

  // Persiste sempre que muda (após carregar)
  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trackers))
    } catch {
      // storage cheio ou indisponível
    }
  }, [trackers, loaded])

  const addTracker = useCallback((name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setTrackers((prev) => [createTracker(trimmed), ...prev])
  }, [])

  const removeTracker = useCallback((id: string) => {
    setTrackers((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const renameTracker = useCallback((id: string, name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setTrackers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, name: trimmed } : t)),
    )
  }, [])

  const updateDay = useCallback(
    (trackerId: string, dayIndex: number, patch: Partial<DayEntry>) => {
      setTrackers((prev) =>
        prev.map((t) => {
          if (t.id !== trackerId) return t
          const days = t.days.map((d, i) =>
            i === dayIndex ? { ...d, ...patch } : d,
          )
          return { ...t, days }
        }),
      )
    },
    [],
  )

  const toggleDay = useCallback((trackerId: string, dayIndex: number) => {
    setTrackers((prev) =>
      prev.map((t) => {
        if (t.id !== trackerId) return t
        const days = t.days.map((d, i) => {
          if (i !== dayIndex) return d
          const done = !d.done
          return {
            ...d,
            done,
            completedAt: done ? new Date().toISOString() : null,
          }
        })
        return { ...t, days }
      }),
    )
  }, [])

  return {
    trackers,
    loaded,
    addTracker,
    removeTracker,
    renameTracker,
    updateDay,
    toggleDay,
  }
}
