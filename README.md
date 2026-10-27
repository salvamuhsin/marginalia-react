# Marginalia Books – React frontend (for Netlify)

Converted from the Laravel/Blade project. Same design (Tailwind + same colours, fonts, animations), same pages.

## Run locally
    npm install
    npm run dev

## Deploy on Netlify
1. Push this folder to GitHub (or drag the folder into Netlify after running `npm run build` and dropping `dist/`).
2. New site -> import repo. Build command `npm run build`, publish directory `dist` (already set in netlify.toml).
3. In Netlify -> Forms you will see `contact` and `newsletter`; messages and subscribers arrive there.

## Product cover photos
Uploaded covers were stored by Laravel in `storage/app/public/products/`.
Copy that folder to `public/storage/products/` in this project. Until then, products show the coloured cover fallback.

## What changed because there is no backend
- Data: products and categories come from `src/data/catalog.json` (your seed data). To change the catalog, edit that file.
- Cart, wishlist, accounts and orders are saved in the visitor's browser (localStorage). They are not shared between devices.
- Login/register is a browser-only demo, not real security. Orders are not sent anywhere.
- Contact form and newsletter use Netlify Forms.
- Card payment (Stripe) shows the same "not set up" message as before; cash on delivery works.
- The /admin panel is not included (it needs a server).
