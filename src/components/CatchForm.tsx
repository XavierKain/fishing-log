import { useState, useRef } from 'react'
import type { Catch } from '../types'

const SPECIES = ['Bass', 'Trout', 'Pike', 'Catfish', 'Walleye', 'Perch', 'Salmon', 'Carp', 'Crappie', 'Bluegill', 'Muskie', 'Redfish', 'Snook', 'Tarpon', 'Other']
const WATER = ['Clear', 'Murky', 'Stained']
const WEATHER = ['Sunny', 'Cloudy', 'Rain', 'Wind', 'Overcast', 'Storm']

type FormData = Omit<Catch, 'id' | 'createdAt'>

const now = () => {
  const d = new Date()
  return { date: d.toISOString().slice(0, 10), time: d.toTimeString().slice(0, 5) }
}

interface Props { onSave: (c: FormData) => Promise<void> }

export default function CatchForm({ onSave }: Props) {
  const { date: today, time: currentTime } = now()
  const [form, setForm] = useState<FormData>({
    species: '', weight: null, weightUnit: 'lbs', length: null, lengthUnit: 'in',
    location: '', lat: null, lng: null, date: today, time: currentTime,
    bait: '', waterCondition: '', weather: '', photo: null, notes: '',
  })
  const [customSpecies, setCustomSpecies] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) => setForm(f => ({ ...f, [k]: v }))

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => set('photo', reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleLocation = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => { set('lat', pos.coords.latitude); set('lng', pos.coords.longitude); if (!form.location) set('location', `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`) },
      () => {}
    )
  }

  const submit = async () => {
    if (!form.species) return
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  const inputClass = 'w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors'
  const labelClass = 'block text-sm font-medium text-slate-300 mb-1'

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-emerald-400">Log a Catch</h2>

      {/* Species */}
      <div>
        <label className={labelClass}>Species *</label>
        {customSpecies ? (
          <div className="flex gap-2">
            <input className={inputClass} placeholder="Enter species..." value={form.species} onChange={e => set('species', e.target.value)} />
            <button onClick={() => setCustomSpecies(false)} className="text-xs text-slate-400 hover:text-slate-200">List</button>
          </div>
        ) : (
          <div className="flex gap-2">
            <select className={inputClass} value={form.species} onChange={e => { if (e.target.value === '__custom') { setCustomSpecies(true); set('species', '') } else set('species', e.target.value) }}>
              <option value="">Select...</option>
              {SPECIES.map(s => <option key={s} value={s}>{s}</option>)}
              <option value="__custom">Custom...</option>
            </select>
          </div>
        )}
      </div>

      {/* Weight + Length */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Weight</label>
          <div className="flex gap-1">
            <input type="number" step="0.01" className={inputClass} placeholder="0.0" value={form.weight ?? ''} onChange={e => set('weight', e.target.value ? Number(e.target.value) : null)} />
            <button onClick={() => set('weightUnit', form.weightUnit === 'kg' ? 'lbs' : 'kg')} className="shrink-0 px-2 py-1 bg-slate-600 rounded text-xs text-emerald-300 hover:bg-slate-500">{form.weightUnit}</button>
          </div>
        </div>
        <div>
          <label className={labelClass}>Length</label>
          <div className="flex gap-1">
            <input type="number" step="0.1" className={inputClass} placeholder="0.0" value={form.length ?? ''} onChange={e => set('length', e.target.value ? Number(e.target.value) : null)} />
            <button onClick={() => set('lengthUnit', form.lengthUnit === 'cm' ? 'in' : 'cm')} className="shrink-0 px-2 py-1 bg-slate-600 rounded text-xs text-emerald-300 hover:bg-slate-500">{form.lengthUnit}</button>
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <label className={labelClass}>Location</label>
        <div className="flex gap-2">
          <input className={inputClass} placeholder="Lake, river, spot..." value={form.location} onChange={e => set('location', e.target.value)} />
          <button onClick={handleLocation} className="shrink-0 px-3 py-2 bg-emerald-600 rounded-lg text-sm hover:bg-emerald-500 transition-colors" title="Use GPS">📍</button>
        </div>
      </div>

      {/* Date/Time */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Date</label>
          <input type="date" className={inputClass} value={form.date} onChange={e => set('date', e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Time</label>
          <input type="time" className={inputClass} value={form.time} onChange={e => set('time', e.target.value)} />
        </div>
      </div>

      {/* Bait */}
      <div>
        <label className={labelClass}>Bait / Lure</label>
        <input className={inputClass} placeholder="What did you use?" value={form.bait} onChange={e => set('bait', e.target.value)} />
      </div>

      {/* Conditions */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Water</label>
          <select className={inputClass} value={form.waterCondition} onChange={e => set('waterCondition', e.target.value)}>
            <option value="">—</option>
            {WATER.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Weather</label>
          <select className={inputClass} value={form.weather} onChange={e => set('weather', e.target.value)}>
            <option value="">—</option>
            {WEATHER.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>
      </div>

      {/* Photo */}
      <div>
        <label className={labelClass}>Photo</label>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handlePhoto} className="hidden" />
        <button onClick={() => fileRef.current?.click()} className="w-full py-3 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 hover:border-emerald-500 hover:text-emerald-400 transition-colors">
          {form.photo ? '✅ Photo added — tap to change' : '📷 Add Photo'}
        </button>
        {form.photo && <img src={form.photo} className="mt-2 rounded-lg max-h-40 mx-auto" alt="catch" />}
      </div>

      {/* Notes */}
      <div>
        <label className={labelClass}>Notes</label>
        <textarea className={inputClass} rows={2} placeholder="Anything else..." value={form.notes} onChange={e => set('notes', e.target.value)} />
      </div>

      {/* Submit */}
      <button onClick={submit} disabled={!form.species || saving}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg font-semibold text-lg transition-colors">
        {saving ? 'Saving...' : '🎣 Log Catch'}
      </button>
    </div>
  )
}
