import type { Order, ServiceResponse } from "../Types";
import { ORDERS_ENDPOINT } from "./constants";

export const orderService = {
    async get_orders(): Promise<ServiceResponse<Order[]>> {
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
    }
};