"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, RefreshCw, Settings, Unplug, TrendingUp, TrendingDown,
} from "lucide-react";
import { usePlugins } from "@/lib/hooks";
import type { PluginDataMetric, PluginDataRow } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";

export default function PluginPage() {
  const { pluginId } = useParams<{ pluginId: string }>();
  const { plugins } = usePlugins();
  const plugin = plugins.find((p) => p.id === pluginId);

  if (!plugin) {
    return (
      <EmptyState
        icon={Unplug}
        title="Plugin not found"
        desc="This plugin doesn't exist or hasn't been installed yet."
        action="Back to Settings"
        onAction={() => window.location.href = "/settings"}
      />
    );
  }

  const metrics = plugin.data.filter((d): d is PluginDataMetric => d.type === "metric");
  const tables = plugin.data.filter((d): d is PluginDataRow => d.type === "row");

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {/* Back link */}
      <Link
        href="/settings"
        className="inline-flex items-center gap-1.5 text-xs mb-4 transition-colors"
        style={{ color: "var(--color-text-secondary)" }}
      >
        <ArrowLeft size={14} /> Back to Settings
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${plugin.color}15` }}
          >
            {plugin.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1
                className="text-xl font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {plugin.name}
              </h1>
              <Badge
                color={plugin.status === "connected" ? "#22c55e" : "#f87171"}
                small
              >
                {plugin.status}
              </Badge>
            </div>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {plugin.desc} &middot; Last sync {plugin.lastSync}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => console.log("Sync plugin:", plugin.id)}>
            <RefreshCw size={12} /> Sync Now
          </Button>
          <Button onClick={() => console.log("Configure plugin:", plugin.id)}>
            <Settings size={12} /> Configure
          </Button>
          <Button onClick={() => console.log("Disconnect plugin:", plugin.id)}>
            <Unplug size={12} /> Disconnect
          </Button>
        </div>
      </div>

      {/* Metrics grid */}
      {metrics.length > 0 && (
        <div
          className="grid gap-3 mb-6"
          style={{ gridTemplateColumns: `repeat(${Math.min(metrics.length, 4)}, 1fr)` }}
        >
          {metrics.map((m) => (
            <div key={m.id} className="glass-card p-4 rounded-xl">
              <p
                className="text-[11px] uppercase tracking-wider mb-1"
                style={{ color: "var(--color-text-muted)" }}
              >
                {m.label}
              </p>
              <p
                className="text-2xl font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {m.value}
              </p>
              {m.change && (
                <div className="flex items-center gap-1 mt-1">
                  {m.changeUp ? (
                    <TrendingUp size={12} style={{ color: "#22c55e" }} />
                  ) : (
                    <TrendingDown size={12} style={{ color: "#f87171" }} />
                  )}
                  <span
                    className="text-xs font-medium"
                    style={{ color: m.changeUp ? "#22c55e" : "#f87171" }}
                  >
                    {m.change}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Data tables */}
      {tables.map((t) => (
        <div key={t.id} className="glass-card rounded-xl overflow-hidden mb-4">
          <div
            className="px-4 py-3 border-b"
            style={{ borderColor: "var(--color-border-default)" }}
          >
            <h3
              className="text-sm font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {t.label}
            </h3>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--color-border-default)" }}>
            {t.rows.map((row, i) => (
              <div
                key={i}
                className="flex items-center px-4 py-2.5 text-sm"
                style={{ borderColor: "var(--color-border-subtle)" }}
              >
                <span
                  className="flex-1 truncate"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {row.name}
                </span>
                <span
                  className="w-24 text-right"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {row.amount}
                </span>
                <span
                  className="w-28 text-right text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {row.date}
                </span>
                <span className="w-24 text-right">
                  <Badge
                    color={
                      row.status === "succeeded" || row.status === "closed"
                        ? "#22c55e"
                        : row.status === "refunded"
                          ? "#f87171"
                          : "#c9a96e"
                    }
                    small
                  >
                    {row.status}
                  </Badge>
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
