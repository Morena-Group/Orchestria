import { useState } from "react";
import {
  LayoutDashboard, ListTodo, Bot, MessageSquare, FileText, Settings,
  ChevronDown, ChevronRight, Plus, Search, Bell, MoreHorizontal, Clock,
  CheckCircle2, XCircle, AlertTriangle, Play, Pause, Eye, Lock,
  ArrowRight, Archive, Filter, Zap, Brain, Send, Paperclip,
  ChevronLeft, Calendar, BarChart3, RefreshCw, Sparkles, Shield,
  Layers, Target, Workflow, X, Check, Edit3, GripVertical, User, Hash,
  FolderOpen, File, Tag, Key, Database, Globe, Repeat, Pin, Shrink,
  HardDrive, Activity, TrendingUp, FolderTree, Upload, Download
} from "lucide-react";

const C = {
  bg: "#0f1117", bgC: "#1a1d27", bgH: "#222633", bgS: "#141720",
  bd: "#2a2d3a", tx: "#e4e4e7", txM: "#71717a", txD: "#52525b",
  ac: "#6366f1", acH: "#818cf8", acD: "#4f46e5",
};

const STATUS = {
  draft: { l: "Draft", c: "#71717a", bg: "#27272a", i: Edit3 },
  pending: { l: "Pending", c: "#f59e0b", bg: "#422006", i: Clock },
  approved: { l: "Approved", c: "#3b82f6", bg: "#172554", i: Check },
  running: { l: "Running", c: "#22c55e", bg: "#052e16", i: Play },
  awaiting_input: { l: "Awaiting Input", c: "#f97316", bg: "#431407", i: AlertTriangle },
  review: { l: "Review", c: "#a855f7", bg: "#3b0764", i: Eye },
  completed: { l: "Completed", c: "#10b981", bg: "#022c22", i: CheckCircle2 },
  failed: { l: "Failed", c: "#ef4444", bg: "#450a0a", i: XCircle },
  throttled: { l: "Throttled", c: "#eab308", bg: "#422006", i: Pause },
};

const PRI = {
  urgent: { l: "Urgent", c: "#ef4444", ic: "🔴" },
  high: { l: "High", c: "#f97316", ic: "🟠" },
  medium: { l: "Medium", c: "#eab308", ic: "🟡" },
  low: { l: "Low", c: "#22c55e", ic: "🟢" },
};

const WT = {
  "claude-cli": { n: "Claude", c: "#d4a574", a: "C" },
  "gemini-cli": { n: "Gemini", c: "#4285f4", a: "G" },
  "chatgpt-cli": { n: "ChatGPT", c: "#10a37f", a: "O" },
  "kimi-cli": { n: "Kimi", c: "#ff6b6b", a: "K" },
};

const PROJECTS = [
  { id: "p1", name: "AI SaaS Platform", color: "#6366f1", total: 24, done: 8 },
  { id: "p2", name: "Marketing Automation", color: "#ec4899", total: 12, done: 3 },
  { id: "p3", name: "Data Pipeline v2", color: "#14b8a6", total: 18, done: 15 },
];

const WORKERS = [
  { id: "w1", name: "Claude Opus", type: "claude-cli", role: "both", status: "online", active: 3, done: 47, model: "claude-opus-4", think: "deep" },
  { id: "w2", name: "Gemini Research", type: "gemini-cli", role: "worker", status: "online", active: 1, done: 23, model: "gemini-2.5-pro", think: "standard" },
  { id: "w3", name: "ChatGPT Writer", type: "chatgpt-cli", role: "worker", status: "offline", active: 0, done: 15, model: "gpt-4o", think: "standard" },
  { id: "w4", name: "Kimi Analyzer", type: "kimi-cli", role: "worker", status: "busy", active: 2, done: 31, model: "kimi-k2", think: "deep" },
];

const TASKS = [
  { id: "t1", title: "Design database schema for user auth", s: "completed", p: "high", w: "w1", pr: "p1", sub: 3, subD: 3, lock: false, tags: ["backend", "db"] },
  { id: "t2", title: "Research competitor pricing models", s: "running", p: "medium", w: "w2", pr: "p1", sub: 5, subD: 2, lock: false, tags: ["research"] },
  { id: "t3", title: "Write API documentation", s: "awaiting_input", p: "medium", w: "w3", pr: "p1", sub: 0, subD: 0, lock: false, tags: ["docs"], block: "Need API key for testing endpoint authentication" },
  { id: "t4", title: "Implement Kanban drag-and-drop", s: "review", p: "high", w: "w1", pr: "p1", sub: 4, subD: 4, lock: false, tags: ["frontend"] },
  { id: "t5", title: "Set up CI/CD pipeline", s: "pending", p: "urgent", w: "w4", pr: "p1", sub: 6, subD: 0, lock: false, tags: ["devops"] },
  { id: "t6", title: "Create landing page copy", s: "draft", p: "low", w: null, pr: "p1", sub: 0, subD: 0, lock: false, tags: ["marketing"] },
  { id: "t7", title: "Optimize database queries", s: "approved", p: "high", w: "w1", pr: "p1", sub: 3, subD: 0, lock: true, tags: ["backend", "perf"] },
  { id: "t8", title: "Security audit - auth flow", s: "running", p: "urgent", w: "w4", pr: "p1", sub: 8, subD: 3, lock: false, tags: ["security"] },
  { id: "t9", title: "Integrate Stripe payments", s: "draft", p: "medium", w: null, pr: "p1", sub: 0, subD: 0, lock: false, tags: ["backend", "payments"] },
  { id: "t10", title: "User onboarding flow design", s: "throttled", p: "medium", w: "w2", pr: "p1", sub: 2, subD: 1, lock: false, tags: ["ux"] },
  { id: "t11", title: "Analyze market research data", s: "completed", p: "high", w: "w2", pr: "p2", sub: 0, subD: 0, lock: false, tags: ["research"] },
  { id: "t12", title: "Build email template system", s: "running", p: "medium", w: "w1", pr: "p2", sub: 4, subD: 1, lock: false, tags: ["backend"] },
];

const CHATS = [
  { id: "m1", role: "user", content: "Can you break down the authentication module into subtasks?", time: "10:23 AM" },
  { id: "m2", role: "bot", content: "I'll decompose the auth module:\n\n1. **DB schema** - User table, sessions, tokens (Claude)\n2. **JWT** - Token generation, validation (Claude)\n3. **OAuth** - Google, GitHub (Gemini)\n4. **Password hashing** - bcrypt (ChatGPT)\n5. **Rate limiting** - Login throttling (Kimi)\n\nCreate these as tasks?", time: "10:23 AM" },
  { id: "m3", role: "user", content: "Yes, but assign OAuth to Claude. Also add 2FA.", time: "10:25 AM" },
  { id: "m4", role: "bot", content: "Done! Created 6 subtasks under 'Auth Module':\n- Reassigned OAuth to Claude Opus\n- Added 2FA (Kimi, medium)\n- All in Draft, awaiting approval.\n\nSet up dependencies? JWT should finish before OAuth and 2FA.", time: "10:25 AM" },
];

// Utilities
const Bd = ({ children, color, bg, s }) => (
  <span className={`inline-flex items-center gap-1 rounded-full font-medium ${s ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'}`}
    style={{ color, backgroundColor: bg || `${color}20` }}>{children}</span>
);
const Av = ({ type, size = 28, role }) => {
  const c = WT[type] || { n: "?", c: "#666", a: "?" };
  return (
    <div className="rounded-full flex items-center justify-center font-bold text-white relative flex-shrink-0"
      style={{ width: size, height: size, backgroundColor: c.c, fontSize: size * 0.4 }}>
      {c.a}
      {(role === "orchestrator" || role === "both") && (
        <div className="absolute -bottom-0.5 -right-0.5 bg-yellow-500 rounded-full flex items-center justify-center"
          style={{ width: size * 0.45, height: size * 0.45 }}>
          <Brain size={size * 0.3} className="text-black" />
        </div>
      )}
    </div>
  );
};
const Dot = ({ s }) => <span className="inline-block rounded-full" style={{ width: 8, height: 8, backgroundColor: s === "online" ? "#22c55e" : s === "busy" ? "#f59e0b" : "#71717a" }} />;
const Inp = ({ placeholder, ...p }) => <input {...p} placeholder={placeholder} className="w-full px-3 py-2 rounded-lg text-sm border outline-none" style={{ backgroundColor: C.bgC, borderColor: C.bd, color: C.tx }} />;
const Sel = ({ children }) => <select className="w-full px-3 py-2 rounded-lg text-sm border outline-none" style={{ backgroundColor: C.bgC, borderColor: C.bd, color: C.tx }}>{children}</select>;
const Lbl = ({ children }) => <span className="text-xs block mb-1" style={{ color: C.txD }}>{children}</span>;

// ============ SIDEBAR ============
const Sidebar = ({ view, setView, proj, setProj, col, setCol }) => {
  const [exp, setExp] = useState(true);
  const nav = [
    { id: "dashboard", l: "Dashboard", ic: LayoutDashboard },
    { id: "tasks", l: "My Tasks", ic: ListTodo },
    { id: "workers", l: "Workers", ic: Bot },
    { id: "chat", l: "Chat", ic: MessageSquare },
    { id: "planner", l: "Master Planner", ic: Workflow },
    { id: "notes", l: "Notes", ic: FileText },
    { id: "briefings", l: "Briefings", ic: BarChart3 },
    { id: "storage", l: "Storage", ic: HardDrive },
    { id: "settings", l: "Settings", ic: Settings },
  ];
  return (
    <div className="h-full flex flex-col border-r" style={{ width: col ? 60 : 240, backgroundColor: C.bgS, borderColor: C.bd, transition: "width 0.2s" }}>
      <div className="flex items-center gap-2 px-4 py-4 border-b" style={{ borderColor: C.bd }}>
        {!col && <><div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center"><Zap size={18} className="text-white" /></div>
          <span className="font-bold text-lg" style={{ color: C.tx }}>Orchestria</span></>}
        <button onClick={() => setCol(!col)} className="ml-auto p-1 rounded hover:bg-white/5" style={{ color: C.txM }}>
          {col ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
      <nav className="flex-1 py-2 overflow-y-auto">
        {nav.map(n => {
          const I = n.ic; const a = view === n.id;
          return (<button key={n.id} onClick={() => setView(n.id)} className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${col ? 'justify-center' : ''}`} title={col ? n.l : undefined}
            style={{ color: a ? C.ac : C.txM, backgroundColor: a ? `${C.ac}15` : "transparent", borderRight: a ? `2px solid ${C.ac}` : "2px solid transparent" }}>
            <I size={18} />{!col && <span>{n.l}</span>}
            {!col && n.id === "chat" && <span className="ml-auto bg-indigo-600 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">2</span>}
          </button>);
        })}
        {!col && <div className="mt-4 px-4">
          <button onClick={() => setExp(!exp)} className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: C.txD }}>
            {exp ? <ChevronDown size={12} /> : <ChevronRight size={12} />} Projects</button>
          {exp && PROJECTS.map(p => (
            <button key={p.id} onClick={() => { setProj(p.id); setView("dashboard"); }}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md mb-0.5"
              style={{ color: proj === p.id ? C.tx : C.txM, backgroundColor: proj === p.id ? C.bgH : "transparent" }}>
              <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: p.color }} />
              <span className="truncate">{p.name}</span>
              <span className="ml-auto text-[10px]" style={{ color: C.txD }}>{p.done}/{p.total}</span>
            </button>))}
          <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md mt-1 hover:bg-white/5" style={{ color: C.txD }}><Plus size={14} /> New Project</button>
        </div>}
      </nav>
    </div>
  );
};

// ============ TOP BAR ============
const TopBar = ({ proj, view }) => {
  const p = PROJECTS.find(x => x.id === proj);
  const labels = { dashboard: "Dashboard", tasks: "My Tasks", workers: "Workers", chat: "Orchestrator Chat", planner: "Master Planner", notes: "Notes", briefings: "Briefings", storage: "Storage", settings: "Settings" };
  return (
    <div className="h-14 flex items-center justify-between px-6 border-b" style={{ backgroundColor: C.bg, borderColor: C.bd }}>
      <div className="flex items-center gap-3">
        {p && <><div className="w-4 h-4 rounded" style={{ backgroundColor: p.color }} /><span className="text-sm font-medium" style={{ color: C.tx }}>{p.name}</span><ChevronRight size={14} style={{ color: C.txD }} /></>}
        <span className="text-sm font-semibold" style={{ color: C.tx }}>{labels[view]}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: C.txD }} />
          <input placeholder="Search... (⌘K)" className="pl-8 pr-3 py-1.5 rounded-lg text-sm border outline-none" style={{ backgroundColor: C.bgC, borderColor: C.bd, color: C.tx, width: 220 }} />
        </div>
        <button className="relative p-2 rounded-lg hover:bg-white/5" style={{ color: C.txM }}><Bell size={18} /><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" /></button>
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">M</div>
      </div>
    </div>
  );
};

// ============ DASHBOARD (Mission Control) ============
const DashboardView = ({ proj }) => {
  const allTasks = TASKS;
  const projTasks = allTasks.filter(t => t.pr === proj);
  const running = allTasks.filter(t => t.s === "running");
  const blocked = allTasks.filter(t => t.s === "awaiting_input");

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Global stats */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { l: "Total Tasks", v: allTasks.length, c: C.ac },
          { l: "Running", v: running.length, c: "#22c55e" },
          { l: "Blocked", v: blocked.length, c: "#f97316" },
          { l: "Workers Online", v: WORKERS.filter(w => w.status === "online").length + "/" + WORKERS.length, c: "#3b82f6" },
          { l: "Completed Today", v: "5", c: "#10b981" },
        ].map(s => (
          <div key={s.l} className="p-4 rounded-xl border" style={{ backgroundColor: C.bgC, borderColor: C.bd }}>
            <span className="text-[10px] uppercase tracking-wider" style={{ color: C.txD }}>{s.l}</span>
            <div className="text-2xl font-bold mt-1" style={{ color: s.c }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Project Health */}
      <div className="rounded-xl border p-4" style={{ backgroundColor: C.bgC, borderColor: C.bd }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: C.tx }}>Project Health</h3>
        <div className="space-y-3">
          {PROJECTS.map(p => {
            const pct = Math.round((p.done / p.total) * 100);
            const pTasks = allTasks.filter(t => t.pr === p.id);
            const pBlocked = pTasks.filter(t => t.s === "awaiting_input").length;
            return (
              <div key={p.id} className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: p.color }} />
                <span className="text-sm w-44 truncate" style={{ color: C.tx }}>{p.name}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: C.bg }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: p.color }} />
                </div>
                <span className="text-xs w-10 text-right" style={{ color: C.txM }}>{pct}%</span>
                {pBlocked > 0 && <Bd color="#f97316" s>{pBlocked} blocked</Bd>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Active Workers */}
        <div className="rounded-xl border p-4" style={{ backgroundColor: C.bgC, borderColor: C.bd }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: C.tx }}>Worker Activity</h3>
          <div className="space-y-2">
            {WORKERS.map(w => (
              <div key={w.id} className="flex items-center gap-3 p-2 rounded" style={{ backgroundColor: C.bg }}>
                <Av type={w.type} size={28} role={w.role} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm truncate" style={{ color: C.tx }}>{w.name}</span>
                    <Dot s={w.status} />
                  </div>
                  <span className="text-[10px]" style={{ color: C.txD }}>{w.active > 0 ? `Working on ${w.active} tasks` : "Idle"}</span>
                </div>
                <span className="text-xs font-bold" style={{ color: C.txM }}>{w.done}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Needs Attention */}
        <div className="rounded-xl border p-4" style={{ backgroundColor: C.bgC, borderColor: C.bd }}>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "#f97316" }}>
            <AlertTriangle size={16} /> Needs Attention
          </h3>
          <div className="space-y-2">
            {blocked.map(t => {
              const w = WORKERS.find(x => x.id === t.w);
              return (
                <div key={t.id} className="p-3 rounded-lg border" style={{ backgroundColor: C.bg, borderColor: "#f9731630" }}>
                  <div className="flex items-center gap-2 mb-1">
                    {w && <Av type={w.type} size={18} role={w.role} />}
                    <span className="text-sm font-medium" style={{ color: C.tx }}>{t.title}</span>
                  </div>
                  <span className="text-xs" style={{ color: "#f97316" }}>{t.block}</span>
                </div>
              );
            })}
            {TASKS.filter(t => t.s === "review").map(t => (
              <div key={t.id} className="p-3 rounded-lg border" style={{ backgroundColor: C.bg, borderColor: "#a855f730" }}>
                <div className="flex items-center gap-2">
                  <Eye size={14} style={{ color: "#a855f7" }} />
                  <span className="text-sm" style={{ color: C.tx }}>{t.title}</span>
                  <Bd color="#a855f7" s>Needs Review</Bd>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border p-4" style={{ backgroundColor: C.bgC, borderColor: C.bd }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: C.tx }}>Recent Activity</h3>
        <div className="space-y-2">
          {[
            { t: "2 min ago", e: "Claude Opus completed 'Design database schema'", c: "#22c55e" },
            { t: "15 min ago", e: "Kimi Analyzer started 'Security audit'", c: "#3b82f6" },
            { t: "1h ago", e: "ChatGPT Writer blocked on 'API documentation' — needs API key", c: "#f97316" },
            { t: "2h ago", e: "Gemini Research completed 'Market research analysis'", c: "#22c55e" },
            { t: "3h ago", e: "New Master Plan 'Auth System Overhaul' created", c: C.ac },
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-3 p-2">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: a.c }} />
              <span className="text-sm flex-1" style={{ color: C.tx }}>{a.e}</span>
              <span className="text-[10px] flex-shrink-0" style={{ color: C.txD }}>{a.t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============ MY TASKS (Kanban) ============
const TaskCard = ({ task, onClick }) => {
  const w = WORKERS.find(x => x.id === task.w);
  return (
    <div onClick={onClick} className="p-3 rounded-lg border cursor-pointer hover:border-indigo-500/50 group" style={{ backgroundColor: C.bgC, borderColor: C.bd }}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {task.lock && <Lock size={12} className="text-yellow-500 flex-shrink-0" />}
          <span className="text-sm font-medium truncate" style={{ color: C.tx }}>{task.title}</span>
        </div>
      </div>
      {task.block && <div className="mb-2 p-2 rounded text-xs flex items-start gap-1.5" style={{ backgroundColor: "#f9731620", color: "#f97316" }}>
        <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" /><span className="line-clamp-2">{task.block}</span>
      </div>}
      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        {task.tags.map(t => <span key={t} className="px-1.5 py-0.5 rounded text-[10px]" style={{ backgroundColor: `${C.ac}20`, color: C.acH }}>{t}</span>)}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {w ? <Av type={w.type} size={22} role={w.role} /> : <div className="w-[22px] h-[22px] rounded-full border border-dashed flex items-center justify-center" style={{ borderColor: C.txD }}><Plus size={10} style={{ color: C.txD }} /></div>}
          {task.sub > 0 && <span className="text-[11px] flex items-center gap-1" style={{ color: C.txM }}><CheckCircle2 size={11} />{task.subD}/{task.sub}</span>}
        </div>
        {PRI[task.p] && <span className="text-[11px]">{PRI[task.p].ic}</span>}
      </div>
    </div>
  );
};

const TasksView = ({ proj, onTask }) => {
  const tasks = TASKS.filter(t => t.pr === proj);
  const cols = ["draft", "pending", "approved", "running", "awaiting_input", "review", "completed"];
  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="flex items-center gap-6 px-6 py-4 border-b" style={{ borderColor: C.bd }}>
        {[{ l: "Running", c: "#22c55e", v: tasks.filter(t => t.s === "running").length }, { l: "Blocked", c: "#f97316", v: tasks.filter(t => t.s === "awaiting_input").length }, { l: "Total", c: C.txM, v: tasks.length }].map(s => (
          <div key={s.l} className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.c }} />
            <span className="text-xs" style={{ color: C.txM }}>{s.l}: <strong style={{ color: C.tx }}>{s.v}</strong></span></div>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 border hover:bg-white/5" style={{ borderColor: C.bd, color: C.txM }}><Filter size={12} /> Filter</button>
          <button className="px-3 py-1.5 rounded-lg text-xs bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1.5"><Plus size={12} /> New Task</button>
        </div>
      </div>
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4" style={{ minWidth: "max-content" }}>
          {cols.map(st => {
            const s = STATUS[st]; const I = s.i; const ct = tasks.filter(t => t.s === st);
            return (
              <div key={st} className="flex-shrink-0" style={{ width: 270 }}>
                <div className="flex items-center gap-2 mb-3 px-1">
                  <I size={14} style={{ color: s.c }} /><span className="text-sm font-semibold" style={{ color: s.c }}>{s.l}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: s.bg, color: s.c }}>{ct.length}</span>
                </div>
                <div className="space-y-2 min-h-[100px] p-1 rounded-lg" style={{ backgroundColor: `${s.c}08` }}>
                  {ct.map(t => <TaskCard key={t.id} task={t} onClick={() => onTask(t)} />)}
                  <button className="w-full p-2 rounded-lg border border-dashed text-sm flex items-center justify-center gap-1 hover:border-indigo-500/50" style={{ borderColor: C.bd, color: C.txD }}><Plus size={14} /> Add</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============ TASK DETAIL MODAL ============
const TaskModal = ({ task, onClose }) => {
  const [tab, setTab] = useState("details");
  const w = WORKERS.find(x => x.id === task.w);
  const sc = STATUS[task.s];
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="rounded-xl border w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col" style={{ backgroundColor: C.bg, borderColor: C.bd }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: C.bd }}>
          <div className="flex items-center gap-3">
            <Bd color={sc.c} bg={sc.bg}>{sc.l}</Bd>
            {task.lock && <Lock size={14} className="text-yellow-500" />}
            {PRI[task.p] && <span className="text-sm">{PRI[task.p].ic} {PRI[task.p].l}</span>}
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-white/10" style={{ color: C.txM }}><X size={16} /></button>
        </div>
        <div className="px-6 pt-4 pb-2">
          <h2 className="text-lg font-semibold" style={{ color: C.tx }}>{task.title}</h2>
          <div className="flex items-center gap-3 mt-2">
            {w && <div className="flex items-center gap-2"><Av type={w.type} size={20} role={w.role} /><span className="text-xs" style={{ color: C.txM }}>{w.name}</span></div>}
            {task.tags.map(t => <span key={t} className="px-1.5 py-0.5 rounded text-[10px]" style={{ backgroundColor: `${C.ac}20`, color: C.acH }}>{t}</span>)}
          </div>
        </div>
        <div className="flex items-center gap-1 px-6 border-b" style={{ borderColor: C.bd }}>
          {["details", "activity", "chat", "output"].map(t => (
            <button key={t} onClick={() => setTab(t)} className="px-3 py-2 text-sm capitalize border-b-2"
              style={{ color: tab === t ? C.ac : C.txM, borderColor: tab === t ? C.ac : "transparent" }}>{t}</button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {tab === "details" && <div className="space-y-4">
            {task.block && <div className="p-4 rounded-lg border flex items-start gap-3" style={{ borderColor: "#f9731640", backgroundColor: "#f9731610" }}>
              <AlertTriangle size={18} className="text-orange-500 flex-shrink-0 mt-0.5" />
              <div><p className="text-sm font-medium text-orange-400">Agent Blocked - Input Required</p>
                <p className="text-sm mt-1" style={{ color: C.txM }}>{task.block}</p>
                <div className="mt-3 flex items-center gap-2">
                  <input placeholder="Provide input..." className="flex-1 px-3 py-1.5 rounded-lg text-sm border outline-none" style={{ backgroundColor: C.bgC, borderColor: C.bd, color: C.tx }} />
                  <button className="px-3 py-1.5 rounded-lg text-sm bg-orange-600 text-white flex items-center gap-1"><Send size={12} /> Send & Resume</button>
                </div>
              </div>
            </div>}
            <div className="grid grid-cols-2 gap-4">
              {[{ l: "Status", v: <Bd color={sc.c} bg={sc.bg}>{sc.l}</Bd> }, { l: "Priority", v: <span style={{ color: C.tx }}>{PRI[task.p]?.ic} {PRI[task.p]?.l}</span> },
              { l: "Worker", v: w ? <div className="flex items-center gap-2"><Av type={w.type} size={20} role={w.role} /><span className="text-sm" style={{ color: C.tx }}>{w.name}</span></div> : <span style={{ color: C.txD }}>Unassigned</span> },
              { l: "Subtasks", v: <span style={{ color: C.tx }}>{task.subD}/{task.sub} completed</span> }].map(f => (
                <div key={f.l} className="p-3 rounded-lg" style={{ backgroundColor: C.bgC }}><Lbl>{f.l}</Lbl>{f.v}</div>
              ))}
            </div>
          </div>}
          {tab === "activity" && <div className="space-y-3">
            {[{ t: "2h ago", e: "Status changed to " + sc.l, b: "system" }, { t: "3h ago", e: "Assigned to " + (w?.name || "Unassigned"), b: "Orchestrator" }].map((l, i) => (
              <div key={i} className="flex items-start gap-3 p-2"><div className="w-1.5 h-1.5 rounded-full mt-2 bg-indigo-500 flex-shrink-0" />
                <div><p className="text-sm" style={{ color: C.tx }}>{l.e}</p><p className="text-xs mt-0.5" style={{ color: C.txD }}>{l.t} • {l.b}</p></div></div>
            ))}
          </div>}
          {tab === "output" && <div className="p-4 rounded-lg border" style={{ backgroundColor: C.bgC, borderColor: C.bd }}><p className="text-sm" style={{ color: C.txM }}>Output appears here once task is completed.</p></div>}
        </div>
        <div className="flex items-center justify-between p-4 border-t" style={{ borderColor: C.bd }}>
          <div className="flex items-center gap-2">
            {task.s === "review" && <><button className="px-4 py-2 rounded-lg text-sm bg-green-600 text-white flex items-center gap-1"><Check size={14} /> Approve</button>
              <button className="px-4 py-2 rounded-lg text-sm bg-red-600/20 text-red-400 flex items-center gap-1"><XCircle size={14} /> Reject</button></>}
            {task.s === "draft" && <button className="px-4 py-2 rounded-lg text-sm bg-indigo-600 text-white flex items-center gap-1"><ArrowRight size={14} /> Move to Pending</button>}
            {task.s === "completed" && <button className="px-4 py-2 rounded-lg text-sm border flex items-center gap-1 hover:bg-white/5" style={{ borderColor: C.bd, color: C.txM }}><RefreshCw size={14} /> Rerun</button>}
          </div>
          <button className="px-3 py-1.5 rounded-lg text-xs border hover:bg-white/5 flex items-center gap-1" style={{ borderColor: C.bd, color: C.txD }}><Archive size={12} /> Archive</button>
        </div>
      </div>
    </div>
  );
};

// ============ WORKERS ============
const WorkersView = () => {
  const [modal, setModal] = useState(false);
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-lg font-semibold" style={{ color: C.tx }}>Workers & Orchestrators</h2>
          <p className="text-sm mt-1" style={{ color: C.txM }}>Manage your AI agents and their roles</p></div>
        <button onClick={() => setModal(true)} className="px-4 py-2 rounded-lg text-sm bg-indigo-600 text-white flex items-center gap-2"><Plus size={16} /> Add Worker</button>
      </div>
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}>
        {WORKERS.map(w => (
          <div key={w.id} className="p-4 rounded-xl border hover:border-indigo-500/30" style={{ backgroundColor: C.bgC, borderColor: C.bd }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3"><Av type={w.type} size={40} role={w.role} />
                <div><div className="flex items-center gap-2"><span className="text-sm font-semibold" style={{ color: C.tx }}>{w.name}</span><Dot s={w.status} /></div>
                  <span className="text-xs" style={{ color: C.txM }}>{w.model}</span></div></div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Bd color={w.role === "both" ? "#eab308" : w.role === "orchestrator" ? "#a855f7" : "#3b82f6"} bg={w.role === "both" ? "#422006" : w.role === "orchestrator" ? "#3b0764" : "#172554"} s>
                {w.role === "both" ? "Worker + Orchestrator" : w.role === "orchestrator" ? "Orchestrator" : "Worker"}</Bd>
              <Bd color="#71717a" bg="#27272a" s>Thinking: {w.think}</Bd>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: C.bg }}><span className="text-[10px] block" style={{ color: C.txD }}>Active</span><span className="text-lg font-bold" style={{ color: C.tx }}>{w.active}</span></div>
              <div className="p-2 rounded-lg" style={{ backgroundColor: C.bg }}><span className="text-[10px] block" style={{ color: C.txD }}>Done</span><span className="text-lg font-bold" style={{ color: C.tx }}>{w.done}</span></div>
            </div>
          </div>
        ))}
      </div>
      {modal && <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setModal(false)}>
        <div className="rounded-xl border p-6 w-full max-w-md" style={{ backgroundColor: C.bg, borderColor: C.bd }} onClick={e => e.stopPropagation()}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: C.tx }}>Add New Worker</h3>
          <div className="space-y-4">
            <div><Lbl>Name</Lbl><Inp placeholder="e.g. Claude Research" /></div>
            <div><Lbl>Type</Lbl><Sel><option>Claude CLI</option><option>Gemini CLI</option><option>ChatGPT CLI</option><option>Kimi CLI</option><option>Other</option></Sel></div>
            <div><Lbl>Role</Lbl><div className="flex gap-2">{["Worker", "Orchestrator", "Both"].map(r => (
              <button key={r} className="flex-1 px-3 py-2 rounded-lg text-sm border text-center hover:border-indigo-500" style={{ borderColor: C.bd, color: C.txM }}>{r}</button>
            ))}</div></div>
            <div><Lbl>Model</Lbl><Inp placeholder="e.g. claude-opus-4" /></div>
            <div><Lbl>Thinking Level</Lbl><Sel><option>Standard</option><option>Deep</option><option>Minimal</option></Sel></div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button onClick={() => setModal(false)} className="px-4 py-2 rounded-lg text-sm border hover:bg-white/5" style={{ borderColor: C.bd, color: C.txM }}>Cancel</button>
            <button className="px-4 py-2 rounded-lg text-sm bg-indigo-600 text-white">Create</button>
          </div>
        </div>
      </div>}
    </div>
  );
};

// ============ CHAT ============
const ChatView = () => {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState("project");
  const [showCtx, setShowCtx] = useState(false);
  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="w-60 border-r flex flex-col" style={{ borderColor: C.bd, backgroundColor: C.bgS }}>
        <div className="p-3 border-b" style={{ borderColor: C.bd }}>
          <button className="w-full px-3 py-2 rounded-lg text-sm bg-indigo-600 text-white flex items-center justify-center gap-1"><Plus size={14} /> New Chat</button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {[{ id: "project", l: "AI SaaS Platform", s: "Break down auth...", t: "10m" },
          { id: "global", l: "Global Overview", s: "Cross-project report", t: "2h" },
          { id: "brain", l: "Brainstorm: Pricing", s: "Freemium model...", t: "1d" }].map(c => (
            <button key={c.id} onClick={() => setChat(c.id)} className="w-full text-left p-2 rounded-lg"
              style={{ backgroundColor: chat === c.id ? C.bgH : "transparent" }}>
              <div className="flex items-center justify-between">
                <span className="text-sm truncate" style={{ color: chat === c.id ? C.tx : C.txM }}>{c.l}</span>
                <span className="text-[10px]" style={{ color: C.txD }}>{c.t}</span>
              </div>
              <span className="text-xs truncate block mt-0.5" style={{ color: C.txD }}>{c.s}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: C.bd }}>
          <div className="flex items-center gap-3">
            <Av type="claude-cli" size={28} role="orchestrator" />
            <div><span className="text-sm font-medium" style={{ color: C.tx }}>Claude Opus</span>
              <span className="text-xs ml-2" style={{ color: C.txD }}>Orchestrator</span></div>
          </div>
          <button onClick={() => setShowCtx(!showCtx)} className="px-3 py-1.5 rounded-lg text-xs border flex items-center gap-1" style={{ borderColor: showCtx ? C.ac : C.bd, color: showCtx ? C.ac : C.txM }}>
            <Database size={12} /> Context Window
          </button>
        </div>
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {CHATS.map(m => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
                  {m.role !== "user" && <Av type="claude-cli" size={28} role="orchestrator" />}
                  <div className="max-w-[70%]">
                    <div className="p-3 rounded-xl text-sm" style={{ backgroundColor: m.role === "user" ? C.acD : C.bgC, color: C.tx, borderBottomRightRadius: m.role === "user" ? 4 : 12, borderBottomLeftRadius: m.role !== "user" ? 4 : 12 }}>
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    </div>
                    <span className="text-[10px] mt-1 block px-1" style={{ color: C.txD }}>{m.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t" style={{ borderColor: C.bd }}>
              <div className="flex-1 rounded-xl border p-2" style={{ backgroundColor: C.bgC, borderColor: C.bd }}>
                <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Ask the orchestrator..." className="w-full bg-transparent text-sm outline-none resize-none" style={{ color: C.tx, minHeight: 40 }} rows={1} />
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-1">
                    <button className="p-1 rounded hover:bg-white/10" style={{ color: C.txD }}><Paperclip size={14} /></button>
                    <button className="p-1 rounded hover:bg-white/10" style={{ color: C.txD }}><Sparkles size={14} /></button>
                  </div>
                  <button className="p-1.5 rounded-lg bg-indigo-600 text-white"><Send size={14} /></button>
                </div>
              </div>
            </div>
          </div>
          {/* Context Panel */}
          {showCtx && <div className="w-64 border-l p-4 overflow-y-auto" style={{ borderColor: C.bd, backgroundColor: C.bgS }}>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: C.txD }}>Active Context</h4>
            <div className="space-y-2">
              {["memory.md", "project-overview.md", "database-schema.md"].map(f => (
                <div key={f} className="flex items-center gap-2 p-2 rounded" style={{ backgroundColor: C.bgC }}>
                  <FileText size={12} style={{ color: C.ac }} />
                  <span className="text-xs flex-1" style={{ color: C.tx }}>{f}</span>
                  <button className="p-0.5 rounded hover:bg-white/10"><X size={10} style={{ color: C.txD }} /></button>
                </div>
              ))}
              <button className="w-full p-2 rounded border border-dashed text-xs flex items-center justify-center gap-1" style={{ borderColor: C.bd, color: C.txD }}><Plus size={10} /> Add file</button>
            </div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mt-4 mb-2" style={{ color: C.txD }}>Token Budget</h4>
            <div className="p-2 rounded" style={{ backgroundColor: C.bgC }}>
              <div className="flex justify-between text-xs mb-1"><span style={{ color: C.txM }}>Used</span><span style={{ color: C.tx }}>42K / 128K</span></div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: C.bg }}>
                <div className="h-full rounded-full bg-indigo-500" style={{ width: "33%" }} />
              </div>
            </div>
          </div>}
        </div>
      </div>
    </div>
  );
};

// ============ MASTER PLANNER (kept concise) ============
const PlannerView = () => {
  const [step, setStep] = useState(1);
  const phases = [
    { id: 1, n: "Research & Analysis", t: "research", w: "w2", tasks: ["Analyze auth vulnerabilities", "Research OAuth 2.0", "Compare JWT vs sessions"] },
    { id: 2, n: "Architecture Design", t: "synthesis", w: "w1", tasks: ["Design auth schema", "Plan migration", "Create API specs"] },
    { id: 3, n: "Implementation", t: "custom", w: "w1", tasks: ["Build JWT service", "Implement OAuth", "Add 2FA", "Rate limiting"] },
    { id: 4, n: "Testing", t: "evaluation", w: "w4", tasks: ["Penetration testing", "Load testing", "Integration tests"] },
  ];
  const PT = { research: { c: "#3b82f6", i: Search }, synthesis: { c: "#a855f7", i: Layers }, evaluation: { c: "#f59e0b", i: Target }, custom: { c: "#6366f1", i: Sparkles } };
  const steps = ["Basic Info", "Phases & Workers", "Approval Matrix", "Context & Constraints", "Review & Launch"];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-center gap-1 mb-8">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center">
            <button onClick={() => setStep(i + 1)} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
              style={{ backgroundColor: step === i + 1 ? C.ac : step > i + 1 ? "#22c55e20" : C.bgC, color: step === i + 1 ? "white" : step > i + 1 ? "#22c55e" : C.txM }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: step > i + 1 ? "#22c55e" : "transparent", color: step > i + 1 ? "white" : "inherit" }}>
                {step > i + 1 ? <Check size={12} /> : i + 1}</span>{s}</button>
            {i < 4 && <div className="w-8 h-px mx-1" style={{ backgroundColor: step > i + 1 ? "#22c55e" : C.bd }} />}
          </div>
        ))}
      </div>
      {step === 1 && <div className="max-w-xl mx-auto space-y-6">
        <div><h2 className="text-xl font-semibold mb-1" style={{ color: C.tx }}>Create Master Task Plan</h2></div>
        <div><Lbl>Plan Name</Lbl><Inp placeholder="e.g. Authentication System Overhaul" /></div>
        <div><Lbl>Description</Lbl><textarea className="w-full px-3 py-2 rounded-lg text-sm border outline-none resize-none" rows={3} style={{ backgroundColor: C.bgC, borderColor: C.bd, color: C.tx }} placeholder="Goal of this master plan..." /></div>
        <div><Lbl>Target Project</Lbl><Sel>{PROJECTS.map(p => <option key={p.id}>{p.name}</option>)}<option>+ New Project</option></Sel></div>
        <div className="flex items-center gap-3 p-3 rounded-lg border" style={{ backgroundColor: C.bgC, borderColor: C.bd }}>
          <Brain size={20} style={{ color: C.ac }} /><div className="flex-1"><span className="text-sm" style={{ color: C.tx }}>AI-Assisted Planning</span>
            <p className="text-xs mt-0.5" style={{ color: C.txD }}>Let orchestrator decompose this plan</p></div>
          <button className="px-3 py-1.5 rounded-lg text-xs bg-indigo-600 text-white">Start Chat</button>
        </div>
      </div>}
      {step === 2 && <div className="max-w-4xl mx-auto space-y-4">
        {phases.map((ph, i) => { const tc = PT[ph.t] || PT.custom; const I = tc.i; const w = WORKERS.find(x => x.id === ph.w);
          return (<div key={ph.id} className="rounded-xl border overflow-hidden" style={{ borderColor: C.bd }}>
            <div className="flex items-center gap-3 p-4" style={{ backgroundColor: `${tc.c}10` }}>
              <GripVertical size={16} style={{ color: C.txD }} /><div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${tc.c}30` }}><I size={16} style={{ color: tc.c }} /></div>
              <span className="text-sm font-semibold flex-1" style={{ color: C.tx }}>Phase {i + 1}: {ph.n}</span>
              {w && <div className="flex items-center gap-2"><Av type={w.type} size={24} role={w.role} /><span className="text-xs" style={{ color: C.txM }}>{w.name}</span></div>}
            </div>
            <div className="p-4 space-y-2" style={{ backgroundColor: C.bgC }}>
              {ph.tasks.map((t, ti) => (<div key={ti} className="flex items-center gap-2 p-2 rounded" style={{ backgroundColor: C.bg }}><Hash size={12} style={{ color: C.txD }} /><span className="text-sm flex-1" style={{ color: C.tx }}>{t}</span></div>))}
              <button className="w-full p-2 rounded border border-dashed text-xs flex items-center justify-center gap-1" style={{ borderColor: C.bd, color: C.txD }}><Plus size={12} /> Add Task</button>
            </div>
          </div>);
        })}
        <button className="w-full p-4 rounded-xl border border-dashed text-sm flex items-center justify-center gap-2" style={{ borderColor: C.bd, color: C.txD }}><Plus size={16} /> Add Phase</button>
      </div>}
      {step === 3 && <div className="max-w-3xl mx-auto space-y-3">
        <h2 className="text-xl font-semibold mb-4" style={{ color: C.tx }}>Approval Matrix</h2>
        {phases.map((ph, i) => { const tc = PT[ph.t] || PT.custom;
          return (<div key={ph.id} className="p-4 rounded-xl border flex items-center gap-4" style={{ backgroundColor: C.bgC, borderColor: C.bd }}>
            <div className="flex-1"><Bd color={tc.c} s>Phase {i + 1}</Bd><span className="text-sm font-medium ml-2" style={{ color: C.tx }}>{ph.n}</span></div>
            <div className="flex gap-2">{["AI", "Human", "Hybrid"].map(m => {
              const sel = (i === 0 && m === "AI") || (i === 1 && m === "Human") || (i === 2 && m === "Hybrid") || (i === 3 && m === "Human");
              return <button key={m} className="px-3 py-1.5 rounded-lg text-xs border" style={{ borderColor: sel ? C.ac : C.bd, backgroundColor: sel ? `${C.ac}20` : "transparent", color: sel ? C.ac : C.txM }}>
                {m === "AI" && <Bot size={12} className="inline mr-1" />}{m === "Human" && <User size={12} className="inline mr-1" />}{m === "Hybrid" && <Shield size={12} className="inline mr-1" />}{m}</button>;
            })}</div>
          </div>);
        })}
      </div>}
      {step === 5 && <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4" style={{ color: C.tx }}>Review & Launch</h2>
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: C.bd }}>
          <div className="p-4 border-b" style={{ borderColor: C.bd, backgroundColor: C.bgC }}>
            <h3 className="text-lg font-semibold" style={{ color: C.tx }}>Authentication System Overhaul</h3>
            <p className="text-xs mt-1" style={{ color: C.txM }}>4 phases • 13 tasks • 3 workers</p>
          </div>
          <div className="p-6 flex gap-2" style={{ backgroundColor: C.bg }}>
            {phases.map((ph, i) => { const tc = PT[ph.t] || PT.custom; const I = tc.i;
              return (<div key={ph.id} className="flex-1">
                <div className="rounded-lg border p-3" style={{ borderColor: `${tc.c}40`, backgroundColor: `${tc.c}10` }}>
                  <div className="flex items-center gap-2 mb-2"><I size={14} style={{ color: tc.c }} /><span className="text-xs font-semibold" style={{ color: tc.c }}>Phase {i + 1}</span></div>
                  <span className="text-sm font-medium block mb-2" style={{ color: C.tx }}>{ph.n}</span>
                  {ph.tasks.map((t, ti) => <div key={ti} className="text-[11px] flex items-center gap-1" style={{ color: C.txM }}><div className="w-1 h-1 rounded-full" style={{ backgroundColor: tc.c }} />{t}</div>)}
                </div>
              </div>);
            })}
          </div>
          <div className="p-4 border-t flex justify-end gap-2" style={{ borderColor: C.bd, backgroundColor: C.bgC }}>
            <button className="px-4 py-2 rounded-lg text-sm border hover:bg-white/5" style={{ borderColor: C.bd, color: C.txM }}>Save Draft</button>
            <button className="px-6 py-2 rounded-lg text-sm bg-indigo-600 text-white flex items-center gap-2"><Zap size={14} /> Launch</button>
          </div>
        </div>
      </div>}
      <div className="flex justify-center gap-3 mt-8">
        {step > 1 && <button onClick={() => setStep(step - 1)} className="px-6 py-2 rounded-lg text-sm border hover:bg-white/5" style={{ borderColor: C.bd, color: C.txM }}>Previous</button>}
        {step < 5 && <button onClick={() => setStep(step + 1)} className="px-6 py-2 rounded-lg text-sm bg-indigo-600 text-white">Next</button>}
      </div>
    </div>
  );
};

// ============ NOTES (with Condense) ============
const NotesView = () => {
  const [condenseMode, setCondenseMode] = useState(false);
  const notes = [
    { id: "n1", title: "Payment Integration Ideas", proj: "AI SaaS Platform", content: "Consider Stripe for primary, Paddle for EU...", proposed: 0, pinned: false },
    { id: "n2", title: "Performance Optimization", proj: "Data Pipeline v2", content: "Slow queries on dashboard. Investigate indexing...", proposed: 3, pinned: true },
    { id: "n3", title: "Competitor Feature Gap", proj: "AI SaaS Platform", content: "Monday.com has timeline view, consider adding...", proposed: 0, pinned: false },
    { id: "n4", title: "Onboarding UX Research", proj: "AI SaaS Platform", content: "Users drop off at step 3. Need better guidance...", proposed: 0, pinned: false },
    { id: "n5", title: "API Rate Strategy", proj: "AI SaaS Platform", content: "Tier limits: Free 100/day, Pro 10K/day...", proposed: 0, pinned: false },
  ];
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-lg font-semibold" style={{ color: C.tx }}>Notes</h2>
          <p className="text-sm mt-1" style={{ color: C.txM }}>Quick ideas. Convert to tasks when ready.</p></div>
        <div className="flex items-center gap-2">
          <button onClick={() => setCondenseMode(!condenseMode)} className="px-3 py-2 rounded-lg text-sm border flex items-center gap-2 hover:bg-white/5"
            style={{ borderColor: condenseMode ? C.ac : C.bd, color: condenseMode ? C.ac : C.txM }}>
            <Shrink size={14} /> Condense Notes
          </button>
          <button className="px-4 py-2 rounded-lg text-sm bg-indigo-600 text-white flex items-center gap-2"><Plus size={16} /> New Note</button>
        </div>
      </div>
      {condenseMode && <div className="mb-6 p-4 rounded-xl border" style={{ backgroundColor: `${C.ac}10`, borderColor: `${C.ac}40` }}>
        <h3 className="text-sm font-semibold mb-2" style={{ color: C.ac }}>Condense Notes</h3>
        <p className="text-xs mb-3" style={{ color: C.txM }}>AI will group your notes by theme. Pinned notes won't be affected.</p>
        <div className="flex items-center gap-3 mb-3">
          <Lbl>Worker for summarization:</Lbl>
          <select className="px-2 py-1 rounded text-xs border" style={{ backgroundColor: C.bgC, borderColor: C.bd, color: C.tx }}>
            {WORKERS.map(w => <option key={w.id}>{w.name}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded-lg text-sm bg-indigo-600 text-white flex items-center gap-1"><Sparkles size={14} /> Preview Grouping</button>
          <span className="text-xs" style={{ color: C.txD }}>You'll review before confirming. Revert anytime.</span>
        </div>
      </div>}
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
        {notes.map(n => (
          <div key={n.id} className="p-4 rounded-xl border hover:border-indigo-500/30 cursor-pointer" style={{ backgroundColor: C.bgC, borderColor: C.bd }}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {n.pinned && <Pin size={12} className="text-yellow-500" />}
                <h3 className="text-sm font-semibold" style={{ color: C.tx }}>{n.title}</h3>
              </div>
              <div className="flex items-center gap-1">
                {!n.pinned && <button className="p-1 rounded hover:bg-white/10" title="Pin (exclude from condense)"><Pin size={12} style={{ color: C.txD }} /></button>}
                <button className="p-1 rounded hover:bg-white/10"><MoreHorizontal size={14} style={{ color: C.txD }} /></button>
              </div>
            </div>
            <Bd color="#6366f1" s>{n.proj}</Bd>
            <p className="text-sm mt-2 line-clamp-2" style={{ color: C.txM }}>{n.content}</p>
            <div className="mt-3 pt-3 border-t flex items-center gap-2" style={{ borderColor: C.bd }}>
              {n.proposed > 0 ? <Bd color="#22c55e" bg="#052e16" s>{n.proposed} tasks proposed</Bd> :
                <button className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 border hover:border-indigo-500/50" style={{ borderColor: C.bd, color: C.acH }}>
                  <Sparkles size={12} /> Propose Tasks</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============ BRIEFINGS (with cross-project) ============
const BriefingsView = () => {
  const [period, setPeriod] = useState("24h");
  const [scope, setScope] = useState("all");
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-lg font-semibold" style={{ color: C.tx }}>Briefings</h2>
          <p className="text-sm mt-1" style={{ color: C.txM }}>AI-generated summaries and recommendations</p></div>
        <div className="flex items-center gap-2">
          {["all", "p1", "p2", "p3"].map(s => (
            <button key={s} onClick={() => setScope(s)} className="px-3 py-1.5 rounded-lg text-xs border"
              style={{ borderColor: scope === s ? C.ac : C.bd, backgroundColor: scope === s ? `${C.ac}20` : "transparent", color: scope === s ? C.ac : C.txM }}>
              {s === "all" ? "All Projects" : PROJECTS.find(p => p.id === s)?.name}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 mb-4">
        {["24h", "7d", "30d", "Custom"].map(p => (
          <button key={p} onClick={() => setPeriod(p)} className="px-3 py-1.5 rounded-lg text-xs border"
            style={{ borderColor: period === p ? C.ac : C.bd, backgroundColor: period === p ? `${C.ac}20` : "transparent", color: period === p ? C.ac : C.txM }}>{p}</button>
        ))}
        <button className="px-4 py-1.5 rounded-lg text-xs bg-indigo-600 text-white flex items-center gap-1 ml-auto"><Sparkles size={12} /> Generate</button>
      </div>
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: C.bd }}>
        <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: C.bd, backgroundColor: C.bgC }}>
          <Av type="claude-cli" size={28} role="orchestrator" />
          <div><span className="text-sm font-medium" style={{ color: C.tx }}>{scope === "all" ? "Cross-Project Briefing" : "Project Briefing"} — Last 24h</span>
            <span className="text-xs ml-2" style={{ color: C.txD }}>30 min ago</span></div>
        </div>
        <div className="p-6 space-y-6" style={{ backgroundColor: C.bg }}>
          <div className="grid grid-cols-4 gap-4">
            {[{ l: "Completed", v: "5", c: "#22c55e" }, { l: "Running", v: "3", c: "#3b82f6" }, { l: "Blocked", v: "1", c: "#f97316" }, { l: "Failed", v: "0", c: "#ef4444" }].map(s => (
              <div key={s.l} className="p-3 rounded-lg" style={{ backgroundColor: C.bgC }}>
                <span className="text-[10px] block" style={{ color: C.txD }}>{s.l}</span>
                <span className="text-2xl font-bold" style={{ color: s.c }}>{s.v}</span>
              </div>
            ))}
          </div>
          {scope === "all" && <div className="p-4 rounded-lg" style={{ backgroundColor: C.bgC }}>
            <h3 className="text-sm font-semibold mb-2" style={{ color: C.tx }}>Per-Project Summary</h3>
            {PROJECTS.map(p => { const pct = Math.round((p.done / p.total) * 100);
              return (<div key={p.id} className="flex items-center gap-3 p-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: p.color }} />
                <span className="text-sm w-40" style={{ color: C.tx }}>{p.name}</span>
                <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: C.bg }}><div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: p.color }} /></div>
                <span className="text-xs" style={{ color: C.txM }}>{pct}%</span>
              </div>);
            })}
          </div>}
          <div className="p-4 rounded-lg" style={{ backgroundColor: C.bgC }}>
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: C.ac }}><Sparkles size={16} /> Recommendations</h3>
            {["Unblock API docs task — provide test API key", "Start Stripe integration — dependencies met", "Schedule security audit — auth module near completion"].map((r, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded mb-1" style={{ backgroundColor: C.bg }}>
                <span className="text-sm" style={{ color: C.tx }}>{r}</span>
                <button className="px-2 py-1 rounded text-[10px] bg-indigo-600 text-white flex-shrink-0 ml-2">Create Task</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ STORAGE ============
const StorageView = () => {
  const [view, setView] = useState("tree");
  const files = [
    { name: "auth-schema-v2.md", type: "md", project: "AI SaaS Platform", worker: "Claude Opus", task: "Design database schema", size: "12 KB", date: "2h ago", tags: ["backend", "schema"] },
    { name: "competitor-analysis.md", type: "md", project: "AI SaaS Platform", worker: "Gemini Research", task: "Research competitor pricing", size: "45 KB", date: "4h ago", tags: ["research"] },
    { name: "security-report-draft.md", type: "md", project: "AI SaaS Platform", worker: "Kimi Analyzer", task: "Security audit", size: "28 KB", date: "1h ago", tags: ["security", "audit"] },
    { name: "email-templates.html", type: "html", project: "Marketing Automation", worker: "Claude Opus", task: "Email template system", size: "8 KB", date: "30m ago", tags: ["frontend"] },
    { name: "market-data-summary.json", type: "json", project: "Marketing Automation", worker: "Gemini Research", task: "Analyze market data", size: "156 KB", date: "1d ago", tags: ["data"] },
  ];
  const collections = [
    { name: "Recent Outputs", count: 8, icon: Clock, color: "#3b82f6" },
    { name: "Needs Review", count: 3, icon: Eye, color: "#a855f7" },
    { name: "Approved", count: 12, icon: CheckCircle2, color: "#22c55e" },
    { name: "Attached to Tasks", count: 15, icon: Paperclip, color: "#f59e0b" },
  ];
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-lg font-semibold" style={{ color: C.tx }}>Storage</h2>
          <p className="text-sm mt-1" style={{ color: C.txM }}>Agent outputs, documents, and deliverables</p></div>
        <div className="flex items-center gap-2">
          {["tree", "list", "tags"].map(v => (
            <button key={v} onClick={() => setView(v)} className="px-3 py-1.5 rounded-lg text-xs border capitalize"
              style={{ borderColor: view === v ? C.ac : C.bd, backgroundColor: view === v ? `${C.ac}20` : "transparent", color: view === v ? C.ac : C.txM }}>{v}</button>
          ))}
          <button className="px-4 py-2 rounded-lg text-sm bg-indigo-600 text-white flex items-center gap-2"><Upload size={14} /> Upload</button>
        </div>
      </div>
      {/* Smart Collections */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {collections.map(c => { const I = c.icon;
          return (<div key={c.name} className="p-3 rounded-xl border cursor-pointer hover:border-indigo-500/30" style={{ backgroundColor: C.bgC, borderColor: C.bd }}>
            <div className="flex items-center gap-2 mb-1"><I size={14} style={{ color: c.color }} /><span className="text-sm font-medium" style={{ color: C.tx }}>{c.name}</span></div>
            <span className="text-xs" style={{ color: C.txM }}>{c.count} files</span>
          </div>);
        })}
      </div>
      {/* Tree View */}
      {view === "tree" && <div className="rounded-xl border overflow-hidden" style={{ borderColor: C.bd }}>
        {PROJECTS.map(p => (
          <div key={p.id}>
            <div className="flex items-center gap-2 p-3 border-b" style={{ borderColor: C.bd, backgroundColor: C.bgC }}>
              <FolderOpen size={16} style={{ color: p.color }} />
              <span className="text-sm font-semibold" style={{ color: C.tx }}>{p.name}</span>
              <span className="text-xs ml-auto" style={{ color: C.txM }}>{files.filter(f => f.project === p.name).length} files</span>
            </div>
            {files.filter(f => f.project === p.name).map(f => (
              <div key={f.name} className="flex items-center gap-3 px-6 py-2 border-b hover:bg-white/5" style={{ borderColor: C.bd }}>
                <File size={14} style={{ color: C.txD }} />
                <span className="text-sm flex-1" style={{ color: C.tx }}>{f.name}</span>
                <Av type={WORKERS.find(w => w.name === f.worker)?.type || "claude-cli"} size={18} role="worker" />
                <span className="text-xs w-20" style={{ color: C.txM }}>{f.size}</span>
                <span className="text-xs w-16" style={{ color: C.txD }}>{f.date}</span>
                <div className="flex gap-1">{f.tags.map(t => <span key={t} className="px-1 py-0.5 rounded text-[9px]" style={{ backgroundColor: `${C.ac}20`, color: C.acH }}>{t}</span>)}</div>
                <button className="p-1 rounded hover:bg-white/10"><Download size={12} style={{ color: C.txD }} /></button>
              </div>
            ))}
          </div>
        ))}
      </div>}
      <div className="mt-4 p-3 rounded-lg flex items-center gap-3" style={{ backgroundColor: C.bgC }}>
        <HardDrive size={16} style={{ color: C.txD }} />
        <span className="text-xs" style={{ color: C.txM }}>Storage used: <strong style={{ color: C.tx }}>249 KB</strong> of 1 GB (Free tier)</span>
        <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: C.bg }}><div className="h-full rounded-full bg-indigo-500" style={{ width: "0.02%" }} /></div>
      </div>
    </div>
  );
};

// ============ SETTINGS ============
const SettingsView = () => {
  const [tab, setTab] = useState("profile");
  const tabs = [
    { id: "profile", l: "Profile", i: User },
    { id: "api", l: "API Keys & Providers", i: Key },
    { id: "system", l: "System Files", i: FileText },
    { id: "notif", l: "Notifications", i: Bell },
    { id: "usage", l: "Usage & Billing", i: TrendingUp },
    { id: "defaults", l: "Agent Defaults", i: Bot },
  ];
  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="w-56 border-r p-4" style={{ borderColor: C.bd, backgroundColor: C.bgS }}>
        {tabs.map(t => { const I = t.i;
          return (<button key={t.id} onClick={() => setTab(t.id)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm mb-1"
            style={{ color: tab === t.id ? C.ac : C.txM, backgroundColor: tab === t.id ? `${C.ac}15` : "transparent" }}>
            <I size={16} />{t.l}</button>);
        })}
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {tab === "profile" && <div className="max-w-xl space-y-4">
          <h2 className="text-lg font-semibold" style={{ color: C.tx }}>Profile</h2>
          <div><Lbl>Name</Lbl><Inp placeholder="Michael" /></div>
          <div><Lbl>Email</Lbl><Inp placeholder="michael@example.com" /></div>
          <div><Lbl>Timezone</Lbl><Sel><option>Europe/Bratislava (UTC+1)</option><option>UTC</option></Sel></div>
          <button className="px-4 py-2 rounded-lg text-sm bg-indigo-600 text-white">Save</button>
        </div>}
        {tab === "api" && <div className="max-w-xl space-y-4">
          <h2 className="text-lg font-semibold" style={{ color: C.tx }}>API Keys & Providers</h2>
          <p className="text-sm" style={{ color: C.txM }}>Manage LLM provider credentials. Keys are encrypted at rest.</p>
          {[{ n: "Anthropic (Claude)", k: "sk-ant-***...3f2k", s: "active" }, { n: "Google (Gemini)", k: "AIza***...9xQ", s: "active" }, { n: "OpenAI (ChatGPT)", k: "sk-proj-***...mN4", s: "active" }, { n: "Moonshot (Kimi)", k: "", s: "not set" }].map(p => (
            <div key={p.n} className="p-4 rounded-xl border" style={{ backgroundColor: C.bgC, borderColor: C.bd }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: C.tx }}>{p.n}</span>
                <Bd color={p.s === "active" ? "#22c55e" : "#71717a"} s>{p.s}</Bd>
              </div>
              <div className="flex items-center gap-2">
                <input type="password" value={p.k} readOnly className="flex-1 px-3 py-1.5 rounded-lg text-sm border outline-none" style={{ backgroundColor: C.bg, borderColor: C.bd, color: C.txM }} placeholder="Enter API key..." />
                <button className="px-3 py-1.5 rounded-lg text-xs border hover:bg-white/5" style={{ borderColor: C.bd, color: C.txM }}>{p.k ? "Rotate" : "Add"}</button>
              </div>
            </div>
          ))}
        </div>}
        {tab === "system" && <div className="max-w-2xl space-y-4">
          <h2 className="text-lg font-semibold" style={{ color: C.tx }}>System Files</h2>
          <p className="text-sm" style={{ color: C.txM }}>Edit memory.md and agent configs directly. Changes sync to workers.</p>
          {["memory.md", "system-prompt.md", "agent-config.yaml"].map(f => (
            <div key={f} className="rounded-xl border overflow-hidden" style={{ borderColor: C.bd }}>
              <div className="flex items-center justify-between p-3 border-b" style={{ borderColor: C.bd, backgroundColor: C.bgC }}>
                <div className="flex items-center gap-2"><FileText size={14} style={{ color: C.ac }} /><span className="text-sm font-medium" style={{ color: C.tx }}>{f}</span></div>
                <button className="px-3 py-1 rounded text-xs bg-indigo-600 text-white">Save</button>
              </div>
              <div className="p-4" style={{ backgroundColor: C.bg }}>
                <textarea className="w-full font-mono text-xs bg-transparent outline-none resize-none" rows={4} style={{ color: C.tx }}
                  defaultValue={f === "memory.md" ? "# Project Context\n\n## AI SaaS Platform\n- Tech stack: Next.js, Supabase, Tailwind\n- Goal: AI-first project management" : f === "system-prompt.md" ? "You are an AI orchestrator managing tasks across multiple workers..." : "orchestrator:\n  model: claude-opus-4\n  thinking: deep\n  max_tokens: 8192"} />
              </div>
            </div>
          ))}
        </div>}
        {tab === "notif" && <div className="max-w-xl space-y-4">
          <h2 className="text-lg font-semibold" style={{ color: C.tx }}>Notifications</h2>
          {[{ l: "Task completed", d: "When any agent completes a task", on: true }, { l: "Agent blocked", d: "When agent needs human input", on: true },
          { l: "Review ready", d: "Task moved to review stage", on: true }, { l: "Daily briefing", d: "Automated summary every morning", on: false },
          { l: "Rate limit hit", d: "When agent hits API rate limit", on: true }, { l: "Master plan stage complete", d: "Phase transition in master plans", on: true }].map(n => (
            <div key={n.l} className="flex items-center justify-between p-4 rounded-xl border" style={{ backgroundColor: C.bgC, borderColor: C.bd }}>
              <div><span className="text-sm font-medium" style={{ color: C.tx }}>{n.l}</span><p className="text-xs mt-0.5" style={{ color: C.txD }}>{n.d}</p></div>
              <div className="w-10 h-5 rounded-full cursor-pointer flex items-center px-0.5" style={{ backgroundColor: n.on ? "#22c55e" : C.bd }}>
                <div className="w-4 h-4 rounded-full bg-white transition-transform" style={{ transform: n.on ? "translateX(20px)" : "translateX(0)" }} />
              </div>
            </div>
          ))}
        </div>}
        {tab === "usage" && <div className="max-w-xl space-y-4">
          <h2 className="text-lg font-semibold" style={{ color: C.tx }}>Usage & Billing</h2>
          <div className="p-4 rounded-xl border" style={{ backgroundColor: C.bgC, borderColor: C.bd }}>
            <div className="flex items-center justify-between mb-3"><span className="text-sm font-medium" style={{ color: C.tx }}>Current Plan</span><Bd color="#22c55e" bg="#052e16">Free Tier</Bd></div>
            <p className="text-xs mb-3" style={{ color: C.txM }}>1 project, 2 workers, 1 GB storage</p>
            <button className="px-4 py-2 rounded-lg text-sm bg-indigo-600 text-white">Upgrade to Pro</button>
          </div>
          <div className="p-4 rounded-xl border" style={{ backgroundColor: C.bgC, borderColor: C.bd }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: C.tx }}>Token Usage (This Month)</h3>
            <div className="space-y-2">
              {[{ n: "Claude Opus", used: "1.2M", cost: "$18.00", pct: 60 }, { n: "Gemini Pro", used: "800K", cost: "$4.00", pct: 40 }, { n: "GPT-4o", used: "200K", cost: "$2.00", pct: 10 }].map(u => (
                <div key={u.n} className="flex items-center gap-3">
                  <span className="text-xs w-28" style={{ color: C.txM }}>{u.n}</span>
                  <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: C.bg }}><div className="h-full rounded-full bg-indigo-500" style={{ width: `${u.pct}%` }} /></div>
                  <span className="text-xs w-16 text-right" style={{ color: C.tx }}>{u.used}</span>
                  <span className="text-xs w-16 text-right font-medium" style={{ color: "#22c55e" }}>{u.cost}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t flex justify-between" style={{ borderColor: C.bd }}>
              <span className="text-sm font-medium" style={{ color: C.tx }}>Total</span>
              <span className="text-sm font-bold" style={{ color: "#22c55e" }}>$24.00</span>
            </div>
          </div>
          <div className="p-4 rounded-xl border" style={{ backgroundColor: C.bgC, borderColor: C.bd }}>
            <h3 className="text-sm font-semibold mb-2" style={{ color: C.tx }}>Monthly Budget</h3>
            <div className="flex items-center gap-3"><Inp placeholder="50.00" /><span className="text-sm" style={{ color: C.txM }}>USD/month</span></div>
            <p className="text-xs mt-2" style={{ color: C.txD }}>Workers pause when 90% is reached. You get notified at 75%.</p>
          </div>
        </div>}
        {tab === "defaults" && <div className="max-w-xl space-y-4">
          <h2 className="text-lg font-semibold" style={{ color: C.tx }}>Agent Defaults</h2>
          <div><Lbl>Default Thinking Level</Lbl><Sel><option>Standard</option><option>Deep</option><option>Minimal</option></Sel></div>
          <div><Lbl>Max Tokens per Task</Lbl><Inp placeholder="8192" /></div>
          <div><Lbl>Max Concurrent Tasks per Worker</Lbl><Inp placeholder="3" /></div>
          <div><Lbl>Default Review Mode</Lbl><Sel><option>Human Review</option><option>AI Review</option><option>Hybrid</option></Sel></div>
          <div><Lbl>On Rate Limit</Lbl><Sel><option>Pause and notify</option><option>Retry with backoff</option><option>Switch to backup model</option></Sel></div>
          <button className="px-4 py-2 rounded-lg text-sm bg-indigo-600 text-white">Save Defaults</button>
        </div>}
      </div>
    </div>
  );
};

// ============ MAIN APP ============
export default function App() {
  const [view, setView] = useState("dashboard");
  const [proj, setProj] = useState("p1");
  const [col, setCol] = useState(false);
  const [task, setTask] = useState(null);

  const renderView = () => {
    switch (view) {
      case "dashboard": return <DashboardView proj={proj} />;
      case "tasks": return <TasksView proj={proj} onTask={setTask} />;
      case "workers": return <WorkersView />;
      case "chat": return <ChatView />;
      case "planner": return <PlannerView />;
      case "notes": return <NotesView />;
      case "briefings": return <BriefingsView />;
      case "storage": return <StorageView />;
      case "settings": return <SettingsView />;
      default: return <DashboardView proj={proj} />;
    }
  };

  return (
    <div className="h-screen flex overflow-hidden" style={{ backgroundColor: C.bg, color: C.tx, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Sidebar view={view} setView={setView} proj={proj} setProj={setProj} col={col} setCol={setCol} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar proj={proj} view={view} />
        {renderView()}
      </div>
      {task && <TaskModal task={task} onClose={() => setTask(null)} />}
    </div>
  );
}
