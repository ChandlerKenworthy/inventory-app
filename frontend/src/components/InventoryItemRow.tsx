import type { InventoryItem } from "../Types";
import "../styles/components/InventoryItemRow.css";
import { GoPencil, GoTrash } from "react-icons/go";

export default function InventoryItemRow(
    { item, deleteItemHandler } : 
    { item: InventoryItem, deleteItemHandler: (id: number) => void }
) {
    return (
        <div className="inventory-table-row">
            <span>{item.product_id}</span>
            <span>{item.quantity}</span>
            <span>{item.aisle}</span>
            <span>{item.shelf}</span>
            <span>{item.bin}</span>
            <span className="modify-pencil"><GoPencil /></span>
            <button 
                type="button"
                onClick={() => deleteItemHandler(item.product_id)}
                className="modify-delete">
                    <GoTrash color="#ba1c1c" />
            </button>
        </div>
    );
}