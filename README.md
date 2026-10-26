# kowsar.vercel.app

Static site, no build step.

    index.html            your personal page  -> https://kowsar.vercel.app/
    shop/index.html       shop page structure -> https://kowsar.vercel.app/shop
    shop/css/             styles, one file per area (tokens, home, catalogue, trust,
                          size-guide, product-page, checkout, account, header, theme, mood)
    shop/js/data/         products.js (catalogue data), details.js (product copy)
    shop/js/              core, catalogue, header-panels, size-guide, global-handlers,
                          product-page, bag, checkout, account, router, init,
                          newsletter, header-scroll, mood
    admin/                boss panel -> https://kowsar.vercel.app/admin (css/, js/)
    vercel.json           maps /shop and /admin, hides /admin from search engines

Script order in shop/index.html matters: data first, then core, then the rest.

## Add or change a product
Edit shop/js/data/products.js (name, price, colours, sizes) and shop/js/data/details.js (description, fabric).

## Deploy with the Vercel CLI
1. npm i -g vercel
2. vercel login
3. vercel --prod  (project name: kowsar, preset: Other, build command and output directory: empty)

## Deploy with GitHub
Push this folder to GitHub, import it in Vercel, name the project kowsar, preset Other, Deploy.

## Before sharing /shop publicly
- shop/index.html has a noindex tag. Remove it at launch.
- Products, prices, reviews, policies, email and bKash/Nagad numbers are samples.
- Checkout is a demo. It does not receive orders or take payments.

## Boss panel (/admin)
- First visit asks you to create a PIN (demo lock, not real security).
- Dashboard, products (add, edit, hide, delete, import/export), orders (status, details, CSV), settings (PIN, backup, reset).
- Everything is stored in the browser you use. Product changes show in the shop on that same browser only.
- Orders from customers' own phones do not reach the panel, because there is no server yet.
- For real orders from many customers, move to a backend (for example Supabase) or Shopify/WooCommerce.
