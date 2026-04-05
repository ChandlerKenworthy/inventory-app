import type { ServiceResponse } from "../Types";
import { INVENTORY_ENDPOINT, PRODUCTS_ENDPOINT } from "./constants";

export const productService = {
    async add(id: number): Promise<ServiceResponse<null>> {
        try {
            const response = await fetch(INVENTORY_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product_id: id,
                    quantity: 1,
                    aisle: 0,
                    shelf: 0,
                    bin: 0
                }),
            });

            const contentType = response.headers.get("content-type");
            const rawData = contentType?.includes("application/json") 
                ? await response.json() 
                : await response.text();

            if (!response.ok) {
                const errorMessage = typeof rawData === 'object' ? rawData.error : rawData;
                return {
                    success: false,
                    message: errorMessage || 'Failed to add product to inventory.'
                };
            }

            return {
                success: true,
                message: 'Product added to inventory successfully',
                data: rawData
            };
        } catch (error) {
            return {
                success: false,
                message: "Network error: " + error,
            }
        }
    },

    async delete(id: number): Promise<ServiceResponse<null>> {
        try {
            const response = await fetch(`${PRODUCTS_ENDPOINT}/${id}`, {
                method: 'DELETE',
            });

            const contentType = response.headers.get("content-type");
            const rawData = contentType?.includes("application/json") 
                ? await response.json() 
                : await response.text();

            if (!response.ok) {
                const errorMessage = typeof rawData === 'object' ? rawData.error : rawData;
                return {
                    success: false,
                    message: errorMessage || 'Failed to delete product from catalogue'
                };
            }

            return {
                success: true,
                message: 'Product removed successfully',
                data: rawData
            };
        } catch (error) {
            return {
                success: false,
                message: "Network error: " + error,
            }
        }
    },
};