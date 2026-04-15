import { useState } from "react";
import { Link } from "react-router-dom";
import type { InventoryItem } from "../Types";
import { GoPencil, GoTrash, GoCheckCircle, GoX } from "react-icons/go";
import TableNumberInput from "./forms/TableNumberInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InventoryItemSchema, { type NewInventoryItemFormData } from "../schema/InventoryItemSchema";
import "../styles/components/InventoryItemRow.css";
import type { UUIDTypes } from "uuid";
import { inventoryService } from "../services/inventoryService";

export default function InventoryItemRow(
    { item, deleteItemHandler, onUpdateSuccess } : 
    { 
        item: InventoryItem, 
        deleteItemHandler: (id: UUIDTypes) => void,
        onUpdateSuccess: () => void
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
            quantity: item.location.quantity,
            aisle: item.location.aisle,
            shelf: item.location.shelf,
            bin: item.location.bin
        },
    });

    const onSubmit = async (data: NewInventoryItemFormData) => {
        const response = await inventoryService.modify({
            product_id: data.product_id,
            location: {
                quantity: data.quantity,
                aisle: data.aisle,
                shelf: data.shelf,
                bin: data.bin
            }
        });
        if (!response.success) {
            alert("Failed to update inventory item: " + response.message);
            return;
        }
        onUpdateSuccess();
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
                <span>{item.location.quantity}</span>
            )}

            {isModifying ? (
                <TableNumberInput 
                    label="aisle"
                    description="Aisle"
                    error={errors.aisle?.message}
                    {...register("aisle", { valueAsNumber: true })} 
                />
            ) : (
                <span>{item.location.aisle}</span>
            )}

            {isModifying ? (
                <TableNumberInput
                    label="shelf"
                    description="Shelf"
                    error={errors.shelf?.message}
                    {...register("shelf", { valueAsNumber: true })} 
                />
            ) : (
                <span>{item.location.shelf}</span>
            )}

            {isModifying ? (
                <TableNumberInput 
                    label="bin"
                    description="Bin"
                    error={errors.bin?.message}
                    {...register("bin", { valueAsNumber: true })} 
                />
            ) : (
                <span>{item.location.bin}</span>
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