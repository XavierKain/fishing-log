import { useState } from 'react'
import type { Catch } from '../types'
import CatchCard from './CatchCard'
import ExportButton from './ExportButton'

interface Props { catches: Catch[]; onDelete: (id: number) => void }

export default function CatchList({ catches, onDelete }: Props) {
  const [filter, setFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const filtered = catches.filter(c => {
    if (filter && !c.species.toLowerCase().includes(filter.toLowerCase()) && !c.location.toLowerCase().includes(filter.toLowerCase())) return false
    if (dateFrom && c.date < dateFrom) return false
    if (dateTo && c.date > dateTo) return false
    return true
  })

  const inputClass = 'bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-emerald-400">Your Catches</h2>
        <span className="text-sm text-slate-400">{filtered.length} catch{filtered.length !== 1 ? 'es' : ''}</span>
      </div>

      {/* Filters */}
      <div className="space-y-2">
        <input className={`${inputClass} w-full`} placeholder="Filter by species or location..." value={filter} onChange={e => setFilter(e.target.value)} />
        <div className="grid grid-cols-2 gap-2">
          <input type="date" className={inputClass} value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          <input type="date" className={inputClass} value={dateTo} onChange={e => setDateTo(e.target.value)} />
        </div>
      </div>

      {catches.length > 0 && <ExportButton catches={filtered} />}

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <p className="text-4xl mb-2">🐟</p>
          <p>{catches.length === 0 ? 'No catches yet — go fish!' : 'No matches for your filter.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => <CatchCard key={c.id} catch_={c} onDelete={() => c.id && onDelete(c.id)} />)}
        </div>
      )}
    </div>
  )
}
