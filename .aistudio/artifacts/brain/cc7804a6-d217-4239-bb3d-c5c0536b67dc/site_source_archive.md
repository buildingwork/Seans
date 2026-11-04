# The Sean Sanctuary - Project Source Archive

The entire project has been bundled into a portable ZIP archive ready for local development or instant one-click deployment to any hosting platform (Vercel, Netlify, Cloudflare Pages, Firebase Hosting, or your own server).

## Download Links

* **Direct Web Download**: [Download sean-sanctuary.zip](/sean-sanctuary.zip)
* **Direct Cloud Run Download**: [Download from Live Cloud Run Service](https://ais-pre-mm5xyae2lc65ons46r57dx-39841992477.europe-west1.run.app/sean-sanctuary.zip)

---

## Included Files

```
sean-sanctuary/
├── README.md                      # Setup and deployment documentation
├── package.json                   # Dependencies & scripts
├── vite.config.ts                 # Vite & Tailwind configuration
├── tsconfig.json                  # TypeScript configuration
├── index.html                     # Entry HTML & meta tags
├── src/
│   ├── main.tsx                   # React root entry point
│   ├── App.tsx                    # Main App container & auth router
│   ├── index.css                  # Global Tailwind CSS imports
│   ├── types/
│   │   └── index.ts               # Shared TypeScript models
│   ├── utils/
│   │   ├── nameVerification.ts    # Multi-spelling Sean & Simon Nedry logic
│   │   ├── nameVerification.test.ts # Unit tests
│   │   └── soundEffects.ts        # Web Audio synthesizer (Nedry alarm & wheel ticks)
│   ├── data/
│   │   └── famousSeans.ts         # Famous Seans catalog & Wikipedia fetcher
│   └── components/
│       ├── LoginScreen.tsx        # Identity verification gate & spelling chips
│       ├── NedryScreen.tsx        # Jurassic Park Dennis Nedry animated terminal
│       ├── SeanHeader.tsx         # Top bar with status & download button
│       ├── Whiteboard.tsx         # Sticky notes pinboard & doodle canvas
│       ├── WheelOfFortune.tsx     # Canvas wheel of Seans & Wikipedia card
│       └── SpellingDebate.tsx     # Sean spelling census voting poll
```

---

## How to Run Locally

1. Extract `sean-sanctuary.zip`.
2. Open a terminal inside the extracted directory and run:
   ```bash
   npm install
   npm run dev
   ```
3. Open `http://localhost:3000` in your web browser.

---

## Deploying to Your Custom Domain (`seans.ie`)

### Option A: Vercel (Instant 1-Click with automatic SSL)
1. Push the code to a GitHub repository or install the Vercel CLI (`npm i -g vercel`).
2. Run `vercel`.
3. In the Vercel dashboard under **Project Settings > Domains**, add `seans.ie` and `www.seans.ie`.
4. Vercel provides the exact `A` and `CNAME` records to enter in your DNS Ireland panel with automatic SSL certificates!

### Option B: Cloudflare Pages / Netlify
1. Connect your repository to Cloudflare Pages or Netlify.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add `seans.ie` as your custom domain.
