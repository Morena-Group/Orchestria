"use client";

import { useState } from "react";
import { User, Shield, FileText, Bell, TrendingUp, Bot, Puzzle } from "lucide-react";
import { ProfileTab } from "./profile-tab";
import { CredentialsTab } from "./credentials-tab";
import { SystemFilesTab } from "./system-files-tab";
import { NotificationsTab } from "./notifications-tab";
import { UsageTab } from "./usage-tab";
import { AgentDefaultsTab } from "./agent-defaults-tab";
import { PluginsTab } from "./plugins-tab";
import { TabView } from "@/components/ui/tab-view";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "credentials", label: "Credentials", icon: Shield },
  { id: "system", label: "System Files", icon: FileText },
  { id: "notif", label: "Notifications", icon: Bell },
  { id: "usage", label: "Usage & Billing", icon: TrendingUp },
  { id: "defaults", label: "Agent Defaults", icon: Bot },
  { id: "plugins", label: "Plugins", icon: Puzzle },
];

export function SettingsView() {
  const [tab, setTab] = useState("profile");

  return (
    <TabView tabs={TABS} activeTab={tab} onTabChange={setTab} variant="vertical">
      <div className="p-6">
        {tab === "profile" && <ProfileTab />}
        {tab === "credentials" && <CredentialsTab />}
        {tab === "system" && <SystemFilesTab />}
        {tab === "notif" && <NotificationsTab />}
        {tab === "usage" && <UsageTab />}
        {tab === "defaults" && <AgentDefaultsTab />}
        {tab === "plugins" && <PluginsTab />}
      </div>
    </TabView>
  );
}
