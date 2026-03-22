import type { InventoryItem } from "../Types";
import "../styles/components/InventoryItemRow.css";
import { GoPencil } from "react-icons/go";

export default function InventoryItemRow({ item }: { item: InventoryItem }) {
    return (
        <div className="inventory-table-row">
            <span>{item.product_id}</span>
            <span>{item.quantity}</span>
            <span>{item.aisle}</span>
            <span>{item.shelf}</span>
            <span>{item.bin}</span>
            <span className="modify-pencil"><GoPencil /></span>
        </div>
    );
}