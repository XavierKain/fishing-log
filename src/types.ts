export interface Catch {
  id?: number
  species: string
  weight: number | null
  weightUnit: 'kg' | 'lbs'
  length: number | null
  lengthUnit: 'cm' | 'in'
  location: string
  lat: number | null
  lng: number | null
  date: string
  time: string
  bait: string
  waterCondition: string
  weather: string
  photo: string | null
  notes: string
  createdAt: number
}

export type Tab = 'log' | 'add' | 'stats' | 'map'
