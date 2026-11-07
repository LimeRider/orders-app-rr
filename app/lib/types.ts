export type OrderStatus = "new" | "in_progress" | "done";

export interface GlassType {
  id: number;
  name: string;
  pricePerM2: number;
}

export interface OrderClient {
  name: string;
  phone: string;
}

export interface ItemOrder {
  id: number;
  glassType: GlassType;
  width: number;
  height: number;
  quantity: number;
}

export interface Order {
  id: number;
  createdAt: string;
  status: OrderStatus;
  client: OrderClient;
  items: ItemOrder[];
}
