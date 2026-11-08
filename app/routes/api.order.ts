import { getOrder } from "~/lib/orders.server";

export async function loader({ params }: { params: { id?: string } }) {
  const order = await getOrder(Number(params.id));
  return order
    ? Response.json(order)
    : Response.json({ error: "Not found" }, { status: 404 });
}
