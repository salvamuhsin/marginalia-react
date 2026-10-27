import { Link, useParams } from 'react-router-dom'
import NotFound from './NotFound.jsx'
import { money } from '../lib/catalog.js'
import { useShop } from '../lib/shop.jsx'

export default function OrderDone() {
  const { id } = useParams()
  const { orders } = useShop()
  const order = orders.find((o) => String(o.id) === id)
  if (!order) return <NotFound />
  return (
    <div className="max-w-2xl mx-auto px-4 mt-16 text-center">
      <p className="text-6xl">🎉</p>
      <h1 className="font-serif text-4xl mt-4">Thank you, {order.name}!</h1>
      <p className="mt-3">Order #{order.id} is {order.payment_status === 'paid' ? 'paid and confirmed' : 'placed (pay on delivery)'}. A confirmation will go to {order.email}.</p>
      <p className="mt-2 font-bold">Total: {money(order.total)}</p>
      <Link to="/books" className="inline-block mt-6 rounded bg-moss text-paper px-6 py-2.5 font-medium">Keep browsing</Link>
    </div>
  )
}
