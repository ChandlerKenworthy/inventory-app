import { useState, useEffect } from "react";
import type { CustomerWithOrderCount } from "../Types";
import Page from "../components/Page";
import { Link } from "react-router-dom";
import { customerService } from "../services/customerService";
import type { UUIDTypes } from "uuid";
import AddNewCustomerForm from "../components/forms/AddNewCustomerForm";
import "../styles/pages/CustomersPage.css";
import { toast } from "react-hot-toast";
import DataTable from "../components/DataTable";
import { GoTrash } from "react-icons/go";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerWithOrderCount[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCustomers = async () => {
    setLoading(true);
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

  const columns = [
    { 
      key: "id", 
      label: "Customer ID", 
      render: (val: string) => (
        <Link className="product-id-link" to={`/customers/${val}`}>
          {val.slice(0, 8)}...
        </Link>
      )
    },
    { key: "first_name", label: "First Name" },
    { key: "second_name", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "order_count", label: "# Orders" },
    { 
      key: "actions", 
      label: "Delete",
      width: "80px",
      render: (_: any, record: CustomerWithOrderCount) => (
        <button 
          type="button"
          onClick={() => deleteCustomerHandler(record.id)}
          className="delete-customer-btn"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <GoTrash color="#ba1c1c" size={18} />
        </button>
      )
    }
  ];

  return (
    <Page title="Customers">
      <div className="customers-content-wrapper">
        <div className="customer-form-wrapper">
          <AddNewCustomerForm onSuccess={fetchCustomers} />
        </div>
        <div className="customer-table-wrapper">
          <DataTable
            columns={columns}
            data={customers}
            isLoading={loading}
            skeletonRows={8}
          />
        </div>
      </div>
    </Page>
  );
}
