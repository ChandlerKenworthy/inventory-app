import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { DefaultCustomer, type CustomerItem } from "../Types";
import "../styles/CustomersPage.css";
import CustomerCard from "../components/CustomerCard";
import TextInput from "../components/forms/TextInput";

export default function CustomersPage() {
    const [customers, setCustomers] = useState<CustomerItem[]>([]);
    const [customer, setCustomer] = useState<CustomerItem>(DefaultCustomer);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomer({
            ...customer,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        const payload = {
            ...customer,
            id: Number(customer.id) // Ensure this is a number type, not "123"
        };

        console.log("Sending customer data:", JSON.stringify(payload));

        await fetch("/api/customers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        setCustomer(DefaultCustomer);
        fetchCustomers();
    }

    const fetchCustomers = async () => {
        const res = await fetch("/api/customers");
        const data = await res.json();
        setCustomers(data);
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    return (
        <div className="page-container">
            <Navbar />
            <div className="content-container">
                <h1 className="page-title">Customers</h1>
                <div className="content-wrapper">
                    <div className="customers-wrapper">
                        {customers.map((customer: CustomerItem) => (
                            <CustomerCard customer={customer} key={customer.id} />
                        ))}
                    </div>
                    <form className="customer-form" onSubmit={handleSubmit}>
                        <TextInput label="id" description="Customer ID" value={customer.id} onChange={handleChange} />
                        <TextInput label="first_name" description="First Name" value={customer.first_name} onChange={handleChange} />
                        <TextInput label="second_name" description="Second Name" value={customer.second_name} onChange={handleChange} />
                        <TextInput label="email" description="Email" value={customer.email} onChange={handleChange} />
                        <button type="submit">Update Customers</button>
                    </form>
                </div>
            </div>
        </div>
    )
}