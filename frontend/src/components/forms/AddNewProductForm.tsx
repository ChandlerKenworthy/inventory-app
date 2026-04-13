import { GoPlusCircle } from "react-icons/go";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AddNewProductSchema, { type NewProductItemFormData } from "../../schema/ProductItemSchema";
import "../../styles/components/forms/AddNewProduct.css";
import TextInput from "./TextInput";
import NumberInput from "./NumberInput";
import RadioInput from "./RadioInput";
import { v4 as uuid } from "uuid";
import { productService } from "../../services/productService";
import toast from "react-hot-toast";

interface AddNewProductProps {
    onSuccess: () => void;
}

export default function AddNewProductForm({ onSuccess }: AddNewProductProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<NewProductItemFormData>({
        resolver: zodResolver(AddNewProductSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            is_fragile: "false" as unknown as boolean, // Match the string value in the radio option
            weight: 0,
            width: 0,
            height: 0,
            depth: 0,
            price: 0.01,
        },
    });

    const onSubmit = async (data: NewProductItemFormData) => {
        const sendData = {
            ...data,
            id: uuid()
        }

        toast.promise(
            productService.add(sendData),
            {
                loading: 'Adding product...',
                success: (result) => {
                    if (!result.success) throw new Error(result.message); // Catch logic errors
                    reset();
                    onSuccess();
                    return "Product added successfully";
                },
                error: (err) => `Error: ${err.message || "Could not add product"}`,
            }
        );
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="add-product-form">
            <TextInput
                label="name"
                description="Product Name"
                error={errors.name?.message}
                {...register("name")}
            />
            <NumberInput 
                label="weight"
                description="Product Weight (kg)"
                error={errors.weight?.message}
                {...register("weight")}
            />
            <NumberInput 
                label="width"
                description="Product Width (cm)"
                error={errors.width?.message}
                {...register("width")}
            />
            <NumberInput 
                label="height"
                description="Product Height (cm)"
                error={errors.height?.message}
                {...register("height")}
            />
            <NumberInput 
                label="depth"
                description="Product Depth (cm)"
                error={errors.depth?.message}
                {...register("depth")}
            />
            <NumberInput 
                label="price"
                description="Product Price (£)"
                error={errors.price?.message}
                {...register("price")}
            />
            <RadioInput 
                label="is_fragile"
                description="Fragile"
                error={errors.is_fragile?.message}
                options={[
                    { value: "true", label: "Yes" },
                    { value: "false", label: "No" }
                ]}
                {...register("is_fragile")}
            />
            <button className="add-product-btn" type="submit">
                <GoPlusCircle />
                Add Product
            </button>
        </form>
    );
}