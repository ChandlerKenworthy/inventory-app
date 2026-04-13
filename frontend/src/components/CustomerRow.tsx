import { GoTrash } from "react-icons/go";
import type { CustomerWithOrderCount } from "../Types";
import type { UUIDTypes } from "uuid";
import "../styles/components/CustomerRow.css";
import { Link } from "react-router";

export default function CustomerRow(
    { customer, deleteCustomerHandler } : 
    { 
        customer: CustomerWithOrderCount,
        deleteCustomerHandler: (id: UUIDTypes) => void,
    }
) {
    return (
        <div className="customer-table-row">
            <Link 
                className="product-id-link"
                to={`/customers/${customer.id}`}
            >
                {customer.id}
            </Link>
            <span>{customer.first_name}</span>
            <span>{customer.second_name}</span>
            <span>{customer.email}</span>
            <span>{customer.order_count}</span>
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