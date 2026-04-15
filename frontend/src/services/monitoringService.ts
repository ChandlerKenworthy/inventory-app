import type { TableStatus, ServiceResponse } from "../Types";

export const monitoringService = {
    async get_db_status(): Promise<ServiceResponse<TableStatus[]>> {
        try {
            const response = await fetch("/api/db_status");
            const data = await response.json();
            
            if (!response.ok) {
                const errorMessage = typeof data === 'object' ? data.error : data;
                return {
                    success: false,
                    message: errorMessage || 'Failed to fetch database status.',
                    data: undefined
                };
            }
            return {
                success: true,
                message: "Database status fetched successfully",
                data: data
            };
        } catch (error) {
            return {
                success: false,
                message: "Failed to fetch database status." + (error as Error).message,
                data: undefined
            };
        }
    }
};