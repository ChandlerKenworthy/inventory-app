import type { OrderResponse } from "../Types"
import { Link } from "react-router-dom";
import "../styles/components/OrderItemRow.css";

export default function OrderItemRow(
    { order } : 
    { 
        order: OrderResponse, 
    }) {
    return (
        <div className="order-table-row">
            <Link 
                to={`/orders/${order.id}`} 
                className="order-id-link"
            >
                {order.id}
            </Link>
            <Link
                to={`/customers/${order.customer_id}`}
                className="order-id-link"
            >
                {order.customer_id}
            </Link>
            <span>{order.status}</span>
            <span>{order.created_at}</span>
            <span>£{order.total_price.toFixed(2)}</span>
            <span>?</span>

        </div>
    )
}