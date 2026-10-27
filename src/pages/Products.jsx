import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Hero from '../components/Hero.jsx'
import Card from '../components/Card.jsx'
import { queryProducts, typeCategories } from '../lib/catalog.js'

const PER_PAGE = 12

export default function Products({ type }) {
  const isBook = type === 'book'
  const base = isBook ? '/books' : '/accessories'
  const [sp, setSp] = useSearchParams()
  const get = (k) => sp.get(k) || ''
  const cats = sp.getAll('category')
  const hasFilters = ['q', 'category', 'min', 'max', 'stock', 'sort'].some((k) => sp.has(k))
  const [open, setOpen] = useState(hasFilters)
  const page = Math.max(1, parseInt(get('page')) || 1)

  const list = queryProducts(type, { q: get('q'), category: cats, min: get('min'), max: get('max'), stock: sp.get('stock') === '1', sort: get('sort') })
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE))
  const shown = list.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const apply = (e) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget), next = new URLSearchParams()
    for (const [k, v] of fd.entries()) if (v !== '') next.append(k, v)
    setSp(next)
  }
  const goto = (n) => { const next = new URLSearchParams(sp); n > 1 ? next.set('page', n) : next.delete('page'); setSp(next); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const field = 'mt-1 w-full rounded border border-ink/25 bg-paper px-3 py-2'
  const pbtn = (active) => `min-w-9 px-3 py-1.5 rounded border text-sm ${active ? 'bg-moss text-paper border-moss' : 'border-ink/25 bg-card'}`

  return (<>
    <Hero img={isBook ? 'hero-books.jpg' : 'hero-accessories.jpg'} title={isBook ? 'Our books' : 'Reading accessories'}
      sub={isBook ? 'Search and filter the whole collection.' : 'Bookmarks, bookshelves, holders, book lights and more.'} />
    <div className="max-w-7xl mx-auto px-4 mt-10 grid lg:grid-cols-[260px_1fr] gap-8">
      <aside className="h-fit">
        <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="filters"
          className="lg:hidden w-full flex items-center justify-between rounded-lg bg-card border border-ink/10 px-4 py-3 font-bold">
          <span>Filters &amp; sort</span>
          <svg className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>
        {/* key resets the form when the URL changes (Reset button, header search, category links) */}
        <form key={sp.toString()} id="filters" onSubmit={apply} className={`${open ? '' : 'hidden'} lg:block mt-3 lg:mt-0 bg-card border border-ink/10 rounded-lg p-5 space-y-5`}>
          <label className="block"><span className="font-bold">Search</span>
            <input name="q" defaultValue={get('q')} placeholder={isBook ? 'Title, author or ISBN' : 'Product name'} className={field} />
          </label>
          <fieldset>
            <legend className="font-bold mb-1">Category</legend>
            {typeCategories(type).map((c) => (
              <label key={c.id} className="flex items-center gap-2 py-0.5">
                <input type="checkbox" name="category" value={c.slug} defaultChecked={cats.includes(c.slug)} className="accent-[rgb(var(--moss))]" />
                <span>{c.icon}</span>{c.name}
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend className="font-bold mb-1">Price</legend>
            <div className="flex gap-2">
              <input type="number" name="min" min="0" defaultValue={get('min')} placeholder="Min" aria-label="Minimum price" className="w-full rounded border border-ink/25 bg-paper px-2 py-1.5" />
              <input type="number" name="max" min="0" defaultValue={get('max')} placeholder="Max" aria-label="Maximum price" className="w-full rounded border border-ink/25 bg-paper px-2 py-1.5" />
            </div>
          </fieldset>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="stock" value="1" defaultChecked={sp.get('stock') === '1'} className="accent-[rgb(var(--moss))]" /> In stock only
          </label>
          <label className="block"><span className="font-bold">Sort by</span>
            <select name="sort" defaultValue={get('sort')} className="mt-1 w-full rounded border border-ink/25 bg-paper px-2 py-2">
              {[['', 'Newest'], ['title', 'Title A–Z'], ['price_asc', 'Price: low to high'], ['price_desc', 'Price: high to low']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
          <div className="flex gap-2">
            <button className="flex-1 rounded bg-moss text-paper py-2 font-medium">Apply</button>
            <Link to={base} className="rounded border border-ink/25 px-3 py-2">Reset</Link>
          </div>
        </form>
      </aside>

      <section>
        <p className="mb-4 text-ink/70">{list.length} {isBook ? 'books' : 'products'} found</p>
        {list.length === 0 ? <p>Nothing matches your filters. Try resetting them.</p> : (<>
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">{shown.map((p) => <Card key={p.id} p={p} />)}</div>
          {pages > 1 && (
            <nav className="mt-8 flex flex-wrap items-center gap-2" aria-label="Pagination">
              <button disabled={page === 1} onClick={() => goto(page - 1)} className={`${pbtn(false)} disabled:opacity-40`}>‹ Prev</button>
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => <button key={n} onClick={() => goto(n)} aria-current={n === page ? 'page' : undefined} className={pbtn(n === page)}>{n}</button>)}
              <button disabled={page === pages} onClick={() => goto(page + 1)} className={`${pbtn(false)} disabled:opacity-40`}>Next ›</button>
            </nav>
          )}
        </>)}
      </section>
    </div>
  </>)
}
