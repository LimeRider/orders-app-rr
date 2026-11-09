import { useState } from "react";
import { Form, Link, redirect } from "react-router";

import { itemCostKop } from "~/lib/calculator";
import { formatMoney } from "~/lib/format";
import type { Route } from "../+types/root";
import { createOrder, glassTypes } from "../lib/orders.server";

export const loader = () => ({ glassTypes });

export async function action({ request }: Route.ActionArgs) {
  const f = await request.formData();
  const name = String(f.get("name")).trim();
  const phone = String(f.get("phone"));
  const glass = f.getAll("glass").map(Number);
  const w = f.getAll("width").map(Number);
  const h = f.getAll("height").map(Number);
  const q = f.getAll("quantity").map(Number);

  const ok = (n: number, min: number, max: number) =>
    Number.isInteger(n) && n >= min && n <= max;
  const valid =
    name &&
    /^\+380\d{9}$/.test(phone) &&
    glass.length > 0 &&
    glass.every(
      (g, i) =>
        glassTypes.some((t) => t.id === g) &&
        ok(w[i], 100, 3000) &&
        ok(h[i], 100, 3000) &&
        ok(q[i], 1, 100000),
    );

  if (!valid) return { error: "Перевірте поля форми" };

  const items = glass.map((g, i) => ({
    id: i + 1,
    glassType: glassTypes.find((t) => t.id === g)!,
    width: w[i],
    height: h[i],
    quantity: q[i],
  }));
  const order = await createOrder(name, phone, items);
  return redirect(`/orders/${order.id}`);
}

type Row = { glass: number; width: string; height: string; quantity: string };

export default function NewOrder({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { glassTypes: types } = loaderData;
  const empty = (): Row => ({
    glass: types[0].id,
    width: "",
    height: "",
    quantity: "1",
  });
  const [rows, setRows] = useState<Row[]>([empty()]);

  const update = (i: number, patch: Partial<Row>) =>
    setRows(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const cost = (r: Row) => {
    const width = Number(r.width),
      height = Number(r.height),
      quantity = Number(r.quantity);
    if (
      !(
        width >= 100 &&
        width <= 3000 &&
        height >= 100 &&
        height <= 3000 &&
        quantity >= 1
      )
    )
      return 0;
    return itemCostKop({
      id: 0,
      glassType: types.find((t) => t.id === r.glass)!,
      width,
      height,
      quantity,
    });
  };
  const total = rows.reduce((s, r) => s + cost(r), 0);

  const input = "w-full rounded border px-3 py-2";

  return (
    <main className="mx-auto max-w-3xl p-4">
      <Link to="/orders" className="underline">
        ← До списку
      </Link>
      <h1 className="my-4 text-2xl font-bold">Нове замовлення</h1>

      <Form method="post" className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <input name="name" required placeholder="Клієнт" className={input} />
          <input
            name="phone"
            required
            defaultValue="+380"
            pattern="\+380\d{9}"
            title="+380 і 9 цифр"
            className={input}
          />
        </div>

        {rows.map((r, i) => (
          <div key={i} className="space-y-2 rounded border p-3">
            <select
              name="glass"
              value={r.glass}
              onChange={(e) => update(i, { glass: Number(e.target.value) })}
              className={input}
            >
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.pricePerM2} грн/м²)
                </option>
              ))}
            </select>
            <div className="grid grid-cols-3 gap-2">
              <input
                name="width"
                type="number"
                required
                min={100}
                max={3000}
                placeholder="Ширина, мм"
                value={r.width}
                onChange={(e) => update(i, { width: e.target.value })}
                className={input}
              />
              <input
                name="height"
                type="number"
                required
                min={100}
                max={3000}
                placeholder="Висота, мм"
                value={r.height}
                onChange={(e) => update(i, { height: e.target.value })}
                className={input}
              />
              <input
                name="quantity"
                type="number"
                required
                min={1}
                placeholder="К-сть"
                value={r.quantity}
                onChange={(e) => update(i, { quantity: e.target.value })}
                className={input}
              />
            </div>
            <div className="flex items-center justify-between">
              <b>{formatMoney(cost(r))}</b>
              <button
                type="button"
                disabled={rows.length === 1}
                onClick={() => setRows(rows.filter((_, idx) => idx !== i))}
                className="rounded border px-3 py-1 disabled:opacity-40"
              >
                Видалити
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setRows([...rows, empty()])}
          className="rounded border px-4 py-2"
        >
          + Додати позицію
        </button>

        <p className="text-xl font-bold">Разом: {formatMoney(total)}</p>
        {actionData && "error" in actionData && (
          <p className="text-red-600">{actionData.error}</p>
        )}
        <button className="w-full rounded bg-blue-600 px-4 py-2 text-white sm:w-auto">
          Створити замовлення
        </button>
      </Form>
    </main>
  );
}
