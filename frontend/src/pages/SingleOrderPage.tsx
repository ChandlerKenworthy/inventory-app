import { Link, useParams } from "react-router-dom";
import Page from "../components/Page";
import { useEffect, useState } from "react";
import { OrderStatus } from "../Types";
import { orderService } from "../services/orderService";
import type { UUIDTypes } from "uuid";
import "../styles/pages/SingleOrderPage.css";
import Barcode from "react-barcode";
import toast from "react-hot-toast";
import { GoCheckCircle } from "react-icons/go";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "../components/DataTable";

export default function SingleOrderPage() {
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();

    // Fetch the order data
    const {
        data: order,
        isLoading,
        error
    } = useQuery({
        queryKey: ["order", id],
        queryFn: () => orderService.get_order(id as UUIDTypes),
        enabled: !!id, // Only run the query if id is available
    });

    // Local state for the "pending" selection (the buttons the user clicks)
    const [status, setStatus] = useState<OrderStatus | null>(null);

    // Sync status with the data when it loads
    useEffect(() => {
        if (order) setStatus(order.status);
    }, [order]);

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    // 3. The Mutation (Step 2 replacement)
    const { mutate: handleUpdateStatus } = useMutation({
        mutationFn: () => 
            orderService.set_order_status(id as UUIDTypes, status as OrderStatus),
        onMutate: () => {
            toast.loading("Updating order status...", { id: "status-toast" });
        },
        onSuccess: () => {
            // This is the magic part: it tells TanStack to re-fetch the 'get_order'
            // query from the backend so the UI is perfectly in sync with the DB.
            queryClient.invalidateQueries({ queryKey: ["order", id] });
            toast.success("Order status updated!", { id: "status-toast" });
        },
        onError: (err: any) => {
            toast.error(`Error: ${err.message}`, { id: "status-toast" });
        }
    });

    if (isLoading) return <div>Loading...</div>;
    if (!order) return <div>No order found.</div>;

    const columns = [
        { key: "product_id", label: "Product ID", render: (id: string) => <Link to={`/products/${id}`} className="order-id-link">{id.slice(0, 8)}...</Link> },
        { key: "quantity", label: "Quantity" },
        { key: "unit_price", label: "Unit Price (£)", render: (value: number) => `£${value.toFixed(2)}` },
    ];

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
                            .filter((key) => isNaN(Number(key)))
                            .map((key) => (
                                <button 
                                    key={key} 
                                    onClick={() => setStatus(OrderStatus[key as keyof typeof OrderStatus])}
                                    className={`status-badge status-${key.toLowerCase()} order-details-state-pill ${
                                        status !== OrderStatus[key as keyof typeof OrderStatus] ? "not-active" : ""
                                    }`}
                                >
                                    {key}
                                </button>
                            ))}
                        
                        <button
                            className="confirm-status-button"
                            onClick={() => handleUpdateStatus()} // Call the mutation here
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
                {order && (
                    <DataTable 
                        columns={columns}
                        data={order.items}
                        isLoading={!order}
                        skeletonRows={2}
                    />
                )}
            </div>
        </Page>
    )
}