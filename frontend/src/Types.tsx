import type { UUIDTypes } from "uuid"

// For monitoring the connection to the database from the frontend health check
export type ConnectionStatus = "checking" | "connected" | "disconnected";

// For handling error/success feedback to the user when dealing with forms and button clicks
export type APIResponse = "success" | "error" | null;

// For handling the different states an order can be in and making code more readable (no magic strings)
export enum OrderStatus {
    Pending = 0,
    Processing = 1,
    Shipped = 2,
    Delivered = 3,
    Cancelled = 4
}

// Used to summarise the orders on the OrdersPage and avoid having to fetch all the order items for each order when we only need a count of them and the total price
export interface OrderSummaryResponse {
    id: string;
    customer_id: string;
    status: OrderStatus;
    created_at: string;
    total_price: number;
    number_of_items: number;
}

// The full order details, used when viewing a specific order and needing to see all the items in that order and their details e.g. to inspect if something went wrong or if something is missing from the order
export interface OrderResponse {
    id: string;
    customer_id: string;
    status: number;
    created_at: string;
    total_price: number;
    items: OrderItemResponse[];
}

// The information required about a product in an order all we care for is the ID, quantity and the price paid everything else can be found from JOINing with the inventory or product tables
export interface OrderItemResponse {
    product_id: string;
    quantity: number;
    unit_price: number;
}

// For recording details of a single type of product in an order when making a new order
export interface OrderItemRecord {
    product_id: UUIDTypes;
    product_name?: string;
    quantity: number;
    unit_price: number; // Track price at the time of sale
}

// Response format from the service layer indicating if the action was successful
// any error or success message and some relevant data, if required
export interface ServiceResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

// The amount, and of which product, in a particular location in the inventory
// for now products cannot have duplicate locations
export type InventoryItem = {
  product_id: UUIDTypes,
  quantity: number
  aisle: number
  shelf: number
  bin: number
}

// For viewing what products are in the catalogue and at what current price, note when making orders
// the price paid is drawn from the product catalogue the moment the order is taken - this information
// is recorded in the order separate from the product catalogue.
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

export type ProductItemWithLocationInfo = ProductItem & {
  inventory: {
    quantity: number
    aisle: number
    shelf: number
    bin: number
  }[]
}

// For collating all the relevant customer information together
export type CustomerItem = {
  id: UUIDTypes,
  first_name: string,
  second_name: string,
  email: string,
}

// For displaying customer details on the SingleCustomerPage, including their order history
export type CustomerWithOrderHistory = {
  id: UUIDTypes,
  first_name: string,
  second_name: string,
  email: string,
  orders: {
    order_id: UUIDTypes,
    created_at: string,
    total_price: number
  }[]
}

// For displaying customers in a table on the CustomersPage and showing how many orders they have made, this is more efficient than having to fetch all the orders for each customer just to count them
export type CustomerWithOrderCount = {
  id: UUIDTypes,
  first_name: string,
  second_name: string,
  email: string,
  order_count: number
}