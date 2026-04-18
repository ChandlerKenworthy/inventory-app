import { useParams } from "react-router-dom";
import Page from "../components/Page";
import { useEffect, useState } from "react";
import { OrderStatus, type OrderItemResponse, type OrderResponse } from "../Types";
import { orderService } from "../services/orderService";
import type { UUIDTypes } from "uuid";
import "../styles/pages/SingleOrderPage.css";
import OrderDetailsRow from "../components/OrderDetailsRow";
import Barcode from "react-barcode";
import toast from "react-hot-toast";
import { GoCheckCircle } from "react-icons/go";

export default function SingleOrderPage() {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<OrderResponse | null>(null);
    const [status, setStatus] = useState<OrderStatus | null>(null);

    const fetchOrder = async () => {
        toast.promise(
            orderService.get_order(id as UUIDTypes),
            {
                loading: "Fetching order details...",
                success: (result) => {
                    setOrder(result.data);
                    setStatus(result.data.status);
                    return `Order details loaded successfully!`;
                },
                error: (err) => `Error fetching order: ${err}`,
            }
        );
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    return (
        <Page title="Order Details">
            <h3>Summary</h3>
            <div className="order-details-summary-container">
                <div className="order-details-summary-text">
                    <p><strong>Order ID:</strong> {order?.id}</p>
                    <p><strong>Customer ID:</strong> {order?.customer_id}</p>
                    <p><strong>Order Date:</strong> {order?.created_at}</p>
                    <p className="order-details-status-paragraph">
                        <strong>Status: </strong>                        
                        {Object.keys(OrderStatus)
                            .filter((key) => isNaN(Number(key))) // Filter out the numeric reverse-mapping
                            .map((key) => (
                            <button 
                                key={key} 
                                onClick={() => setStatus(OrderStatus[key as keyof typeof OrderStatus])}
                                className={`status-badge status-${key.toLowerCase()} order-details-state-pill ${status !== OrderStatus[key as keyof typeof OrderStatus] ? "not-active" : ""}`}
                            >
                                {key}
                            </button>
                            ))}
                        <button
                            className="confirm-status-button"
                            onClick={() => {
                                toast.promise(
                                    orderService.set_order_status(id as UUIDTypes, status as OrderStatus),
                                    {
                                        loading: "Updating order status...",
                                        success: () => {
                                            fetchOrder(); // Refresh order details after status update
                                            return "Order status updated successfully!";
                                        },
                                        error: (err) => `Error updating order status: ${err}`,
                                    }
                                )
                            }}
                        >
                            <GoCheckCircle size={18} color="#2bbe2e" />
                        </button>
                    </p>
                    <p><strong>Total Price:</strong> £{order?.total_price.toFixed(2)}</p>
                </div>
                {order && <Barcode value={order.id} format="CODE128" width={1} height={60} displayValue={true} />}
            </div>
            <h3>Items</h3>
            <div className="order-details-table">
                <div className="order-details-table-header">
                    <span>Product ID</span>
                    <span>Quantity</span>
                    <span>Unit Price (£)</span>
                </div>
                {order?.items.map((item: OrderItemResponse) => (
                    <OrderDetailsRow
                        key={item.product_id}
                        item={item}
                    />
                ))}
            </div>
        </Page>
    )
}