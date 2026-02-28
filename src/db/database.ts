import Dexie, { type Table } from 'dexie'
import type { Catch } from '../types'

export class CatchDB extends Dexie {
  catches!: Table<Catch, number>

  constructor() {
    super('FishingCatchLog')
    this.version(1).stores({
      catches: '++id, species, location, date, createdAt',
    })
  }
}

export const db = new CatchDB()
