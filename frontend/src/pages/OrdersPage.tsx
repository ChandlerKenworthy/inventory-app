import { useState, useEffect } from "react";
import Page from "../components/Page";
import type { OrderSummaryResponse } from "../Types";
import { orderService } from "../services/orderService";
import OrderItemRow from "../components/OrderItemRow";
import "../styles/pages/OrdersPage.css";
import { toast } from "react-hot-toast";

export default function OrdersPage() {
    const [orders, setOrders] = useState<OrderSummaryResponse[]>([]);

    const fetchOrders = async () => {
        toast.promise(
            orderService.get_orders_summary(), {
                loading: "Fetching orders...",
                success: (result) => {
                    if (!result.success) throw new Error(result.message);
                    setOrders(result.data);
                    return "Orders fetched successfully!";
                },
                error: (err) => "Failed to fetch orders: " + err.message,
            }
        );
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <Page title="Orders">
            <div className="content-wrapper">
                {orders.length === 0 && <p>No orders found.</p>}
                {orders.length > 0 && (
                    <div className="orders-table">
                        <div className="orders-table-header">
                            <span>Order ID</span>
                            <span>Customer ID</span>
                            <span>Status</span>
                            <span>Order Date</span>
                            <span>Value (£)</span>
                            <span># Items</span>
                        </div>
                        <div className="orders-table-body">
                        {orders.map((order: OrderSummaryResponse) => (
                            <OrderItemRow 
                                key={order.id as string} 
                                order={order} 
                            />
                        ))}
                        </div>
                    </div>
                )}
            </div>
        </Page>
    );
}