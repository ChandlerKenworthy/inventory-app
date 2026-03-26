import "../styles/components/StatusBadge.css";
import type { ConnectionStatus } from "../Types";

interface StatusBadgeProps {
  status: ConnectionStatus;
  lastChecked: Date | null;
}

export function StatusBadge({ status, lastChecked }: StatusBadgeProps) {
  const config = {
    checking:     { label: "Checking...", className: "status status--checking" },
    connected:    { label: "Connected",   className: "status status--connected" },
    disconnected: { label: "Disconnected", className: "status status--disconnected" },
  };

  const { label, className } = config[status];

  return (
    <div className={className}>
      <span className="status__dot" />
      <span className="status__label">{label}</span>
      {lastChecked && (
        <span className="status__time">
          Last checked: {lastChecked.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}