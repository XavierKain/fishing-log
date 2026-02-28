import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/database'
import type { Catch } from '../types'

export function useCatches() {
  const catches = useLiveQuery(() => db.catches.orderBy('createdAt').reverse().toArray()) ?? []

  async function addCatch(c: Omit<Catch, 'id' | 'createdAt'>) {
    return db.catches.add({ ...c, createdAt: Date.now() })
  }

  async function deleteCatch(id: number) {
    return db.catches.delete(id)
  }

  async function updateCatch(id: number, changes: Partial<Catch>) {
    return db.catches.update(id, changes)
  }

  return { catches, addCatch, deleteCatch, updateCatch }
}
