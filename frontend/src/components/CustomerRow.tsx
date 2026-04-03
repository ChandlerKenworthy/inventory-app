import { GoTrash } from "react-icons/go";
import type { CustomerItem } from "../Types";
import "../styles/components/CustomerRow.css";

export default function CustomerRow(
    { customer, deleteCustomerHandler } : 
    { 
        customer: CustomerItem,
        deleteCustomerHandler: (id: number) => void,
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
                className="in-row-btn"
            >
                    <GoTrash color="#ba1c1c" />
            </button>

        </div>
    );
}