import { useState } from 'react'
import type { Tab } from './types'
import { useCatches } from './hooks/useCatches'
import CatchForm from './components/CatchForm'
import CatchList from './components/CatchList'
import StatsView from './components/StatsView'
import MapView from './components/MapView'

const tabs: { key: Tab; label: string; icon: string }[] = [
  { key: 'log', label: 'Log', icon: '📋' },
  { key: 'add', label: 'Add', icon: '➕' },
  { key: 'stats', label: 'Stats', icon: '📊' },
  { key: 'map', label: 'Map', icon: '🗺️' },
]

export default function App() {
  const [tab, setTab] = useState<Tab>('log')
  const { catches, addCatch, deleteCatch } = useCatches()

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-800/90 backdrop-blur border-b border-slate-700 px-4 py-3">
        <h1 className="text-xl font-bold text-emerald-400 text-center">🎣 Catch Log</h1>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-4">
        {tab === 'log' && <CatchList catches={catches} onDelete={deleteCatch} />}
        {tab === 'add' && <CatchForm onSave={async (c) => { await addCatch(c); setTab('log') }} />}
        {tab === 'stats' && <StatsView catches={catches} />}
        {tab === 'map' && <MapView catches={catches} />}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-800/95 backdrop-blur border-t border-slate-700 flex justify-around py-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex flex-col items-center gap-0.5 px-4 py-1 text-xs transition-colors ${
              tab === t.key ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-lg">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
