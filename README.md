# Fastor Food Ordering

A mobile-first food ordering web app built with **React + Vite** . It covers phone-number signup with OTP, a home screen with restaurants and food items, product customization, and a working cart.

## Features

| Screen               | What it does| 

| **Signup**           | Country dial-code selector (default +91), mobile number validation, "Get OTP" via the register API                           |
| **OTP verification** | Six-digit input with auto-advance, backspace and paste support, shows the number, 30-second resend countdown, back to signup |
| **Home**             | Location header, search, Best Seller strip, promo banner, Popular Items, live restaurant list with pagination                |
| **Product details**  | Large image, price, quantity stepper, portion options that change the price, Add to cart                                     |
| **Cart**             | Line items with quantity controls and remove, correct totals, empty state, clear cart                                        |

Also included: loading, error and empty states, image fallbacks, keyboard-accessible forms, protected routes, and cart persistence across reloads.

## Tech stack

- React 18, Vite 5, JavaScript, plain CSS
- React Router DOM 6
- Fetch API (no Axios needed)
- Context API + `useReducer` for auth and cart state
- Lucide React for icons

```bash
# 1. Install dependencies
npm install

# 2. (Optional) create your env file
cp .env.example .env

# 3. Start the dev server
npm run dev
```

Open http://localhost:5173. Use a browser device toolbar (mobile view) to see the intended layout.

| Variable                                      | Purpose                                 | Default |
| --------------------------------------------- | --------------------------------------- | ------- |
| `VITE_API_BASE_URL`                           | Backend base URL                        |
| Production build: `https://staging.fastor.ai` |
| `VITE_CITY_ID`                                | `city_id` used when listing restaurants | `118`   |

## Available scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the dev server with hot reload |
| `npm run build`   | Create a production build in `dist/` |
| `npm run preview` | Serve the production build locally   |

## Project structure

```text
src/
├── components/
│   └── FoodImage.jsx          # Image with emoji fallback
├── context/
│   ├── AuthContext.jsx        # User + JWT, persisted in localStorage
│   └── CartContext.jsx        # Cart reducer, totals, localStorage persistence
├── data/
│   └── mockProducts.js        # Mock food items and portion options
├── pages/
│   ├── Signup.jsx
│   ├── VerifyOTP.jsx
│   ├── Home.jsx
│   ├── ProductDetails.jsx
│   └── Cart.jsx
├── services/
│   ├── api.js                 # Fetch wrapper: base URL, headers, error handling
│   ├── authService.js         # register / login
│   └── restaurantService.js   # restaurant listing
├── styles/index.css           # Design tokens and all styles
├── App.jsx                    # Routes and route guards
└── main.jsx                   # Providers and app entry
```

UI components never call `fetch` directly. All network access goes through `src/services`, so endpoints can change without touching the UI.

## API integration

Base URL: `https://staging.fastor.ai`

| Purpose          | Method | Endpoint                | Body / params                                 |
| ---------------- | ------ | ----------------------- | --------------------------------------------- |
| Request OTP      | `POST` | `/v1/pwa/user/register` | `phone`, `dial_code` (form-urlencoded)        |
| Log in           | `POST` | `/v1/pwa/user/login`    | `phone`, `otp`, `dial_code` (form-urlencoded) |
| List restaurants | `GET`  | `/v1/m/restaurant`      | `city_id`, `page`                             |

## Mock data

The Postman collection has no APIs for food categories, products, customization, cart or checkout. These parts are mocked:

## App flow and routes

```text
/signup  →  /verify  →  /  →  /product/:id  →  /cart
```

| Route                        | Access                                                   |
| ---------------------------- | -------------------------------------------------------- |
| `/signup`, `/verify`         | Public only (logged-in users are redirected to `/`)      |
| `/`, `/product/:id`, `/cart` | Protected (logged-out users are redirected to `/signup`) |

## Authentication and security notes

- The JWT and user info are stored in `localStorage` under `fastor_auth`. This is a common approach for a simple SPA but is exposed to XSS. An `httpOnly` cookie set by the backend would be safer for production.
- Logging out clears the stored auth data. The cart is kept.
- There is no automatic handling of expired tokens yet.

## Deployment

Build with `npm run build` and deploy the `dist/` folder to any static host (Netlify, Vercel, Cloudflare Pages, etc.).
