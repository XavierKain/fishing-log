import { useState } from 'react'
import { db } from '../db/database'
import type { Catch } from '../types'

// Simple fish SVG generator with species-specific colors
function fishSvg(color: string, bgColor: string, label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <rect width="400" height="300" fill="${bgColor}" rx="12"/>
    <g transform="translate(200,130)">
      <ellipse cx="0" cy="0" rx="90" ry="45" fill="${color}" opacity="0.9"/>
      <polygon points="90,-30 130,0 90,30" fill="${color}" opacity="0.8"/>
      <polygon points="-20,-45 0,-65 10,-40" fill="${color}" opacity="0.7"/>
      <circle cx="-50" cy="-10" r="7" fill="white"/>
      <circle cx="-48" cy="-10" r="4" fill="#1e293b"/>
      <ellipse cx="10" cy="10" rx="30" ry="8" fill="${bgColor}" opacity="0.15"/>
      <line x1="-20" y1="5" x2="40" y2="5" stroke="${bgColor}" stroke-width="1" opacity="0.2"/>
      <line x1="-20" y1="15" x2="35" y2="15" stroke="${bgColor}" stroke-width="1" opacity="0.2"/>
    </g>
    <text x="200" y="220" text-anchor="middle" fill="white" font-family="sans-serif" font-size="18" font-weight="bold" opacity="0.9">${label}</text>
    <text x="200" y="245" text-anchor="middle" fill="white" font-family="sans-serif" font-size="12" opacity="0.5">Catch Log</text>
    <!-- water ripples -->
    <ellipse cx="100" cy="270" rx="60" ry="4" fill="white" opacity="0.05"/>
    <ellipse cx="300" cy="280" rx="50" ry="3" fill="white" opacity="0.05"/>
  </svg>`
  return 'data:image/svg+xml,' + encodeURIComponent(svg)
}

const SAMPLE_CATCHES: Omit<Catch, 'id'>[] = [
  {
    species: 'Largemouth Bass', weight: 4.2, weightUnit: 'lbs', length: 18, lengthUnit: 'in',
    location: 'Lake Travis, Austin TX', lat: 30.3935, lng: -97.9003,
    date: '2026-02-15', time: '07:30', bait: 'Crankbait - shad pattern',
    waterCondition: 'Clear', weather: 'Sunny',
    photo: fishSvg('#4ade80', '#1a3a2a', 'Largemouth Bass - 4.2 lbs'),
    notes: 'Early morning topwater bite near the marina dock. Water temp 62°F.', createdAt: Date.now() - 86400000 * 13
  },
  {
    species: 'Rainbow Trout', weight: 2.1, weightUnit: 'lbs', length: 14, lengthUnit: 'in',
    location: 'Blue River, Silverthorne CO', lat: 39.6333, lng: -106.0703,
    date: '2026-02-10', time: '09:15', bait: 'Fly - Elk Hair Caddis #16',
    waterCondition: 'Clear', weather: 'Cloudy',
    photo: fishSvg('#f472b6', '#2a1a2e', 'Rainbow Trout - 2.1 lbs'),
    notes: 'Beautiful colors on this one. Catch & release. Air temp 38°F, light snow.', createdAt: Date.now() - 86400000 * 18
  },
  {
    species: 'Northern Pike', weight: 8.7, weightUnit: 'lbs', length: 28, lengthUnit: 'in',
    location: 'Lake Minnetonka, MN', lat: 44.9333, lng: -93.5833,
    date: '2026-01-28', time: '11:00', bait: 'Spinnerbait - white/chartreuse',
    waterCondition: 'Murky', weather: 'Overcast',
    photo: fishSvg('#a3e635', '#1a2a1a', 'Northern Pike - 8.7 lbs'),
    notes: 'Monster pike in the weed bed! 15 min fight. Water temp 45°F, wind 10mph NW.', createdAt: Date.now() - 86400000 * 31
  },
  {
    species: 'Channel Catfish', weight: 12.5, weightUnit: 'lbs', length: 26, lengthUnit: 'in',
    location: 'Mississippi River, St. Louis MO', lat: 38.6270, lng: -90.1994,
    date: '2026-02-20', time: '20:45', bait: 'Chicken liver on circle hook',
    waterCondition: 'Stained', weather: 'Wind',
    photo: fishSvg('#a78bfa', '#1a1a2e', 'Channel Catfish - 12.5 lbs'),
    notes: 'Night session on the bank. Strong current, had to use 3oz sinker. Air 52°F.', createdAt: Date.now() - 86400000 * 8
  },
  {
    species: 'Walleye', weight: 3.8, weightUnit: 'lbs', length: 20, lengthUnit: 'in',
    location: 'Lake Erie, Cleveland OH', lat: 41.6839, lng: -81.7286,
    date: '2026-02-22', time: '06:00', bait: 'Jig + live minnow',
    waterCondition: 'Stained', weather: 'Cloudy',
    photo: fishSvg('#fbbf24', '#2a2a1a', 'Walleye - 3.8 lbs'),
    notes: 'Jigging the reef edge at 18ft. Water temp 40°F, barometric pressure dropping.', createdAt: Date.now() - 86400000 * 6
  },
  {
    species: 'King Salmon', weight: 9.3, weightUnit: 'lbs', length: 24, lengthUnit: 'in',
    location: 'Puget Sound, Seattle WA', lat: 47.6062, lng: -122.3321,
    date: '2026-01-15', time: '05:30', bait: 'Herring cut plug - chartreuse',
    waterCondition: 'Clear', weather: 'Rain',
    photo: fishSvg('#fb923c', '#2a1a1a', 'King Salmon - 9.3 lbs'),
    notes: 'Trolling at 80ft with downrigger. Steady rain, air 42°F. Kept for smoking.', createdAt: Date.now() - 86400000 * 44
  },
  {
    species: 'Crappie', weight: 1.2, weightUnit: 'lbs', length: 11, lengthUnit: 'in',
    location: 'Lake Fork, East TX', lat: 32.8618, lng: -95.5735,
    date: '2026-02-25', time: '16:00', bait: 'Small jig - chartreuse/white',
    waterCondition: 'Clear', weather: 'Sunny',
    photo: fishSvg('#67e8f9', '#1a2a2e', 'Crappie - 1.2 lbs'),
    notes: 'Found a school in 12ft near standing timber. Caught 8 total, kept 4 for dinner. 72°F.', createdAt: Date.now() - 86400000 * 3
  },
  {
    species: 'Redfish', weight: 6.5, weightUnit: 'lbs', length: 22, lengthUnit: 'in',
    location: 'Galveston Bay, TX', lat: 29.2856, lng: -94.8614,
    date: '2026-02-18', time: '10:30', bait: 'Live shrimp under popping cork',
    waterCondition: 'Murky', weather: 'Wind',
    photo: fishSvg('#f87171', '#2a1a1a', 'Redfish - 6.5 lbs'),
    notes: 'Slot red on the grass flat. Wind 15mph SE, incoming tide. Water temp 58°F.', createdAt: Date.now() - 86400000 * 10
  },
  {
    species: 'Bluegill', weight: 0.6, weightUnit: 'lbs', length: 8, lengthUnit: 'in',
    location: 'Harris Farm Pond, Charlotte NC', lat: 35.2271, lng: -80.8431,
    date: '2026-02-26', time: '14:00', bait: 'Red worm on bobber',
    waterCondition: 'Clear', weather: 'Sunny',
    photo: fishSvg('#60a5fa', '#1a1a2e', 'Bluegill - 0.6 lbs'),
    notes: 'Teaching the kids to fish - they loved it! Warm afternoon, 68°F, no wind.', createdAt: Date.now() - 86400000 * 2
  },
  {
    species: 'Largemouth Bass', weight: 5.8, weightUnit: 'lbs', length: 21, lengthUnit: 'in',
    location: 'Sam Rayburn Reservoir, TX', lat: 31.0650, lng: -94.1021,
    date: '2026-02-27', time: '08:00', bait: 'Texas rig - watermelon Senko',
    waterCondition: 'Stained', weather: 'Overcast',
    photo: fishSvg('#34d399', '#1a2e2a', 'Largemouth Bass - 5.8 lbs'),
    notes: 'Big girl off a submerged log in 6ft. Overcast, air 60°F, barometer steady.', createdAt: Date.now() - 86400000 * 1
  },
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

      <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 space-y-3">
        <h3 className="font-medium text-slate-200">Test Data</h3>
        <p className="text-sm text-slate-400">Load 10 sample catches with photos, GPS pins on real fishing spots, weather conditions, water temps, and detailed notes.</p>
        <button onClick={importSample} disabled={importing}
          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 rounded-lg text-sm font-medium transition-colors">
          {importing ? 'Importing...' : '📥 Import 10 Sample Catches'}
        </button>
      </div>

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

      <div className="text-center text-xs text-slate-600 space-y-1">
        <p>Fishing Catch Log v1.0</p>
        <p>Data stored locally on your device</p>
      </div>
    </div>
  )
}
