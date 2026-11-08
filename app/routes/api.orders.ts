import { getOrders } from "~/lib/orders.server";

export async function loader({ request }: { request: Request }) {
  const p = new URL(request.url).searchParams;
  return Response.json(
    await getOrders(p.get("q") ?? "", p.get("status") ?? ""),
  );
}
