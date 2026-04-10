import { CUSTOMERS_ENDPOINT } from "./constants";
import type { ServiceResponse } from "../Types";
import type { NewCustomerFormData } from "../schema/CustomerSchema";
import type { UUIDTypes } from "uuid";
import type { CustomerItem } from "../Types";

export const customerService = {
    async add(data: NewCustomerFormData): Promise<ServiceResponse<null>> {
        try {
            const response = await fetch(CUSTOMERS_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
                    message: errorMessage || 'Failed to add new customer.'
                };
            }

            return {
                success: true,
                message: 'Customer added successfully',
                data: rawData
            };
        } catch (error) {
            return {
                success: false,
                message: "Network error: " + error,
            };
        }
    },

    async delete(id: UUIDTypes): Promise<ServiceResponse<null>> {
        try {
            const response = await fetch(`${CUSTOMERS_ENDPOINT}/${id}`, {
                method: 'DELETE',
            });

            const contentType = response.headers.get("content-type");
            const rawData = contentType?.includes("application/json") 
                ? await response.json() 
                : await response.text();

            if (!response.ok) {
                // If backend sends { "error": "Reason" }, extract it, else use rawData
                const errorMessage = typeof rawData === 'object' ? rawData.error : rawData;
                return {
                    success: false,
                    message: errorMessage || 'Failed to delete customer'
                };
            }

            return {
                success: true,
                message: 'Customer deleted successfully',
                data: rawData
            };
        } catch(error) {
            // This catches network failures (server down, no internet)
            return {
                success: false,
                message: "Network error: " + error,
            };
        }
    },

    async get(id: UUIDTypes): Promise<ServiceResponse<CustomerItem>> {
        try {
            const response = await fetch(`${CUSTOMERS_ENDPOINT}/${id}`);
            const data = await response.json() 
            if (!response.ok) {
                const errorMessage = typeof data === 'object' ? data.error : data;
                return {
                    success: false,
                    message: errorMessage || 'Failed to fetch customer'
                };
            }
            return {
                success: true,
                message: 'Customer fetched successfully',
                data: data
            };

        } catch (error) {
            return {
                success: false,
                message: "Network error: " + error,
            }
        }
    }
}