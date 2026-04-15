import { GoCloud, GoCloudOffline, GoCpu, GoDatabase } from "react-icons/go";
import Page from "../components/Page";
import { StatusBadge } from "../components/StatusBage";
import { useHealthCheck } from "../hooks/HealthCheck";
import "../styles/pages/StatusPage.css";
import { useEffect, useState } from "react";
import type { TableStatus } from "../Types";
import { monitoringService } from "../services/monitoringService";
import toast from "react-hot-toast";

export default function StatusPage() {
    const { status, lastChecked } = useHealthCheck(5000); // poll every 5s
    const [dbInfo, setDbInfo] = useState<TableStatus[]>([]);

    const fetchDbStatus = async () => {
        toast.promise(
            monitoringService.get_db_status(),
            {
                loading: 'Fetching database status...',
                success: (response) => {
                    if (response.success && response.data) {
                        setDbInfo(response.data);
                        return "Database status fetched successfully";
                    } else {
                        throw new Error(response.message || "Failed to fetch database status");
                    }
                },
                error: (err) => `Error: ${err.message || "Could not fetch database status"}`
            }
        );
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
                {dbInfo.length !== 0 && (
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
                )}
                {dbInfo.length === 0 && <p>No database information available. The connection to the database is probably down.</p>}

                <div className="header-content">
                    <GoCpu size={20} />
                    <h3>Resource Utilisation</h3>
                </div>
            </div>
        </Page>
    );
}