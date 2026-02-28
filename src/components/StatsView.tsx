import type { Catch } from '../types'

interface Props { catches: Catch[] }

export default function StatsView({ catches }: Props) {
  if (catches.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <p className="text-4xl mb-2">📊</p>
        <p>Log some catches to see your stats!</p>
      </div>
    )
  }

  // Species breakdown
  const bySpecies: Record<string, Catch[]> = {}
  catches.forEach(c => { (bySpecies[c.species] ??= []).push(c) })

  // Best month
  const byMonth: Record<string, number> = {}
  catches.forEach(c => { const m = c.date.slice(0, 7); byMonth[m] = (byMonth[m] ?? 0) + 1 })
  const bestMonth = Object.entries(byMonth).sort((a, b) => b[1] - a[1])[0]

  // Heaviest catch (normalize to lbs)
  const withWeight = catches.filter(c => c.weight != null)
  const heaviest = withWeight.length > 0
    ? withWeight.reduce((best, c) => {
        const w = c.weightUnit === 'kg' ? (c.weight ?? 0) * 2.205 : (c.weight ?? 0)
        const bw = best.weightUnit === 'kg' ? (best.weight ?? 0) * 2.205 : (best.weight ?? 0)
        return w > bw ? c : best
      })
    : null

  // Records per species
  const records = Object.entries(bySpecies).map(([species, list]) => {
    const biggest = list.filter(c => c.weight != null).sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0))[0]
    const longest = list.filter(c => c.length != null).sort((a, b) => (b.length ?? 0) - (a.length ?? 0))[0]
    return { species, count: list.length, biggest, longest }
  }).sort((a, b) => b.count - a.count)

  const cardClass = 'bg-slate-800 rounded-xl border border-slate-700 p-4'

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-emerald-400">Your Stats</h2>

      {/* Overview */}
      <div className="grid grid-cols-2 gap-3">
        <div className={cardClass}>
          <p className="text-2xl font-bold text-emerald-400">{catches.length}</p>
          <p className="text-xs text-slate-400">Total Catches</p>
        </div>
        <div className={cardClass}>
          <p className="text-2xl font-bold text-emerald-400">{Object.keys(bySpecies).length}</p>
          <p className="text-xs text-slate-400">Species</p>
        </div>
        {bestMonth && (
          <div className={cardClass}>
            <p className="text-lg font-bold text-emerald-400">{bestMonth[0]}</p>
            <p className="text-xs text-slate-400">Best Month ({bestMonth[1]} catches)</p>
          </div>
        )}
        {heaviest && (
          <div className={cardClass}>
            <p className="text-lg font-bold text-emerald-400">{heaviest.weight} {heaviest.weightUnit}</p>
            <p className="text-xs text-slate-400">Heaviest ({heaviest.species})</p>
          </div>
        )}
      </div>

      {/* Personal Records */}
      <h3 className="text-sm font-semibold text-slate-300 mt-4">Personal Records by Species</h3>
      <div className="space-y-2">
        {records.map(r => (
          <div key={r.species} className={`${cardClass} flex items-center justify-between`}>
            <div>
              <span className="px-2 py-0.5 bg-emerald-600/30 text-emerald-300 rounded-full text-xs font-medium">{r.species}</span>
              <span className="text-xs text-slate-400 ml-2">{r.count} catch{r.count !== 1 ? 'es' : ''}</span>
            </div>
            <div className="text-right text-xs text-slate-400">
              {r.biggest?.weight != null && <p>🏋️ {r.biggest.weight} {r.biggest.weightUnit}</p>}
              {r.longest?.length != null && <p>📏 {r.longest.length} {r.longest.lengthUnit}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
