import { GoTrash } from "react-icons/go";
import type { CustomerItem } from "../Types";
import type { UUIDTypes } from "uuid";
import "../styles/components/CustomerRow.css";

export default function CustomerRow(
    { customer, deleteCustomerHandler } : 
    { 
        customer: CustomerItem,
        deleteCustomerHandler: (id: UUIDTypes) => void,
    }
) {
    return (
        <div className="customer-table-row">
            <span>{customer.id}</span>
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