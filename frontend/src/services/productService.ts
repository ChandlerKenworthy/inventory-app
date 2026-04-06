import type { UUIDTypes } from "uuid";
import type { ProductItem, ServiceResponse } from "../Types";
import { PRODUCTS_ENDPOINT } from "./constants";
import type { NewProductItemFormData } from "../schema/ProductItemSchema";

export const productService = {
    async get(id: UUIDTypes): Promise<ServiceResponse<ProductItem>> {
        try {
            const response = await fetch(`${PRODUCTS_ENDPOINT}/${id}`);
            const data = await response.json();
            if (!response.ok) {
                const errorMessage = typeof data === 'object' ? data.error : data;
                return {
                    success: false,
                    message: errorMessage || 'Failed to fetch product.'
                };
            }
            return {
                success: true,
                message: "Product fetched successfully",
                data: data
            };
        } catch (error) {
            return {
                success: false,
                message: "Network error: " + error,
            }
        }
    },

    async add(data: NewProductItemFormData): Promise<ServiceResponse<null>> {
        try {
            const response = await fetch(PRODUCTS_ENDPOINT, {
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
                    message: errorMessage || 'Failed to add product to catalogue.'
                };
            }

            return {
                success: true,
                message: 'Product added catalogue successfully',
                data: rawData
            };
        } catch (error) {
            return {
                success: false,
                message: "Network error: " + error,
            }
        }
    },

    async delete(id: UUIDTypes): Promise<ServiceResponse<null>> {
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