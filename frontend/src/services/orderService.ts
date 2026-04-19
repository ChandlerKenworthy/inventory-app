import type { UUIDTypes } from "uuid";
import type { NewOrderItemFormData } from "../schema/OrderItemSchema";
import type { OrderResponse, OrderSummaryResponse } from "../Types";
import { ORDERS_ENDPOINT } from "./constants";
import { OrderStatus } from "../Types";

export const orderService = {
    async get_order(id: UUIDTypes): Promise<OrderResponse> {
        const response = await fetch(`${ORDERS_ENDPOINT}/${id}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch order");
        }

        return response.json();
    },

    async get_orders_summary(): Promise<OrderSummaryResponse[]> {
        const response = await fetch(`${ORDERS_ENDPOINT}/summary`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch order summaries");
        }

        return response.json();
    },

    async send_order(data: NewOrderItemFormData): Promise<void> {
        const response = await fetch(ORDERS_ENDPOINT, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to commit customer order.');
        }

        return response.json();
    },

    async set_order_status(id: UUIDTypes, status: OrderStatus): Promise<void> {
        const response = await fetch(`${ORDERS_ENDPOINT}/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            const data = await response.json();
            // Throwing ensures TanStack Query enters the 'error' state
            throw new Error(data.error || 'Failed to update order status.');
        }
    }
};