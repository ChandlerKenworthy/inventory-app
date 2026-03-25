import { z } from "zod";

const ProductItemSchema = z.object({
    id: z.coerce.number().min(1, "Must be at least 1"),
    name: z.string().min(1, "Name is required"),
    is_fragile: z.preprocess(
        (val) => val === "true" || val === true, 
        z.boolean()
    ),
    weight: z.coerce.number().min(0.1, "Must be at least 0.1 kg"),
    width: z.coerce.number().min(0.1, "Must be at least 0.1 cm"),
    height: z.coerce.number().min(0.1, "Must be at least 0.1 cm"),
    depth: z.coerce.number().min(0.1, "Must be at least 0.1 cm"),
});

export type NewProductItemFormData = z.infer<typeof ProductItemSchema>;
export default ProductItemSchema;