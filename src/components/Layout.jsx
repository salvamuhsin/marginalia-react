import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Icon from './Icon.jsx'
import { shop } from '../lib/config.js'
import { useShop } from '../lib/shop.jsx'
import useScrollEffects from '../lib/useScrollEffects.js'

const NAV = [['/', 'Home'], ['/about', 'About'], ['/books', 'Books'], ['/accessories', 'Accessories'], ['/contact', 'Contact']]
const FOOT = [['/', 'Home'], ['/about', 'About us'], ['/books', 'Books'], ['/accessories', 'Accessories'], ['/contact', 'Contact']]

function Badge({ n, id }) {
  const ref = useRef(); const first = useRef(true)
  useEffect(() => {
    if (first.current) { first.current = false; return }
    const el = ref.current; if (!el) return
    el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump')
  }, [n])
  return <span ref={ref} id={id} className={`absolute -top-2 -right-2 text-[10px] bg-ember text-paper rounded-full px-1.5 ${n ? '' : 'hidden'}`}>{n}</span>
}

export default function Layout() {
  const { cartCount, wishlist, user, logout, toast, flash } = useShop()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [menu, setMenu] = useState(false), [search, setSearch] = useState(false), [userMenu, setUserMenu] = useState(false)
  const qRef = useRef(), userRef = useRef()

  useScrollEffects(pathname)
  useEffect(() => { window.scrollTo(0, 0); setMenu(false); setUserMenu(false); setSearch(false) }, [pathname])
  useEffect(() => { if (search) qRef.current?.focus() }, [search])
  useEffect(() => {
    const h = (e) => { if (userRef.current && !userRef.current.contains(e.target)) setUserMenu(false) }
    document.addEventListener('click', h); return () => document.removeEventListener('click', h)
  }, [])

  const toggleTheme = () => {
    const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = t; localStorage.setItem('theme', t)
  }
  const doSearch = (e) => { e.preventDefault(); navigate(`/books?q=${encodeURIComponent(qRef.current.value)}`) }
  const navCls = (active) => `py-1 ${active ? 'text-moss border-b-2 border-moss' : 'hover:text-moss'}`

  useEffect(() => { document.title = shop.name }, [])

  return (
    <>
      <div id="scrollbar" aria-hidden="true"></div>
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          <button className="lg:hidden" onClick={() => setMenu(!menu)} aria-label="Menu"><Icon name="menu" /></button>
          <Link to="/" className="font-serif text-2xl text-moss">Marginalia</Link>
          <nav className="hidden lg:flex gap-6 flex-1 ml-6 font-medium">
            {NAV.map(([to, l]) => <NavLink key={to} to={to} end className={({ isActive }) => navCls(isActive)}>{l}</NavLink>)}
          </nav>
          <div className="flex items-center gap-3 ml-auto lg:ml-0">
            <button onClick={() => setSearch(!search)} aria-label="Search"><Icon name="search" /></button>
            <button onClick={toggleTheme} aria-label="Toggle dark mode" className="text-lg leading-none">◐</button>
            <Link to="/wishlist" className="relative" aria-label="Wishlist"><Icon name="heart" /><Badge id="wl-badge" n={wishlist.length} /></Link>
            <Link to="/cart" className="relative" aria-label="Cart"><Icon name="bag" /><Badge id="cart-badge" n={cartCount} /></Link>
            <div className="relative" ref={userRef}>
              <button onClick={() => setUserMenu(!userMenu)} aria-label="Profile"><Icon name="user" /></button>
              {userMenu && (
                <div className="absolute right-0 mt-3 w-48 bg-card border border-ink/10 rounded shadow-lg py-2 text-sm">
                  {user ? (<>
                    <p className="px-4 py-1 text-ink/60">Hi, {user.name}</p>
                    <Link to="/account" className="block px-4 py-2 hover:bg-ink/5">My orders</Link>
                    <button onClick={() => { logout(); navigate('/') }} className="w-full text-left px-4 py-2 hover:bg-ink/5">Log out</button>
                  </>) : (<>
                    <Link to="/login" className="block px-4 py-2 hover:bg-ink/5">Log in</Link>
                    <Link to="/register" className="block px-4 py-2 hover:bg-ink/5">Create account</Link>
                  </>)}
                </div>
              )}
            </div>
          </div>
        </div>
        {search && (
          <div className="fade-in border-t border-ink/10 bg-card">
            <form onSubmit={doSearch} className="max-w-7xl mx-auto px-4 py-3 flex gap-2" role="search">
              <input ref={qRef} name="q" placeholder="Search books by title, author or ISBN" className="flex-1 rounded border border-ink/25 bg-paper px-3 py-2" />
              <button className="rounded bg-moss text-paper px-5 font-medium">Search</button>
            </form>
          </div>
        )}
        {menu && (
          <nav className="lg:hidden border-t border-ink/10 bg-card px-4 py-2 flex flex-col">
            {NAV.map(([to, l]) => <Link key={to} to={to} className="py-2 font-medium">{l}</Link>)}
          </nav>
        )}
      </header>

      {flash && <p className="max-w-7xl mx-auto mt-4 px-4"><span className="block rounded bg-moss/15 border border-moss/30 text-moss px-4 py-3" role="status">{flash}</span></p>}
      <main className="flex-1" key={pathname}><Outlet /></main>

      <footer className="bg-ink text-paper mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div><p className="font-serif text-2xl">Marginalia</p><p className="mt-3 text-paper/70 text-sm">Books and reading accessories for people who love a good page.</p></div>
          <div><p className="font-bold mb-3">Explore</p>
            <ul className="space-y-2 text-sm text-paper/80">{FOOT.map(([to, l]) => <li key={to}><Link to={to}>{l}</Link></li>)}</ul></div>
          <div><p className="font-bold mb-3">Account</p>
            <ul className="space-y-2 text-sm text-paper/80">
              <li><Link to="/account">My orders</Link></li><li><Link to="/wishlist">Wishlist</Link></li><li><Link to="/cart">Cart</Link></li>
            </ul></div>
          <div><p className="font-bold mb-3">Contact</p>
            <ul className="space-y-2 text-sm text-paper/80"><li>{shop.address}</li><li>{shop.phone}</li><li>{shop.email}</li></ul></div>
        </div>
        <p className="border-t border-paper/15 text-center text-xs text-paper/60 py-4">© {new Date().getFullYear()} {shop.name}. All rights reserved.</p>
      </footer>
      <button id="to-top" type="button" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>
      <div id="toast" className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 max-w-[90vw] bg-ink text-paper px-5 py-3 rounded-lg shadow-lg text-sm transition-opacity duration-300 pointer-events-none ${toast ? 'opacity-100' : 'opacity-0'}`} role="status" aria-live="polite">{toast}</div>
    </>
  )
}
