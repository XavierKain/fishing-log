import { useState } from 'react'
import type { Catch } from '../types'

interface Props { catch_: Catch; onDelete: () => void }

export default function CatchCard({ catch_: c, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden" onClick={() => setExpanded(!expanded)}>
      <div className="p-4 flex items-start gap-3">
        {c.photo && <img src={c.photo} alt={c.species} className="w-16 h-16 rounded-lg object-cover shrink-0" />}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-emerald-600/30 text-emerald-300 rounded-full text-xs font-medium">{c.species}</span>
            <span className="text-xs text-slate-500">{c.date}</span>
          </div>
          <div className="flex gap-3 text-sm text-slate-300">
            {c.weight != null && <span>{c.weight} {c.weightUnit}</span>}
            {c.length != null && <span>{c.length} {c.lengthUnit}</span>}
          </div>
          {c.location && <p className="text-xs text-slate-500 mt-1 truncate">📍 {c.location}</p>}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-2 text-sm border-t border-slate-700 pt-3">
          {c.bait && <p><span className="text-slate-500">Bait:</span> {c.bait}</p>}
          {c.waterCondition && <p><span className="text-slate-500">Water:</span> {c.waterCondition}</p>}
          {c.weather && <p><span className="text-slate-500">Weather:</span> {c.weather}</p>}
          {c.time && <p><span className="text-slate-500">Time:</span> {c.time}</p>}
          {c.notes && <p><span className="text-slate-500">Notes:</span> {c.notes}</p>}
          {c.photo && <img src={c.photo} alt={c.species} className="rounded-lg max-h-60 w-full object-contain" />}
          <div className="pt-2">
            {confirmDelete ? (
              <div className="flex gap-2">
                <button onClick={(e) => { e.stopPropagation(); onDelete() }} className="px-3 py-1 bg-red-600 rounded text-xs hover:bg-red-500">Confirm Delete</button>
                <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(false) }} className="px-3 py-1 bg-slate-600 rounded text-xs">Cancel</button>
              </div>
            ) : (
              <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(true) }} className="text-xs text-red-400 hover:text-red-300">Delete</button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
