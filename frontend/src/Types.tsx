import type { UUIDTypes } from "uuid"

export type InventoryItem = {
  product_id: UUIDTypes,
  quantity: number
  aisle: number
  shelf: number
  bin: number
}

export enum OrderStatus {
    Pending = 0,
    Processing = 1,
    Shipped = 2,
    Delivered = 3,
    Cancelled = 4
}

export interface OrderItemRecord {
    product_id: UUIDTypes;
    product_name?: string; // Optional: added during the SQL JOIN
    quantity: number;
    unit_price: number;    // Always track the price at time of sale!
}

export interface Order {
    id: number;
    customer_id: number;
    customer_name?: string; // Optional: added during the SQL JOIN
    items: OrderItemRecord[];
    status: OrderStatus;    // Use an Enum for readability
    total_price: number;
    created_at: string;
    delivery_date: string | null;
    tracking_number?: string;
}

export interface ServiceResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

export type ProductItem = {
  id: UUIDTypes,
  name: string,
  is_fragile: boolean,
  weight: number,
  width: number,
  height: number,
  depth: number,
  price: number,
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