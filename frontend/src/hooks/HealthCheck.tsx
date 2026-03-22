import { useState, useEffect } from "react";

type ConnectionStatus = "checking" | "connected" | "disconnected";

export function useHealthCheck(intervalMs = 5000) {
  const [status, setStatus] = useState<ConnectionStatus>("checking");
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const check = async () => {
    try {
      const res = await fetch("/api/health", { signal: AbortSignal.timeout(3000) });
      setStatus(res.ok ? "connected" : "disconnected");
    } catch {
      setStatus("disconnected");
    }
    setLastChecked(new Date());
  };

  useEffect(() => {
    check();                              // run immediately on mount
    const id = setInterval(check, intervalMs);
    return () => clearInterval(id);      // clean up on unmount
  }, [intervalMs]);

  return { status, lastChecked };
}