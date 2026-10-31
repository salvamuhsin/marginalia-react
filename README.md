# Marginalia Books (React)

A React storefront for the Marginalia bookshop. It is a frontend-only version of the Laravel project, built to be hosted for free on **Netlify**. It keeps the same design, pages and animations.

## Features

- Home page with carousel, offers, categories, FAQ and newsletter signup
- Books and accessories pages with search, category, price and stock filters, sorting and pagination
- Product pages with related items
- Wishlist and shopping cart
- Login, register and "My orders" (demo accounts, see below)
- Checkout with cash on delivery
- About and Contact pages
- Light and dark mode, scroll animations, responsive layout

## Tech stack

- React 18 and React Router
- Vite
- Tailwind CSS 3
- Netlify Forms for the contact form and newsletter

## Getting started

Requirements: [Git](https://git-scm.com) and [Node.js](https://nodejs.org) (LTS version).

```bash
# 1. Download the project
git clone https://github.com/salvamuhsin/marginalia-react.git

# 2. Go into the project folder
cd marginalia-react

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Then open the address shown in the terminal (usually http://localhost:5173).

To get the latest changes later:

```bash
git pull
npm install
```

Open the address shown in the terminal (usually http://localhost:5173).

To test the production build:

```bash
npm run build
npm run preview
```

## Project structure

```
public/
  images/            Banners, slides and illustrations
  covers/            Product cover images
src/
  components/        Layout, Card, Cover, Hero, Icon
  pages/             Home, About, Contact, Products, ProductShow, Cart, Checkout, ...
  lib/               Catalog helpers, cart and account state, scroll effects
  data/catalog.json  Products and categories
netlify.toml         Netlify build settings and redirects
```

## Managing products

Products and categories live in `src/data/catalog.json`.

## Shop details

Name, currency, email, phone and address are in `src/lib/config.js`.

## How it works without a backend

This project has no server, so some features work differently from the Laravel version:

| Feature | How it works here |
|---|---|
| Products and categories | Read from `src/data/catalog.json` |
| Cart and wishlist | Saved in the visitor's browser (localStorage) |
| Login and register | Browser-only demo accounts, not real security |
| Orders | Saved in the browser only and not sent anywhere |
| Contact form and newsletter | Sent to Netlify Forms |
| Card payment (Stripe) | Not available, shows a "not set up" message |
| Admin panel | Not included (needs a server) |

Because data is stored per browser, carts, accounts and orders are not shared between devices.

