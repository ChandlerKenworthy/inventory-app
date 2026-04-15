import { useParams } from "react-router-dom";
import Page from "../components/Page";
import { useEffect, useState } from "react";
import type { OrderItemResponse, OrderResponse } from "../Types";
import { orderService } from "../services/orderService";
import type { UUIDTypes } from "uuid";
import "../styles/pages/SingleOrderPage.css";
import OrderDetailsRow from "../components/OrderDetailsRow";
import Barcode from "react-barcode";
import toast from "react-hot-toast";

export default function SingleOrderPage() {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<OrderResponse | null>(null);

    const fetchOrder = async () => {
        toast.promise(
            orderService.get_order(id as UUIDTypes),
            {
                loading: "Fetching order details...",
                success: (result) => {
                    setOrder(result.data);
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
                    <p><strong>Status:</strong> {order?.status}</p>
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