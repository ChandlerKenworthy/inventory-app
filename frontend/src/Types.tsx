import type { UUIDTypes } from "uuid"

export type InventoryItem = {
  product_id: number,
  quantity: number
  aisle: number
  shelf: number
  bin: number
}

export type OrderItem = {
  id: number,
  customer_id: number,
  order_date: string,
  items: {
    product_id: number,
    quantity: number
  }[],
  status: number,
  total_price: number
}

export interface ServiceResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

export type ProductResponseItem = {
  id: number,
  name: string,
  is_fragile: boolean,
  weight: number,
  width: number,
  height: number,
  depth: number
}

export type CustomerItem = {
  id: UUIDTypes, // uuid
  first_name: string,
  second_name: string,
  email: string,
}

export const DefaultCustomer = {
  id: "00000000-0000-0000-0000-000000000000",
  first_name: "Default",
  second_name: "Customer",
  email: "default@customer.com",
} as CustomerItem;

export type ConnectionStatus = "checking" | "connected" | "disconnected";
export type APIResponse = "success" | "error" | null;