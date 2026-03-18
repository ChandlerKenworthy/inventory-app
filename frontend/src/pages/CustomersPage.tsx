import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { DefaultCustomer, type CustomerItem } from "../Types";

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
                <div>
                    {customers.map((customer: CustomerItem) => (
                        <div key={customer.id}>
                            {customer.id} - {customer.first_name} {customer.second_name} - {customer.email}
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSubmit}>
					<div>
						<label htmlFor="id">Customer ID:</label>
						<input name="id" placeholder="Customer ID" value={customer.id} onChange={handleChange} />
					</div>
                    <div>
						<label htmlFor="first_name">First Name:</label>
						<input name="first_name" placeholder="First Name" value={customer.first_name} onChange={handleChange} />
					</div>
					<div>
						<label htmlFor="second_name">Second Name:</label>
						<input name="second_name" placeholder="Second Name" value={customer.second_name} onChange={handleChange} />
					</div>
					<div>
						<label htmlFor="email">Email:</label>
						<input name="email" placeholder="Email" value={customer.email} onChange={handleChange} />
					</div>
					<button type="submit">Update Customers</button>
				</form>
            </div>
        </div>
    )
}