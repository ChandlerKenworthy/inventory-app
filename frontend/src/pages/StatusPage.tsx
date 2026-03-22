import Navbar from "../components/Navbar";
import { StatusBadge } from "../components/StatusBage";
import { useHealthCheck } from "../hooks/HealthCheck";
import "../styles/pages/StatusPage.css";

export default function StatusPage() {
    const { status, lastChecked } = useHealthCheck(5000); // poll every 5s

    return (
        <div className="page-container">
            <Navbar />
            <div className="content-container">
                <h1 className="page-title">Status</h1> 
                <div className="status-row">
                    <p>Backend Connection:</p>
                    <StatusBadge status={status} lastChecked={lastChecked} />
                </div>
            </div>
        </div>
    );
}