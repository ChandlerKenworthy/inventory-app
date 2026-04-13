import { useEffect, useState } from "react";
import AddNewOrderForm from "../components/forms/AddNewOrderForm";
import Page from "../components/Page";
import type { CustomerItem, OrderItemRecord } from "../Types";
import { inventoryService } from "../services/inventoryService";
import { customerService } from "../services/customerService";
import { toast } from "react-hot-toast";

export default function NewOrderPage() {
    const [inventory, setInventory] = useState<OrderItemRecord[]>([]);
    const [customers, setCustomers] = useState<CustomerItem[]>([]);
    
    const fetchInventory = async () => {
        toast.promise(
            inventoryService.get_in_stock_products(),
            {
                loading: "Loading inventory...",
                success: (result) => {
                    if (!result.success) throw new Error(result.message);
                    setInventory(result.data);
                    return "Inventory loaded";
                },
                error: (err) => "Failed to load inventory: " + err.message,
            }
        );
    }

    const fetchCustomers = async () => {
        toast.promise(
            customerService.get_all(),
            {
                loading: "Loading customers...",
                success: (result) => {
                    if (!result.success) throw new Error(result.message);
                    setCustomers(result.data);
                    return "Customers loaded";
                },
                error: (err) => "Failed to load customers: " + err.message,
            }
        );
    }

    useEffect(() => {
        fetchInventory();
        fetchCustomers();
    }, []);

    return (
        <Page title="New Order">
            <AddNewOrderForm
                onSuccess={() => {}} // don't need to do anything apart from maybe navigate to order details screen?
                products={inventory}
                customers={customers}
            />
        </Page>
    )
}