import { OrderStatus } from "../Types"
import type { OrderSummaryResponse } from "../Types";
import { Link } from "react-router-dom";
import "../styles/components/OrderItemRow.css";

export default function OrderItemRow(
    { order } : 
    { 
        order: OrderSummaryResponse, 
    }) {

    // Helper to get a nice display name
    const getStatusLabel = (status: OrderStatus) => {
        // This converts 0 -> "Pending", 1 -> "Processing", etc.
        return OrderStatus[status];
    };

    // Helper for conditional styling classes
    const getStatusClass = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.Pending: return "status-pending";
            case OrderStatus.Processing: return "status-processing";
            case OrderStatus.Shipped: return "status-shipped";
            case OrderStatus.Delivered: return "status-delivered";
            case OrderStatus.Cancelled: return "status-cancelled";
            default: return "status-default";
        }
    };

    return (
        <div className="order-table-row">
            <Link to={`/orders/${order.id}`} className="order-id-link">
                {order.id}
            </Link>
            <Link to={`/customers/${order.customer_id}`} className="order-id-link">
                {order.customer_id}
            </Link>
            <span className={`status-badge ${getStatusClass(order.status)}`}>
                {getStatusLabel(order.status)}
            </span>
            <span>{new Date(order.created_at).toLocaleDateString()}</span>
            <span>£{order.total_price.toFixed(2)}</span>
            <span>{order.number_of_items}</span>
        </div>
    )
}