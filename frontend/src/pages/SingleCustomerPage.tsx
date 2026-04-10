import { useParams } from "react-router-dom";
import type { CustomerItem } from "../Types";
import { useEffect, useState } from "react";
import { customerService } from "../services/customerService";
import type { UUIDTypes } from "uuid";
import Page from "../components/Page";
import Barcode from "react-barcode";
import "../styles/pages/SingleCustomerPage.css";

export default function SingleCustomerPage() {
    const { id } = useParams<{ id: string }>();

    const [customer, setCustomer] = useState<CustomerItem | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    
    const fetchCustomer = async () => {
        setLoading(true);
        const result = await customerService.get(id as UUIDTypes);
        if(result.success) {
            setCustomer(result.data);
        } else {
            alert("Error: " + result.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (id) fetchCustomer();
    }, [id]);

    return (
        <Page title={"Customer Details"}>
            <div className="customer-details-wrapper">
                <div className="customer-info-container">
                    <div className="product-dummy-img"></div>
                    <Barcode value={id} format="CODE128" width={1} height={100} displayValue={true} />
                </div>
                <div className="customer-details-container">
                    <h4 className="title">Customer Details</h4>
                    {loading && <p>Customer details are loading...</p>}
                    {!loading && (<ul className="customer-details-list">
                        <li>First name: {customer?.first_name}</li>
                        <li>Last name: {customer?.second_name}</li>
                        <li>Email: {customer?.email}</li>
                    </ul>)}

                    <h4 className="title">Order History</h4>
                    <p>TODO: Add the order history here...</p>                
                </div>
            </div>
        </Page>
    )
}