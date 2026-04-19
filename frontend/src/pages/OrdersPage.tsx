import { useEffect } from "react";
import Page from "../components/Page";
import { OrderStatus } from "../Types";
import { orderService } from "../services/orderService";
import "../styles/pages/OrdersPage.css";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import DataTable from "../components/DataTable";
import { useQuery } from "@tanstack/react-query";

export default function OrdersPage() {
    const { data: orders, isLoading, error } = useQuery({
        queryKey: ["orders_summary"],
        queryFn: orderService.get_orders_summary,
        refetchInterval: 15000, // refetch every 15 seconds to keep data fresh
    });

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

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

    if (isLoading) return <div>Loading...</div>;
    if (!orders) return <div>No orders found.</div>;

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