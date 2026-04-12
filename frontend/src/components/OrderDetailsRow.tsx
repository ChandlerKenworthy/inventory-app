import type { OrderItemResponse } from "../Types"
import { Link } from "react-router-dom";
import "../styles/components/OrderDetailsRow.css";

export default function OrderDetailsRow(
    { item } : 
    { 
        item: OrderItemResponse, 
    }) {
    return (
        <div className="order-details-table-row">
            <Link to={`/products/${item.product_id}`} className="order-id-link">
                {item.product_id}
            </Link>
            <span>{item.quantity}</span>
            <span>£{item.unit_price.toFixed(2)}</span>
        </div>
    )
}