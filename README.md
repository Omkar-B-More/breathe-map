# 🌿 BreatheMap — Smart Low Pollution Route Navigator

> A Progressive Web App that finds the healthiest routes for walking, jogging, and cycling — by scoring real road routes against air quality, traffic density, and historical pollution data.

## ✨ What It Does

BreatheMap doesn't just find the fastest way to get somewhere — it finds the way that's best for your lungs. Search a destination in Mumbai, pick how you're traveling (walk / jog / cycle), and the app returns **three real, road-accurate routes** ranked by a custom pollution-aware health score, color-coded so you can decide at a glance.

| 🟢 Green | 🟡 Yellow | 🔴 Red |
|---|---|---|
| Healthy — safe to use | Moderate — limit exposure | Unhealthy — avoid if possible |

---

## 🚀 Live Demo

Open [`index.html`](./index.html) directly in any browser — no build step, no API keys, no server required. It's a fully self-contained single-page app.

Default location: **Borivali West, Mumbai** (configurable in code).

---

## 🧩 Features

- 🗺️ **Live interactive map** (Leaflet.js + CartoDB dark tiles) centered on the user's location
- 🔍 **Destination search with autocomplete** — 30+ pre-geocoded Mumbai landmarks, or tap anywhere on the map
- 🛣️ **Real road routing** via the OSRM (Open Source Routing Machine) public API — routes follow actual streets, not straight lines
- 🚶🏃🚴 **Three travel modes** — Walk, Jogger (parks/trails priority), Cyclist (bike lanes priority)
- 📊 **Three ranked route options per search** — Cleanest, Balanced, Fastest — each with distance, ETA, AQI, and a computed Health Score
- 🌡️ **Toggleable pollution heatmap** overlay showing AQI hotspots across the city
- 📈 **Analytics dashboard** — weekly AQI trends, hourly pollution curve, 30-minute interval breakdown, route comparison chart (all via Chart.js)
- ⭐ **Saved routes** screen for favorite low-pollution paths
- 📱 **Installable PWA** — add to home screen, works offline via Service Worker
- 🎨 **Dark, map-app-native UI** — floating search bar, FAB, bottom sheet route picker

---

## 🧮 The Route Health Score

Every route is scored using a weighted formula that balances current air quality, live traffic congestion, and historical pollution trends for that path:

```
RouteScore = (AQI × 0.5) + (TrafficDensity × 0.3) + (HistoricalPollution × 0.2)
```

| Score Range | Category | Meaning |
|---|---|---|
| 0 – 80    | 🟢 Green  | Healthy — safe to travel |
| 80 – 150  | 🟡 Yellow | Moderate — okay in short bursts |
| 150+      | 🔴 Red    | Unhealthy — avoid if possible |

**Lower score = healthier route.** This logic lives in `findRoutes()` inside `index.html` (and is mirrored in `backend/utils/routeScore.js` for the API version).

---

## 🛠️ Tech Stack

| Layer | Tools |
|---|---|
| **Map** | [Leaflet.js](https://leafletjs.com/) + OpenStreetMap tiles (CartoDB Dark Matter) |
| **Routing** | [OSRM](http://project-osrm.org/) Directions API (free, no key needed) |
| **Charts** | [Chart.js](https://www.chartjs.org/) |
| **Frontend** | HTML5 / CSS3 / Vanilla JavaScript (no build tools — runs anywhere) |
| **PWA** | Web App Manifest + Service Worker (`manifest.json`, `sw.js`) |
| **Backend (reference impl.)** | Node.js, Express.js |
| **Database (reference impl.)** | PostgreSQL |

> The repo includes a production-style backend (`/backend`) and Next.js frontend scaffold (`/frontend`) for teams that want to scale this beyond the single-file demo — see [Architecture](#-architecture) below.

---

## 📁 Project Structure

```
breathemap/
├── index.html              # ⭐ Standalone PWA — open this to run the app
├── manifest.json           # PWA manifest (installable app metadata)
├── sw.js                   # Service worker (offline caching)
│
├── backend/                 # Express.js API (for scaling beyond mock data)
│   ├── server.js            # REST endpoints: routes, pollution, analytics, favorites
│   ├── schema.sql            # PostgreSQL schema: users, routes, pollution_data, favorites
│   └── utils/
│       └── routeScore.js     # Shared health-score formula + ranking logic
│
└── frontend/                # Next.js scaffold (component-based rewrite path)
    └── src/lib/index.ts      # TypeScript route score fn, Axios client, React hooks
```

---

## ⚙️ How It Works

1. **Map loads** centered on the user's default location, with a pulsing live-location marker
2. **User searches** a destination — autocomplete suggests matching places, or they click the map directly
3. **On "Find Healthiest Route"**, the app calls the OSRM API for real alternative road routes between the two points
4. **Each route is scored** using the weighted pollution formula above and tagged Cleanest / Balanced / Fastest
5. **Routes are drawn** as color-coded polylines on the live map, sorted best-to-worst in a bottom sheet
6. **Selecting a route** updates the live AQI badge and starts "navigation"
7. **Analytics tab** visualizes historical AQI patterns to help plan ahead

---

## 🏃 Running Locally

No installation needed for the core app:

```bash
git clone https://github.com/<your-username>/breathemap.git
cd breathemap
# Just open it
open index.html        # macOS
start index.html        # Windows
xdg-open index.html     # Linux
```

Or serve it locally for full PWA behavior (service workers require http/https, not `file://`):

```bash
npx serve .
# then visit http://localhost:3000
```

### Running the optional backend

```bash
cd backend
npm install
createdb breathemap
psql -d breathemap -f schema.sql
node server.js   # → http://localhost:4000
```

---

## ☁️ Deployment

- **Static frontend** → [Vercel](https://vercel.com), [Netlify](https://netlify.com), or GitHub Pages (it's just static files)
- **Backend** → [Railway](https://railway.app) or [Render](https://render.com) with a managed PostgreSQL add-on
- **Database** → [Supabase](https://supabase.com) or [Neon](https://neon.tech) (free-tier Postgres)

---

## 🗺️ Architecture

```
┌─────────────┐     search/select destination     ┌──────────────┐
│   Browser   │ ─────────────────────────────────▶ │   OSRM API   │
│  (Leaflet)  │ ◀───────────────────────────────── │ (road routes)│
└─────┬───────┘        real route geometry          └──────────────┘
      │
      │ score routes (AQI × 0.5 + Traffic × 0.3 + Historical × 0.2)
      ▼
┌─────────────┐
│ Routes Panel │  →  Green / Yellow / Red ranked cards
└─────────────┘
```

For the scaled version: the frontend would call `/api/routes/generate` on the Express backend, which proxies OSRM, enriches with live AQI from a provider (e.g. OpenWeatherMap Air Pollution API), persists results in PostgreSQL, and returns scored routes to the client.

---

## 🔮 Roadmap

- [ ] Live AQI integration (OpenWeatherMap / IQAir API) replacing mock pollution values
- [ ] User authentication + persisted favorites
- [ ] City selector (currently hardcoded to Mumbai/Borivali)
- [ ] Push notifications for AQI spikes on saved routes
- [ ] Historical route comparison over time

---






<p align="center">Built with 🌿 for cleaner commutes.</p>s://docs.lovable.dev/features/custom-domain#custom-domain)
