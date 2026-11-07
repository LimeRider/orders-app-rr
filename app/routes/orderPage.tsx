import { getOrder } from "~/lib/orders.server";
import type { Route } from "./+types/orderPage";
import { isRouteErrorResponse, Link } from "react-router";
import {
  formatArea,
  formatDate,
  formatMoney,
  STATUS_LABELS,
} from "~/lib/format";
import {
  itemAreaMm2,
  itemBillableMm2,
  itemCostKop,
  orderAreaMm2,
  orderBillableMm2,
  orderCostKop,
} from "~/lib/calculator";

export async function loader({ params }: Route.LoaderArgs) {
  const id = Number(params.id);
  const order = Number.isInteger(id) ? await getOrder(id) : null;
  if (!order) {
    throw new Response("Not Found", { status: 404 });
  }
  return { order };
}

export default function OrderPage({ loaderData }: Route.ComponentProps) {
  const { order } = loaderData;

  return (
    <main className="mx-auto max-w-5xl p-4">
      <Link to="/orders" className="text-blue-600 underline">
        ← Назад
      </Link>
      <h1 className="my-4 text-2xl font-bold">Замовлення №{order.id}</h1>
      <dl className="mb-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
        <dt className="font-semibold">Клієнт</dt>
        <dd>{order.client.name}</dd>
        <dt className="font-semibold">Телефон</dt>
        <dd>{order.client.phone}</dd>
        <dt className="font-semibold">Дата</dt>
        <dd>{formatDate(order.createdAt)}</dd>
        <dt className="font-semibold">Статус</dt>
        <dd>{STATUS_LABELS[order.status]}</dd>
      </dl>

      {order.items.length === 0 ? (
        <p className="py-6">У цьому замовленні ще немає позицій.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left [&_td]:p-2 [&_th]:p-2">
            <thead>
              <tr className="border-b">
                <th>Тип скла</th>
                <th>Розмір, мм</th>
                <th>К-сть</th>
                <th>Площа</th>
                <th>До оплати</th>
                <th>Ціна за м²</th>
                <th>Вартість</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((i) => (
                <tr key={i.id} className="border-b">
                  <td>{i.glassType.name}</td>
                  <td className="whitespace-nowrap">
                    {i.width} × {i.height}
                  </td>
                  <td>{i.quantity}</td>
                  <td className="whitespace-nowrap">
                    {formatArea(itemAreaMm2(i))}
                  </td>
                  <td className="whitespace-nowrap">
                    {formatArea(itemBillableMm2(i))}
                  </td>
                  <td className="whitespace-nowrap">
                    {formatMoney(i.glassType.pricePerM2 * 100)}
                  </td>
                  <td className="whitespace-nowrap">
                    {formatMoney(itemCostKop(i))}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold">
                <td colSpan={3}>Разом</td>
                <td className="whitespace-nowrap">
                  {formatArea(orderAreaMm2(order))}
                </td>
                <td className="whitespace-nowrap">
                  {formatArea(orderBillableMm2(order))}
                </td>
                <td></td>
                <td className="whitespace-nowrap">
                  {formatMoney(orderCostKop(order))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </main>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  return (
    <main className="mx-auto max-w-5xl p-4">
      <h1 className="mb-3 text-2xl font-bold">
        {notFound ? "Замовлення не знайдено" : "Щось пішло не так"}
      </h1>
      <Link to="/orders" className="text-blue-600 underline">
        ← Назад
      </Link>
    </main>
  );
}
