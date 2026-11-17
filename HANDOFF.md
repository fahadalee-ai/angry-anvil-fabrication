# Angry Anvil Fabrication — handoff

The app is a phone-framed TanStack Start interface on the existing web stack. It was not migrated to React Native. Open it at the project base path `/on-top-aba/` (kept so the current preview host still matches).

Sign-in, registration, password changes, and verification codes accept any input. A saved sample account is still `builder@angryanvil.store` / `ShopDemo1`. Sign in with Apple creates a labeled sample session and does not call Apple. Guest browsing covers the shop and course catalog. Checkout, course purchase, chat, giveaways, Bible offers/requests, and bookings ask for an account.

## Open questions for the client

- Payment provider for courses. Apple generally requires In-App Purchase for digital content sold in an iOS app. The payment call sits behind `confirmPayment` in `src/lib/services.ts`. The sample flow records access only after that function resolves, and it does not charge anyone.
- Whether the first Beginner Welding lesson stays a free preview.
- Certificates are omitted until the client confirms one exists.
- Real kit contents, specs, merchandise, and any price that is not the four sample kit prices in the brief.
- Printify account, so merchandise and fulfillment can replace `listPrintifyProducts`.
- Giveaway official rules, eligibility, age, and prize. The in-app copy is a placeholder.
- Bible Exchange policy. The three steps are marked SAMPLE.
- Devotional translation licensing. Samples use the public-domain King James Version plus original sample reflections.
- Facebook page URL. The home update row links to https://www.angryanvil.store/ because a page URL was not confirmed.
- Shipping rates, return window, privacy policy, and terms. Those screens are placeholders.

## What is real vs sample

Shop phone `(606) 271-2461`, email `angryanvil.fab@gmail.com`, and weekday hours came from the live site. Kit names and the four kit prices came from the brief and are still badged SAMPLE. Course prices, laser prices, and merchandise prices are sample figures. Custom fabrication has no price.

Photos in `public/assets/images` were generated for this app. The logo is the existing file at `src/img/logo.png` and was not redrawn. Empty states are shared vector anvil marks, not generated photos. Extra product angles beyond the shots in the catalog are still to be produced.

Course videos and PDFs have no URLs. Locked lessons show a lock. Entitled lessons use an in-app sample player. A "simulate refund" control on a purchased course locks it again so that state can be reviewed.
