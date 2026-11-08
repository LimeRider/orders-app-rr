import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("orders", "routes/ordersPage.tsx"),
  route("orders/:id", "routes/orderPage.tsx"),
  route("api/orders", "routes/api.orders.ts"),
  route("api/orders/:id", "routes/api.order.ts"),
] satisfies RouteConfig;
