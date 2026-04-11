import { useState, useEffect } from "react";
import Page from "../components/Page";
import { ClimbingBoxLoader } from "react-spinners";
import type { OrderResponse } from "../Types";
import { orderService } from "../services/orderService";
import OrderItemRow from "../components/OrderItemRow";
import "../styles/pages/OrdersPage.css";

export default function OrdersPage() {
    const [loading, setLoading] = useState<boolean>(true);
    const [orders, setOrders] = useState<OrderResponse[]>([]);

    const fetchOrders = async () => {
        setLoading(true);
        const response = await orderService.get_orders();
        if (response.success && response.data) {
            setOrders(response.data);
        } else {
            // do some error handling e.g. setfeedback or something
            console.error("Something went wrong fetching orders: ", response.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <Page title="Orders">
            <div className="content-wrapper">
                <ClimbingBoxLoader color="#000" size={12} loading={loading} />
                {!loading && orders.length === 0 && <p>No orders found.</p>}
                {!loading && orders.length && (
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
                        {orders.map((order: OrderResponse) => (
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