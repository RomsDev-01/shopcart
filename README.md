# ◆ ShopCart — E-Commerce Storefront

A fully functional e-commerce frontend built as a capstone project demonstrating end-to-end frontend architecture with React.

---

## Tech Stack

| Layer | Library |
|---|---|
| UI Framework | React 18 |
| State Management | React Context API + useReducer |
| Form Handling | React Hook Form |
| Mock Backend | JSON Server |
| Build Tool | Vite |
| Routing | React Router DOM |
| Dev Orchestration | Concurrently |

---

## Features

- **Product catalog** — 12 products across 4 categories
- **Filtering** — by category, price range, search
- **Sorting** — by featured, newest, rating, price
- **Product detail modal** — size/color selection, quantity
- **Cart drawer** — add, remove, update quantity, persisted to localStorage
- **Multi-step checkout** — 3-step form with validation via React Hook Form
- **Order submission** — POSTs to JSON Server and shows success screen

---

## Project Structure

```
shopcart/
├── db.json                 # JSON Server database
├── vite.config.js          # Vite + API proxy config
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx             # Root + page routing
    ├── index.css           # Global design system
    ├── context/
    │   ├── CartContext.jsx    # Cart state (useReducer + localStorage)
    │   └── ProductContext.jsx # Products, filters, API fetching
    ├── hooks/
    │   └── useCheckout.js    # Checkout step state + order submission
    └── components/
        ├── Navbar.jsx
        ├── FilterBar.jsx
        ├── ProductCard.jsx
        ├── ProductModal.jsx
        ├── CartDrawer.jsx
        ├── CheckoutForm.jsx
        └── OrderSuccess.jsx
```

---

## Getting Started (Local Development)

### 1. Install dependencies

```bash
npm install
```

### 2. Run dev server + JSON Server together

```bash
npm run dev
```

This runs both the Vite dev server (port 5173) and JSON Server (port 3001) simultaneously using `concurrently`.

### 3. Open in browser

```
http://localhost:5173
```

> Vite proxies `/api/*` → `http://localhost:3001` so you don't need CORS headers.

---

## Architecture Deep-Dive

### CartContext

`CartContext.jsx` uses `useReducer` for predictable cart state updates.

```jsx
// Actions: ADD_ITEM | REMOVE_ITEM | UPDATE_QTY | CLEAR_CART | TOGGLE_DRAWER
const [state, dispatch] = useReducer(cartReducer, initialState)
```

Cart is persisted to `localStorage` via a `useEffect` that fires on every `items` change:

```jsx
useEffect(() => {
  localStorage.setItem('cart', JSON.stringify(state.items))
}, [state.items])
```

Items are keyed by `id + variant` so the same product in different sizes is tracked independently.

### ProductContext

`ProductContext.jsx` handles data fetching and client-side filtering/sorting in one place.

```jsx
// Derived filtered list — computed on every render from state
const filtered = state.products
  .filter(p => matchesCategory && matchesPrice && matchesSearch)
  .sort(bySortOption)
```

This avoids a separate `filteredProducts` state slice and keeps derived data DRY.

### React Hook Form

`CheckoutForm.jsx` uses RHF's `register` and `handleSubmit` pattern:

```jsx
const { register, handleSubmit, formState: { errors } } = useForm()

// Validation is declarative
{...register('email', {
  required: 'Email is required',
  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' }
})}
```

The same `<form>` renders different fields per step — RHF tracks all field states across re-renders without re-registering.

### useCheckout Hook

`useCheckout.js` encapsulates step state and order submission logic, keeping `CheckoutForm` as a pure presentational component:

```jsx
const { step, nextStep, prevStep, submitOrder, orderData } = useCheckout()
```

---

## Deploying to Vercel

ShopCart has two parts:
- **Frontend** (React/Vite) → deploy to Vercel normally
- **JSON Server** (mock API) → needs a separate backend host

### Part A: Deploy Frontend to Vercel

#### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "initial commit"
gh repo create shopcart --public --push
# or: git remote add origin https://github.com/YOUR_USERNAME/shopcart.git
#     git push -u origin main
```

#### Step 2 — Import to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. Framework preset: **Vite** (auto-detected)
4. Build command: `npm run build` ✅ (default)
5. Output directory: `dist` ✅ (default)
6. Click **Deploy**

#### Step 3 — Set the API base URL

In `src/context/ProductContext.jsx`, the fetch calls use `/api/products`. In production, `/api` needs to point to your deployed JSON Server.

Create `src/config.js`:

```js
const API_BASE = import.meta.env.VITE_API_URL || '/api'
export default API_BASE
```

Then update your fetch calls:
```js
import API_BASE from '../config'
const res = await fetch(`${API_BASE}/products`)
```

In Vercel: **Settings → Environment Variables**
```
VITE_API_URL = https://your-json-server.railway.app
```

### Part B: Deploy JSON Server Backend

JSON Server is a Node.js process — it needs a persistent host. Two free options:

---

#### Option 1: Railway (Recommended — easiest)

1. Create a `server.js` in project root:

```js
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.rewriter({ '/api/*': '/$1' }))
server.use(router)

const PORT = process.env.PORT || 3001
server.listen(PORT, () => console.log(`JSON Server running on port ${PORT}`))
```

2. Add to `package.json`:
```json
"scripts": {
  "start": "node server.js"
}
```

3. Add `json-server` to regular dependencies (not devDependencies):
```bash
npm install json-server@0.17.4
```

4. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
5. Select your repo → Railway auto-detects `npm start`
6. Copy the deployment URL (e.g. `https://shopcart-api.railway.app`)

---

#### Option 2: Render

1. Same `server.js` as above
2. Go to [render.com](https://render.com) → New Web Service
3. Connect GitHub repo
4. Build command: `npm install`
5. Start command: `node server.js`
6. Instance type: **Free**
7. Copy your Render URL

---

#### Step 4 — Connect Frontend to Backend

Back in Vercel:
- **Environment Variables** → Add `VITE_API_URL` = your Railway/Render URL
- Redeploy (Vercel → Deployments → Redeploy)

Your full-stack demo app is now live!

---

## Development Scripts

| Command | Description |
|---|---|
| `npm run dev` | Frontend + JSON Server (concurrent) |
| `npm run server` | JSON Server only (port 3001) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | ESLint check |

---

## Extending the Project

**Add React Router** for dedicated product pages (`/products/:id`):
```bash
npm install react-router-dom
```

**Add Zustand** to replace Context for simpler global state:
```bash
npm install zustand
```

**Add Stripe** for real payments:
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

**Add TanStack Query** for smarter data fetching with caching:
```bash
npm install @tanstack/react-query
```

---

## License

MIT — free to use, modify, and deploy.
