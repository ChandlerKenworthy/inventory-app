import type { CustomerItem } from "../Types";
import '../styles/components/CustomerCard.css';

export default function CustomerCard({ customer }: { customer: CustomerItem }) {
    return (
        <div className="customer-card">
            <h4 className="customer-name">{customer.first_name} {customer.second_name}</h4>
            <span className="customer-id">ID: {customer.id}</span>
            <span className="customer-email">{customer.email}</span>
            <div className="dummy-img"></div>
        </div>
    )
}