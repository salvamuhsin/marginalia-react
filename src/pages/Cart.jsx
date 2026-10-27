import { useState } from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero.jsx'
import Cover from '../components/Cover.jsx'
import { money } from '../lib/catalog.js'
import { useShop } from '../lib/shop.jsx'

function Line({ l }) {
  const { updateCart, removeFromCart } = useShop()
  const [qty, setQty] = useState(l.qty)
  return (
    <div className="flex flex-wrap items-center gap-4 py-4 border-b border-ink/15">
      <div className="w-16 rounded overflow-hidden"><Cover p={l.product} /></div>
      <div className="flex-1 min-w-[160px]">
        <Link to={`/product/${l.product.id}`} className="font-medium">{l.product.title}</Link>
        <p className="text-sm text-ink/60">{money(l.product.price)} each</p>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); updateCart(l.product, Number(qty)) }} className="flex gap-2">
        <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} min="0" max={l.product.stock} aria-label="Quantity" className="w-16 rounded border border-ink/25 bg-paper px-2 py-1" />
        <button className="text-sm underline">Update</button>
      </form>
      <p className="w-24 text-right font-bold">{money(l.total)}</p>
      <button onClick={() => removeFromCart(l.product)} className="text-sm underline text-red-600">Remove</button>
    </div>
  )
}

export default function Cart() {
  const { lines, cartTotal, user } = useShop()
  return (<>
    <Hero img="hero-cart.jpg" title="Your cart" />
    <section className="max-w-4xl mx-auto px-4 mt-10">
      {lines.length === 0
        ? <p>Your cart is empty. <Link to="/books" className="underline text-moss">Find a book to read</Link>.</p>
        : lines.map((l) => <Line key={`${l.product.id}-${l.qty}`} l={l} />)}
      {lines.length > 0 && (
        <div className="mt-6 flex items-center justify-end gap-6">
          <p className="text-xl">Total <strong>{money(cartTotal)}</strong></p>
          <Link to="/checkout" className="rounded bg-moss text-paper px-6 py-2.5 font-medium">{user ? 'Checkout' : 'Log in to checkout'}</Link>
        </div>
      )}
    </section>
  </>)
}
