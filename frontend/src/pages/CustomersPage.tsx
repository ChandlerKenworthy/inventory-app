import { useState, useEffect } from "react";
import type { APIResponse, CustomerItem } from "../Types";
import Page from "../components/Page";
import FeedbackPopup from "../components/FeedbackPopup";
import CustomerRow from "../components/CustomerRow";
import { customerService } from "../services/customerService";
import { ClimbingBoxLoader } from "react-spinners";
import type { UUIDTypes } from "uuid";
import AddNewCustomerForm from "../components/forms/AddNewCustomerForm";
import "../styles/pages/CustomersPage.css";

export default function CustomersPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [feedback, setFeedback] = useState<{ type: APIResponse, message: string }>({
        type: null,
        message: ''
    });

  const fetchCustomers = async () => {
    setLoading(true);
    const result = await customerService.get_all();
    if (!result.success) {
        setFeedback({
            type: 'error',
            message: result.message
        });
        setCustomers([]);
        setLoading(false);
        return;
    }
    setCustomers(result.data);
    setLoading(false);
  };

  const deleteCustomerHandler = async (customerId: UUIDTypes) => {
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
      <div className="customers-content-wrapper">
        <div className="customer-form-wrapper">
          <AddNewCustomerForm onSuccess={fetchCustomers} setFeedback={setFeedback} />
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
