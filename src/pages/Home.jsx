import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card.jsx'
import { homeCategories, newest, productCount } from '../lib/catalog.js'
import { shop } from '../lib/config.js'
import { submitNetlify } from '../lib/forms.js'
import { useShop } from '../lib/shop.jsx'

const slides = [
  { img: 'slide-1.jpg', c1: '#2F5D50', c2: '#1B2433', t: 'Find your next favourite book', s: 'Classics, science, history and tech — hand picked for curious readers.', r: '/books', b: 'Shop books' },
  { img: 'slide-2.jpg', c1: '#8A5A2B', c2: '#1B2433', t: 'Make reading time cosier', s: 'Bookmarks, shelves, holders and lights for every reading nook.', r: '/accessories', b: 'Shop accessories' },
  { img: 'slide-3.jpg', c1: '#7A1F3D', c2: '#14213D', t: 'New readers get 10% off', s: 'Subscribe to our newsletter and get your welcome code.', r: '/', b: 'Get the offer' },
]
const offers = [
  ['10% off', 'your first order', 'WELCOME10', 'offer-welcome.jpg'],
  ['Free bookmark', 'with every 3 books', 'BOOKMARK', 'offer-bookmark.jpg'],
  ['Free shipping', `on orders over ${shop.currency}50`, 'SHIPFREE', 'offer-shipping.jpg'],
]
const faqs = [
  ['Do I need an account to order?', 'You can browse and fill your cart as a guest. To place an order you need to log in or create a free account.'],
  ['Which payment methods do you accept?', 'You can pay online by card through a secure payment page, or choose cash on delivery.'],
  ['Where can I see my orders?', 'Log in and open “My orders” from the profile menu to see every order and its status.'],
  ['What if an item is sold out?', 'Sold-out items are marked on the card. Add them to your wishlist and check back soon.'],
]

function Carousel() {
  const [i, setI] = useState(0)
  const n = slides.length
  useEffect(() => { const t = setInterval(() => setI((v) => (v + 1) % n), 6000); return () => clearInterval(t) }, [n])
  const s = slides[i]
  return (
    <section className="relative" aria-roledescription="carousel">
      <div key={i} className="fade-in relative overflow-hidden min-h-[420px] md:min-h-[580px] flex items-center bg-ink text-white">
        <div className="kb absolute inset-0 bg-cover bg-[position:75%_center] lg:bg-center"
          style={{ backgroundImage: `linear-gradient(90deg, rgb(0 0 0 / .65), rgb(0 0 0 / .1)), url('/images/${s.img}'), linear-gradient(135deg, ${s.c1}, ${s.c2})` }}></div>
        <div className="absolute inset-0 bg-black/35 lg:hidden"></div>
        <div className="relative max-w-7xl mx-auto px-4 w-full">
          <h2 style={{ '--d': '100ms' }} className="hero-rise font-serif text-4xl md:text-6xl max-w-2xl leading-tight">{s.t}</h2>
          <p style={{ '--d': '300ms' }} className="hero-rise mt-4 text-lg max-w-lg text-white/90">{s.s}</p>
          <Link style={{ '--d': '500ms' }} to={s.r} className="hero-rise inline-block mt-6 rounded bg-ember text-ink px-6 py-3 font-bold">{s.b}</Link>
        </div>
      </div>
      <button onClick={() => setI((i - 1 + n) % n)} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-white w-10 h-10" aria-label="Previous slide">‹</button>
      <button onClick={() => setI((i + 1) % n)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-white w-10 h-10" aria-label="Next slide">›</button>
      <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2">
        {slides.map((_, k) => <button key={k} onClick={() => setI(k)} className={`h-2.5 rounded-full transition-all duration-300 ${i === k ? 'bg-white w-7' : 'bg-white/40 w-2.5'}`} aria-label={`Slide ${k + 1}`}></button>)}
      </div>
    </section>
  )
}

export default function Home() {
  const { showFlash } = useShop()
  const [open, setOpen] = useState(null)
  const [error, setError] = useState('')
  const books = newest('book', 4), accessories = newest('accessory', 4)
  const cats = homeCategories().slice(0, 8)

  const subscribe = async (e) => {
    e.preventDefault(); const f = e.currentTarget; setError('')
    try {
      await submitNetlify('newsletter', { email: new FormData(f).get('email') })
      f.reset(); showFlash('You are subscribed to our newsletter.'); window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch { setError('Sorry, we could not subscribe you right now. Please try again.') }
  }

  const catLink = (c) => `${c.type === 'book' ? '/books' : '/accessories'}?category=${c.slug}`

  return (<>
    <Carousel />

    <div className="bg-moss text-paper overflow-hidden py-3" aria-label="Announcements">
      <div className="marquee flex w-max whitespace-nowrap font-medium">
        {[0, 1].map((r) => ['New arrivals every week', 'Free gift wrapping on request', 'Pay online or cash on delivery', 'Reading accessories now in stock', '10% off your first order'].map((m) => (
          <span key={r + m} className="contents"><span className="px-6">{m}</span><span className="px-2" aria-hidden="true">✦</span></span>
        )))}
      </div>
    </div>

    <section className="max-w-7xl mx-auto px-4 mt-16">
      <h2 className="font-serif text-3xl mb-6">What we offer</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[['📚', 'Books', 'Fiction, science, history and technology titles.', '/books'], ['🔖', 'Accessories', 'Bookmarks, shelves, holders and book lights.', '/accessories'],
          ['🚚', 'Fast delivery', 'Carefully packed and sent to your door.', '/contact'], ['🔒', 'Easy checkout', 'Pay online by card or cash on delivery.', '/cart']].map(([i, t, d, r]) => (
          <Link key={t} to={r} className="bg-card border border-ink/10 rounded-lg p-6 hover:border-moss transition">
            <span className="text-4xl">{i}</span><h3 className="font-serif text-xl mt-3">{t}</h3><p className="text-ink/70 mt-1 text-sm">{d}</p></Link>
        ))}
      </div>
    </section>

    {cats.length > 0 && (
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="flex justify-between items-end mb-6">
          <h2 className="font-serif text-3xl">Shop by category</h2>
          <Link to="/books" className="text-moss font-medium hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {cats.map((c) => {
            const n = productCount(c.id)
            return (
              <Link key={c.id} to={catLink(c)} className="flex items-center gap-4 bg-card border border-ink/10 rounded-lg p-4 hover:border-moss transition">
                <span className="text-3xl">{c.icon || '📦'}</span>
                <span><span className="block font-medium">{c.name}</span><span className="text-sm text-ink/60">{n} {n === 1 ? 'item' : 'items'}</span></span>
              </Link>
            )
          })}
        </div>
      </section>
    )}

    {books.length > 0 && (
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="flex justify-between items-end mb-6"><h2 className="font-serif text-3xl">New books</h2><Link to="/books" className="text-moss font-medium">View all →</Link></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">{books.map((p) => <Card key={p.id} p={p} />)}</div>
      </section>
    )}

    <section className="max-w-7xl mx-auto px-4 mt-16">
      <div className="relative overflow-hidden rounded-2xl min-h-[260px] md:min-h-[320px] flex items-center bg-cover bg-[position:75%_center] lg:bg-center text-[#1B2433]"
        style={{ backgroundImage: "url('/images/promo-offer.jpg'), linear-gradient(135deg, #FFF1C9, #FF9E7D)" }}>
        <div className="absolute inset-0 bg-white/55 lg:hidden"></div>
        <div className="relative p-8 md:p-12 max-w-xl">
          <p className="text-[#B5471F] font-bold tracking-widest text-sm">WELCOME OFFER</p>
          <h2 className="font-serif text-3xl md:text-5xl mt-2 leading-tight">Get 10% off your first order</h2>
          <p className="mt-3 text-[#1B2433]/80">Join our newsletter and start your reading list with a little extra.</p>
          <a href="#newsletter" className="inline-block mt-6 rounded bg-[#1B2433] text-white px-6 py-3 font-bold">Join the newsletter</a>
        </div>
      </div>
    </section>

    <section className="mt-16 bg-card border-y border-ink/10">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="font-serif text-3xl text-center">Why readers choose us</h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-center">
          {[['🚚', 'Fast delivery', 'Orders are packed with care and sent to your door.'], ['🔒', 'Secure checkout', 'Pay by card online or with cash on delivery.'], ['🎁', 'Gift ready', 'Books and accessories that make thoughtful presents.'], ['💬', 'Friendly support', 'Real people answer your questions quickly.']].map(([ico, ttl, txt]) => (
            <div key={ttl}><p className="text-4xl">{ico}</p><h3 className="font-serif text-xl mt-3">{ttl}</h3><p className="text-ink/70 text-sm mt-1">{txt}</p></div>
          ))}
        </div>
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-4 mt-16">
      <h2 className="font-serif text-3xl mb-6 text-center">Special offers</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {offers.map(([a, b, code, img]) => (
          <div key={code} className="relative overflow-hidden rounded-lg min-h-[280px] flex items-end bg-cover bg-center" style={{ backgroundImage: `url('/images/${img}')` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/10"></div>
            <div className="relative z-10 p-8 text-white w-full">
              <p className="font-serif text-3xl drop-shadow-md">{a}</p>
              <p className="mt-1 text-white/90 drop-shadow">{b}</p>
              <p className="mt-4 inline-block border border-dashed border-white/80 bg-black/30 rounded px-3 py-1 text-sm tracking-widest">{code}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-4 mt-16">
      <div className="relative overflow-hidden rounded-2xl min-h-[260px] md:min-h-[320px] flex items-center bg-cover bg-[position:75%_center] lg:bg-center text-[#1B2433]"
        style={{ backgroundImage: "url('/images/promo-accessories.jpg'), linear-gradient(135deg, #D8F3E5, #9AD0F5)" }}>
        <div className="absolute inset-0 bg-white/55 lg:hidden"></div>
        <div className="relative p-8 md:p-12 max-w-xl">
          <p className="text-[#0F5C5C] font-bold tracking-widest text-sm">READING ACCESSORIES</p>
          <h2 className="font-serif text-3xl md:text-5xl mt-2 leading-tight">Make every page cosier</h2>
          <p className="mt-3 text-[#1B2433]/80">Bookmarks, book lights, shelves and holders for your reading corner.</p>
          <Link to="/accessories" className="inline-block mt-6 rounded bg-[#1B2433] text-white px-6 py-3 font-bold">Shop accessories</Link>
        </div>
      </div>
    </section>

    {accessories.length > 0 && (
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="flex justify-between items-end mb-6"><h2 className="font-serif text-3xl">Reading accessories</h2><Link to="/accessories" className="text-moss font-medium">View all →</Link></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">{accessories.map((p) => <Card key={p.id} p={p} />)}</div>
      </section>
    )}

    <section className="max-w-7xl mx-auto px-4 mt-16">
      <h2 className="font-serif text-3xl mb-6 text-center">What our readers say</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {[['Sara M.', 'Great selection and my order arrived beautifully packed. The reading light is perfect for bedtime.'], ['Omar K.', 'Found a book I had been searching for months. Easy checkout and quick delivery.'], ['Lina A.', 'Love the bookmarks and the wooden book stand. I will be ordering again.']].map(([who, quote]) => (
          <figure key={who} className="bg-card border border-ink/10 rounded-lg p-6">
            <p className="text-ember text-lg" aria-label="5 out of 5 stars">★★★★★</p>
            <blockquote className="mt-3 text-ink/80">“{quote}”</blockquote>
            <figcaption className="mt-4 font-medium">{who}</figcaption>
          </figure>
        ))}
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-4 mt-16">
      <h2 className="font-serif text-3xl mb-6 text-center">How it works</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {[['Browse and search', 'Filter by category or price and find your next read or reading accessory.'], ['Add to cart', 'Save favourites to your wishlist and add what you want to your cart.'], ['Checkout and enjoy', 'Log in, choose card or cash on delivery, and we deliver to your door.']].map(([ttl, txt], i) => (
          <div key={ttl} className="flex gap-4">
            <span className="shrink-0 w-10 h-10 rounded-full bg-moss text-paper grid place-items-center font-bold">{i + 1}</span>
            <div><h3 className="font-serif text-xl">{ttl}</h3><p className="text-ink/70 mt-1">{txt}</p></div>
          </div>
        ))}
      </div>
    </section>

    <section className="max-w-3xl mx-auto px-4 mt-16">
      <h2 className="font-serif text-3xl mb-6 text-center">Frequently asked questions</h2>
      <div className="space-y-3">
        {faqs.map(([q, a], k) => (
          <div key={q} className="bg-card border border-ink/10 rounded-lg">
            <button type="button" onClick={() => setOpen(open === k ? null : k)} aria-expanded={open === k} className="w-full flex justify-between gap-4 text-left p-4 font-medium">
              <span>{q}</span><span aria-hidden="true">{open === k ? '−' : '+'}</span>
            </button>
            {open === k && <p className="fade-in px-4 pb-4 text-ink/80">{a}</p>}
          </div>
        ))}
      </div>
    </section>

    <section id="newsletter" className="max-w-7xl mx-auto px-4 mt-16 scroll-mt-24">
      <div className="rounded-2xl bg-moss text-paper p-8 md:p-12 flex flex-col items-center text-center md:flex-row md:text-left md:justify-between gap-6 md:gap-8">
        <img src="/images/newsletter-illustration.svg" alt="" className="w-32 sm:w-40 md:w-44 shrink-0" />
        <div className="flex-1"><h2 className="font-serif text-3xl">Join our newsletter</h2><p className="mt-2 text-paper/80">New arrivals, offers and reading lists, once a month.</p></div>
        <form onSubmit={subscribe} className="flex gap-2 w-full md:w-auto">
          <input type="email" name="email" required placeholder="you@example.com" aria-label="Email" className="flex-1 min-w-0 md:w-72 rounded px-3 py-2.5 bg-paper text-ink" />
          <button className="rounded bg-ember text-ink px-5 font-bold">Subscribe</button>
        </form>
      </div>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </section>
  </>)
}
