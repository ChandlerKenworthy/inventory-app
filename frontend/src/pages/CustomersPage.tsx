
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
import { customerService } from "../services/customerService";
import { ClimbingBoxLoader } from "react-spinners";

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
    const result = await customerService.add(data);
    setFeedback({
        type: result.success ? 'success' : 'error',
        message: result.message
    });
    reset(); // Clear the form, whatever happens
    if (result.success) {
      onSuccess(); // Refresh the list
    }
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
      <button type="submit">Add Customer</button>
    </form>
  );
}

export default function CustomersPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [feedback, setFeedback] = useState<{ type: APIResponse, message: string }>({
        type: null,
        message: ''
    });

  const fetchCustomers = async () => {
    setLoading(true);
    const res = await fetch("/api/customers");
    const data = await res.json();
    setCustomers(data);
    setLoading(false);
  };

  const deleteCustomerHandler = async (customerId: number) => {
    setLoading(true);
    const result = await customerService.delete(customerId);
    setFeedback({
        type: result.success ? 'success' : 'error',
        message: result.message
    });
    if (result.success) {
        fetchCustomers(); // Refresh the list
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <Page title="Customers">
      {feedback.type && <FeedbackPopup feedback={feedback} onClose={() => setFeedback({ type: null, message: '' })} />}
      <div className="content-wrapper">
        <CustomerForm onSuccess={fetchCustomers} setFeedback={setFeedback} />

        <ClimbingBoxLoader color="#000" size={12} loading={loading} />
        {!loading && (<div className="customers-table">
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
        </div>)}
        
        </div>
    </Page>
  );
}
