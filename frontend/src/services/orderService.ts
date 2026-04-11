import type { NewOrderItemFormData } from "../schema/OrderItemSchema";
import type { Order, OrderBasicResponse, ServiceResponse } from "../Types";
import { ORDERS_ENDPOINT } from "./constants";

export const orderService = {
    async get_orders(): Promise<ServiceResponse<OrderBasicResponse[]>> {
        /* This is a watered down version currently:
        export interface OrderBasicResponse {
          id: UUIDTypes;
          customer_id: UUIDTypes;
          status: OrderStatus;
          total_price: number;
          created_at: string;
        }
        */

        try {
            const response = await fetch(ORDERS_ENDPOINT);
            const data = await response.json();

            if (!response.ok) {
                const errorMessage = typeof data === 'object' ? data.error : data;
                return {
                    success: false,
                    message: errorMessage || 'Failed to add product to inventory.'
                };
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