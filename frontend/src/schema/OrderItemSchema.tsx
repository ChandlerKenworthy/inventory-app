import { z } from "zod";

export const OrderItemSchema = z.object({
    customer_id: z.uuidv4(),
    items: z.array(z.object({
        product_id: z.uuidv4(),
        quantity: z.coerce.number().min(1, "Min 1").max(999, "Too many"),
    })).min(1, "Order must have at least one item"),
});

export type NewOrderItemFormData = z.infer<typeof OrderItemSchema>;
export default OrderItemSchema;