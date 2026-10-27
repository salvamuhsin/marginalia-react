import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getProduct, products } from './catalog.js'

/*
 * Front-end only "backend": cart, wishlist, accounts and orders live in this browser (localStorage).
 * Accounts and orders are NOT shared between devices and passwords are only hashed in the browser,
 * so treat login as a demo until a real backend is connected.
 */
const Ctx = createContext(null)
export const useShop = () => useContext(Ctx)

const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

export async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => load('mg_cart', {}))          // { productId: qty }
  const [wishlist, setWishlist] = useState(() => load('mg_wishlist', []))
  const [user, setUser] = useState(() => load('mg_user', null))
  const [orders, setOrders] = useState(() => load('mg_orders', []))
  const [toast, setToast] = useState('')
  const [flash, setFlash] = useState(null)                               // banner shown under the header
  const timer = useRef()
  const { pathname } = useLocation()

  useEffect(() => save('mg_cart', cart), [cart])
  useEffect(() => save('mg_wishlist', wishlist), [wishlist])
  useEffect(() => save('mg_user', user), [user])
  useEffect(() => save('mg_orders', orders), [orders])

  // a banner message disappears after you move to another page (like a Laravel session flash)
  const flashPath = useRef(pathname)
  useEffect(() => { if (flashPath.current !== pathname) setFlash(null) }, [pathname])
  const showFlash = useCallback((m) => { flashPath.current = pathname; setFlash(m) }, [pathname])

  const say = useCallback((m) => {
    setToast(m); clearTimeout(timer.current); timer.current = setTimeout(() => setToast(''), 2600)
  }, [])

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0)
  const lines = Object.entries(cart)
    .map(([id, qty]) => { const product = getProduct(id); return product && { product, qty, total: product.price * qty } })
    .filter(Boolean)
  const cartTotal = lines.reduce((a, l) => a + l.total, 0)

  const addToCart = (p, qty = 1) => {
    if (p.stock < 1) return say(`Sorry, “${p.title}” is sold out.`)
    const have = cart[p.id] || 0
    const next = Math.min(have + Math.max(1, qty), p.stock)
    setCart({ ...cart, [p.id]: next })
    say(next === have ? `Only ${p.stock} in stock, and they are all in your cart.` : `“${p.title}” added to your cart.`)
  }
  const updateCart = (p, qty) => {
    const c = { ...cart }
    if (qty < 1) delete c[p.id]; else c[p.id] = Math.min(qty, p.stock)
    setCart(c)
  }
  const removeFromCart = (p) => { const c = { ...cart }; delete c[p.id]; setCart(c) }
  const clearCart = () => setCart({})

  const inWishlist = (id) => wishlist.includes(id)
  const toggleWishlist = (p) => {
    const active = !wishlist.includes(p.id)
    setWishlist(active ? [...wishlist, p.id] : wishlist.filter((i) => i !== p.id))
    say(active ? `Added “${p.title}” to your wishlist.` : 'Removed from your wishlist.')
  }
  const wishlistProducts = wishlist.map(getProduct).filter(Boolean)

  // ----- accounts (browser only) -----
  const register = async ({ name, email, password }) => {
    const users = load('mg_users', [])
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) return { error: 'This email is already registered.' }
    const u = { id: Date.now(), name, email, hash: await sha256(password) }
    save('mg_users', [...users, u])
    setUser({ id: u.id, name: u.name, email: u.email })
    return { ok: true }
  }
  const login = async ({ email, password }) => {
    const u = load('mg_users', []).find((x) => x.email.toLowerCase() === email.toLowerCase())
    if (!u || u.hash !== (await sha256(password))) return { error: 'These credentials do not match our records.' }
    setUser({ id: u.id, name: u.name, email: u.email })
    return { ok: true }
  }
  const logout = () => setUser(null)

  const placeOrder = (data) => {
    const order = {
      id: (orders.reduce((m, o) => Math.max(m, o.id), 0) || 1000) + 1,
      userId: user?.id, ...data, total: cartTotal, status: 'pending', payment_status: 'unpaid',
      created_at: new Date().toISOString(),
      items: lines.map((l) => ({ title: l.product.title, quantity: l.qty, price: l.product.price })),
    }
    setOrders([order, ...orders]); clearCart()
    return order
  }
  const myOrders = orders.filter((o) => o.userId === user?.id)

  return (
    <Ctx.Provider value={{
      cart, cartCount, lines, cartTotal, addToCart, updateCart, removeFromCart,
      wishlist, inWishlist, toggleWishlist, wishlistProducts,
      user, register, login, logout, orders, myOrders, placeOrder,
      toast, say, flash, showFlash, products,
    }}>{children}</Ctx.Provider>
  )
}
