import Page from "../components/Page";
import { StatusBadge } from "../components/StatusBage";
import { useHealthCheck } from "../hooks/HealthCheck";
import "../styles/pages/StatusPage.css";

export default function StatusPage() {
    const { status, lastChecked } = useHealthCheck(5000); // poll every 5s

    return (
        <Page title="System Status">
            <div className="status-row">
                <p>Backend Connection:</p>
                <StatusBadge status={status} lastChecked={lastChecked} />
            </div>
        </Page>
    );
}