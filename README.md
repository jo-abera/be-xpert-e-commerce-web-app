# Nexus Market — BE-XPERT E-Commerce Web App

Modern full-stack-style e-commerce storefront and admin dashboard built for **Nexus Academy / BE-XPERT**. The app uses **Next.js 15 (App Router)**, **TypeScript**, **TanStack React Query**, **Zustand**, **shadcn/ui**, **next-themes**, and **Tailwind CSS**. Product, category, and user data come from the public **[Escuela JS API](https://api.escuelajs.co/api/v1)**.

---

## Live demo (local)

```bash
npm install
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)**.

| Script | Description |
|--------|-------------|
| `npm run dev` | Dev server on port **3000** |
| `npm run dev:clean` | Delete `.next` cache, then start dev |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | ESLint |

Optional API override (`.env.local`):

```env
NEXT_PUBLIC_API_URL=https://api.escuelajs.co/api/v1
```

---

## Demo accounts (Escuela JS API)

These accounts live on the **shared public API** (for learning/demo only—not production secrets).

| Role | Email | Password | Use |
|------|--------|----------|-----|
| **Admin** | `admin@mail.com` | `admin123` | Admin dashboard (`/admin`) |
| Customer | `john@mail.com` | `changeme` | Shop, cart, checkout |
| Customer | `maria@mail.com` | `12345` | Shop, cart, checkout |

### Register your own account

1. Go to **`/register`**
2. Password rules in the app: **at least 4 characters**, **letters and numbers only** (e.g. `pass1234`)
3. Log in at **`/login`**

If you see **“An account with this email already exists”**, that email is already on the API—use **Log in** or another email (e.g. Gmail plus: `you+shop@gmail.com`).

**Admin access:** Log in as `admin@mail.com`. If the API role is not `admin`, use **Continue in development mode** on the admin gate (client-side demo only).

---

## Features

### Storefront

- Home with featured products and categories
- Product listing (search, category filter, sort)
- Product detail, add to cart
- Categories and category pages (`/categories/[slug]`)
- Persistent cart (Zustand + localStorage)
- Login / register
- Protected checkout and profile
- Light / dark theme

### Admin (`/admin`)

- Overview (counts from API)
- Products: list, create, view, **edit**
- Categories: list, create, edit
- Users: list, view, **delete** (when API allows—typically users you created)
- Separate admin layout and access guard

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS 3 |
| UI | shadcn/ui (Base Nova), Lucide icons |
| Theming | next-themes |
| Server state | TanStack React Query v5 |
| Client state | Zustand (persist) |
| Notifications | Sonner |
| Motion | Framer Motion (admin drawer, etc.) |
| Backend | Escuela JS REST API |

### Data flow (short)

- **React Query** (`src/hooks/`) — fetch/cache API data (products, categories, auth profile, users).
- **Zustand** (`src/store/`) — cart, auth tokens, admin flags, last order.
- **`src/lib/api/`** — HTTP client, token refresh, endpoint modules.

---

## Project structure

```
be-xpert-e-commerce-web-app/
├── public/
│   └── images/                 # Static assets (e.g. hero images)
├── src/
│   ├── app/                    # Routes (URLs) — thin page.tsx files
│   ├── components/             # UI and feature screens
│   ├── hooks/                  # React Query hooks
│   ├── lib/                    # API client, query client, re-exports
│   ├── store/                  # Zustand stores
│   ├── types/                  # TypeScript types
│   └── utils/                  # Shared helpers (format, validation, etc.)
├── components.json             # shadcn/ui config
├── next.config.ts
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## `src/app/` — routing

Each folder under `app/` maps to a URL. **`page.tsx`** is the page component. **`[param]`** folders are **dynamic routes**.

| Path | URL example | Purpose |
|------|-------------|---------|
| `app/page.tsx` | `/` | Home |
| `app/products/page.tsx` | `/products` | Product catalog |
| `app/products/[id]/page.tsx` | `/products/5` | Product detail |
| `app/categories/page.tsx` | `/categories` | All categories |
| `app/categories/[slug]/page.tsx` | `/categories/clothes` | Products in category |
| `app/cart/page.tsx` | `/cart` | Shopping cart |
| `app/login/page.tsx` | `/login` | Sign in |
| `app/register/page.tsx` | `/register` | Create account |
| `app/profile/page.tsx` | `/profile` | User profile (auth required) |
| `app/checkout/page.tsx` | `/checkout` | Checkout (auth required) |
| `app/checkout/success/page.tsx` | `/checkout/success` | Order confirmation |
| `app/admin/page.tsx` | `/admin` | Admin overview |
| `app/admin/products/...` | `/admin/products`, `/admin/products/new`, `/admin/products/[id]/edit` | Manage products |
| `app/admin/categories/...` | `/admin/categories`, … | Manage categories |
| `app/admin/users/...` | `/admin/users`, `/admin/users/[id]` | Manage users |
| `app/layout.tsx` | — | Root layout (providers, AppShell gate) |
| `app/admin/layout.tsx` | — | Admin shell + AdminGuard |
| `app/not-found.tsx` | — | 404 page |

**`[slug]`** — human-readable category name in the URL. **`[id]`** — numeric id from the API (common in admin).

---

## `src/components/` — UI

| Folder | Main files | Role |
|--------|------------|------|
| `home/` | `Hero.tsx` | Home page content |
| `products/` | `ProductsClient`, `ProductDetailClient`, `ProductCard`, `ProductGrid`, … | Shop catalog |
| `categories/` | `CategoriesClient`, `CategoryProductsClient`, `CategoryCard` | Categories |
| `cart/` | `CartClient`, `OrderSummary`, `QuantitySelector` | Cart |
| `checkout/` | `CheckoutClient`, `CheckoutSuccessClient` | Checkout flow |
| `auth/` | `LoginForm`, `RegisterForm`, `AuthGuard`, `AuthCard` | Authentication |
| `profile/` | `ProfileClient` | Profile page |
| `layout/` | `AppShell`, `Header`, `Footer`, `AppShellGate`, … | Store chrome |
| `admin/` | `AdminShell`, `AdminGuard`, `AdminOverview`, `*Client`, `ProductForm`, `DeleteUserDialog`, … | Admin UI |
| `theme/` | `theme-provider`, `theme-toggle`, `themed-toaster` | Dark/light mode |
| `ui/` | `Button`, `Input`, `Skeleton`, … | shadcn/ui primitives |
| `providers/` | `app-providers.tsx` | React Query + theme wrapper |

Page files in `app/` import `*Client` components from here.

---

## `src/hooks/` — React Query

| File | Purpose |
|------|---------|
| `useAuth.ts` | Login, register, profile, logout |
| `useProducts.ts` | List, get, related, create, update |
| `useCategories.ts` | List, get by slug/id, create, update |
| `useUsers.ts` | List, get, delete user |
| `useDocumentTitle.ts` | Browser tab title |
| `useDebouncedValue.ts` | Search debouncing |
| `useReplaceSearchParams.ts` | URL query updates |

---

## `src/store/` — Zustand

| File | Purpose |
|------|---------|
| `auth-store.ts` | Access/refresh tokens (localStorage) |
| `cart-store.ts` | Cart items (localStorage) |
| `admin-store.ts` | Dev admin flag, “created by you” product/category ids |
| `order-store.ts` | Last checkout order (sessionStorage) |
| `index.ts` | Re-exports |

---

## `src/lib/` — API & infrastructure

| Path | Purpose |
|------|---------|
| `api/client.ts` | `fetch` wrapper, errors, JWT refresh |
| `api/auth.ts` | Login, profile, register, email check |
| `api/products.ts` | Product CRUD + list filters |
| `api/categories.ts` | Category CRUD |
| `api/users.ts` | Users list, get, delete |
| `api/sanitize.ts` | Normalize API payloads |
| `api/index.ts` | Public API exports |
| `query-client.ts` | TanStack QueryClient defaults |
| `utils.ts` | Re-exports `cn` for shadcn (`@/lib/utils`) |
| `format.ts`, `validation.ts`, `products.ts` | Re-exports from `src/utils/` |
| `auth/redirect.ts` | Re-exports login redirect helpers |
| `admin/utils.ts` | Re-exports product display helpers |

---

## `src/utils/` — shared helpers

| File | Purpose |
|------|---------|
| `cn.ts` | Merge Tailwind classes (clsx + tailwind-merge) |
| `format.ts` | `formatPrice`, `formatDate`, `cleanImageUrls`, `initials` |
| `validation.ts` | Email, phone, URL, form errors |
| `products.ts` | `sortProducts`, sort options |
| `product-display.ts` | Filter junk API products, display titles/images |
| `auth-redirect.ts` | Build/parse login redirect query params |
| `index.ts` | Barrel export |

---

## `src/types/`

| File | Purpose |
|------|---------|
| `product.ts` | Product, Category, filters, inputs |
| `user.ts` | User, login/register, tokens |
| `cart.ts` | Cart item, checkout form, simulated order |
| `index.ts` | Re-exports |

---

## Architecture notes

1. **Routes stay thin** — `app/**/page.tsx` only wires URL params to client components.
2. **Store vs admin layout** — `AppShellGate` in root layout adds header/footer for shop routes; `/admin` uses `AdminShell` without the shop header.
3. **Storefront catalog** — `product-display.ts` hides auto-generated Escuela test products and improves titles/images on the shop.
4. **Auth** — Bearer token on API calls; 401 triggers refresh or logout.
5. **No real payments** — Checkout is simulated; order stored locally for the success page.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `EADDRINUSE` port 3000 | Stop other `npm run dev` terminals; kill node on 3000; run one dev server |
| 404 on `_next/static/...` | Wrong port or stale cache — use **localhost:3000**, run `npm run dev:clean`, hard refresh |
| Register: email exists | Use **Log in** or a new email |
| Login: wrong password | Use demo accounts above or register a new email |
| Admin: access denied | Log in as `admin@mail.com` / `admin123` or use dev mode on gate |
| Delete user fails | Seed users cannot be deleted; only self-registered users (API rules) |

---

## Author

**Nexus Academy — BE-XPERT capstone**

---

## License

Private / academic use unless otherwise specified by your program.
