import type { UUIDTypes } from "uuid";
import type { InventoryItem, OrderItemRecord, ServiceResponse } from "../Types";
import { INVENTORY_ENDPOINT } from "./constants";

export const inventoryService = {
    async get_in_stock_products(): Promise<ServiceResponse<OrderItemRecord[]>> {
        try {
            const response = await fetch(`${INVENTORY_ENDPOINT}/instock`);
            const data = await response.json();
            
            if (!response.ok) {
                const errorMessage = typeof data === 'object' ? data.error : data;
                return {
                    success: false,
                    message: errorMessage || 'Failed to fetch in-stock products.'
                };
            }
            return {
                success: true,
                message: "In-stock products fetched successfully",
                data: data
            };
        } catch (error) {
            return {
                success: false,
                message: "Network error: " + error,
            }
        }
    },

    async add_product(id: UUIDTypes): Promise<ServiceResponse<null>> {
        try {
            const response = await fetch(INVENTORY_ENDPOINT, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
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
                message: 'Product added to inventory successfully.',
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
            const response = await fetch(`${INVENTORY_ENDPOINT}/${id}`, {
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
                    message: errorMessage || 'Failed to delete product from inventory.'
                };
            }

            return {
                success: true,
                message: 'Product deleted from inventory successfully',
                data: rawData
            };
        } catch(error) {
            return {
                success: false,
                message: "Network error: " + error,
            };
        }
    },

    async modify(payload: InventoryItem): Promise<ServiceResponse<null>> {
        try {
            const response = await fetch("/api/modify_inventory", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const contentType = response.headers.get("content-type");
            const rawData = contentType?.includes("application/json") 
                ? await response.json() 
                : await response.text();

            if (!response.ok) {
                const errorMessage = typeof rawData === 'object' ? rawData.error : rawData;
                return {
                    success: false,
                    message: errorMessage || 'Failed to modify inventory item.'
                };
            }
            return {
                success: true,
                message: 'Inventory item modified successfully.',
                data: rawData
            };
        } catch(error) {
            return {
                success: false,
                message: "Network error: " + error,
            };
        }
    }


};