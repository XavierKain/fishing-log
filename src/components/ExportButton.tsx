import { jsPDF } from 'jspdf'
import type { Catch } from '../types'

interface Props { catches: Catch[] }

function exportCSV(catches: Catch[]) {
  const headers = ['Date', 'Time', 'Species', 'Weight', 'Unit', 'Length', 'Unit', 'Location', 'Bait', 'Water', 'Weather', 'Notes']
  const rows = catches.map(c => [c.date, c.time, c.species, c.weight ?? '', c.weightUnit, c.length ?? '', c.lengthUnit, c.location, c.bait, c.waterCondition, c.weather, c.notes])
  const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `catches-${new Date().toISOString().slice(0, 10)}.csv`; a.click()
  URL.revokeObjectURL(url)
}

function exportPDF(catches: Catch[]) {
  const doc = new jsPDF()
  doc.setFontSize(18)
  doc.text('Fishing Catch Log', 14, 22)
  doc.setFontSize(10)
  doc.text(`Generated ${new Date().toLocaleDateString()} — ${catches.length} catches`, 14, 30)

  let y = 42
  catches.forEach((c, i) => {
    if (y > 270) { doc.addPage(); y = 20 }
    doc.setFontSize(11)
    doc.text(`${i + 1}. ${c.species}`, 14, y)
    doc.setFontSize(9)
    const details = [c.date, c.weight != null ? `${c.weight} ${c.weightUnit}` : null, c.length != null ? `${c.length} ${c.lengthUnit}` : null, c.location].filter(Boolean).join(' · ')
    doc.text(details, 14, y + 5)
    if (c.bait) doc.text(`Bait: ${c.bait}`, 14, y + 10)
    y += c.bait ? 18 : 14
  })

  doc.save(`catches-${new Date().toISOString().slice(0, 10)}.pdf`)
}

export default function ExportButton({ catches }: Props) {
  return (
    <div className="flex gap-2">
      <button onClick={() => exportCSV(catches)} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-300 transition-colors">📄 CSV</button>
      <button onClick={() => exportPDF(catches)} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-300 transition-colors">📑 PDF</button>
    </div>
  )
}
