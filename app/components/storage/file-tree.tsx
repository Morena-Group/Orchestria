"use client";

import { useState, useMemo } from "react";
import type { StorageFile } from "@/lib/types";
import { Folder, FileText, Upload } from "lucide-react";
import { FileTreeNode } from "./file-tree-node";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const STATUS_COLORS: Record<string, string> = {
  approved: "var(--color-text-primary)",
  review: "var(--color-accent)",
  uploaded: "var(--color-text-secondary)",
};

interface FileTreeProps {
  files: StorageFile[];
  selectedFileId: string | null;
  onSelectFile: (file: StorageFile) => void;
}

interface ProjectGroup {
  name: string;
  artifacts: StorageFile[];
  uploads: StorageFile[];
}

export function FileTree({ files, selectedFileId, onSelectFile }: FileTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    // Expand all projects by default
    const projects = new Set(files.filter((f) => !f.isShared).map((f) => f.projName));
    projects.forEach((p) => initial.add(`proj:${p}`));
    if (files.some((f) => f.isShared)) initial.add("shared");
    return initial;
  });

  const { projectGroups, sharedFiles } = useMemo(() => {
    const groups: Record<string, ProjectGroup> = {};
    const shared: StorageFile[] = [];

    for (const file of files) {
      if (file.isShared) {
        shared.push(file);
        continue;
      }
      const proj = file.projName || "Uncategorized";
      if (!groups[proj]) {
        groups[proj] = { name: proj, artifacts: [], uploads: [] };
      }
      if (file.isUpload) {
        groups[proj].uploads.push(file);
      } else {
        groups[proj].artifacts.push(file);
      }
    }

    return {
      projectGroups: Object.values(groups).sort((a, b) => a.name.localeCompare(b.name)),
      sharedFiles: shared,
    };
  }, [files]);

  function toggle(nodeId: string) {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  }

  function renderFileLeaf(file: StorageFile) {
    const isSelected = selectedFileId === file.id;
    return (
      <button
        key={file.id}
        onClick={() => onSelectFile(file)}
        className="w-full flex items-center gap-2 py-1.5 px-2 rounded-lg text-xs hover:bg-white/[0.02] transition-colors"
        style={{
          paddingLeft: "72px",
          backgroundColor: isSelected ? "rgba(201, 169, 110, 0.04)" : "transparent",
        }}
      >
        <span className="truncate flex-1 text-left" style={{ color: "var(--color-text-primary)" }}>
          {file.name}
        </span>
        <span className="text-[10px] flex-shrink-0" style={{ color: "var(--color-text-muted)" }}>
          {file.size}
        </span>
        {file.workerType && (
          <Avatar type={file.workerType} size={14} role="worker" />
        )}
        <Badge color={STATUS_COLORS[file.status] ?? "#71717a"} small>
          {file.status}
        </Badge>
      </button>
    );
  }

  return (
    <div className="py-1">
      {projectGroups.map((group) => {
        const projKey = `proj:${group.name}`;
        const projExpanded = expandedNodes.has(projKey);
        const totalFiles = group.artifacts.length + group.uploads.length;

        return (
          <FileTreeNode
            key={projKey}
            label={group.name}
            count={totalFiles}
            depth={0}
            expanded={projExpanded}
            onToggle={() => toggle(projKey)}
            icon={<Folder size={14} style={{ color: "var(--color-accent)" }} />}
          >
            {/* Artifacts */}
            {group.artifacts.length > 0 && (
              <FileTreeNode
                label="Artifacts"
                count={group.artifacts.length}
                depth={1}
                expanded={expandedNodes.has(`${projKey}:artifacts`)}
                onToggle={() => toggle(`${projKey}:artifacts`)}
                icon={<FileText size={12} style={{ color: "var(--color-text-secondary)" }} />}
              >
                {group.artifacts.map(renderFileLeaf)}
              </FileTreeNode>
            )}

            {/* Uploads */}
            {group.uploads.length > 0 && (
              <FileTreeNode
                label="Uploads"
                count={group.uploads.length}
                depth={1}
                expanded={expandedNodes.has(`${projKey}:uploads`)}
                onToggle={() => toggle(`${projKey}:uploads`)}
                icon={<Upload size={12} style={{ color: "var(--color-text-secondary)" }} />}
              >
                {group.uploads.map(renderFileLeaf)}
              </FileTreeNode>
            )}
          </FileTreeNode>
        );
      })}

      {/* Shared files */}
      {sharedFiles.length > 0 && (
        <FileTreeNode
          label="Shared"
          count={sharedFiles.length}
          depth={0}
          expanded={expandedNodes.has("shared")}
          onToggle={() => toggle("shared")}
          icon={<Folder size={14} style={{ color: "var(--color-text-secondary)" }} />}
        >
          {sharedFiles.map(renderFileLeaf)}
        </FileTreeNode>
      )}
    </div>
  );
}
