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

export const glassTypes = [
  ...new Map(
    orders.flatMap((o) => o.items).map((i) => [i.glassType.id, i.glassType]),
  ).values(),
];

export async function createOrder(
  name: string,
  phone: string,
  items: Order["items"],
) {
  await delay();
  const order: Order = {
    id: Math.max(...orders.map((o) => o.id)) + 1,
    createdAt: new Date().toISOString(),
    status: "new",
    client: { name, phone },
    items,
  };
  orders.push(order);
  return order;
}
