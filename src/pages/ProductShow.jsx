import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Cover from '../components/Cover.jsx'
import Card from '../components/Card.jsx'
import NotFound from './NotFound.jsx'
import { getCategory, getProduct, money, related as getRelated } from '../lib/catalog.js'
import { useShop } from '../lib/shop.jsx'

export default function ProductShow() {
  const { id } = useParams()
  const p = getProduct(id)
  const { addToCart, toggleWishlist, inWishlist } = useShop()
  const [qty, setQty] = useState(1)
  useEffect(() => { if (p) document.title = `${p.title} – Marginalia Books` }, [p])
  if (!p) return <NotFound />
  const rel = getRelated(p)
  const on = inWishlist(p.id)
  const catNames = p.categoryIds.map((c) => getCategory(c)?.name).filter(Boolean).join(' · ')

  return (<>
    <div className="max-w-7xl mx-auto px-4 mt-10 grid md:grid-cols-[300px_1fr] gap-10">
      <div className="rounded-lg overflow-hidden shadow-md h-fit"><Cover p={p} big /></div>
      <div>
        <p className="text-sm text-ink/60">{catNames}</p>
        <h1 className="font-serif text-4xl mt-1">{p.title}</h1>
        {p.author && <p className="mt-1 text-lg">by {p.author}</p>}
        <p className="mt-4 max-w-prose leading-relaxed text-ink/80">{p.description}</p>
        {p.isbn && <p className="mt-4 text-sm text-ink/60">ISBN {p.isbn} · Published {p.year}</p>}
        <p className="mt-6 text-3xl font-bold">{money(p.price)}</p>
        <div className="mt-4 flex flex-wrap gap-3 items-center">
          {p.stock > 0 ? (<>
            <form onSubmit={(e) => { e.preventDefault(); addToCart(p, Number(qty) || 1) }} className="flex gap-3 items-center">
              <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} min="1" max={p.stock} aria-label="Quantity" className="w-20 rounded border border-ink/25 bg-paper px-2 py-2" />
              <button className="rounded bg-moss text-paper px-6 py-2.5 font-medium">Add to cart</button>
            </form>
            <span className="text-sm text-ink/60">{p.stock} in stock</span>
          </>) : <span className="font-medium">Sold out</span>}
          <button onClick={() => toggleWishlist(p)} className="rounded border border-ink/25 px-4 py-2.5">{on ? '♥ In wishlist' : '♡ Add to wishlist'}</button>
        </div>
      </div>
    </div>
    {rel.length > 0 && (
      <section className="max-w-7xl mx-auto px-4 mt-14">
        <h2 className="font-serif text-2xl mb-4">You may also like</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">{rel.map((r) => <Card key={r.id} p={r} />)}</div>
      </section>
    )}
  </>)
}
