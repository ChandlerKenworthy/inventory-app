
import Navbar from "../components/Navbar";
import type CustomerItem from "../Types";
import CustomerCard from "../components/CustomerCard";
import TextInput from "../components/forms/TextInput";
import NumberInput from "../components/forms/NumberInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import schema, { type NewCustomerFormData } from "../schema/schema";
import "../styles/CustomersPage.css";

import { useState, useEffect } from "react";

interface CustomerFormProps {
  onSuccess: () => void; // tells the parent to re-fetch after submit
}

export function CustomerForm({ onSuccess }: CustomerFormProps) {
  const {
    register,
    handleSubmit,        // RHF's handleSubmit — no longer clashes
    reset,
    formState: { errors },
  } = useForm<NewCustomerFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      id: 0,
      first_name: "",
      second_name: "",
      email: "",
    },
  });

  // passed into RHF's handleSubmit()
  const onSubmit = async (data: NewCustomerFormData) => {
    console.log("Sending customer data:", JSON.stringify(data));
    await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    reset();         // clear the form back to defaultValues
    onSuccess();     // trigger parent re-fetch
  };

  return (
    <form className="customer-form" onSubmit={handleSubmit(onSubmit)}>
      <NumberInput
        label="id"
        description="Customer ID"
        error={errors.id?.message}
        {...register("id")}
      />
      <TextInput
        label="first_name"
        description="First Name"
        error={errors.first_name?.message}
        {...register("first_name")}
      />
      <TextInput
        label="second_name"
        description="Second Name"
        error={errors.second_name?.message}
        {...register("second_name")}
      />
      <TextInput
        label="email"
        description="Email"
        input_type="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <button type="submit">Update Customer</button>
    </form>
  );
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerItem[]>([]);

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
          <CustomerForm onSuccess={fetchCustomers} />
        </div>
      </div>
    </div>
  );
}
