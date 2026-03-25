import type { InventoryItem } from "../Types";
import "../styles/components/InventoryItemRow.css";
import { GoPencil, GoTrash } from "react-icons/go";

export default function InventoryItemRow({ item }: { item: InventoryItem }) {
    const deleteItem = async (id: number) => {
        const response = await fetch(`/api/inventory/${id}`, {
            method: 'DELETE',
        });
        if(!response.ok) {
            console.error('Failed to delete item');
        } else {
            console.log('Item deleted successfully');
        }
        // TODO: Update UI or show a success message or something?
    }

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
                onClick={() => deleteItem(item.product_id)}
                className="modify-delete">
                    <GoTrash color="#ba1c1c" />
            </button>
        </div>
    );
}