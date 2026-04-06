import { useEffect, useState } from "react";
import AddNewOrderForm from "../components/forms/AddNewOrderForm";
import Page from "../components/Page";
import type { CustomerItem, InventoryItem } from "../Types";
import { inventoryService } from "../services/inventoryService";
import { customerService } from "../services/customerService";

export default function NewOrderPage() {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [customers, setCustomers] = useState<CustomerItem>([]);
    
    const fetchInventory = async () => {
        const result = await inventoryService.get_all();
        if (result.success) {
            setInventory(result.data);
        } else {
            // TODO: Handle the error properly
            alert("Failed to fetch inventory: " + result.message);
        }
    }

    const fetchCustomers = async () => {
        const result = await customerService.get_all();
        if (result.success) {
            setCustomers(result.data);
        } else {
            alert("Failed to fetch customers: " + result.message);
        }
    }

    useEffect(() => {
        fetchInventory();
        fetchCustomers();
    }, []);

    return (
        <Page title="New Order">
            <AddNewOrderForm
                onSuccess={() => console.log("Success")}
                products={inventory}
                customers={customers}
            />
        </Page>
    )
}