import { useState } from 'react'
import { db } from '../db/database'
import type { Catch } from '../types'

const SAMPLE_CATCHES: Omit<Catch, 'id'>[] = [
  { species: 'Bass', weight: 4.2, weightUnit: 'lbs', length: 18, lengthUnit: 'in', location: 'Lake Travis', lat: 30.3935, lng: -97.9003, date: '2026-02-15', time: '07:30', bait: 'Crankbait', waterCondition: 'Clear', weather: 'Sunny', photo: null, notes: 'Early morning bite, caught near the dock.', createdAt: Date.now() - 86400000 * 13 },
  { species: 'Trout', weight: 2.1, weightUnit: 'lbs', length: 14, lengthUnit: 'in', location: 'Blue River', lat: 39.4553, lng: -106.0447, date: '2026-02-10', time: '09:15', bait: 'Fly — Elk Hair Caddis', waterCondition: 'Clear', weather: 'Cloudy', photo: null, notes: 'Beautiful rainbow, catch and release.', createdAt: Date.now() - 86400000 * 18 },
  { species: 'Pike', weight: 8.7, weightUnit: 'lbs', length: 28, lengthUnit: 'in', location: 'Lake Minnetonka', lat: 44.9333, lng: -93.5833, date: '2026-01-28', time: '11:00', bait: 'Spinnerbait', waterCondition: 'Murky', weather: 'Overcast', photo: null, notes: 'Monster pike! Personal best.', createdAt: Date.now() - 86400000 * 31 },
  { species: 'Catfish', weight: 12.5, weightUnit: 'lbs', length: 26, lengthUnit: 'in', location: 'Mississippi River', lat: 38.6270, lng: -90.1994, date: '2026-02-20', time: '20:45', bait: 'Chicken liver', waterCondition: 'Stained', weather: 'Wind', photo: null, notes: 'Night fishing session, strong fight.', createdAt: Date.now() - 86400000 * 8 },
  { species: 'Walleye', weight: 3.8, weightUnit: 'lbs', length: 20, lengthUnit: 'in', location: 'Lake Erie', lat: 41.6839, lng: -81.7286, date: '2026-02-22', time: '06:00', bait: 'Jig + minnow', waterCondition: 'Stained', weather: 'Cloudy', photo: null, notes: 'Jigging near the reef, great action.', createdAt: Date.now() - 86400000 * 6 },
  { species: 'Salmon', weight: 9.3, weightUnit: 'lbs', length: 24, lengthUnit: 'in', location: 'Puget Sound', lat: 47.6062, lng: -122.3321, date: '2026-01-15', time: '05:30', bait: 'Herring cut plug', waterCondition: 'Clear', weather: 'Rain', photo: null, notes: 'King salmon, trolling at 80ft depth.', createdAt: Date.now() - 86400000 * 44 },
  { species: 'Crappie', weight: 1.2, weightUnit: 'lbs', length: 11, lengthUnit: 'in', location: 'Lake Travis', lat: 30.3980, lng: -97.8950, date: '2026-02-25', time: '16:00', bait: 'Small jig — chartreuse', waterCondition: 'Clear', weather: 'Sunny', photo: null, notes: 'Caught 8 total, kept 4 for dinner.', createdAt: Date.now() - 86400000 * 3 },
  { species: 'Redfish', weight: 6.5, weightUnit: 'lbs', length: 22, lengthUnit: 'in', location: 'Galveston Bay', lat: 29.2856, lng: -94.8614, date: '2026-02-18', time: '10:30', bait: 'Shrimp — live', waterCondition: 'Murky', weather: 'Wind', photo: null, notes: 'Slot red, great pull on light tackle.', createdAt: Date.now() - 86400000 * 10 },
  { species: 'Bluegill', weight: 0.6, weightUnit: 'lbs', length: 8, lengthUnit: 'in', location: 'Farm Pond', lat: 35.2271, lng: -80.8431, date: '2026-02-26', time: '14:00', bait: 'Worm', waterCondition: 'Clear', weather: 'Sunny', photo: null, notes: 'Teaching the kids to fish, they loved it.', createdAt: Date.now() - 86400000 * 2 },
  { species: 'Bass', weight: 5.8, weightUnit: 'lbs', length: 21, lengthUnit: 'in', location: 'Lake Fork', lat: 32.8618, lng: -95.5735, date: '2026-02-27', time: '08:00', bait: 'Texas rig — watermelon', waterCondition: 'Stained', weather: 'Overcast', photo: null, notes: 'Big largemouth off a submerged log.', createdAt: Date.now() - 86400000 * 1 },
]

export default function Settings() {
  const [importing, setImporting] = useState(false)
  const [done, setDone] = useState(false)
  const [clearing, setClearing] = useState(false)

  const importSample = async () => {
    setImporting(true)
    await db.catches.bulkAdd(SAMPLE_CATCHES as Catch[])
    setImporting(false)
    setDone(true)
    setTimeout(() => setDone(false), 3000)
  }

  const clearAll = async () => {
    await db.catches.clear()
    setClearing(false)
    setDone(true)
    setTimeout(() => setDone(false), 3000)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-emerald-400">Settings</h2>

      {done && (
        <div className="bg-emerald-600/20 border border-emerald-600/40 rounded-lg px-4 py-2 text-emerald-300 text-sm">
          ✅ Done!
        </div>
      )}

      {/* Sample Data */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 space-y-3">
        <h3 className="font-medium text-slate-200">Test Data</h3>
        <p className="text-sm text-slate-400">Load 10 sample catches with different species, locations, and GPS coordinates to test the app.</p>
        <button onClick={importSample} disabled={importing}
          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 rounded-lg text-sm font-medium transition-colors">
          {importing ? 'Importing...' : '📥 Import 10 Sample Catches'}
        </button>
      </div>

      {/* Clear Data */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 space-y-3">
        <h3 className="font-medium text-slate-200">Danger Zone</h3>
        {clearing ? (
          <div className="space-y-2">
            <p className="text-sm text-red-400">Are you sure? This will delete all your catches.</p>
            <div className="flex gap-2">
              <button onClick={clearAll} className="flex-1 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-medium transition-colors">Yes, Delete All</button>
              <button onClick={() => setClearing(false)} className="flex-1 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm font-medium transition-colors">Cancel</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setClearing(true)} className="w-full py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-600/40 text-red-400 rounded-lg text-sm font-medium transition-colors">
            🗑️ Clear All Catches
          </button>
        )}
      </div>

      {/* App Info */}
      <div className="text-center text-xs text-slate-600 space-y-1">
        <p>Fishing Catch Log v1.0</p>
        <p>Data stored locally on your device</p>
      </div>
    </div>
  )
}
