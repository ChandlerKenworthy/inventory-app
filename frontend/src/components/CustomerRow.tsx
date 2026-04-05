import { GoTrash } from "react-icons/go";
import type { CustomerItem } from "../Types";
import type { UUIDTypes } from "uuid";
import "../styles/components/CustomerRow.css";
import { useState } from "react";
import { set } from "zod";

export default function CustomerRow(
    { customer, deleteCustomerHandler } : 
    { 
        customer: CustomerItem,
        deleteCustomerHandler: (id: UUIDTypes) => void,
    }
) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(customer.id.toString());
            setCopied(true);
            setTimeout(() => setCopied(false), 1500); // Reset after 1.5 seconds
        } catch (err) {
            console.error("Failed to copy!", err);
        }
    };

    return (
        <div className="customer-table-row">
            <span 
                className="copyable-customer-id" 
                onClick={handleCopy}
                title="Click to copy ID"
            >
                {copied ? "Copied to clipboard!" : customer.id}
            </span>
            <span>{customer.first_name}</span>
            <span>{customer.second_name}</span>
            <span>{customer.email}</span>
            <span>?</span>
            <button 
                type="button"
                onClick={() => deleteCustomerHandler(customer.id)}
                className="delete-customer-btn"
            >
                    <GoTrash color="#ba1c1c" />
            </button>

        </div>
    );
}