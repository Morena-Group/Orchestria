import { Brain } from "lucide-react";
import { WT } from "@/lib/constants/status";
import type { WorkerType, WorkerRole } from "@/lib/types";

interface AvatarProps {
  type: WorkerType;
  size?: number;
  role?: WorkerRole;
}

export function Avatar({ type, size = 28, role }: AvatarProps) {
  const config = WT[type] || { n: "?", c: "#1c1f2e", a: "?" };
  const isOrchestrator = role === "orchestrator" || role === "both";

  return (
    <div
      className="rounded-full flex items-center justify-center font-semibold relative flex-shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: config.c,
        border: "1px solid #1e2231",
        color: "#a1a1aa",
        fontSize: size * 0.4,
      }}
    >
      {config.a}
      {isOrchestrator && (
        <div
          className="absolute -bottom-0.5 -right-0.5 rounded-full flex items-center justify-center"
          style={{
            width: size * 0.45,
            height: size * 0.45,
            backgroundColor: "#c9a96e",
          }}
        >
          <Brain size={size * 0.3} className="text-black" />
        </div>
      )}
    </div>
  );
}
