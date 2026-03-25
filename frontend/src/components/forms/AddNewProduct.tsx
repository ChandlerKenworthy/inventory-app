import { GoPlusCircle } from "react-icons/go";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AddNewProductSchema, { type NewProductItemFormData } from "../../schema/ProductItemSchema";
import "../../styles/components/forms/AddNewProduct.css";
import TextInput from "./TextInput";
import NumberInput from "./NumberInput";
import RadioInput from "./RadioInput";

interface AddNewProductProps {
    onSuccess: () => void;
}

export default function AddNewProduct({ onSuccess }: AddNewProductProps) {
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
            depth: 0
        },
    });

    const onSubmit = async (data: NewProductItemFormData) => {
        await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        reset();
        onSuccess();
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
                label="id"
                description="Product ID"
                error={errors.id?.message}
                {...register("id")}
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