"use client";

import { useState } from "react";
import { User, Key, Shield, FileText, Bell, TrendingUp, Bot, Puzzle } from "lucide-react";
import { ProfileTab } from "./profile-tab";
import { ApiKeysTab } from "./api-keys-tab";
import { CredentialsTab } from "./credentials-tab";
import { SystemFilesTab } from "./system-files-tab";
import { NotificationsTab } from "./notifications-tab";
import { UsageTab } from "./usage-tab";
import { AgentDefaultsTab } from "./agent-defaults-tab";
import { PluginsTab } from "./plugins-tab";

const TABS = [
  { id: "profile", l: "Profile", icon: User },
  { id: "api", l: "API Keys", icon: Key },
  { id: "credentials", l: "Credentials", icon: Shield },
  { id: "system", l: "System Files", icon: FileText },
  { id: "notif", l: "Notifications", icon: Bell },
  { id: "usage", l: "Usage & Billing", icon: TrendingUp },
  { id: "defaults", l: "Agent Defaults", icon: Bot },
  { id: "plugins", l: "Plugins", icon: Puzzle },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function SettingsView() {
  const [tab, setTab] = useState<TabId>("profile");

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Sidebar */}
      <div
        className="w-52 flex-shrink-0 border-r p-4 space-y-1 overflow-y-auto"
        style={{ borderColor: "var(--color-border-default)" }}
      >
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left"
              style={{
                backgroundColor: active ? "rgba(201, 169, 110, 0.08)" : "transparent",
                color: active ? "var(--color-accent)" : "var(--color-text-secondary)",
              }}
            >
              <Icon size={16} />
              {t.l}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {tab === "profile" && <ProfileTab />}
        {tab === "api" && <ApiKeysTab />}
        {tab === "credentials" && <CredentialsTab />}
        {tab === "system" && <SystemFilesTab />}
        {tab === "notif" && <NotificationsTab />}
        {tab === "usage" && <UsageTab />}
        {tab === "defaults" && <AgentDefaultsTab />}
        {tab === "plugins" && <PluginsTab />}
      </div>
    </div>
  );
}
