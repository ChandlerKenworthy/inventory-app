import { useState, useEffect } from "react";
import Page from "../components/Page";
import { ClimbingBoxLoader } from "react-spinners";
import type { OrderItem } from "../Types";
import { orderService } from "../services/orderService";
import "../styles/pages/OrdersPage.css";

export default function OrdersPage() {
    const [loading, setLoading] = useState<boolean>(true);
    const [orders, setOrders] = useState<OrderItem[]>([]);

    const fetchOrders = async () => {
        setLoading(true);
        // call to services layer here
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
            </div>
        </Page>
    );
}