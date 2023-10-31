# Cheap Domain Finder

**Try at [speclang.dev/domains](https://speclang.dev/domains)**

Tired of paying too much for a domain? Trying to look for the best price to save some money? Don't want to run into a
premium domain?
Then this website's for you! This app will find the best prices for domains across several registrars and will show you
the best price.

---

## Setup for yourself

1. Run `pnpm install` (or your choice of package manager)
2. Create an .env with information according to `.env.example` -- you'll need to make API keys for all of them, and a
   PostgreSQL database with password & username (I recommend [neon.tech](https://neon.tech))
3. Run `pip install` and run `load_price_data.py` to load price data into the database
4. Run `pnpm dev` to run the app and try it yourself!

---

## Notes:

-   This doesn't cover all registrars as some don't have public API endpoints, but do have pricing data as extracted from
    their websites. That's the reason for the databases for several items, as they can store the price data for all items
-   When using this app, you may omit the home button to my personal page (https://speclang.dev) if you'd like to.
