import { z } from "zod";

// For the form for adding a new customer
const InventoryItemSchema = z.object({
    product_id: z.coerce.number().min(1, "Must be at least 1"),
    quantity: z.coerce.number().min(0, "Must be at least 0"),
    aisle: z.coerce.number().min(1, "Must be at least 1").max(999, "Must be less than 1000"),
    shelf: z.coerce.number().min(1, "Must be at least 1").max(999, "Must be less than 1000"),
    bin: z.coerce.number().min(1, "Must be at least 1").max(10, "Must be less than 11"),
});

export type NewInventoryItemFormData = z.infer<typeof InventoryItemSchema>;
export default InventoryItemSchema;