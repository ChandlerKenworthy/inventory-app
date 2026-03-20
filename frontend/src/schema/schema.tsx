import { z } from "zod";

const schema = z.object({
    email: z
        .email("Must be a valid email address")
        .min(6, "Email must be at least 6 characters long")
        .max(100, "Email must be less than 100 characters long"),
    first_name: z
        .string()
        .min(3, "First name must be at least 3 characters long")
        .max(20, "First name must be less than 20 characters long")
        .regex(/^([a-zA-Z\s])+$/, "Only letters and spaces"),
    second_name: z
        .string()
        .min(3, "Second name must be at least 3 characters long")
        .max(20, "Second name must be less than 20 characters long")
        .regex(/^([a-zA-Z\s])+$/, "Only letters and spaces"),
    id: z.coerce.number().min(1, "Must be at least 1"),
});

export type NewCustomerFormData = z.infer<typeof schema>; // TypeScript type auto-generated
export default schema;