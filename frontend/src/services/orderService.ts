import type { UUIDTypes } from "uuid";
import type { NewOrderItemFormData } from "../schema/OrderItemSchema";
import type { OrderResponse, ServiceResponse } from "../Types";
import { ORDERS_ENDPOINT } from "./constants";

export const orderService = {
    async get_order(id: UUIDTypes): Promise<ServiceResponse<OrderResponse>> {
        try {
            const response = await fetch(`${ORDERS_ENDPOINT}/${id}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
            });
            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: "Failed to fetch order.",
                }
            }
            return {
                success: true,
                message: "Order fetched successfully",
                data: data
            };
        } catch (error) {
            return {
                success: false,
                message: "Network error: " + error,
                data: undefined
            };
        }
    },

    async get_orders(): Promise<ServiceResponse<OrderResponse[]>> {
        try {
            const response = await fetch(ORDERS_ENDPOINT, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
            });
            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: "Failed to fetch orders.",
                    data: undefined
                }
            }
            return {
                success: true,
                message: "Orders fetched successfully",
                data: data
            };
        } catch (error) {
            return {
                success: false,
                message: "Network error: " + error,
                data: undefined
            };
        }
    },

    async send_order(data: NewOrderItemFormData): Promise<ServiceResponse<null>> {
        try {
            const response = await fetch(ORDERS_ENDPOINT, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data),
            });

            const contentType = response.headers.get("content-type");
            const rawData = contentType?.includes("application/json") 
                ? await response.json() 
                : await response.text();

            if (!response.ok) {
                const errorMessage = typeof rawData === 'object' ? rawData.error : rawData;
                return {
                    success: false,
                    message: errorMessage || 'Failed to commit customer order.'
                };
            }

            return {
                success: true,
                message: 'Order added to database successfully.',
                data: rawData
            };
        } catch (error) {
            return {
                success: false,
                message: "Network error: " + error,
            }
        }
    }
};