import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Hero from '../components/Hero.jsx'
import { money } from '../lib/catalog.js'
import { useShop } from '../lib/shop.jsx'

const field = 'mt-1 w-full rounded border border-ink/25 bg-paper px-3 py-2'
const Err = ({ m }) => (m ? <span className="text-sm text-red-600">{m}</span> : null)

export function Login() {
  const { user, login } = useShop()
  const navigate = useNavigate(), { state } = useLocation()
  const [error, setError] = useState('')
  if (user) return <Navigate to="/" replace />
  const submit = async (e) => {
    e.preventDefault(); const d = Object.fromEntries(new FormData(e.currentTarget))
    const r = await login(d)
    if (r.error) setError(r.error); else navigate(state?.from || '/', { replace: true })
  }
  return (
    <div className="max-w-md mx-auto px-4 mt-14">
      <form onSubmit={submit} className="bg-card border border-ink/10 rounded-lg p-8 space-y-4">
        <h1 className="font-serif text-3xl text-center">Log in</h1>
        {state?.from === '/checkout' && <p className="rounded bg-ember/20 px-3 py-2 text-sm">Please log in or create an account to place your order.</p>}
        <label className="block"><span className="font-medium">Email</span><input type="email" name="email" required className={field} /><Err m={error} /></label>
        <label className="block"><span className="font-medium">Password</span><input type="password" name="password" required className={field} /></label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="remember" /> Remember me</label>
        <button className="w-full rounded bg-moss text-paper py-2.5 font-medium">Log in</button>
        <p className="text-sm">New here? <Link to="/register" state={state} className="underline text-moss">Create an account</Link></p>
      </form>
    </div>
  )
}

export function Register() {
  const { user, register } = useShop()
  const navigate = useNavigate(), { state } = useLocation()
  const [errors, setErrors] = useState({})
  if (user) return <Navigate to="/" replace />
  const submit = async (e) => {
    e.preventDefault(); const d = Object.fromEntries(new FormData(e.currentTarget)), err = {}
    if (d.password.length < 8) err.password = 'The password field must be at least 8 characters.'
    if (d.password !== d.password_confirmation) err.password_confirmation = 'The password confirmation does not match.'
    if (Object.keys(err).length) return setErrors(err)
    const r = await register(d)
    if (r.error) setErrors({ email: r.error }); else navigate(state?.from || '/', { replace: true })
  }
  return (
    <div className="max-w-md mx-auto px-4 mt-14">
      <form onSubmit={submit} className="bg-card border border-ink/10 rounded-lg p-8 space-y-4">
        <h1 className="font-serif text-3xl text-center">Create account</h1>
        {[['name', 'Name', 'text'], ['email', 'Email', 'email'], ['password', 'Password (8+ characters)', 'password'], ['password_confirmation', 'Confirm password', 'password']].map(([f, l, t]) => (
          <label key={f} className="block"><span className="font-medium">{l}</span><input type={t} name={f} required className={field} /><Err m={errors[f]} /></label>
        ))}
        <button className="w-full rounded bg-moss text-paper py-2.5 font-medium">Sign up</button>
        <p className="text-sm">Already registered? <Link to="/login" state={state} className="underline text-moss">Log in</Link></p>
      </form>
    </div>
  )
}

export function Account() {
  const { user, myOrders } = useShop()
  if (!user) return <Navigate to="/login" replace />
  return (<>
    <Hero img="hero-account.jpg" title="My orders" sub={`Welcome back, ${user.name}.`} />
    <section className="max-w-4xl mx-auto px-4 mt-10 space-y-4">
      {myOrders.length === 0 ? <p>You have no orders yet.</p> : myOrders.map((o) => (
        <div key={o.id} className="bg-card border border-ink/10 rounded-lg p-5">
          <div className="flex justify-between">
            <p className="font-bold">Order #{o.id} · {new Date(o.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            <p className="text-sm uppercase tracking-wide text-moss">{o.status.replace('_', ' ')}</p>
          </div>
          <ul className="mt-2 text-sm text-ink/80">{o.items.map((i, k) => <li key={k}>{i.quantity} × {i.title}</li>)}</ul>
          <p className="mt-2 font-bold">{money(o.total)}</p>
        </div>
      ))}
    </section>
  </>)
}
