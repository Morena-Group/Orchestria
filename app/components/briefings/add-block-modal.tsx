"use client";

import type { ReportBlock } from "@/lib/types";
import { REPORT_BLOCKS } from "@/lib/data/briefings";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { BLOCK_ICON_MAP } from "./briefings-view";
import { GripVertical } from "lucide-react";

interface AddBlockModalProps {
  open: boolean;
  onClose: () => void;
  activeBlocks: string[];
  onAddBlock: (blockId: string) => void;
}

export function AddBlockModal({
  open,
  onClose,
  activeBlocks,
  onAddBlock,
}: AddBlockModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Add Report Block" maxWidth="max-w-md">
      <div className="space-y-1">
        {REPORT_BLOCKS.map((b) => {
          const Icon = BLOCK_ICON_MAP[b.icon] ?? GripVertical;
          const added = activeBlocks.includes(b.id);
          return (
            <div
              key={b.id}
              className="flex items-center gap-3 p-3 rounded-lg"
              style={{
                backgroundColor: added
                  ? "rgba(201, 169, 110, 0.06)"
                  : "var(--color-bg-card)",
              }}
            >
              <Icon
                size={16}
                style={{
                  color: added
                    ? "var(--color-accent)"
                    : "var(--color-text-muted)",
                }}
              />
              <div className="flex-1">
                <span
                  className="text-sm"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {b.name}
                </span>
                <p
                  className="text-[10px]"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {b.desc}
                </p>
              </div>
              {added ? (
                <Badge color="var(--color-accent)" small>
                  Added
                </Badge>
              ) : (
                <button
                  onClick={() => {
                    onAddBlock(b.id);
                    onClose();
                  }}
                  className="px-3 py-1 rounded text-xs"
                  style={{
                    backgroundColor: "var(--color-accent)",
                    color: "var(--color-accent-fg)",
                  }}
                >
                  Add
                </button>
              )}
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
