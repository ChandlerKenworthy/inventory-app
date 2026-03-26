import { GoCloud, GoCloudOffline, GoCpu, GoDatabase } from "react-icons/go";
import Page from "../components/Page";
import { StatusBadge } from "../components/StatusBage";
import { useHealthCheck } from "../hooks/HealthCheck";
import "../styles/pages/StatusPage.css";

export default function StatusPage() {
    const { status, lastChecked } = useHealthCheck(5000); // poll every 5s

    return (
        <Page title="System Status">
            <div className="status-row">
                <div className="header-content">
                    {status === "connected" ? <GoCloud size={20} /> : <GoCloudOffline size={20} />}
                    <h3>Backend Connection</h3>
                </div>
                <StatusBadge status={status} lastChecked={lastChecked} />

                <div className="header-content">
                    <GoDatabase size={20} />
                    <h3>Database Information</h3>
                </div>

                <div className="header-content">
                    <GoCpu size={20} />
                    <h3>Resource Utilisation</h3>
                </div>
            </div>
        </Page>
    );
}