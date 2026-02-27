import type { WorkerStatus } from "@/lib/types";

interface StatusDotProps {
  status: WorkerStatus;
}

export function StatusDot({ status }: StatusDotProps) {
  const label = status === "online" ? "Online" : status === "busy" ? "Busy" : "Offline";
  const color = status === "online" ? "#a1a1aa" : status === "busy" ? "#c9a96e" : "#52525b";

  return (
    <span className="text-xs font-medium" style={{ color }}>
      {label}
    </span>
  );
}
