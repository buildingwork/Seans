# The Sean Sanctuary

An exclusive web portal strictly for people named Sean (all valid spellings accepted), featuring the 1993 *Jurassic Park* Dennis Nedry security protocol for Simons, an interactive community whiteboard with sticky notes and freehand drawing, and the Wikipedia Wheel of Seans.

## Features
- **Strictly Seans-Only Gate**: Supports all spelling variants (*Sean*, *Shaun*, *Shawn*, *Seán*, *Sion*, *Shon*, *Shane*).
- **Dennis Nedry Intruder Screen**: Simons (*Simon*, *Simon Pegg*, etc.) trigger the classic *Jurassic Park* permission denied screen with animated wagging finger, CRT scanlines, and Web Audio synthesized "Ah ah ah!" sound effects.
- **Community Whiteboard**:
  - Shared sticky pinboard with colorful notes, signatures, and persistent like counters in Netlify Database.
  - Digital chalkboard canvas for freehand sketches with brush controls, eraser, and PNG export.
- **Wikipedia Wheel of Fortune**: Canvas wheel of famous Seans with deceleration physics, audio clicks, and live Wikipedia REST API summary cards.
- **The Great Sean Spelling Census**: Community poll and historical etymology of the name Sean.

## Where data lives

Community notes and likes are stored in Netlify Database (managed Postgres), accessed through the `/api/notes` Netlify Function. They are shared across browsers and devices and survive reloads and site deployments.

- The board shows the latest 100 notes and refreshes every 30 seconds while the page is visible, with a manual refresh option. Older notes remain in the database. Notes are public; entered names are self-declared, not verified accounts.
- Only the browser that created a note can delete it, using an HTTP-only ownership cookie valid for one year. Clearing that cookie loses deletion access; entering the same name elsewhere does not grant ownership. Likes are repeatable endorsements, not unique member votes.
- Previous browser-only notes are not automatically published or imported. The new shared board starts empty without fictional example posts. Old `localStorage` data is left untouched.
- The entered name and spelling are stored in `sessionStorage` under `SEAN_SANCTUARY_USER` and `SEAN_SANCTUARY_SPELLING`. They last for the current browser tab session and are removed when switching users. This is a playful name check, not an authenticated account.
- Census votes and the voted state exist only in React memory and reset on reload. Starting vote totals and the header's active-Sean count are hardcoded sample figures, not live community statistics.
- Doodles exist only on the current canvas and reset when leaving the drawing tab or reloading. The PNG export saves a copy to the visitor's device.
- Famous-Sean profiles are bundled in `src/data/famousSeans.ts`; Wikipedia summaries are fetched from Wikipedia with bundled fallback content. Code and bundled content are versioned in the GitHub repository and served through Netlify.

Database schema is defined in `db/schema.ts`, and generated migrations live in `netlify/database/migrations/`. Netlify applies migrations at deploy time and isolates deploy previews from production data. Run local development with `netlify dev --port 8889` to serve the API alongside Vite; plain Vite does not serve database endpoints.

This version implements a public community board. Accounts, private messages, reporting, and administrator moderation are separate future features. A small board is roughly 1–2 development days; a broader community with verified accounts, profiles, replies, and moderation is roughly 1–2 weeks, depending on requirements. Hosting charges depend on usage.
