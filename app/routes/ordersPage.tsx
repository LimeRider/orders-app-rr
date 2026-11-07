import { getOrders } from "~/lib/orders.server";

import { Form, Link, useNavigation } from "react-router";
import { formatDate, formatMoney, STATUS_LABELS } from "~/lib/format";
import { orderCostKop } from "~/lib/calculator";
import type { Route } from "./+types/ordersPage";

export async function loader({ request }: Route.LoaderArgs) {
  const params = new URL(request.url).searchParams;
  const q = params.get("q") ?? "";
  const status = params.get("status") ?? "";
  return { orders: await getOrders(q, status), q, status };
}

export default function Orders({ loaderData }: Route.ComponentProps) {
  const { orders, q, status } = loaderData;
  const loading = useNavigation().state !== "idle";
  return (
    <main className="mx-auto max-w-5xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Замовлення</h1>

      <Form key={q + status} className="mb-4 flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Номер або ім'я"
          className="rounded border px-3 py-2"
        />
        <select
          name="status"
          defaultValue={status}
          className="rounded border px-3 py-2"
        >
          <option value="">Усі статуси</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button className="rounded bg-blue-600 px-4 py-2 text-white">
          Знайти
        </button>
      </Form>
      {loading && <p>Завантажується...</p>}
      {orders.length === 0 ? (
        <div className="py-10 text-center">
          <p className="mb-3">Нічого не знайдено</p>
          <Link to="/orders" className="rounded border px-4 py-2">
            Скинути фільтри
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                {["№", "Дата", "Клієнт", "Статус", "Позицій", "Вартість"].map(
                  (h) => (
                    <th key={h} className="p-2">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b [&>td]:p-2">
                  <td>
                    <Link
                      to={`/orders/${o.id}`}
                      className="text-blue-600 underline"
                    >
                      {o.id}
                    </Link>
                  </td>
                  <td>{formatDate(o.createdAt)}</td>
                  <td>{o.client.name}</td>
                  <td>
                    {STATUS_LABELS[o.status as keyof typeof STATUS_LABELS]}
                  </td>
                  <td>{o.items.length}</td>
                  <td className="whitespace-nowrap">
                    {formatMoney(orderCostKop(o))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export function ErrorBoundary() {
  return (
    <main className="mx-auto max-w-5xl p-4">
      <p className="mb-3">Не вдалося завантажити замовлення.</p>
      <Link to="/orders" reloadDocument className="rounded border px-4 py-2">
        Спробувати ще раз
      </Link>
    </main>
  );
}
