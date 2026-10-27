import { useState } from 'react'
import { getCategory } from '../lib/catalog.js'

export default function Cover({ p, big = false }) {
  const [failed, setFailed] = useState(false)

  if (p.image && !failed) {
    return <img src={`/covers/${p.image}`} alt={p.title} onError={() => setFailed(true)}
      className={`w-full object-cover ${p.type === 'book' ? 'aspect-[2/3]' : 'aspect-square'}`} />
  }
  const cat = getCategory(p.category_id)
  if (p.type === 'book') {
    return (
      <div className="aspect-[2/3] flex flex-col justify-between p-4 text-white overflow-hidden"
        style={{ background: `linear-gradient(90deg, rgba(0,0,0,.25) 0 6px, transparent 6px), ${p.cover_color}` }}>
        <span className={`font-serif leading-tight ${big ? 'text-3xl' : 'text-lg'}`}>{p.title}</span>
        <span className="text-xs opacity-80">{p.author}</span>
      </div>
    )
  }
  return (
    <div className="aspect-square flex flex-col items-center justify-center gap-2 p-4 text-white text-center" style={{ background: p.cover_color }}>
      <span className={big ? 'text-8xl' : 'text-5xl'}>{cat?.icon || '📦'}</span>
      <span className={`font-serif leading-tight ${big ? 'text-2xl' : 'text-sm'}`}>{p.title}</span>
    </div>
  )
}