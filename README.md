# kowsar.vercel.app

Static site, no build step.

- index.html  : your personal page, served at https://kowsar.vercel.app/
- shop.html   : the KOWSAR fashion shop, served at https://kowsar.vercel.app/shop
- vercel.json : maps /shop to shop.html

## Deploy with the Vercel CLI
1. Install Node.js, then run: npm i -g vercel
2. In this folder run: vercel login
3. Run: vercel --prod
   - Project name: kowsar  (gives kowsar.vercel.app if the name is free)
   - Framework preset: Other
   - Build command: leave empty
   - Output directory: leave empty (the current folder)

## Deploy with GitHub
1. Push this folder to a GitHub repository.
2. In Vercel choose Add New, Project, and import the repository.
3. Name the project kowsar, preset Other, leave build settings empty, then Deploy.

## Before you share /shop publicly
- shop.html has a noindex tag so search engines skip it. Remove it at launch.
- Products, prices, reviews, policies, the email address and the bKash and Nagad numbers are samples.
- Checkout is a demo. It does not receive orders or take payments.
