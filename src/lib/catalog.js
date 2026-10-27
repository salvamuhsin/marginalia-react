import data from '../data/catalog.json'
import { shop } from './config.js'

export const categories = data.categories
export const products = data.products.map((p) => ({ ...p }))

const catById = new Map(categories.map((c) => [c.id, c]))
const prodById = new Map(products.map((p) => [p.id, p]))

export const getCategory = (id) => catById.get(id)
export const getProduct = (id) => prodById.get(Number(id))

export const money = (cents) =>
  shop.currency + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// Newest first (same as Laravel's latest())
const byNewest = (a, b) => (a.created_at < b.created_at ? 1 : a.created_at > b.created_at ? -1 : b.id - a.id)

export const newest = (type, n) => products.filter((p) => p.type === type).sort(byNewest).slice(0, n)

export const productCount = (catId) => products.filter((p) => p.categoryIds.includes(catId)).length

export const homeCategories = () =>
  [...categories].sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name))

export const typeCategories = (type) =>
  categories.filter((c) => c.type === type).sort((a, b) => a.name.localeCompare(b.name))

export function queryProducts(type, { q, category, min, max, stock, sort }) {
  const s = (q || '').toLowerCase()
  let list = products.filter((p) => p.type === type)
  if (s) list = list.filter((p) => [p.title, p.author, p.isbn].some((v) => (v || '').toLowerCase().includes(s)))
  if (category.length) {
    const ids = categories.filter((c) => category.includes(c.slug)).map((c) => c.id)
    list = list.filter((p) => p.categoryIds.some((id) => ids.includes(id)))
  }
  if (min !== '' && !isNaN(min)) list = list.filter((p) => p.price >= Number(min) * 100)
  if (max !== '' && !isNaN(max)) list = list.filter((p) => p.price <= Number(max) * 100)
  if (stock) list = list.filter((p) => p.stock > 0)
  if (sort === 'price_asc') list.sort((a, b) => a.price - b.price)
  else if (sort === 'price_desc') list.sort((a, b) => b.price - a.price)
  else if (sort === 'title') list.sort((a, b) => a.title.localeCompare(b.title))
  else list.sort(byNewest)
  return list
}

export function related(product) {
  return products
    .filter((p) => p.type === product.type && p.id !== product.id && p.categoryIds.some((id) => product.categoryIds.includes(id)))
    .slice(0, 4)
}
