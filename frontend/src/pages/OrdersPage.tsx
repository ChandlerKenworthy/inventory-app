import { useState, useEffect } from "react";
import Page from "../components/Page";
import { OrderStatus, type OrderSummaryResponse } from "../Types";
import { orderService } from "../services/orderService";
import "../styles/pages/OrdersPage.css";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import DataTable from "../components/DataTable";

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

    const columns = [
        { key: "id", label: "Order ID", render: (val: string) => (
            <Link to={`/orders/${val}`} className="order-id-link">
                {val.slice(0, 8)}...
            </Link>
        ) 
        },
        { key: "customer_id", label: "Customer ID", render: (val: string) => (
            <Link to={`/customers/${val}`} className="order-id-link">
                {val.slice(0, 8)}...
            </Link>
        )
        },
        { key: "status", label: "Status", render: (val: number) => {
            return (
                <span className={`status-badge status-${OrderStatus[val].toLowerCase()}`}>
                    {OrderStatus[val]}
                </span>
            )
        }},
        { key: "created_at", label: "Order Date", width: "15%"},
        { key: "total_price", label: "Value (£)", render: (val: number) => `£${val.toFixed(2)}` },
        { key: "number_of_items", label: "# Items" },
    ];

    return (
        <Page title="Orders">
            <div className="content-wrapper">
                {orders.length === 0 && <p>No orders found.</p>}
                {orders.length > 0 && (
                    <DataTable 
                        columns={columns}
                        data={orders}
                        isLoading={false}
                        skeletonRows={3}
                    />
                )}
            </div>
        </Page>
    );
}