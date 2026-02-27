import type { Plugin, MarketplacePlugin } from "@/lib/types";

export const INSTALLED_PLUGINS: Plugin[] = [
  {
    id: "plg-stripe", name: "Stripe", icon: "\u{1F4B3}", cat: "Payments", status: "connected", auth: "oauth", lastSync: "2 min ago", items: 14, desc: "Revenue, charges, subscriptions", color: "#635bff",
    data: [
      { id: "sd1", type: "metric", label: "MRR", value: "$4,280", change: "+12%", changeUp: true },
      { id: "sd2", type: "metric", label: "Active Subs", value: "38", change: "+3", changeUp: true },
      { id: "sd3", type: "metric", label: "Churn Rate", value: "2.1%", change: "-0.3%", changeUp: true },
      {
        id: "sd4", type: "row", label: "Last 5 Charges", rows: [
          { name: "Pro Plan — john@acme.co", amount: "$49", date: "Today 14:22", status: "succeeded" },
          { name: "Pro Plan — lisa@startup.io", amount: "$49", date: "Today 11:05", status: "succeeded" },
          { name: "Team Plan — dev@bigco.com", amount: "$149", date: "Yesterday", status: "succeeded" },
          { name: "Pro Plan — max@freelance.dev", amount: "$49", date: "Yesterday", status: "refunded" },
          { name: "Pro Plan — anna@design.co", amount: "$49", date: "Feb 23", status: "succeeded" },
        ],
      },
    ],
  },
  {
    id: "plg-github", name: "GitHub", icon: "\u{1F419}", cat: "Dev Tools", status: "connected", auth: "oauth", lastSync: "5 min ago", items: 23, desc: "Issues, PRs, commits", color: "#238636",
    data: [
      { id: "gd1", type: "metric", label: "Open Issues", value: "12", change: "+2", changeUp: false },
      { id: "gd2", type: "metric", label: "Open PRs", value: "4", change: "0", changeUp: true },
      { id: "gd3", type: "metric", label: "Commits (7d)", value: "47", change: "+18", changeUp: true },
      {
        id: "gd4", type: "row", label: "Recent Issues", rows: [
          { name: "#142 — Auth token expires too early", amount: "bug", date: "Today", status: "open" },
          { name: "#141 — Add dark mode to settings", amount: "feature", date: "Today", status: "open" },
          { name: "#140 — Webhook retry fails on 429", amount: "bug", date: "Yesterday", status: "open" },
          { name: "#139 — Migrate to Node 20", amount: "chore", date: "Feb 23", status: "closed" },
        ],
      },
    ],
  },
  {
    id: "plg-slack", name: "Slack", icon: "\u{1F4AC}", cat: "Communication", status: "connected", auth: "oauth", lastSync: "1 min ago", items: 8, desc: "Messages, channels, alerts", color: "#e01e5a",
    data: [
      { id: "sld1", type: "metric", label: "Unread", value: "6", change: "", changeUp: true },
      { id: "sld2", type: "metric", label: "Mentions", value: "3", change: "today", changeUp: false },
      {
        id: "sld3", type: "row", label: "Recent Mentions", rows: [
          { name: "@michael can you review the pricing PR?", amount: "#dev", date: "12 min ago", status: "unread" },
          { name: "@michael standup notes posted", amount: "#general", date: "1h ago", status: "read" },
          { name: "@michael deploy to staging done", amount: "#deploys", date: "3h ago", status: "read" },
        ],
      },
    ],
  },
];

export const PLUGIN_MARKETPLACE: MarketplacePlugin[] = [
  { id: "mk-notion", name: "Notion", icon: "\u{1F4DD}", cat: "Docs", desc: "Pages, databases, wikis", color: "#000", installed: false },
  { id: "mk-linear", name: "Linear", icon: "\u{1F537}", cat: "Dev Tools", desc: "Issues, projects, cycles", color: "#5e6ad2", installed: false },
  { id: "mk-analytics", name: "Google Analytics", icon: "\u{1F4CA}", cat: "Analytics", desc: "Traffic, events, conversions", color: "#e37400", installed: false },
  { id: "mk-sentry", name: "Sentry", icon: "\u{1F41B}", cat: "Dev Tools", desc: "Errors, performance, alerts", color: "#362d59", installed: false },
  { id: "mk-hubspot", name: "HubSpot", icon: "\u{1F536}", cat: "CRM", desc: "Contacts, deals, pipelines", color: "#ff7a59", installed: false },
  { id: "mk-vercel", name: "Vercel", icon: "\u{25B2}", cat: "Dev Tools", desc: "Deployments, domains, logs", color: "#fff", installed: false },
  { id: "mk-posthog", name: "PostHog", icon: "\u{1F994}", cat: "Analytics", desc: "Events, funnels, feature flags", color: "#1d4aff", installed: false },
  { id: "mk-mailchimp", name: "Mailchimp", icon: "\u{1F4E7}", cat: "Marketing", desc: "Campaigns, lists, analytics", color: "#ffe01b", installed: false },
];
