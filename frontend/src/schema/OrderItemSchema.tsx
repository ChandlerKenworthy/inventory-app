import { z } from "zod";

const OrderItemSchema = z.object({
    id: z.coerce.number().min(1, "Must be at least 1"),
    customer_id: z.coerce.number().min(1, "Must be at least 1"),
    // TODO: Complete the rest of these fields
});

export type NewOrderItemFormData = z.infer<typeof OrderItemSchema>;
export default OrderItemSchema;