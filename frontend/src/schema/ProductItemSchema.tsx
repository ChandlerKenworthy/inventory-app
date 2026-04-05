import { z } from "zod";

const ProductItemSchema = z.object({
    name: z.string().min(3, "Product name is required"),
    is_fragile: z.preprocess(
        (val) => val === "true" || val === true, 
        z.boolean()
    ),
    weight: z.coerce.number().min(0.1, "Must be at least 0.1 kg"),
    width: z.coerce.number().min(0.1, "Must be at least 0.1 cm"),
    height: z.coerce.number().min(0.1, "Must be at least 0.1 cm"),
    depth: z.coerce.number().min(0.1, "Must be at least 0.1 cm"),
    price: z.coerce.number().min(0.01, "Must be at least £0.01"),
});

export type NewProductItemFormData = z.infer<typeof ProductItemSchema>;
export default ProductItemSchema;