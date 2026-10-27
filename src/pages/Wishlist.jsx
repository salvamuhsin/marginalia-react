import { Link } from 'react-router-dom'
import Hero from '../components/Hero.jsx'
import Card from '../components/Card.jsx'
import { useShop } from '../lib/shop.jsx'

export default function Wishlist() {
  const { wishlistProducts } = useShop()
  return (<>
    <Hero img="hero-wishlist.jpg" title="Your wishlist" sub="Books and accessories you want to come back to." />
    <section className="max-w-7xl mx-auto px-4 mt-10">
      {wishlistProducts.length === 0
        ? <p>Your wishlist is empty. <Link to="/books" className="underline text-moss">Browse books</Link>.</p>
        : <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">{wishlistProducts.map((p) => <Card key={p.id} p={p} />)}</div>}
    </section>
  </>)
}
