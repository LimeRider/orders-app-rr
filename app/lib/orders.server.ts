import OrdersData from "../data/orders.json";
import type { Order } from "./types";

const orders = OrdersData as Order[];

const delay = () =>
  new Promise((r) => setTimeout(r, 300 + Math.random() * 500));

export async function getOrders(q = "", status = "") {
  await delay();
  const query = q.trim().toLowerCase();
  return orders.filter(
    (o) =>
      (!status || o.status === status) &&
      (!query ||
        String(o.id).includes(query) ||
        o.client.name.toLowerCase().includes(query)),
  );
}

export async function getOrder(id: number) {
  await delay();
  return orders.find((o) => o.id === id) ?? null;
}
