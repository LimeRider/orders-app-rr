import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("orders", "routes/ordersPage.tsx"),
  route("orders/:id", "routes/orderPage.tsx"),
] satisfies RouteConfig;
