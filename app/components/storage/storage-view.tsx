"use client";

import { useState } from "react";
import { FilesTab } from "./files-tab";
import { KnowledgeTab } from "./knowledge-tab";
import { ContextTab } from "./context-tab";
import { File, Brain, Target } from "lucide-react";
import { TabView } from "@/components/ui/tab-view";

const TABS = [
  { id: "files", label: "Files", icon: File },
  { id: "knowledge", label: "Knowledge", icon: Brain },
  { id: "context", label: "Context", icon: Target },
];

export function StorageView() {
  const [tab, setTab] = useState("files");

  return (
    <TabView tabs={TABS} activeTab={tab} onTabChange={setTab} variant="horizontal">
      {tab === "files" && <FilesTab />}
      {tab === "knowledge" && <KnowledgeTab />}
      {tab === "context" && <ContextTab />}
    </TabView>
  );
}
