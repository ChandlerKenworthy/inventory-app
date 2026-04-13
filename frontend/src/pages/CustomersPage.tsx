import { useState, useEffect } from "react";
import type { CustomerItem } from "../Types";
import Page from "../components/Page";
import CustomerRow from "../components/CustomerRow";
import { customerService } from "../services/customerService";
import { ClimbingBoxLoader } from "react-spinners";
import type { UUIDTypes } from "uuid";
import AddNewCustomerForm from "../components/forms/AddNewCustomerForm";
import "../styles/pages/CustomersPage.css";
import { toast } from "react-hot-toast";

export default function CustomersPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [customers, setCustomers] = useState<CustomerItem[]>([]);

  const fetchCustomers = async () => {
    setLoading(true);
    const result = await customerService.get_all();
    if (!result.success) {
        setCustomers([]);
        setLoading(false);
        return;
    }
    setCustomers(result.data);
    setLoading(false);
  };

  const deleteCustomerHandler = async (customerId: UUIDTypes) => {
    if (!window.confirm("Are you sure? This will permanently remove the customer record.")) return;
    toast.promise(
        customerService.delete(customerId),
        {
            loading: 'Deleting customer...',
            success: (result) => {
                if (!result.success) throw new Error(result.message); // Catch logic errors
                fetchCustomers();
                return "Customer deleted successfully";
            },
            error: (err) => `Error: ${err.message || "Could not delete customer"}`,
        }
    );
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <Page title="Customers">
      <div className="customers-content-wrapper">
        <div className="customer-form-wrapper">
          <AddNewCustomerForm onSuccess={fetchCustomers} />
        </div>
        <div className="customer-table-wrapper">
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
                    key={customer.id as string} 
                    customer={customer}
                    deleteCustomerHandler={deleteCustomerHandler}
                  />
              ))}
            </div>
          </div>)}
        </div>
      </div>
    </Page>
  );
}
