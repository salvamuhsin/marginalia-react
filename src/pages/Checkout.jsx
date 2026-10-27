import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Hero from '../components/Hero.jsx'
import { money } from '../lib/catalog.js'
import { useShop } from '../lib/shop.jsx'

export default function Checkout() {
  const { lines, cartTotal, cartCount, user, placeOrder } = useShop()
  const navigate = useNavigate()
  const [errors, setErrors] = useState({})
  if (!user) return <Navigate to="/login" state={{ from: '/checkout' }} replace />
  if (cartCount === 0) return <Navigate to="/cart" replace />

  const submit = (e) => {
    e.preventDefault()
    const d = Object.fromEntries(new FormData(e.currentTarget))
    const err = {}
    if (!d.name.trim()) err.name = 'The name field is required.'
    if (!d.phone.trim()) err.phone = 'The phone field is required.'
    if (!d.address.trim()) err.address = 'The address field is required.'
    if (d.payment === 'card') err.payment = 'Card payment is not set up yet. Please choose cash on delivery.'
    setErrors(err)
    if (Object.keys(err).length) return
    const order = placeOrder({ name: d.name, email: d.email, phone: d.phone, address: d.address, payment_method: d.payment })
    navigate(`/order/${order.id}`)
  }
  const field = 'mt-1 w-full rounded border border-ink/25 bg-paper px-3 py-2'
  const Err = ({ k }) => errors[k] ? <span className="text-sm text-red-600">{errors[k]}</span> : null

  return (<>
    <Hero img="hero-checkout.jpg" title="Checkout" />
    <div className="max-w-5xl mx-auto px-4 mt-10 grid md:grid-cols-2 gap-10">
      <form onSubmit={submit} className="space-y-4">
        {[['name', 'Full name', user.name, 'text'], ['email', 'Email', user.email, 'email'], ['phone', 'Phone', '', 'text']].map(([f, l, def, t]) => (
          <label key={f} className="block"><span className="font-medium">{l}</span>
            <input name={f} type={t} defaultValue={def} required className={field} /><Err k={f} />
          </label>
        ))}
        <label className="block"><span className="font-medium">Delivery address</span>
          <textarea name="address" rows="3" required className={field}></textarea><Err k="address" />
        </label>
        <fieldset className="space-y-2"><legend className="font-medium">Payment method</legend>
          <label className="flex items-center gap-2 border border-ink/15 rounded p-3 bg-card"><input type="radio" name="payment" value="cod" defaultChecked /> Cash on delivery</label>
          <label className="flex items-center gap-2 border border-ink/15 rounded p-3 bg-card"><input type="radio" name="payment" value="card" /> Pay online by card (secure Stripe page)</label>
          <Err k="payment" />
        </fieldset>
        <button className="rounded bg-moss text-paper px-6 py-2.5 font-medium">Place order</button>
      </form>
      <div className="bg-card border border-ink/10 rounded-lg p-6 h-fit">
        <h2 className="font-serif text-xl mb-3">Order summary</h2>
        {lines.map((l) => <p key={l.product.id} className="flex justify-between py-1"><span>{l.qty} × {l.product.title}</span><span>{money(l.total)}</span></p>)}
        <p className="flex justify-between border-t border-ink/15 mt-3 pt-3 font-bold"><span>Total</span><span>{money(cartTotal)}</span></p>
      </div>
    </div>
  </>)
}
