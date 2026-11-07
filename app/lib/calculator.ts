import type { ItemOrder, Order } from "./types";

export const itemAreaMm2 = (i: ItemOrder) => i.width * i.height * i.quantity;

export const itemBillableMm2 = (i: ItemOrder) =>
  Math.max(i.width * i.height, 500_000) * i.quantity;

export const itemCostKop = (i: ItemOrder) =>
  Math.round((itemBillableMm2(i) * i.glassType.pricePerM2) / 10_000);

export const mm2ToM2Rounded = (mm2: number) => Math.round(mm2 / 10_000) / 100;

export const orderAreaMm2 = (o: Order) =>
  o.items.reduce((sum, i) => sum + itemAreaMm2(i), 0);

export const orderBillableMm2 = (o: Order) =>
  o.items.reduce((sum, i) => sum + itemBillableMm2(i), 0);

export const orderCostKop = (o: Order) =>
  o.items.reduce((sum, i) => sum + itemCostKop(i), 0);
