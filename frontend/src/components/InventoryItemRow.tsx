import { useState } from "react";
import { Link } from "react-router-dom";
import type { InventoryItem } from "../Types";
import { GoPencil, GoTrash, GoCheckCircle, GoX } from "react-icons/go";
import TableNumberInput from "./forms/TableNumberInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InventoryItemSchema, { type NewInventoryItemFormData } from "../schema/InventoryItemSchema";
import "../styles/components/InventoryItemRow.css";

export default function InventoryItemRow(
    { item, deleteItemHandler, onUpdateSuccess } : 
    { 
        item: InventoryItem, 
        deleteItemHandler: (id: number) => void,
        onUpdateSuccess: (data: NewInventoryItemFormData) => void
    }
) {
    const [isModifying, setIsModifying] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<NewInventoryItemFormData>({
        resolver: zodResolver(InventoryItemSchema),
        defaultValues: {
            product_id: item.product_id,
            quantity: item.quantity,
            aisle: item.aisle,
            shelf: item.shelf,
            bin: item.bin
        },
    });

    const onSubmit = async (data: NewInventoryItemFormData) => {
        await fetch("/api/modify_inventory", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data)
		});
        onUpdateSuccess(data);
        setIsModifying(false);
    };

    const handleCancel = () => {
        reset(); // Revert to original values
        setIsModifying(false);
    };

    return (
        <form className="inventory-table-row" onSubmit={handleSubmit(onSubmit)}>
            {/* Hidden field for product_id as needed in the form data */}
            <input type="hidden" {...register("product_id")} />
            <Link 
                to={`/products/${item.product_id}`} 
                className="product-id-link"
            >
                {item.product_id}
            </Link>

            {isModifying ? (
                <TableNumberInput 
                    label="quantity"
                    description="Quantity"
                    error={errors.quantity?.message}
                    {...register("quantity", { valueAsNumber: true })} 
                />
            ) : (
                <span>{item.quantity}</span>
            )}

            {isModifying ? (
                <TableNumberInput 
                    label="aisle"
                    description="Aisle"
                    error={errors.aisle?.message}
                    {...register("aisle", { valueAsNumber: true })} 
                />
            ) : (
                <span>{item.aisle}</span>
            )}

            {isModifying ? (
                <TableNumberInput
                    label="shelf"
                    description="Shelf"
                    error={errors.shelf?.message}
                    {...register("shelf", { valueAsNumber: true })} 
                />
            ) : (
                <span>{item.shelf}</span>
            )}

            {isModifying ? (
                <TableNumberInput 
                    label="bin"
                    description="Bin"
                    error={errors.bin?.message}
                    {...register("bin", { valueAsNumber: true })} 
                />
            ) : (
                <span>{item.bin}</span>
            )}

            <div className="action-buttons">
                {isModifying ? (
                    <>
                        <button type="submit" className="modify-delete">
                            <GoCheckCircle color="#27c03e" />
                        </button>
                        <button type="button" className="modify-delete" onClick={handleCancel}>
                            <GoX color="#ba1c1c" />
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        className="modify-delete"
                        onClick={() => setIsModifying(true)}
                    >
                        <GoPencil />
                    </button>
                )}
            </div>
            <button 
                type="button"
                onClick={() => deleteItemHandler(item.product_id)}
                className="modify-delete"
            >
                <GoTrash color="#ba1c1c" />
            </button>
        </form>
    );
}