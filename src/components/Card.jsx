import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import Cover from './Cover.jsx'
import { money, getCategory } from '../lib/catalog.js'
import { useShop } from '../lib/shop.jsx'

export default function Card({ p }) {
  const { addToCart, toggleWishlist, inWishlist } = useShop()
  const on = inWishlist(p.id)
  return (
    <article className="group bg-card rounded-lg border border-ink/10 overflow-hidden flex flex-col transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-moss/40">
      <div className="relative">
        <Link to={`/product/${p.id}`} className="block overflow-hidden"><div className="transition-transform duration-500 ease-out group-hover:scale-105"><Cover p={p} /></div></Link>
        <div className="absolute top-2 right-2">
          <button onClick={() => toggleWishlist(p)} aria-label="Toggle wishlist" className="rounded-full bg-card/90 p-2 text-ember">
            <Icon name="heart" className="w-5 h-5 wl-heart" fill={on} />
          </button>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-medium leading-snug"><Link to={`/product/${p.id}`}>{p.title}</Link></h3>
        <p className="text-sm text-ink/60">{p.author || getCategory(p.category_id)?.name}</p>
        <div className="mt-auto pt-3 flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
          <span className="font-bold">{money(p.price)}</span>
          {p.stock > 0
            ? <button onClick={() => addToCart(p)} className="text-sm rounded bg-moss text-paper px-3 py-1.5">Add to cart</button>
            : <span className="text-sm text-ink/50">Sold out</span>}
        </div>
      </div>
    </article>
  )
}
