import { GoCloud, GoCloudOffline, GoCpu, GoDatabase } from "react-icons/go";
import Page from "../components/Page";
import { StatusBadge } from "../components/StatusBage";
import { useHealthCheck } from "../hooks/HealthCheck";
import "../styles/pages/StatusPage.css";
import { useEffect, useState } from "react";
import type { TableStatus } from "../Types";
import { monitoringService } from "../services/monitoringService";

export default function StatusPage() {
    const { status, lastChecked } = useHealthCheck(5000); // poll every 5s
    const [dbInfo, setDbInfo] = useState<TableStatus[]>([]);

    const fetchDbStatus = async () => {
        const response = await monitoringService.get_db_status();
        if (response.success && response.data) {
            setDbInfo(response.data);
        } else {
            console.error("Failed to fetch database status:", response.message);
        }
    };

    useEffect(() => {
        fetchDbStatus();
    }, []);

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
                <div className="db-stats-container">
                    {dbInfo.map(table => (
                        <div key={table.table_name} className="db-stat-item">
                            <span className="table-name">{table.table_name}</span>
                            <span className="table-size">
                                {table.size_mb < 0.01 ? '< 0.01 MB' : `${table.size_mb.toFixed(2)} MB`}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="header-content">
                    <GoCpu size={20} />
                    <h3>Resource Utilisation</h3>
                </div>
            </div>
        </Page>
    );
}