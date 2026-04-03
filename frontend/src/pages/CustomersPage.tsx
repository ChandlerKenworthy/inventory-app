
import { useState, useEffect } from "react";
import type { APIResponse, CustomerItem } from "../Types";
import TextInput from "../components/forms/TextInput";
import NumberInput from "../components/forms/NumberInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomerSchema, { type NewCustomerFormData } from "../schema/CustomerSchema";
import "../styles/pages/CustomersPage.css";
import Page from "../components/Page";
import FeedbackPopup from "../components/FeedbackPopup";
import CustomerRow from "../components/CustomerRow";

interface CustomerFormProps {
  onSuccess: () => void; // tells the parent to re-fetch after submit
  setFeedback: (feedback: { type: APIResponse; message: string }) => void; // for setting success/error messages in the parent
}

function CustomerForm({ onSuccess, setFeedback }: CustomerFormProps) {
  const {
    register,
    handleSubmit,        // RHF's handleSubmit — no longer clashes
    reset,
    formState: { errors },
  } = useForm<NewCustomerFormData>({
    resolver: zodResolver(CustomerSchema),
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
    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resp_data = await response.json();
      
      if (!response.ok) { // if response is not 2xx, treat as error
        setFeedback({ type: 'error', message: resp_data || 'Failed to add new customer.' });
      } else {
        setFeedback({ type: 'success', message: resp_data || 'New customer added successfully!' });
      }

      reset();         // clear the form back to defaultValues
      onSuccess();     // trigger parent re-fetch
    } catch (err) {
      setFeedback({ type: 'error', message: 'Network error: ' + err });
    }
    setTimeout(() => setFeedback({ type: null, message: '' }), 5000); // clear feedback after 5 seconds
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
  const [feedback, setFeedback] = useState<{ type: APIResponse, message: string }>({
        type: null,
        message: ''
    });

  const fetchCustomers = async () => {
    const res = await fetch("/api/customers");
    const data = await res.json();
    setCustomers(data);
  };

  const deleteCustomerHandler = async (customerId: number) => {
    console.log("Called with ID:", customerId);
    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: "DELETE",
      });
      console.log("Response status:", response.status);
      console.log("Response OK?", response.ok);
      if (!response.ok) {
        setFeedback({ type: 'error', message: 'Failed to delete customer.' });
      } else {
        setFeedback({ type: 'success', message: 'Customer deleted successfully!' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Network error: ' + err });
    }
    fetchCustomers(); // re-fetch after deletion
    // Clear the message after 5 seconds
    //setTimeout(() => setFeedback({ type: null, message: '' }), 5000);
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <Page title="Customers">
      {feedback.type && <FeedbackPopup feedback={feedback} onClose={() => setFeedback({ type: null, message: '' })} />}
      <div className="content-wrapper">
        <CustomerForm onSuccess={fetchCustomers} setFeedback={setFeedback} />

        <div className="customers-table">
          <div className="customers-table-header">
            <span>Customer ID</span>
            <span>First Name</span>
            <span>Last Name</span>
            <span>Email</span>
            <span># Orders</span>
            <span>Delete</span>
          </div>
          <div className="customers-table-body">
          {customers.map((customer: CustomerItem) => (
              <CustomerRow 
                key={customer.id} 
                customer={customer}
                deleteCustomerHandler={deleteCustomerHandler}
              />
          ))}
          </div>
        </div>
        
        </div>
    </Page>
  );
}
