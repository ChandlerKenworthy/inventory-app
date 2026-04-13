import { useState, useEffect } from "react";
import type { CustomerWithOrderCount } from "../Types";
import Page from "../components/Page";
import CustomerRow from "../components/CustomerRow";
import { customerService } from "../services/customerService";
import type { UUIDTypes } from "uuid";
import AddNewCustomerForm from "../components/forms/AddNewCustomerForm";
import "../styles/pages/CustomersPage.css";
import { toast } from "react-hot-toast";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerWithOrderCount[]>([]);

  const fetchCustomers = async () => {
    toast.promise(
        customerService.get_all(),
        {
            loading: 'Loading customers...',
            success: (result) => {
                if (!result.success) throw new Error(result.message); // Catch logic errors
                setCustomers(result.data);
                return "Customers loaded successfully";
            },
            error: (err) => `Error: ${err.message || "Could not load customers"}`,
        }
    );
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
              {customers.map((customer: CustomerWithOrderCount) => (
                  <CustomerRow 
                    key={customer.id as string} 
                    customer={customer}
                    deleteCustomerHandler={deleteCustomerHandler}
                  />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
