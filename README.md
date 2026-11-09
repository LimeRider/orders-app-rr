# Glass Unit Orders

An SSR app for viewing glass unit orders. Trainee Frontend test assignment.

**Live demo:** (https://orders-app-rr.onrender.com/orders)

> The free Render plan puts the service to sleep after inactivity, so the first request may take up to a minute.

## Stack

React 19, TypeScript, React Router 7 (framework mode, SSR), Tailwind CSS.

## Running locally

```bash
npm install
npm run dev      # development, http://localhost:5173
npm run build
npm start        # production build
```

## Why React Router 7

It is the tool I know best, so my time went into the requirements instead of learning a new framework. In framework mode it provides full SSR: a `loader` runs on the server and the page arrives with its data already rendered. It also has built-in 404 handling via `throw new Response`, `action` for forms, and resource routes for API endpoints.

## What runs on the server and what runs on the client

**Server:**
- reading `orders.json` (it lives in `app/data` and is bundled into the server build, not served from `public`);
- the `loaders` of `/orders` and `/orders/:id`: filtering by `q` and `status` from the URL, HTTP 404 for a missing order;
- the redirect `/` → `/orders`;
- the API endpoints `GET /api/orders?q=&status=` and `GET /api/orders/:id`;
- the `action` of the "New order" form, with server-side re-validation;
- an artificial 300–800 ms delay on every data request.

**Client:**
- the loading indicator during navigation (`useNavigation`);
- the theme toggle and persisting the choice in `localStorage`;
- the "New order" form state: adding and removing items, live cost recalculation while typing.

The initial HTML is always rendered on the server and then hydrated in the browser.

## Design decisions

- **Pages call `getOrders` / `getOrder` directly** instead of going through `/api`. This avoids an extra network hop from the server to itself, and the same logic serves both the pages and the endpoints.
- **Filters live in the URL** (`/orders?q=koval&status=new`). The search form is a plain GET form, so after a reload or following a link the page already arrives filtered from the server.
- **Search by number** matches as a substring (`q=100` matches every order with 100 in its number). Search by name is case-insensitive.
- **Money is calculated in kopecks (integers)** and area in mm², to avoid floating-point errors. For example, order 1016 has items that come out at exactly half a kopeck, and the result must round to 6,753.38, not 6,753.37.
- **Cost is calculated from the exact area**, while the area is displayed with two decimals. As a result, the displayed row areas may not visually add up to the total (for example, order 1016: 5.87 + 0.94 ≠ 6.82).
- **0.5 m² minimum:** a glass unit smaller than that is billed as 0.5 m² (for example, 707 × 707 in order 1011).
- **Edge cases:** an order with no items (1003) shows a message instead of an empty table; `/orders/9999` returns HTTP 404.
- **Dates** are formatted in the `Europe/Kyiv` time zone so the server and the browser render the same value.

## Responsiveness and theme

- Works from 360 px wide; tables scroll inside their own container and never stretch the page.
- Dark theme: follows the system setting by default, with a manual toggle. A small script in `<head>` sets the theme before the first paint, so the light theme never flashes.

## "New order" form

Validation: client name is required, phone must be `+380` followed by 9 digits, width and height 100–3000 mm, quantity at least 1. In the browser this is done with HTML attributes; on the server the same checks are repeated in the `action`.

**Storage limitation:** new orders are kept in the memory of the Node process. They are lost when the server restarts (on the Render free plan this happens after inactivity and on every deploy). If several instances run, each has its own list. A real database is needed for production.

## Structure

```
app/
  components/ThemeToggle.tsx
  data/orders.json
  lib/            types, calculator, format, orders.server
  routes/         home, ordersPage, orderPage, newOrderPage, api.orders, api.order
```
