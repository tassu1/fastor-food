# Fastor Food Ordering (React + Vite)

Mobile-first food ordering web app based on the Fastor7 Figma design.

## Run
```bash
npm install
cp .env.example .env     # optional
npm run dev              # http://localhost:5173
npm run build            # production build in dist/
```

## API configuration
| Variable | Purpose | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend base URL | `https://staging.fastor.ai` (dev uses the Vite `/api` proxy to avoid CORS) |
| `VITE_CITY_ID` | `city_id` for restaurant listing | `118` |

Real endpoints (all in `src/services`): `POST /v1/pwa/user/register`, `POST /v1/pwa/user/login` (form-urlencoded), `GET /v1/m/restaurant?city_id=118`.
The restaurant request also sends `page=N` for pagination (assumed param; confirm against the API) and the JWT as a Bearer header.
For a production deployment, set `VITE_API_BASE_URL` and make sure the API allows your origin (CORS), or put a reverse proxy in front.

## Mock vs real
- Real: signup/OTP, login, restaurant list.
- Mock (`src/data/mockProducts.js`): food items, best sellers, banner, portion options. Cart is React state persisted to `localStorage`; checkout is not implemented.

## Auth note
The JWT is kept in `localStorage` (simple SPA approach; vulnerable to XSS). An httpOnly cookie issued by the backend would be safer. No credentials are hardcoded.

## Flow
`/signup` → `/verify` → `/` (home) → `/product/:id` → `/cart`. Protected routes redirect to `/signup`.
