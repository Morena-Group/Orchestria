"use client";

import { useState } from "react";
import type { StorageFile } from "@/lib/types";
import { STORAGE_FILES } from "@/lib/data/storage";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileDetailPanel } from "./file-detail-panel";
import { Search, Upload, File, Code, FileText, Eye, Database } from "lucide-react";

const TYPE_ICONS: Record<string, typeof File> = { code: Code, doc: FileText, image: Eye, data: Database };
const STATUS_COLORS: Record<string, string> = {
  approved: "var(--color-text-primary)",
  review: "var(--color-accent)",
  uploaded: "var(--color-text-secondary)",
};
const FILTERS = ["all", "recent", "review", "artifacts", "uploads"] as const;

export function FilesTab() {
  const [fileFilter, setFileFilter] = useState("all");
  const [fileSearch, setFileSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState<StorageFile | null>(null);

  const filteredFiles = STORAGE_FILES.filter((f) => {
    if (fileFilter === "review") return f.status === "review";
    if (fileFilter === "artifacts") return !f.isUpload;
    if (fileFilter === "uploads") return f.isUpload;
    return true;
  })
    .filter((f) => {
      if (!fileSearch) return true;
      const q = fileSearch.toLowerCase();
      return (
        f.name.toLowerCase().includes(q) ||
        f.tags.some((t) => t.includes(q)) ||
        (f.worker ?? "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => (fileFilter === "recent" ? a.recency - b.recency : 0))
    .slice(0, fileFilter === "recent" ? 5 : Infinity);

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div
          className="px-6 py-3 border-b flex items-center gap-3 flex-shrink-0"
          style={{ borderColor: "var(--color-border-default)" }}
        >
          {/* Quota */}
          <div className="flex items-center gap-2 mr-4">
            <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
              2.6 MB / 1 GB
            </span>
            <div
              className="w-20 h-1.5 rounded-full overflow-hidden"
              style={{ backgroundColor: "var(--color-bg-deep)" }}
            >
              <div
                className="h-full rounded-full"
                style={{ width: "0.26%", backgroundColor: "var(--color-accent)" }}
              />
            </div>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search
              size={12}
              className="absolute left-2.5 top-1/2 -translate-y-1/2"
              style={{ color: "var(--color-text-muted)" }}
            />
            <input
              value={fileSearch}
              onChange={(e) => setFileSearch(e.target.value)}
              placeholder="Search files..."
              className="glass-input w-full pl-7 pr-3 py-1.5 rounded-lg text-xs outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFileFilter(f)}
                className="px-2.5 py-1 rounded-lg text-[10px] capitalize transition-colors"
                style={{
                  backgroundColor:
                    fileFilter === f ? "rgba(201, 169, 110, 0.12)" : "transparent",
                  color:
                    fileFilter === f
                      ? "var(--color-accent)"
                      : "var(--color-text-secondary)",
                }}
              >
                {f}
              </button>
            ))}
          </div>

          <Button>
            <Upload size={12} /> Upload
          </Button>
        </div>

        {/* Table header */}
        <div
          className="flex items-center gap-3 px-6 py-1.5 text-[9px] uppercase tracking-wider"
          style={{ color: "var(--color-text-muted)" }}
        >
          <span className="flex-1">File</span>
          <span className="w-36">Source</span>
          <span className="w-20">Size</span>
          <span className="w-16">Status</span>
          <span className="w-16 text-right">Date</span>
        </div>

        {/* File list */}
        <div className="flex-1 overflow-y-auto">
          {filteredFiles.map((f) => {
            const TypeIcon = TYPE_ICONS[f.type] ?? File;
            return (
              <div
                key={f.id}
                onClick={() =>
                  setSelectedFile(selectedFile?.id === f.id ? null : f)
                }
                className="flex items-center gap-3 px-6 py-2.5 border-b cursor-pointer hover:bg-white/[0.02] transition-colors"
                style={{
                  borderColor: "var(--color-border-default)",
                  backgroundColor:
                    selectedFile?.id === f.id
                      ? "rgba(201, 169, 110, 0.04)"
                      : "transparent",
                }}
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "var(--color-bg-card)" }}
                  >
                    <TypeIcon size={16} style={{ color: "var(--color-accent)" }} />
                  </div>
                  <div className="min-w-0">
                    <span
                      className="text-sm block truncate"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {f.name}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className="text-[10px]"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {f.projName}
                      </span>
                      {f.tags.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className="text-[9px] px-1 py-0.5 rounded"
                          style={{
                            backgroundColor: "var(--color-accent-dim)",
                            color: "var(--color-accent-hover)",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="w-36 flex items-center gap-1.5 min-w-0">
                  {f.workerType ? (
                    <>
                      <Avatar type={f.workerType} size={16} role="worker" />
                      <span
                        className="text-[10px] truncate"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {f.worker}
                      </span>
                    </>
                  ) : f.isUpload ? (
                    <span
                      className="text-[10px]"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      User upload
                    </span>
                  ) : (
                    <span
                      className="text-[10px]"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      —
                    </span>
                  )}
                </div>
                <span
                  className="w-20 text-xs"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {f.size}
                </span>
                <div className="w-16">
                  <Badge color={STATUS_COLORS[f.status] ?? "#71717a"} small>
                    {f.status}
                  </Badge>
                </div>
                <span
                  className="w-16 text-[10px] text-right"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {f.date}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail panel */}
      {selectedFile && (
        <FileDetailPanel
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </div>
  );
}
