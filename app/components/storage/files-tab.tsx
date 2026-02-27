"use client";

import { useState } from "react";
import type { StorageFile } from "@/lib/types";
import { STORAGE_FILES } from "@/lib/data/storage";
import { Button } from "@/components/ui/button";
import { FileDetailPanel } from "./file-detail-panel";
import { FileTree } from "./file-tree";
import { Search, Upload } from "lucide-react";

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

        {/* Tree view */}
        <div className="flex-1 overflow-y-auto">
          <FileTree
            files={filteredFiles}
            selectedFileId={selectedFile?.id ?? null}
            onSelectFile={(file) =>
              setSelectedFile(selectedFile?.id === file.id ? null : file)
            }
          />
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
