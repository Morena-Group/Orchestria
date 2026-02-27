"use client";

import { INSTALLED_PLUGINS, PLUGIN_MARKETPLACE } from "@/lib/data/plugins";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Settings, Unplug, Download, Info } from "lucide-react";

export function PluginsTab() {
  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
        Plugins
      </h2>

      {/* Installed Plugins */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>
          Installed ({INSTALLED_PLUGINS.length})
        </h3>
        <div className="space-y-2">
          {INSTALLED_PLUGINS.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 p-4 rounded-xl border"
              style={{ borderColor: "var(--color-border-default)", backgroundColor: "var(--color-bg-card)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ backgroundColor: `${p.color}20` }}
              >
                {p.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                    {p.name}
                  </span>
                  <Badge color="var(--color-accent)" small>{p.cat}</Badge>
                  <Badge color="var(--color-text-primary)" small>{p.status}</Badge>
                </div>
                <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                  {p.desc} &bull; Last sync: {p.lastSync} &bull; {p.items} items
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => console.log("Sync plugin:", p.id)}
                  className="p-2 rounded-lg transition-colors hover:bg-white/5"
                  title="Sync Now"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  <RefreshCw size={14} />
                </button>
                <button
                  onClick={() => console.log("Configure plugin:", p.id)}
                  className="p-2 rounded-lg transition-colors hover:bg-white/5"
                  title="Configure"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  <Settings size={14} />
                </button>
                <button
                  onClick={() => console.log("Disconnect plugin:", p.id)}
                  className="p-2 rounded-lg transition-colors hover:bg-white/5"
                  title="Disconnect"
                  style={{ color: "var(--color-error)" }}
                >
                  <Unplug size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marketplace */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>
          Marketplace
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {PLUGIN_MARKETPLACE.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-xl border"
              style={{ borderColor: "var(--color-border-default)", backgroundColor: "var(--color-bg-card)" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                  style={{ backgroundColor: `${p.color}20` }}
                >
                  {p.icon}
                </div>
                <div>
                  <span className="text-sm font-medium block" style={{ color: "var(--color-text-primary)" }}>
                    {p.name}
                  </span>
                  <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>{p.cat}</span>
                </div>
              </div>
              <p className="text-[10px] mb-3" style={{ color: "var(--color-text-secondary)" }}>{p.desc}</p>
              <Button className="w-full justify-center" onClick={() => console.log("Install plugin:", p.id)}>
                <Download size={12} /> Install
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Capabilities Info */}
      <div
        className="p-4 rounded-xl"
        style={{ backgroundColor: "var(--color-bg-card)" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Info size={14} style={{ color: "var(--color-accent)" }} />
          <span className="text-xs font-medium" style={{ color: "var(--color-text-primary)" }}>
            How Plugins Work
          </span>
        </div>
        <p className="text-[10px] leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
          Plugins are read-only data connectors. They pull data from external services into Orchestria
          so your AI workers have context about your tools. Plugins never write to external services &mdash;
          write actions go through workers with the Credentials Vault. OAuth-first authentication ensures
          secure, scoped access.
        </p>
      </div>
    </div>
  );
}
