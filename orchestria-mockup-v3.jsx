import { useState } from "react";
import {
  LayoutDashboard, ListTodo, Bot, MessageSquare, FileText, Settings,
  ChevronDown, ChevronRight, Plus, Search, Bell, MoreHorizontal, Clock,
  CheckCircle2, XCircle, AlertTriangle, Play, Pause, Eye, Lock,
  ArrowRight, Archive, Filter, Zap, Brain, Send, Paperclip,
  ChevronLeft, Calendar, BarChart3, RefreshCw, Sparkles, Shield,
  Layers, Target, Workflow, X, Check, Edit3, GripVertical, User, Hash,
  File, Key, Database, Repeat, Pin, Shrink, HardDrive, Activity,
  TrendingUp, Upload, Download, FolderOpen, Puzzle, Link, Trash2,
  Save, RotateCcw, Cpu, Mail, Smartphone, Code, Globe, DollarSign,
  Timer, GitBranch, Maximize2, Minimize2, Move, MoreVertical
} from "lucide-react";

// ============ THEME ============
const C = { bg: "#0f1117", bgC: "#1a1d27", bgH: "#222633", bgS: "#141720", bd: "#2a2d3a", tx: "#e4e4e7", txM: "#71717a", txD: "#52525b", ac: "#6366f1", acH: "#818cf8", acD: "#4f46e5" };
const ST = { draft:{l:"Draft",c:"#71717a",bg:"#27272a",i:Edit3}, pending:{l:"Pending",c:"#f59e0b",bg:"#422006",i:Clock}, approved:{l:"Approved",c:"#3b82f6",bg:"#172554",i:Check}, running:{l:"Running",c:"#22c55e",bg:"#052e16",i:Play}, awaiting_input:{l:"Awaiting Input",c:"#f97316",bg:"#431407",i:AlertTriangle}, review:{l:"Review",c:"#a855f7",bg:"#3b0764",i:Eye}, completed:{l:"Completed",c:"#10b981",bg:"#022c22",i:CheckCircle2}, failed:{l:"Failed",c:"#ef4444",bg:"#450a0a",i:XCircle}, throttled:{l:"Throttled",c:"#eab308",bg:"#422006",i:Pause} };
const PRI = { urgent:{l:"Urgent",c:"#ef4444",ic:"🔴"}, high:{l:"High",c:"#f97316",ic:"🟠"}, medium:{l:"Medium",c:"#eab308",ic:"🟡"}, low:{l:"Low",c:"#22c55e",ic:"🟢"} };
const WT = { "claude-cli":{n:"Claude",c:"#d4a574",a:"C"}, "gemini-cli":{n:"Gemini",c:"#4285f4",a:"G"}, "chatgpt-cli":{n:"ChatGPT",c:"#10a37f",a:"O"}, "kimi-cli":{n:"Kimi",c:"#ff6b6b",a:"K"}, "human":{n:"Human",c:"#8b5cf6",a:"H"} };

// ============ DATA ============
const PROJECTS = [
  { id:"p1", name:"AI SaaS Platform", color:"#6366f1", total:24, done:8 },
  { id:"p2", name:"Marketing Automation", color:"#ec4899", total:12, done:3 },
  { id:"p3", name:"Data Pipeline v2", color:"#14b8a6", total:18, done:15 },
];
const WORKERS = [
  { id:"w1", name:"Claude Opus", type:"claude-cli", role:"both", status:"online", active:3, done:47, model:"claude-opus-4", think:"deep", isHuman:false },
  { id:"w2", name:"Gemini Research", type:"gemini-cli", role:"worker", status:"online", active:1, done:23, model:"gemini-2.5-pro", think:"standard", isHuman:false },
  { id:"w3", name:"ChatGPT Writer", type:"chatgpt-cli", role:"worker", status:"offline", active:0, done:15, model:"gpt-4o", think:"standard", isHuman:false },
  { id:"w4", name:"Kimi Analyzer", type:"kimi-cli", role:"worker", status:"busy", active:2, done:31, model:"kimi-k2", think:"deep", isHuman:false },
  { id:"w5", name:"Michael", type:"human", role:"worker", status:"online", active:1, done:12, model:null, think:null, isHuman:true, skills:["code-review","stakeholder","devops"], email:"michael@example.com", contact:"in-app" },
];
const TASKS = [
  { id:"t1", title:"Design database schema for user auth", s:"completed", p:"high", w:"w1", pr:"p1", sub:3, subD:3, lock:false, tags:["backend","db"] },
  { id:"t2", title:"Research competitor pricing models", s:"running", p:"medium", w:"w2", pr:"p1", sub:5, subD:2, lock:false, tags:["research"] },
  { id:"t3", title:"Write API documentation", s:"awaiting_input", p:"medium", w:"w3", pr:"p1", sub:0, subD:0, lock:false, tags:["docs"], block:"Need API key for testing endpoint authentication" },
  { id:"t4", title:"Implement Kanban drag-and-drop", s:"review", p:"high", w:"w1", pr:"p1", sub:4, subD:4, lock:false, tags:["frontend"] },
  { id:"t5", title:"Set up CI/CD pipeline", s:"pending", p:"urgent", w:"w4", pr:"p1", sub:6, subD:0, lock:false, tags:["devops"] },
  { id:"t6", title:"Create landing page copy", s:"draft", p:"low", w:null, pr:"p1", sub:0, subD:0, lock:false, tags:["marketing"] },
  { id:"t7", title:"Optimize database queries", s:"approved", p:"high", w:"w1", pr:"p1", sub:3, subD:0, lock:true, tags:["backend","perf"] },
  { id:"t8", title:"Security audit - auth flow", s:"running", p:"urgent", w:"w4", pr:"p1", sub:8, subD:3, lock:false, tags:["security"] },
  { id:"t9", title:"Approve infrastructure budget", s:"awaiting_input", p:"high", w:"w5", pr:"p1", sub:0, subD:0, lock:false, tags:["ops"], block:"Waiting for Michael to approve AWS spend increase" },
  { id:"t10", title:"User onboarding flow design", s:"throttled", p:"medium", w:"w2", pr:"p1", sub:2, subD:1, lock:false, tags:["ux"] },
];
const CHATS = [
  { id:"m1", role:"user", content:"Can you break down the authentication module into subtasks?", time:"10:23 AM" },
  { id:"m2", role:"bot", content:"I'll decompose the auth module:\n\n1. **DB schema** — User table, sessions (Claude)\n2. **JWT** — Token generation, validation (Claude)\n3. **OAuth** — Google, GitHub (Gemini)\n4. **Password hashing** — bcrypt (ChatGPT)\n5. **Rate limiting** — Login throttling (Kimi)\n\nCreate these as tasks?", time:"10:23 AM" },
  { id:"m3", role:"user", content:"Yes, but assign OAuth to Claude. Also add 2FA.", time:"10:25 AM" },
  { id:"m4", role:"bot", content:"Done! Created 6 subtasks under 'Auth Module'. All in Draft.\n\nSet up dependencies? JWT should finish before OAuth and 2FA.", time:"10:25 AM" },
];

// ============ UTILS ============
const Bd = ({children,color,bg,s}) => <span className={`inline-flex items-center gap-1 rounded-full font-medium ${s?'px-1.5 py-0.5 text-[10px]':'px-2 py-0.5 text-xs'}`} style={{color,backgroundColor:bg||`${color}20`}}>{children}</span>;
const Av = ({type,size=28,role}) => { const c=WT[type]||{n:"?",c:"#666",a:"?"}; return (<div className="rounded-full flex items-center justify-center font-bold text-white relative flex-shrink-0" style={{width:size,height:size,backgroundColor:c.c,fontSize:size*0.4}}>{c.a}{(role==="orchestrator"||role==="both")&&<div className="absolute -bottom-0.5 -right-0.5 bg-yellow-500 rounded-full flex items-center justify-center" style={{width:size*0.45,height:size*0.45}}><Brain size={size*0.3} className="text-black"/></div>}</div>);};
const Dot = ({s}) => <span className="inline-block rounded-full" style={{width:8,height:8,backgroundColor:s==="online"?"#22c55e":s==="busy"?"#f59e0b":"#71717a"}}/>;
const Inp = ({...p}) => <input {...p} className="w-full px-3 py-2 rounded-lg text-sm border outline-none" style={{backgroundColor:C.bgC,borderColor:C.bd,color:C.tx}}/>;
const Sel = ({children,...p}) => <select {...p} className="w-full px-3 py-2 rounded-lg text-sm border outline-none" style={{backgroundColor:C.bgC,borderColor:C.bd,color:C.tx}}>{children}</select>;
const Lbl = ({children}) => <span className="text-xs block mb-1" style={{color:C.txD}}>{children}</span>;
const Btn = ({children,primary,...p}) => <button {...p} className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${primary?'bg-indigo-600 text-white hover:bg-indigo-700':'border hover:bg-white/5'}`} style={primary?{}:{borderColor:C.bd,color:C.txM}}>{children}</button>;

// ============ SIDEBAR ============
const Sidebar = ({view,setView,proj,setProj,col,setCol}) => {
  const [exp,setExp]=useState(true);
  const nav=[{id:"dashboard",l:"Dashboard",ic:LayoutDashboard},{id:"tasks",l:"My Tasks",ic:ListTodo},{id:"workers",l:"Workers",ic:Bot},{id:"chat",l:"Chat",ic:MessageSquare},{id:"planner",l:"Master Planner",ic:Workflow},{id:"notes",l:"Notes",ic:FileText},{id:"briefings",l:"Briefings",ic:BarChart3},{id:"storage",l:"Storage",ic:HardDrive},{id:"settings",l:"Settings",ic:Settings}];
  return (
    <div className="h-full flex flex-col border-r" style={{width:col?60:240,backgroundColor:C.bgS,borderColor:C.bd,transition:"width 0.2s"}}>
      <div className="flex items-center gap-2 px-4 py-4 border-b" style={{borderColor:C.bd}}>
        {!col&&<><div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center"><Zap size={18} className="text-white"/></div><span className="font-bold text-lg" style={{color:C.tx}}>Orchestria</span></>}
        <button onClick={()=>setCol(!col)} className="ml-auto p-1 rounded hover:bg-white/5" style={{color:C.txM}}>{col?<ChevronRight size={16}/>:<ChevronLeft size={16}/>}</button>
      </div>
      <nav className="flex-1 py-2 overflow-y-auto">
        {nav.map(n=>{const I=n.ic;const a=view===n.id;return(<button key={n.id} onClick={()=>setView(n.id)} className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${col?'justify-center':''}`} title={col?n.l:undefined} style={{color:a?C.ac:C.txM,backgroundColor:a?`${C.ac}15`:"transparent",borderRight:a?`2px solid ${C.ac}`:"2px solid transparent"}}><I size={18}/>{!col&&<span>{n.l}</span>}</button>);})}
        {!col&&<div className="mt-4 px-4">
          <button onClick={()=>setExp(!exp)} className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider mb-2" style={{color:C.txD}}>{exp?<ChevronDown size={12}/>:<ChevronRight size={12}/>} Projects</button>
          {exp&&PROJECTS.map(p=>(<button key={p.id} onClick={()=>{setProj(p.id);setView("dashboard");}} className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md mb-0.5" style={{color:proj===p.id?C.tx:C.txM,backgroundColor:proj===p.id?C.bgH:"transparent"}}><div className="w-3 h-3 rounded-sm flex-shrink-0" style={{backgroundColor:p.color}}/><span className="truncate">{p.name}</span><span className="ml-auto text-[10px]" style={{color:C.txD}}>{p.done}/{p.total}</span></button>))}
          <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md mt-1 hover:bg-white/5" style={{color:C.txD}}><Plus size={14}/> New Project</button>
        </div>}
      </nav>
    </div>
  );
};

const TopBar = ({proj,view}) => {
  const p=PROJECTS.find(x=>x.id===proj);
  const labels={dashboard:"Dashboard",tasks:"My Tasks",workers:"Workers",chat:"Orchestrator Chat",planner:"Master Planner",notes:"Notes",briefings:"Briefings",storage:"Storage",settings:"Settings"};
  return (
    <div className="h-14 flex items-center justify-between px-6 border-b" style={{backgroundColor:C.bg,borderColor:C.bd}}>
      <div className="flex items-center gap-3">
        {p&&<><div className="w-4 h-4 rounded" style={{backgroundColor:p.color}}/><span className="text-sm font-medium" style={{color:C.tx}}>{p.name}</span><ChevronRight size={14} style={{color:C.txD}}/></>}
        <span className="text-sm font-semibold" style={{color:C.tx}}>{labels[view]}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative"><Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{color:C.txD}}/><input placeholder="Search... (⌘K)" className="pl-8 pr-3 py-1.5 rounded-lg text-sm border outline-none" style={{backgroundColor:C.bgC,borderColor:C.bd,color:C.tx,width:220}}/></div>
        <button className="relative p-2 rounded-lg hover:bg-white/5" style={{color:C.txM}}><Bell size={18}/><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"/></button>
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">M</div>
      </div>
    </div>
  );
};

// ============ MODULAR DASHBOARD ============
const WIDGET_CATALOG = [
  { id:"total-tasks", cat:"Stats", name:"Total Tasks", desc:"Task counts by status", icon:ListTodo, default:true },
  { id:"worker-hours", cat:"Stats", name:"Worker Hours Today", desc:"Time spent per worker today", icon:Timer, default:false },
  { id:"token-usage", cat:"Stats", name:"Token Usage", desc:"Tokens consumed today/week/month", icon:Cpu, default:false },
  { id:"cost-tracker", cat:"Stats", name:"Cost Tracker", desc:"API costs breakdown", icon:DollarSign, default:false },
  { id:"success-rate", cat:"Stats", name:"Success Rate", desc:"% tasks completed per worker", icon:TrendingUp, default:false },
  { id:"task-trend", cat:"Stats", name:"Completion Trend", desc:"Tasks completed over 7/30 days", icon:BarChart3, default:false },
  { id:"project-health", cat:"Overview", name:"Project Health", desc:"Progress bars per project", icon:Activity, default:true },
  { id:"worker-activity", cat:"Overview", name:"Worker Activity", desc:"Who is doing what right now", icon:Bot, default:true },
  { id:"needs-attention", cat:"Overview", name:"Needs Attention", desc:"Blocked and review tasks", icon:AlertTriangle, default:true },
  { id:"recent-activity", cat:"Overview", name:"Recent Activity", desc:"Timeline of events", icon:Clock, default:true },
  { id:"scheduled", cat:"Overview", name:"Upcoming Scheduled", desc:"Tasks scheduled for today/week", icon:Calendar, default:false },
  { id:"master-progress", cat:"Overview", name:"Master Plan Progress", desc:"Active master plan status", icon:Workflow, default:false },
  { id:"quick-task", cat:"Actions", name:"Quick Task", desc:"Create task inline", icon:Plus, default:false },
  { id:"quick-note", cat:"Actions", name:"Quick Note", desc:"Jot down a note fast", icon:Edit3, default:false },
  { id:"chat-preview", cat:"Actions", name:"Chat Preview", desc:"Last orchestrator message", icon:MessageSquare, default:false },
  { id:"briefing-summary", cat:"Actions", name:"Briefing Summary", desc:"Latest briefing excerpt", icon:Sparkles, default:false },
  { id:"custom-code", cat:"Custom", name:"Custom Metric", desc:"Write JS to compute custom metrics", icon:Code, default:false },
];

const WidgetContent = ({id}) => {
  if(id==="total-tasks") return (<div className="grid grid-cols-3 gap-2">{[{l:"Running",v:TASKS.filter(t=>t.s==="running").length,c:"#22c55e"},{l:"Blocked",v:TASKS.filter(t=>t.s==="awaiting_input").length,c:"#f97316"},{l:"Review",v:TASKS.filter(t=>t.s==="review").length,c:"#a855f7"},{l:"Completed",v:TASKS.filter(t=>t.s==="completed").length,c:"#10b981"},{l:"Pending",v:TASKS.filter(t=>t.s==="pending").length,c:"#f59e0b"},{l:"Draft",v:TASKS.filter(t=>t.s==="draft").length,c:"#71717a"}].map(s=><div key={s.l} className="p-2 rounded" style={{backgroundColor:C.bg}}><span className="text-[10px] block" style={{color:C.txD}}>{s.l}</span><span className="text-xl font-bold" style={{color:s.c}}>{s.v}</span></div>)}</div>);
  if(id==="worker-hours") return (<div className="space-y-2">{WORKERS.map(w=><div key={w.id} className="flex items-center gap-2"><Av type={w.type} size={20} role={w.role}/><span className="text-xs w-24 truncate" style={{color:C.tx}}>{w.name}</span><div className="flex-1 h-3 rounded-full overflow-hidden" style={{backgroundColor:C.bg}}><div className="h-full rounded-full" style={{width:`${Math.random()*80+10}%`,backgroundColor:WT[w.type]?.c||"#666"}}/></div><span className="text-xs w-10 text-right" style={{color:C.txM}}>{(Math.random()*6+0.5).toFixed(1)}h</span></div>)}</div>);
  if(id==="token-usage") return (<div className="space-y-2">{[{n:"Claude",v:"1.2M",c:"$18.00"},{n:"Gemini",v:"800K",c:"$4.00"},{n:"GPT-4o",v:"200K",c:"$2.00"}].map(u=><div key={u.n} className="flex items-center justify-between p-2 rounded" style={{backgroundColor:C.bg}}><span className="text-xs" style={{color:C.txM}}>{u.n}</span><span className="text-xs font-medium" style={{color:C.tx}}>{u.v} tokens</span><span className="text-xs font-bold" style={{color:"#22c55e"}}>{u.c}</span></div>)}<div className="flex justify-between pt-2 border-t" style={{borderColor:C.bd}}><span className="text-xs" style={{color:C.txM}}>Total today</span><span className="text-sm font-bold" style={{color:"#22c55e"}}>$24.00</span></div></div>);
  if(id==="cost-tracker") return (<div><div className="text-3xl font-bold mb-1" style={{color:"#22c55e"}}>$24.00</div><span className="text-xs" style={{color:C.txD}}>Today's spend • Budget: $50/day</span><div className="h-2 rounded-full mt-2 overflow-hidden" style={{backgroundColor:C.bg}}><div className="h-full rounded-full bg-green-500" style={{width:"48%"}}/></div></div>);
  if(id==="project-health") return (<div className="space-y-2">{PROJECTS.map(p=>{const pct=Math.round((p.done/p.total)*100);return(<div key={p.id} className="flex items-center gap-3"><div className="w-3 h-3 rounded-sm" style={{backgroundColor:p.color}}/><span className="text-xs w-36 truncate" style={{color:C.tx}}>{p.name}</span><div className="flex-1 h-2 rounded-full overflow-hidden" style={{backgroundColor:C.bg}}><div className="h-full rounded-full" style={{width:`${pct}%`,backgroundColor:p.color}}/></div><span className="text-xs w-10 text-right" style={{color:C.txM}}>{pct}%</span></div>);})}</div>);
  if(id==="worker-activity") return (<div className="space-y-2">{WORKERS.filter(w=>w.active>0).map(w=><div key={w.id} className="flex items-center gap-2 p-2 rounded" style={{backgroundColor:C.bg}}><Av type={w.type} size={24} role={w.role}/><div className="flex-1 min-w-0"><span className="text-sm block truncate" style={{color:C.tx}}>{w.name}</span><span className="text-[10px]" style={{color:C.txD}}>{w.active} task{w.active>1?"s":""} active</span></div><Dot s={w.status}/></div>)}</div>);
  if(id==="needs-attention") return (<div className="space-y-2">{TASKS.filter(t=>t.s==="awaiting_input"||t.s==="review").map(t=>{const sc=ST[t.s];return(<div key={t.id} className="p-2 rounded flex items-center gap-2" style={{backgroundColor:C.bg}}><sc.i size={14} style={{color:sc.c}}/><span className="text-xs flex-1 truncate" style={{color:C.tx}}>{t.title}</span><Bd color={sc.c} bg={sc.bg} s>{sc.l}</Bd></div>);})}</div>);
  if(id==="recent-activity") return (<div className="space-y-1">{[{t:"2m",e:"Claude completed 'DB schema'",c:"#22c55e"},{t:"15m",e:"Kimi started 'Security audit'",c:"#3b82f6"},{t:"1h",e:"ChatGPT blocked on 'API docs'",c:"#f97316"},{t:"2h",e:"Gemini completed 'Market research'",c:"#22c55e"}].map((a,i)=><div key={i} className="flex items-center gap-2 p-1"><div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{backgroundColor:a.c}}/><span className="text-xs flex-1" style={{color:C.tx}}>{a.e}</span><span className="text-[10px]" style={{color:C.txD}}>{a.t}</span></div>)}</div>);
  if(id==="quick-task") return (<div className="space-y-2"><Inp placeholder="Task title..."/><div className="flex gap-2"><Sel><option>Medium</option><option>Urgent</option><option>High</option><option>Low</option></Sel><Btn primary><Plus size={14}/> Add</Btn></div></div>);
  if(id==="quick-note") return (<div><textarea className="w-full px-3 py-2 rounded-lg text-sm border outline-none resize-none" rows={2} style={{backgroundColor:C.bgC,borderColor:C.bd,color:C.tx}} placeholder="Jot something down..."/><Btn primary className="mt-2"><Edit3 size={14}/> Save Note</Btn></div>);
  if(id==="chat-preview") return (<div className="p-2 rounded" style={{backgroundColor:C.bg}}><div className="flex items-center gap-2 mb-1"><Av type="claude-cli" size={18} role="orchestrator"/><span className="text-[10px]" style={{color:C.txD}}>10:25 AM</span></div><p className="text-xs line-clamp-3" style={{color:C.txM}}>Done! Created 6 subtasks under 'Auth Module'. All in Draft.</p></div>);
  if(id==="custom-code") return (<div><textarea className="w-full px-3 py-2 rounded-lg text-xs font-mono border outline-none resize-none" rows={3} style={{backgroundColor:C.bg,borderColor:C.bd,color:C.tx}} defaultValue={"// Access data via orchestria.tasks, orchestria.workers\nconst blocked = orchestria.tasks.filter(t => t.status === 'blocked');\nreturn { value: blocked.length, label: 'Blocked' };"}/><span className="text-[10px] mt-1 block" style={{color:C.txD}}>Runs in sandboxed Web Worker</span></div>);
  return <span className="text-xs" style={{color:C.txD}}>Widget content</span>;
};

const DashboardView = () => {
  const [widgets,setWidgets] = useState(WIDGET_CATALOG.filter(w=>w.default).map(w=>w.id));
  const [showCatalog,setShowCatalog] = useState(false);
  const [expandedCats,setExpandedCats] = useState({});
  const removeWidget = (id) => setWidgets(ws=>ws.filter(w=>w!==id));
  const addWidget = (id) => { setWidgets(ws=>[...ws,id]); };
  const toggleCat = (cat) => setExpandedCats(prev=>({...prev,[cat]:!prev[cat]}));
  const cats = [...new Set(WIDGET_CATALOG.map(w=>w.cat))];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs" style={{color:C.txD}}>{widgets.length} widgets active</span>
        <div className="flex items-center gap-2">
          <Btn onClick={()=>setShowCatalog(true)}><Plus size={14}/> Add Widget</Btn>
          <Btn><Download size={14}/> Export PDF</Btn>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {widgets.map(wId => {
          const wDef = WIDGET_CATALOG.find(w=>w.id===wId);
          if(!wDef) return null;
          const I = wDef.icon;
          return (
            <div key={wId} className="rounded-xl border group" style={{backgroundColor:C.bgC,borderColor:C.bd}}>
              <div className="flex items-center justify-between p-3 border-b" style={{borderColor:C.bd}}>
                <div className="flex items-center gap-2"><I size={14} style={{color:C.ac}}/><span className="text-sm font-medium" style={{color:C.tx}}>{wDef.name}</span></div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                  <button className="p-1 rounded hover:bg-white/10" title="Remove" onClick={()=>removeWidget(wId)}><X size={12} style={{color:C.txD}}/></button>
                </div>
              </div>
              <div className="p-3"><WidgetContent id={wId}/></div>
            </div>
          );
        })}
        {/* Add widget placeholder */}
        <button onClick={()=>setShowCatalog(true)} className="rounded-xl border border-dashed flex flex-col items-center justify-center py-8 hover:border-indigo-500/50 transition-colors" style={{borderColor:C.bd}}>
          <Plus size={24} style={{color:C.txD}}/><span className="text-sm mt-2" style={{color:C.txD}}>Add Widget</span>
        </button>
      </div>

      {/* Widget Catalog Modal */}
      {showCatalog && <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={()=>setShowCatalog(false)}>
        <div className="rounded-xl border w-full max-w-lg max-h-[70vh] overflow-hidden flex flex-col" style={{backgroundColor:C.bg,borderColor:C.bd}} onClick={e=>e.stopPropagation()}>
          <div className="flex items-center justify-between p-4 border-b" style={{borderColor:C.bd}}>
            <h3 className="text-lg font-semibold" style={{color:C.tx}}>Add Widget</h3>
            <button onClick={()=>setShowCatalog(false)} className="p-1 rounded hover:bg-white/10"><X size={16} style={{color:C.txM}}/></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {cats.map(cat => {
              const isOpen = expandedCats[cat] || false;
              const catWidgets = WIDGET_CATALOG.filter(w=>w.cat===cat);
              const addedCount = catWidgets.filter(w=>widgets.includes(w.id)).length;
              return (
              <div key={cat} className="rounded-lg border overflow-hidden" style={{borderColor:C.bd}}>
                <button onClick={()=>toggleCat(cat)} className="w-full flex items-center gap-2 p-3 hover:bg-white/5" style={{backgroundColor:C.bgC}}>
                  {isOpen?<ChevronDown size={14} style={{color:C.txM}}/>:<ChevronRight size={14} style={{color:C.txM}}/>}
                  <span className="text-xs font-semibold uppercase tracking-wider flex-1 text-left" style={{color:C.txD}}>{cat}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{backgroundColor:C.bg,color:C.txM}}>{addedCount}/{catWidgets.length}</span>
                </button>
                {isOpen && <div className="p-2 space-y-1">
                  {catWidgets.map(w => {
                    const I=w.icon; const added=widgets.includes(w.id);
                    return (<div key={w.id} className="flex items-center gap-3 p-3 rounded-lg" style={{backgroundColor:added?`${C.ac}10`:C.bg}}>
                      <I size={16} style={{color:added?C.ac:C.txD}}/>
                      <div className="flex-1"><span className="text-sm" style={{color:C.tx}}>{w.name}</span><p className="text-[10px]" style={{color:C.txD}}>{w.desc}</p></div>
                      {added?<Bd color={C.ac} s>Added</Bd>:<button onClick={()=>addWidget(w.id)} className="px-3 py-1 rounded-lg text-xs bg-indigo-600 text-white">Add</button>}
                    </div>);
                  })}
                </div>}
              </div>);
            })}
          </div>
        </div>
      </div>}
    </div>
  );
};

// ============ MY TASKS (Kanban + New Task Modal) ============
const NewTaskModal = ({onClose}) => {
  const [showSchedule,setShowSchedule]=useState(false);
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="rounded-xl border w-full max-w-xl max-h-[85vh] overflow-y-auto" style={{backgroundColor:C.bg,borderColor:C.bd}} onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b" style={{borderColor:C.bd}}>
          <h3 className="text-lg font-semibold" style={{color:C.tx}}>New Task</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10"><X size={16} style={{color:C.txM}}/></button>
        </div>
        <div className="p-4 space-y-4">
          <div><Lbl>Title *</Lbl><Inp placeholder="What needs to be done?"/></div>
          <div><Lbl>Description</Lbl><textarea className="w-full px-3 py-2 rounded-lg text-sm border outline-none resize-none" rows={3} style={{backgroundColor:C.bgC,borderColor:C.bd,color:C.tx}} placeholder="Detailed description, requirements, context..."/></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Lbl>Project</Lbl><Sel>{PROJECTS.map(p=><option key={p.id}>{p.name}</option>)}</Sel></div>
            <div><Lbl>Priority</Lbl><Sel><option>🟡 Medium</option><option>🔴 Urgent</option><option>🟠 High</option><option>🟢 Low</option></Sel></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Lbl>Assign Worker</Lbl><Sel><option>Auto (Orchestrator decides)</option>{WORKERS.map(w=><option key={w.id}>{w.isHuman?"👤":"🤖"} {w.name}</option>)}</Sel></div>
            <div><Lbl>Review By</Lbl><Sel><option>Orchestrator decides</option><option>Orchestrator review</option><option>Human Review</option>{WORKERS.filter(w=>w.isHuman).map(w=><option key={w.id}>{w.name}</option>)}</Sel></div>
          </div>
          <div><Lbl>Tags</Lbl><Inp placeholder="backend, auth, urgent (comma separated)"/></div>
          <div>
            <Lbl>Dependencies</Lbl>
            <div className="rounded-lg border p-2" style={{backgroundColor:C.bgC,borderColor:C.bd}}>
              <input placeholder="Search tasks..." className="w-full bg-transparent text-sm outline-none mb-2 px-1" style={{color:C.tx}}/>
              <div className="max-h-28 overflow-y-auto space-y-1">
                {TASKS.slice(0,6).map(t=>{const sc=ST[t.s];return(
                  <label key={t.id} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/5 cursor-pointer">
                    <input type="checkbox" className="accent-indigo-600"/>
                    <span className="text-xs flex-1 truncate" style={{color:C.tx}}>{t.title}</span>
                    <Bd color={sc.c} bg={sc.bg} s>{sc.l}</Bd>
                  </label>);})}
              </div>
            </div>
            <span className="text-[10px] mt-1 block" style={{color:C.txD}}>Task won't start until all selected dependencies are completed</span>
          </div>

          {/* Subtasks */}
          <div>
            <Lbl>Subtasks</Lbl>
            <div className="space-y-1.5">
              {["Set up project scaffold","Write unit tests"].map((st,i)=>
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{backgroundColor:C.bgC,borderColor:C.bd}}>
                  <GripVertical size={12} style={{color:C.txD}} className="cursor-grab"/>
                  <span className="text-sm flex-1" style={{color:C.tx}}>{st}</span>
                  <button className="p-0.5 rounded hover:bg-white/10"><X size={12} style={{color:C.txD}}/></button>
                </div>
              )}
              <div className="flex gap-2">
                <input placeholder="Add subtask..." className="flex-1 px-3 py-2 rounded-lg text-sm border outline-none" style={{backgroundColor:C.bgC,borderColor:C.bd,color:C.tx}}/>
                <button className="px-3 py-2 rounded-lg text-sm bg-indigo-600 text-white flex items-center gap-1"><Plus size={12}/> Add</button>
              </div>
            </div>
            <span className="text-[10px] mt-1 block" style={{color:C.txD}}>Subtasks inherit parent's project and worker unless overridden</span>
          </div>

          {/* Scheduling */}
          <div className="border-t pt-4" style={{borderColor:C.bd}}>
            <button onClick={()=>setShowSchedule(!showSchedule)} className="flex items-center gap-2 text-sm" style={{color:showSchedule?C.ac:C.txM}}>
              <Calendar size={14}/> Scheduling {showSchedule?<ChevronDown size={12}/>:<ChevronRight size={12}/>}
            </button>
            {showSchedule && <div className="mt-3 space-y-3 p-3 rounded-lg" style={{backgroundColor:C.bgC}}>
              <div><Lbl>When</Lbl><div className="flex gap-2">
                {["Now","Scheduled","Recurring"].map(o=><button key={o} className="flex-1 px-3 py-1.5 rounded-lg text-xs border text-center" style={{borderColor:o==="Now"?C.ac:C.bd,color:o==="Now"?C.ac:C.txM,backgroundColor:o==="Now"?`${C.ac}20`:"transparent"}}>{o}</button>)}
              </div></div>
              <div><Lbl>Start Date</Lbl><Inp type="date"/></div>
              <div><Lbl>Repeat</Lbl><Sel><option>No repeat</option><option>Daily</option><option>Weekly</option><option>Monthly</option><option>Custom (cron)</option></Sel></div>
            </div>}
          </div>

          {/* Lock */}
          <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer" style={{backgroundColor:C.bgC}}>
            <input type="checkbox" className="accent-indigo-600"/>
            <div><span className="text-sm" style={{color:C.tx}}>Lock task</span><p className="text-[10px]" style={{color:C.txD}}>Orchestrator cannot modify this task</p></div>
            <Lock size={14} className="ml-auto text-yellow-500"/>
          </label>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t" style={{borderColor:C.bd}}>
          <Btn onClick={onClose}>Cancel</Btn>
          <Btn primary><Plus size={14}/> Create Task</Btn>
        </div>
      </div>
    </div>
  );
};

const TaskCard = ({task,onClick}) => { const w=WORKERS.find(x=>x.id===task.w); return (
  <div onClick={onClick} className="p-3 rounded-lg border cursor-pointer hover:border-indigo-500/50 group" style={{backgroundColor:C.bgC,borderColor:C.bd}}>
    <div className="flex items-center gap-1.5 mb-2 min-w-0">{task.lock&&<Lock size={12} className="text-yellow-500"/>}<span className="text-sm font-medium truncate" style={{color:C.tx}}>{task.title}</span></div>
    {task.block&&<div className="mb-2 p-2 rounded text-xs flex items-start gap-1.5" style={{backgroundColor:"#f9731620",color:"#f97316"}}><AlertTriangle size={12} className="flex-shrink-0 mt-0.5"/><span className="line-clamp-2">{task.block}</span></div>}
    <div className="flex items-center gap-1.5 mb-2 flex-wrap">{task.tags.map(t=><span key={t} className="px-1.5 py-0.5 rounded text-[10px]" style={{backgroundColor:`${C.ac}20`,color:C.acH}}>{t}</span>)}</div>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">{w?<Av type={w.type} size={22} role={w.role}/>:<div className="w-[22px] h-[22px] rounded-full border border-dashed flex items-center justify-center" style={{borderColor:C.txD}}><Plus size={10} style={{color:C.txD}}/></div>}{task.sub>0&&<span className="text-[11px] flex items-center gap-1" style={{color:C.txM}}><CheckCircle2 size={11}/>{task.subD}/{task.sub}</span>}</div>
      {PRI[task.p]&&<span className="text-[11px]">{PRI[task.p].ic}</span>}
    </div>
  </div>
);};

const TasksView = ({proj,onTask}) => {
  const [showNew,setShowNew]=useState(false);
  const tasks=TASKS.filter(t=>t.pr===proj);
  const cols=["draft","pending","approved","running","awaiting_input","review","completed"];
  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="flex items-center gap-4 px-6 py-3 border-b" style={{borderColor:C.bd}}>
        <span className="text-xs" style={{color:C.txM}}>Total: <strong style={{color:C.tx}}>{tasks.length}</strong></span>
        <div className="ml-auto flex items-center gap-2">
          <Btn><Filter size={12}/> Filter</Btn>
          <Btn primary onClick={()=>setShowNew(true)}><Plus size={12}/> New Task</Btn>
        </div>
      </div>
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4" style={{minWidth:"max-content"}}>
          {cols.map(st=>{const s=ST[st];const I=s.i;const ct=tasks.filter(t=>t.s===st);return(
            <div key={st} className="flex-shrink-0" style={{width:260}}>
              <div className="flex items-center gap-2 mb-3 px-1"><I size={14} style={{color:s.c}}/><span className="text-sm font-semibold" style={{color:s.c}}>{s.l}</span><span className="text-xs px-1.5 py-0.5 rounded-full" style={{backgroundColor:s.bg,color:s.c}}>{ct.length}</span></div>
              <div className="space-y-2 min-h-[100px] p-1 rounded-lg" style={{backgroundColor:`${s.c}08`}}>
                {ct.map(t=><TaskCard key={t.id} task={t} onClick={()=>onTask(t)}/>)}
                <button onClick={()=>setShowNew(true)} className="w-full p-2 rounded-lg border border-dashed text-sm flex items-center justify-center gap-1 hover:border-indigo-500/50" style={{borderColor:C.bd,color:C.txD}}><Plus size={14}/></button>
              </div>
            </div>
          );})}
        </div>
      </div>
      {showNew&&<NewTaskModal onClose={()=>setShowNew(false)}/>}
    </div>
  );
};

const TaskModal = ({task,onClose}) => {
  const w=WORKERS.find(x=>x.id===task.w);const sc=ST[task.s];
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="rounded-xl border w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col" style={{backgroundColor:C.bg,borderColor:C.bd}} onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b" style={{borderColor:C.bd}}>
          <div className="flex items-center gap-3"><Bd color={sc.c} bg={sc.bg}>{sc.l}</Bd>{task.lock&&<Lock size={14} className="text-yellow-500"/>}{PRI[task.p]&&<span className="text-sm">{PRI[task.p].ic} {PRI[task.p].l}</span>}</div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-white/10"><X size={16} style={{color:C.txM}}/></button>
        </div>
        <div className="px-6 pt-4 pb-2"><h2 className="text-lg font-semibold" style={{color:C.tx}}>{task.title}</h2>
          <div className="flex items-center gap-3 mt-2">{w&&<div className="flex items-center gap-2"><Av type={w.type} size={20} role={w.role}/><span className="text-xs" style={{color:C.txM}}>{w.name}{w.isHuman?" (Human)":""}</span></div>}{task.tags.map(t=><span key={t} className="px-1.5 py-0.5 rounded text-[10px]" style={{backgroundColor:`${C.ac}20`,color:C.acH}}>{t}</span>)}</div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {task.block&&<div className="p-4 rounded-lg border flex items-start gap-3 mb-4" style={{borderColor:"#f9731640",backgroundColor:"#f9731610"}}>
            <AlertTriangle size={18} className="text-orange-500 flex-shrink-0 mt-0.5"/>
            <div><p className="text-sm font-medium text-orange-400">Agent Blocked — Input Required</p><p className="text-sm mt-1" style={{color:C.txM}}>{task.block}</p>
              <div className="mt-3 flex items-center gap-2"><input placeholder="Provide input..." className="flex-1 px-3 py-1.5 rounded-lg text-sm border outline-none" style={{backgroundColor:C.bgC,borderColor:C.bd,color:C.tx}}/><button className="px-3 py-1.5 rounded-lg text-sm bg-orange-600 text-white flex items-center gap-1"><Send size={12}/> Send & Resume</button></div>
            </div>
          </div>}
          <div className="grid grid-cols-2 gap-4">{[{l:"Status",v:<Bd color={sc.c} bg={sc.bg}>{sc.l}</Bd>},{l:"Priority",v:<span style={{color:C.tx}}>{PRI[task.p]?.ic} {PRI[task.p]?.l}</span>},{l:"Worker",v:w?<div className="flex items-center gap-2"><Av type={w.type} size={20} role={w.role}/><span className="text-sm" style={{color:C.tx}}>{w.name}</span></div>:<span style={{color:C.txD}}>Unassigned</span>},{l:"Subtasks",v:<span style={{color:C.tx}}>{task.subD}/{task.sub}</span>}].map(f=><div key={f.l} className="p-3 rounded-lg" style={{backgroundColor:C.bgC}}><Lbl>{f.l}</Lbl>{f.v}</div>)}</div>
        </div>
        <div className="flex items-center justify-between p-4 border-t" style={{borderColor:C.bd}}>
          <div className="flex items-center gap-2">
            {task.s==="review"&&<><Btn primary><Check size={14}/> Approve</Btn><Btn><XCircle size={14}/> Reject</Btn></>}
            {task.s==="draft"&&<Btn primary><ArrowRight size={14}/> Move to Pending</Btn>}
            {task.s==="completed"&&<Btn><RefreshCw size={14}/> Rerun</Btn>}
          </div>
          <Btn><Archive size={12}/> Archive</Btn>
        </div>
      </div>
    </div>
  );
};

// ============ WORKERS (with Human) ============
const HUMAN_SKILLS = [
  {id:"code-review",l:"Code Review",d:"Review code, PRs, technical decisions"},
  {id:"design",l:"Design",d:"UI/UX design, wireframing, visual decisions"},
  {id:"copywriting",l:"Copywriting",d:"Marketing texts, blog posts, communication"},
  {id:"research",l:"Research",d:"Manual research, fact verification"},
  {id:"qa",l:"QA / Testing",d:"Manual testing, bug reporting"},
  {id:"devops",l:"DevOps",d:"Infrastructure, deployment, servers"},
  {id:"data-entry",l:"Data Entry",d:"Manual data input, forms, credentials"},
  {id:"stakeholder",l:"Stakeholder",d:"Approvals, business decisions, budget"},
];

const WorkersView = () => {
  const [modal,setModal]=useState(false);
  const [isHuman,setIsHuman]=useState(false);
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-lg font-semibold" style={{color:C.tx}}>Workers & Orchestrators</h2><p className="text-sm mt-1" style={{color:C.txM}}>AI agents and human team members</p></div>
        <Btn primary onClick={()=>setModal(true)}><Plus size={16}/> Add Worker</Btn>
      </div>
      <div className="grid gap-4" style={{gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))"}}>
        {WORKERS.map(w=>(
          <div key={w.id} className="p-4 rounded-xl border hover:border-indigo-500/30" style={{backgroundColor:C.bgC,borderColor:C.bd}}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3"><Av type={w.type} size={40} role={w.role}/>
                <div><div className="flex items-center gap-2"><span className="text-sm font-semibold" style={{color:C.tx}}>{w.name}</span><Dot s={w.status}/></div>
                  <span className="text-xs" style={{color:C.txM}}>{w.isHuman?"Human Team Member":w.model}</span></div></div>
            </div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {w.isHuman?<Bd color="#8b5cf6" bg="#2e1065" s>Human</Bd>:<Bd color={w.role==="both"?"#eab308":w.role==="orchestrator"?"#a855f7":"#3b82f6"} bg={w.role==="both"?"#422006":w.role==="orchestrator"?"#3b0764":"#172554"} s>{w.role==="both"?"Worker + Orchestrator":w.role}</Bd>}
              {w.isHuman&&w.skills?.map(sk=>{const s=HUMAN_SKILLS.find(x=>x.id===sk);return s?<Bd key={sk} color="#71717a" bg="#27272a" s>{s.l}</Bd>:null;})}
              {!w.isHuman&&<Bd color="#71717a" bg="#27272a" s>Think: {w.think}</Bd>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2 rounded-lg" style={{backgroundColor:C.bg}}><span className="text-[10px] block" style={{color:C.txD}}>Active</span><span className="text-lg font-bold" style={{color:C.tx}}>{w.active}</span></div>
              <div className="p-2 rounded-lg" style={{backgroundColor:C.bg}}><span className="text-[10px] block" style={{color:C.txD}}>Done</span><span className="text-lg font-bold" style={{color:C.tx}}>{w.done}</span></div>
            </div>
          </div>
        ))}
      </div>
      {/* Create Worker Modal */}
      {modal&&<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={()=>setModal(false)}>
        <div className="rounded-xl border p-6 w-full max-w-md max-h-[85vh] overflow-y-auto" style={{backgroundColor:C.bg,borderColor:C.bd}} onClick={e=>e.stopPropagation()}>
          <h3 className="text-lg font-semibold mb-4" style={{color:C.tx}}>Add Worker</h3>
          {/* Type toggle */}
          <div className="flex gap-2 mb-4">{["AI Agent","Human"].map(t=><button key={t} onClick={()=>setIsHuman(t==="Human")} className="flex-1 px-4 py-2 rounded-lg text-sm border text-center" style={{borderColor:(t==="Human"?isHuman:!isHuman)?C.ac:C.bd,backgroundColor:(t==="Human"?isHuman:!isHuman)?`${C.ac}20`:"transparent",color:(t==="Human"?isHuman:!isHuman)?C.ac:C.txM}}>{t==="AI Agent"?<Bot size={14} className="inline mr-2"/>:<User size={14} className="inline mr-2"/>}{t}</button>)}</div>
          <div className="space-y-4">
            <div><Lbl>Name</Lbl><Inp placeholder={isHuman?"e.g. Sarah Designer":"e.g. Claude Research"}/></div>
            {isHuman?<>
              <div><Lbl>Email</Lbl><Inp placeholder="sarah@company.com" type="email"/></div>
              <div><Lbl>Contact Method</Lbl><div className="flex gap-2">{[{l:"In-App",i:Smartphone},{l:"Email",i:Mail},{l:"Webhook",i:Globe}].map(m=><button key={m.l} className="flex-1 px-3 py-2 rounded-lg text-xs border text-center flex items-center justify-center gap-1" style={{borderColor:m.l==="In-App"?C.ac:C.bd,color:m.l==="In-App"?C.ac:C.txM}}><m.i size={12}/>{m.l}</button>)}</div></div>
              <div><Lbl>Description</Lbl><textarea className="w-full px-3 py-2 rounded-lg text-sm border outline-none resize-none" rows={2} style={{backgroundColor:C.bgC,borderColor:C.bd,color:C.tx}} placeholder="Role, responsibilities, expertise areas..."/></div>
              <div>
                <div className="flex items-center gap-2 mb-2"><Lbl>Skills</Lbl>
                  <div className="relative group"><span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 cursor-help" style={{color:C.txD}}>?</span>
                    <div className="absolute bottom-full left-0 mb-1 w-48 p-2 rounded-lg text-[10px] bg-black/90 text-white hidden group-hover:block z-10">Skills help the orchestrator decide which tasks to assign to this person.</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">{HUMAN_SKILLS.map(sk=>(
                  <label key={sk.id} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border cursor-pointer hover:border-indigo-500/50" style={{borderColor:C.bd,backgroundColor:C.bgC}} title={sk.d}>
                    <input type="checkbox" className="accent-indigo-600"/>
                    <span className="text-xs" style={{color:C.tx}}>{sk.l}</span>
                  </label>
                ))}</div>
                <Inp placeholder="+ Add custom skill..." className="mt-2"/>
              </div>
              <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer" style={{backgroundColor:C.bgC}}>
                <input type="checkbox" defaultChecked className="accent-indigo-600"/>
                <div><span className="text-sm" style={{color:C.tx}}>Auto-escalate blocked tasks</span><p className="text-[10px]" style={{color:C.txD}}>Automatically assign AI-blocked tasks matching this person's skills</p></div>
              </label>
            </>:<>
              <div><Lbl>Type</Lbl><Sel><option>Claude CLI</option><option>Gemini CLI</option><option>ChatGPT CLI</option><option>Kimi CLI</option><option>Other</option></Sel></div>
              <div><Lbl>Role</Lbl><div className="flex gap-2">{["Worker","Orchestrator","Both"].map(r=><button key={r} className="flex-1 px-3 py-2 rounded-lg text-sm border text-center" style={{borderColor:C.bd,color:C.txM}}>{r}</button>)}</div></div>
              <div><Lbl>Model</Lbl><Inp placeholder="e.g. claude-opus-4"/></div>
              <div><Lbl>Thinking Level</Lbl><Sel><option>Standard</option><option>Deep</option><option>Minimal</option></Sel></div>
            </>}
          </div>
          <div className="flex justify-end gap-2 mt-6"><Btn onClick={()=>setModal(false)}>Cancel</Btn><Btn primary>Create</Btn></div>
        </div>
      </div>}
    </div>
  );
};

// ============ CHAT (same as v2 with context panel) ============
const ChatView = () => {
  const [input,setInput]=useState("");const [showCtx,setShowCtx]=useState(false);
  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="w-56 border-r flex flex-col" style={{borderColor:C.bd,backgroundColor:C.bgS}}>
        <div className="p-3 border-b" style={{borderColor:C.bd}}><button className="w-full px-3 py-2 rounded-lg text-sm bg-indigo-600 text-white flex items-center justify-center gap-1"><Plus size={14}/> New Chat</button></div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {[{id:"p",l:"AI SaaS Platform",s:"Break down auth...",t:"10m"},{id:"g",l:"Global Overview",s:"Cross-project report",t:"2h"}].map(c=>(<button key={c.id} className="w-full text-left p-2 rounded-lg" style={{backgroundColor:c.id==="p"?C.bgH:"transparent"}}><span className="text-sm block truncate" style={{color:C.tx}}>{c.l}</span><span className="text-xs truncate block" style={{color:C.txD}}>{c.s}</span></button>))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b flex items-center justify-between" style={{borderColor:C.bd}}>
          <div className="flex items-center gap-3"><Av type="claude-cli" size={28} role="orchestrator"/><span className="text-sm font-medium" style={{color:C.tx}}>Claude Opus</span></div>
          <button onClick={()=>setShowCtx(!showCtx)} className="px-3 py-1.5 rounded-lg text-xs border flex items-center gap-1" style={{borderColor:showCtx?C.ac:C.bd,color:showCtx?C.ac:C.txM}}><Database size={12}/> Context</button>
        </div>
        <div className="flex-1 flex">
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">{CHATS.map(m=>(<div key={m.id} className={`flex ${m.role==="user"?"justify-end":"justify-start"} gap-2`}>{m.role!=="user"&&<Av type="claude-cli" size={28} role="orchestrator"/>}<div className="max-w-[70%]"><div className="p-3 rounded-xl text-sm" style={{backgroundColor:m.role==="user"?C.acD:C.bgC,color:C.tx}}><p className="whitespace-pre-wrap">{m.content}</p></div></div></div>))}</div>
            <div className="p-4 border-t" style={{borderColor:C.bd}}><div className="rounded-xl border p-2" style={{backgroundColor:C.bgC,borderColor:C.bd}}><textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask the orchestrator..." className="w-full bg-transparent text-sm outline-none resize-none" style={{color:C.tx,minHeight:40}} rows={1}/><div className="flex items-center justify-between mt-1"><button className="p-1 rounded hover:bg-white/10" style={{color:C.txD}}><Paperclip size={14}/></button><button className="p-1.5 rounded-lg bg-indigo-600 text-white"><Send size={14}/></button></div></div></div>
          </div>
          {showCtx&&<div className="w-60 border-l p-4 overflow-y-auto" style={{borderColor:C.bd,backgroundColor:C.bgS}}>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{color:C.txD}}>Active Context</h4>
            <div className="space-y-2">{["memory.md","project-overview.md","db-schema.md"].map(f=><div key={f} className="flex items-center gap-2 p-2 rounded" style={{backgroundColor:C.bgC}}><FileText size={12} style={{color:C.ac}}/><span className="text-xs flex-1" style={{color:C.tx}}>{f}</span><button className="p-0.5 rounded hover:bg-white/10"><X size={10} style={{color:C.txD}}/></button></div>)}<button className="w-full p-2 rounded border border-dashed text-xs flex items-center justify-center gap-1" style={{borderColor:C.bd,color:C.txD}}><Plus size={10}/> Add</button></div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mt-4 mb-2" style={{color:C.txD}}>Tokens</h4>
            <div className="p-2 rounded" style={{backgroundColor:C.bgC}}><div className="flex justify-between text-xs mb-1"><span style={{color:C.txM}}>Used</span><span style={{color:C.tx}}>42K / 128K</span></div><div className="h-1.5 rounded-full overflow-hidden" style={{backgroundColor:C.bg}}><div className="h-full rounded-full bg-indigo-500" style={{width:"33%"}}/></div></div>
          </div>}
        </div>
      </div>
    </div>
  );
};

// ============ MASTER PLANNER (Pyramid DAG + Chat) ============
const PLAN_TEMPLATES = [
  {id:"blank",name:"Blank Plan",desc:"Start from scratch",icon:"📋"},
  {id:"saas",name:"SaaS Feature",desc:"Research → Design → Build → Test → Deploy",icon:"🚀"},
  {id:"research",name:"Deep Research",desc:"Define → Gather → Analyze → Synthesize → Report",icon:"🔬"},
  {id:"migration",name:"Migration",desc:"Audit → Plan → Migrate → Validate → Cutover",icon:"🔄"},
  {id:"security",name:"Security Audit",desc:"Scan → Assess → Fix → Verify → Document",icon:"🛡️"},
];

const PYRAMID = [
  {id:"r0",level:0,label:"Auth System Overhaul",status:"running",priority:"urgent",worker:null,review:"Orchestrator decides",tags:["master-plan"],children:["r1","r2"],description:"Complete auth system overhaul with JWT, OAuth, 2FA"},
  {id:"r1",level:1,label:"Research & Architecture",status:"completed",priority:"high",worker:"w2",review:"Orchestrator review",tags:["research"],children:["r3","r4"],description:"Analyze requirements and design schemas"},
  {id:"r2",level:1,label:"Implementation",status:"running",priority:"high",worker:"w1",review:"Human Review",tags:["dev"],children:["r5","r6","r7"],description:"Build all auth components"},
  {id:"r3",level:2,label:"Analyze vulnerabilities",status:"completed",priority:"medium",worker:"w2",review:"Orchestrator review",tags:["security"],children:[],description:"Map attack surface"},
  {id:"r4",level:2,label:"Design auth schema",status:"completed",priority:"high",worker:"w1",review:"Human Review",tags:["backend","db"],children:[],description:"User, session, token tables"},
  {id:"r5",level:2,label:"JWT service",status:"running",priority:"high",worker:"w1",review:"Human Review",tags:["backend"],children:["r8","r9"],description:"Token generation and validation"},
  {id:"r6",level:2,label:"OAuth providers",status:"pending",priority:"medium",worker:"w1",review:"Orchestrator review",tags:["backend"],children:[],description:"Google, GitHub OAuth integration"},
  {id:"r7",level:2,label:"2FA module",status:"draft",priority:"medium",worker:"w4",review:"Human Review",tags:["security"],children:[],description:"TOTP and SMS fallback"},
  {id:"r8",level:3,label:"Token generation",status:"running",priority:"high",worker:"w1",review:"Orchestrator review",tags:["backend"],children:[],description:"JWT creation with RS256"},
  {id:"r9",level:3,label:"Token validation middleware",status:"pending",priority:"high",worker:"w1",review:"Orchestrator review",tags:["backend"],children:[],description:"Express middleware for JWT verify"},
];

const PLAN_CHATS = [
  {role:"user",content:"Break down the auth system into phases. JWT first, then OAuth.",time:"10:15 AM"},
  {role:"bot",content:"I've created a pyramid plan:\n\nLevel 0: Auth System Overhaul\nLevel 1: Research & Architecture → Implementation\nLevel 2: Individual components (JWT, OAuth, 2FA)\nLevel 3: Granular subtasks\n\nJWT service is prioritized. Want me to add testing phases?",time:"10:16 AM"},
  {role:"user",content:"Yes, add testing as Level 1 after Implementation",time:"10:18 AM"},
];

const PyramidRow = ({nodes,allNodes,selected,onSelect,onExpand,expanded}) => {
  if(nodes.length===0) return null;
  return (
    <div className="flex items-start justify-center gap-3 relative">
      {nodes.map(node => {
        const w=WORKERS.find(x=>x.id===node.worker);
        const sc=ST[node.status]||ST.draft;
        const pc=PRI[node.priority]||PRI.medium;
        const isSel=selected===node.id;
        const hasKids=node.children.length>0;
        const isExp=expanded[node.id];
        const kids=allNodes.filter(n=>node.children.includes(n.id));
        return (
          <div key={node.id} className="flex flex-col items-center">
            {/* Node card */}
            <div className={`rounded-xl border-2 cursor-pointer group relative ${isSel?'ring-2 ring-indigo-500':''}`}
              style={{borderColor:sc.c,backgroundColor:`${sc.c}10`,minWidth:node.level===0?280:node.level===1?240:200,maxWidth:node.level===0?320:280}}
              onClick={()=>onSelect(isSel?null:node.id)}>
              <div className="px-3 py-2">
                <div className="flex items-center gap-1.5 mb-1">
                  {hasKids&&<button onClick={e=>{e.stopPropagation();onExpand(node.id);}} className="p-0.5 rounded hover:bg-white/10">
                    {isExp?<ChevronDown size={12} style={{color:sc.c}}/>:<ChevronRight size={12} style={{color:sc.c}}/>}
                  </button>}
                  <span className="text-[10px]">{pc.ic}</span>
                  <span className="text-sm font-semibold flex-1 truncate" style={{color:C.tx}}>{node.label}</span>
                  {node.level===0&&<Zap size={12} style={{color:C.ac}}/>}
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Bd color={sc.c} bg={sc.bg} s>{sc.l}</Bd>
                  {w&&<div className="flex items-center gap-1"><Av type={w.type} size={14} role={w.role}/><span className="text-[10px]" style={{color:C.txD}}>{w.name}</span></div>}
                  {!w&&node.level>0&&<span className="text-[10px]" style={{color:C.txD}}>Unassigned</span>}
                  {hasKids&&<span className="text-[10px]" style={{color:C.txD}}>({kids.length})</span>}
                </div>
              </div>
              {/* hover: + button */}
              <div className="absolute -top-2 -right-2 flex gap-0.5 opacity-0 group-hover:opacity-100 z-20">
                <button className="w-5 h-5 rounded-full flex items-center justify-center text-white" style={{backgroundColor:C.ac}} title="Add subtask"><Plus size={10}/></button>
              </div>
            </div>
            {/* Connector line down */}
            {hasKids&&isExp&&<div className="w-px h-4" style={{backgroundColor:C.bd}}/>}
            {/* Children row */}
            {hasKids&&isExp&&<PyramidRow nodes={kids} allNodes={allNodes} selected={selected} onSelect={onSelect} onExpand={onExpand} expanded={expanded}/>}
          </div>
        );
      })}
      {/* Horizontal connector between siblings */}
      {nodes.length>1&&<div className="absolute top-0 left-0 right-0 pointer-events-none" style={{height:1}}>
        {/* visual connector handled by flex gap */}
      </div>}
    </div>
  );
};

const PlannerView = () => {
  const [selected,setSelected]=useState(null);
  const [expanded,setExpanded]=useState({"r0":true,"r1":true,"r2":true,"r5":true});
  const [showVersions,setShowVersions]=useState(false);
  const [showTemplates,setShowTemplates]=useState(false);
  const [showChat,setShowChat]=useState(false);
  const [chatInput,setChatInput]=useState("");
  const versions=[{id:"v3",name:"v3 — After adding 2FA",date:"Today 10:30"},{id:"v2",name:"v2 — Expanded testing",date:"Today 09:15"},{id:"v1",name:"v1 — Initial plan",date:"Yesterday"}];
  const toggleExp=(id)=>setExpanded(p=>({...p,[id]:!p[id]}));
  const selNode=PYRAMID.find(n=>n.id===selected);
  const roots=PYRAMID.filter(n=>n.level===0);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b flex-shrink-0" style={{borderColor:C.bd}}>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold" style={{color:C.tx}}>Auth System Overhaul</span>
          <span className="text-xs" style={{color:C.txD}}>4 levels, {PYRAMID.length} nodes</span>
        </div>
        <div className="flex items-center gap-2">
          <Btn onClick={()=>setShowTemplates(!showTemplates)}><Layers size={12}/> Templates</Btn>
          <Btn><RotateCcw size={12}/> Undo</Btn>
          <div className="relative">
            <Btn onClick={()=>setShowVersions(!showVersions)}><Save size={12}/> Versions</Btn>
            {showVersions&&<div className="absolute right-0 top-full mt-1 w-64 rounded-xl border p-3 z-30" style={{backgroundColor:C.bg,borderColor:C.bd}}>
              <h4 className="text-xs font-semibold mb-2" style={{color:C.txD}}>Version History</h4>
              {versions.map(v=><div key={v.id} className="flex items-center gap-2 p-2 rounded hover:bg-white/5 cursor-pointer"><GitBranch size={12} style={{color:C.ac}}/><div><span className="text-xs block" style={{color:C.tx}}>{v.name}</span><span className="text-[10px]" style={{color:C.txD}}>{v.date}</span></div></div>)}
              <div className="mt-2 pt-2 border-t" style={{borderColor:C.bd}}><Inp placeholder="Name this version..."/><button className="w-full mt-2 px-3 py-1.5 rounded-lg text-xs bg-indigo-600 text-white">Save</button></div>
            </div>}
          </div>
          <Btn onClick={()=>setShowChat(!showChat)}><MessageSquare size={12}/> Chat</Btn>
          <Btn primary><Zap size={14}/> Launch</Btn>
        </div>
      </div>

      {/* Templates dropdown */}
      {showTemplates&&<div className="px-6 py-3 border-b flex items-center gap-3 overflow-x-auto flex-shrink-0" style={{borderColor:C.bd,backgroundColor:C.bgS}}>
        {PLAN_TEMPLATES.map(t=><button key={t.id} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border whitespace-nowrap hover:border-indigo-500/50" style={{borderColor:C.bd,backgroundColor:C.bgC}}>
          <span className="text-lg">{t.icon}</span>
          <div className="text-left"><span className="text-sm block" style={{color:C.tx}}>{t.name}</span><span className="text-[10px]" style={{color:C.txD}}>{t.desc}</span></div>
        </button>)}
      </div>}

      <div className="flex-1 flex overflow-hidden">
        {/* Pyramid Canvas */}
        <div className="flex-1 overflow-auto p-8" style={{backgroundColor:C.bgS}}>
          {/* Dot grid bg */}
          <div className="min-w-fit">
            <PyramidRow nodes={roots} allNodes={PYRAMID} selected={selected} onSelect={setSelected} onExpand={toggleExp} expanded={expanded}/>
            {/* Add root-level node */}
            <div className="flex justify-center mt-6">
              <button className="px-4 py-2 rounded-xl border border-dashed flex items-center gap-2 hover:border-indigo-500/50" style={{borderColor:C.bd,color:C.txD,backgroundColor:C.bgC}}><Plus size={14}/> Add Phase</button>
            </div>
          </div>
        </div>

        {/* Right panel: detail or chat */}
        {(selNode||showChat)&&<div className="w-80 border-l flex flex-col overflow-hidden" style={{borderColor:C.bd,backgroundColor:C.bg}}>
          {/* Tab toggle if both could show */}
          {selNode&&showChat&&<div className="flex border-b flex-shrink-0" style={{borderColor:C.bd}}>
            <button onClick={()=>setShowChat(false)} className="flex-1 px-3 py-2 text-xs text-center" style={{color:!showChat?C.ac:C.txM,backgroundColor:!showChat?`${C.ac}10`:"transparent"}}>Details</button>
            <button onClick={()=>setShowChat(true)} className="flex-1 px-3 py-2 text-xs text-center" style={{color:showChat?C.ac:C.txM,backgroundColor:showChat?`${C.ac}10`:"transparent"}}>Chat</button>
          </div>}

          {/* Detail panel */}
          {selNode&&!showChat&&<div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold" style={{color:C.tx}}>{selNode.label}</h3>
              <button onClick={()=>setSelected(null)} className="p-1 rounded hover:bg-white/10"><X size={14} style={{color:C.txM}}/></button>
            </div>
            <p className="text-xs mb-4" style={{color:C.txM}}>{selNode.description}</p>
            <div className="space-y-3">
              <div><Lbl>Status</Lbl><Sel defaultValue={selNode.status}><option value="draft">Draft</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="running">Running</option><option value="awaiting_input">Awaiting Input</option><option value="review">Review</option><option value="completed">Completed</option></Sel></div>
              <div><Lbl>Priority</Lbl><Sel defaultValue={selNode.priority}><option value="urgent">🔴 Urgent</option><option value="high">🟠 High</option><option value="medium">🟡 Medium</option><option value="low">🟢 Low</option></Sel></div>
              <div><Lbl>Worker</Lbl><Sel defaultValue={selNode.worker||"auto"}><option value="auto">Auto (Orchestrator)</option>{WORKERS.map(w=><option key={w.id} value={w.id}>{w.isHuman?"👤":"🤖"} {w.name}</option>)}</Sel></div>
              <div><Lbl>Review By</Lbl><Sel defaultValue={selNode.review}><option>Orchestrator decides</option><option>Orchestrator review</option><option>Human Review</option>{WORKERS.filter(w=>w.isHuman).map(w=><option key={w.id}>{w.name}</option>)}</Sel></div>
              <div><Lbl>Tags</Lbl><div className="flex flex-wrap gap-1">{selNode.tags.map(t=><span key={t} className="px-1.5 py-0.5 rounded text-[10px]" style={{backgroundColor:`${C.ac}20`,color:C.acH}}>{t}</span>)}<button className="px-1.5 py-0.5 rounded text-[10px] border border-dashed" style={{borderColor:C.bd,color:C.txD}}>+</button></div></div>
              {selNode.children.length>0&&<div><Lbl>Children ({selNode.children.length})</Lbl>
                <div className="space-y-1">{PYRAMID.filter(n=>selNode.children.includes(n.id)).map(ch=>{const chSc=ST[ch.status]||ST.draft;return<div key={ch.id} className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-white/5" style={{backgroundColor:C.bgC}} onClick={()=>setSelected(ch.id)}><Bd color={chSc.c} bg={chSc.bg} s>{chSc.l}</Bd><span className="text-xs flex-1 truncate" style={{color:C.tx}}>{ch.label}</span></div>})}</div>
              </div>}
              {/* Dependencies (parents) */}
              {selNode.level>0&&<div><Lbl>Depends on</Lbl>
                <div className="space-y-1">{PYRAMID.filter(n=>n.children.includes(selNode.id)).map(p=><div key={p.id} className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-white/5" style={{backgroundColor:C.bgC}} onClick={()=>setSelected(p.id)}><Link size={10} style={{color:C.ac}}/><span className="text-xs" style={{color:C.tx}}>{p.label}</span></div>)}</div>
              </div>}
              <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer" style={{backgroundColor:C.bgC}}>
                <input type="checkbox" className="accent-indigo-600"/>
                <div><span className="text-xs" style={{color:C.tx}}>Lock node</span><p className="text-[10px]" style={{color:C.txD}}>Prevent orchestrator from modifying</p></div>
              </label>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t" style={{borderColor:C.bd}}>
              <Btn primary><Check size={12}/> Save</Btn>
              <button className="p-2 rounded hover:bg-white/10" title="Delete"><Trash2 size={14} style={{color:"#ef4444"}}/></button>
            </div>
          </div>}

          {/* Chat panel */}
          {showChat&&<div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-3 border-b flex items-center justify-between flex-shrink-0" style={{borderColor:C.bd}}>
              <div className="flex items-center gap-2"><Av type="claude-cli" size={22} role="orchestrator"/><span className="text-xs font-medium" style={{color:C.tx}}>Plan Chat</span></div>
              {!selNode&&<button onClick={()=>setShowChat(false)} className="p-1 rounded hover:bg-white/10"><X size={14} style={{color:C.txM}}/></button>}
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {PLAN_CHATS.map((m,i)=><div key={i} className={`flex ${m.role==="user"?"justify-end":"justify-start"} gap-1.5`}>
                {m.role!=="user"&&<Av type="claude-cli" size={20} role="orchestrator"/>}
                <div className={`max-w-[85%] p-2.5 rounded-xl text-xs`} style={{backgroundColor:m.role==="user"?C.acD:C.bgC,color:C.tx}}>
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  <span className="text-[9px] block mt-1" style={{color:C.txD}}>{m.time}</span>
                </div>
              </div>)}
            </div>
            <div className="p-3 border-t flex-shrink-0" style={{borderColor:C.bd}}>
              <div className="flex gap-2">
                <input value={chatInput} onChange={e=>setChatInput(e.target.value)} placeholder="Ask about this plan..." className="flex-1 px-3 py-2 rounded-lg text-xs border outline-none" style={{backgroundColor:C.bgC,borderColor:C.bd,color:C.tx}}/>
                <button className="p-2 rounded-lg bg-indigo-600 text-white"><Send size={14}/></button>
              </div>
            </div>
          </div>}

          {/* If nothing selected and no chat */}
          {!selNode&&!showChat&&<div className="flex-1 flex items-center justify-center p-6"><p className="text-xs text-center" style={{color:C.txD}}>Click a node to see details, or open Chat to talk to the orchestrator.</p></div>}
        </div>}
      </div>
    </div>
  );
};

// ============ NOTES (with Condense) ============
const NotesView = () => {
  const [condense,setCondense]=useState(false);
  const notes=[{id:"n1",title:"Payment Integration",proj:"AI SaaS Platform",content:"Stripe primary, Paddle EU...",proposed:0,pinned:false},{id:"n2",title:"Performance",proj:"Data Pipeline v2",content:"Slow queries, investigate indexing...",proposed:3,pinned:true},{id:"n3",title:"Competitor Gap",proj:"AI SaaS Platform",content:"Monday has timeline view...",proposed:0,pinned:false},{id:"n4",title:"API Rate Strategy",proj:"AI SaaS Platform",content:"Free 100/day, Pro 10K...",proposed:0,pinned:false}];
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold" style={{color:C.tx}}>Notes</h2>
        <div className="flex gap-2"><Btn onClick={()=>setCondense(!condense)}><Shrink size={14}/> Condense</Btn><Btn primary><Plus size={16}/> New Note</Btn></div>
      </div>
      {condense&&<div className="mb-6 p-4 rounded-xl border" style={{backgroundColor:`${C.ac}10`,borderColor:`${C.ac}40`}}>
        <p className="text-xs mb-3" style={{color:C.txM}}>AI will group notes by theme. Pinned notes won't be affected.</p>
        <div className="flex items-center gap-3"><Lbl>Worker:</Lbl><select className="px-2 py-1 rounded text-xs border" style={{backgroundColor:C.bgC,borderColor:C.bd,color:C.tx}}>{WORKERS.map(w=><option key={w.id}>{w.name}</option>)}</select>
          <Btn primary><Sparkles size={14}/> Preview</Btn><span className="text-[10px]" style={{color:C.txD}}>Revert anytime.</span></div>
      </div>}
      <div className="grid gap-4" style={{gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))"}}>
        {notes.map(n=><div key={n.id} className="p-4 rounded-xl border hover:border-indigo-500/30" style={{backgroundColor:C.bgC,borderColor:C.bd}}>
          <div className="flex items-center gap-2 mb-2">{n.pinned&&<Pin size={12} className="text-yellow-500"/>}<h3 className="text-sm font-semibold flex-1" style={{color:C.tx}}>{n.title}</h3>
            {!n.pinned&&<button className="p-1 rounded hover:bg-white/10" title="Pin"><Pin size={12} style={{color:C.txD}}/></button>}</div>
          <Bd color="#6366f1" s>{n.proj}</Bd>
          <p className="text-sm mt-2 line-clamp-2" style={{color:C.txM}}>{n.content}</p>
          <div className="mt-3 pt-3 border-t" style={{borderColor:C.bd}}>{n.proposed>0?<Bd color="#22c55e" bg="#052e16" s>{n.proposed} tasks proposed</Bd>:<button className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 border" style={{borderColor:C.bd,color:C.acH}}><Sparkles size={12}/> Propose Tasks</button>}</div>
        </div>)}
      </div>
    </div>
  );
};

// ============ BRIEFINGS (modular report builder) ============
const REPORT_BLOCKS = [
  {id:"exec-summary",name:"Executive Summary",desc:"AI-generated 3-5 sentence overview",icon:Sparkles,default:true},
  {id:"task-stats",name:"Task Statistics",desc:"Counts by status, completion rate",icon:BarChart3,default:true},
  {id:"per-project",name:"Per-Project Breakdown",desc:"Detailed stats per project",icon:Activity,default:true},
  {id:"worker-perf",name:"Worker Performance",desc:"Hours, success rate, cost per worker",icon:Bot,default:false},
  {id:"token-cost",name:"Token / Cost Report",desc:"API spending breakdown",icon:DollarSign,default:false},
  {id:"completed-list",name:"Completed Tasks",desc:"List with details",icon:CheckCircle2,default:false},
  {id:"blocked-analysis",name:"Blocked / Failed Analysis",desc:"Why tasks got stuck",icon:AlertTriangle,default:false},
  {id:"recommendations",name:"Recommendations",desc:"AI-suggested next steps",icon:Sparkles,default:true},
  {id:"timeline",name:"Timeline View",desc:"Visual progress timeline",icon:Calendar,default:false},
  {id:"notes-summary",name:"Notes Summary",desc:"Condensed notes for period",icon:FileText,default:false},
  {id:"custom-block",name:"Custom Block",desc:"JS-powered custom section",icon:Code,default:false},
];

const BriefingsView = () => {
  const [blocks,setBlocks]=useState(REPORT_BLOCKS.filter(b=>b.default).map(b=>b.id));
  const [showAdd,setShowAdd]=useState(false);
  const [period,setPeriod]=useState("24h");
  const [scope,setScope]=useState("all");
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold" style={{color:C.tx}}>Briefings</h2>
        <div className="flex gap-2">
          <Btn><Save size={12}/> Save Template</Btn>
          <Btn><Download size={12}/> Export PDF</Btn>
          <Btn primary><Sparkles size={12}/> Generate</Btn>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-4">
        {["all","p1","p2","p3"].map(s=><button key={s} onClick={()=>setScope(s)} className="px-3 py-1 rounded-lg text-xs border" style={{borderColor:scope===s?C.ac:C.bd,color:scope===s?C.ac:C.txM,backgroundColor:scope===s?`${C.ac}20`:"transparent"}}>{s==="all"?"All Projects":PROJECTS.find(p=>p.id===s)?.name}</button>)}
        <div className="ml-auto flex gap-1">{["24h","7d","30d"].map(p=><button key={p} onClick={()=>setPeriod(p)} className="px-2 py-1 rounded text-xs" style={{backgroundColor:period===p?`${C.ac}20`:"transparent",color:period===p?C.ac:C.txM}}>{p}</button>)}</div>
      </div>
      {/* Active blocks */}
      <div className="space-y-3 mb-4">
        {blocks.map(bId=>{const bDef=REPORT_BLOCKS.find(b=>b.id===bId);if(!bDef)return null;const I=bDef.icon;
          return (<div key={bId} className="rounded-xl border group" style={{backgroundColor:C.bgC,borderColor:C.bd}}>
            <div className="flex items-center gap-3 p-3 border-b" style={{borderColor:C.bd}}>
              <GripVertical size={14} style={{color:C.txD}} className="cursor-grab"/>
              <I size={14} style={{color:C.ac}}/><span className="text-sm font-medium flex-1" style={{color:C.tx}}>{bDef.name}</span>
              <button onClick={()=>setBlocks(bs=>bs.filter(b=>b!==bId))} className="p-1 rounded hover:bg-white/10 opacity-0 group-hover:opacity-100"><X size={12} style={{color:C.txD}}/></button>
            </div>
            <div className="p-4">
              {bId==="exec-summary"&&<p className="text-sm" style={{color:C.txM}}>Strong progress across projects. 5 tasks completed, 1 blocked (API docs awaiting credentials). Auth module nearing completion — recommend starting Stripe integration.</p>}
              {bId==="task-stats"&&<div className="grid grid-cols-4 gap-3">{[{l:"Completed",v:"5",c:"#22c55e"},{l:"Running",v:"3",c:"#3b82f6"},{l:"Blocked",v:"1",c:"#f97316"},{l:"Failed",v:"0",c:"#ef4444"}].map(s=><div key={s.l} className="p-2 rounded" style={{backgroundColor:C.bg}}><span className="text-[10px] block" style={{color:C.txD}}>{s.l}</span><span className="text-2xl font-bold" style={{color:s.c}}>{s.v}</span></div>)}</div>}
              {bId==="per-project"&&<div className="space-y-2">{PROJECTS.map(p=>{const pct=Math.round(p.done/p.total*100);return<div key={p.id} className="flex items-center gap-3"><div className="w-3 h-3 rounded-sm" style={{backgroundColor:p.color}}/><span className="text-xs w-36" style={{color:C.tx}}>{p.name}</span><div className="flex-1 h-2 rounded-full" style={{backgroundColor:C.bg}}><div className="h-full rounded-full" style={{width:`${pct}%`,backgroundColor:p.color}}/></div><span className="text-xs" style={{color:C.txM}}>{pct}%</span></div>})}</div>}
              {bId==="recommendations"&&<div className="space-y-2">{["Unblock API docs — provide test API key","Start Stripe integration — deps met","Schedule security audit next week"].map((r,i)=><div key={i} className="flex items-center justify-between p-2 rounded" style={{backgroundColor:C.bg}}><span className="text-sm" style={{color:C.tx}}>{r}</span><button className="px-2 py-1 rounded text-[10px] bg-indigo-600 text-white ml-2">Create Task</button></div>)}</div>}
              {!["exec-summary","task-stats","per-project","recommendations"].includes(bId)&&<p className="text-xs" style={{color:C.txD}}>Generated content for "{bDef.name}" will appear here.</p>}
            </div>
          </div>);
        })}
      </div>
      <button onClick={()=>setShowAdd(true)} className="w-full p-4 rounded-xl border border-dashed flex items-center justify-center gap-2 hover:border-indigo-500/50" style={{borderColor:C.bd,color:C.txD}}><Plus size={16}/> Add Report Block</button>
      {showAdd&&<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={()=>setShowAdd(false)}>
        <div className="rounded-xl border w-full max-w-md max-h-[60vh] overflow-y-auto p-4" style={{backgroundColor:C.bg,borderColor:C.bd}} onClick={e=>e.stopPropagation()}>
          <h3 className="text-lg font-semibold mb-3" style={{color:C.tx}}>Add Report Block</h3>
          {REPORT_BLOCKS.map(b=>{const I=b.icon;const added=blocks.includes(b.id);return(
            <div key={b.id} className="flex items-center gap-3 p-3 rounded-lg mb-1" style={{backgroundColor:added?`${C.ac}10`:C.bgC}}>
              <I size={16} style={{color:added?C.ac:C.txD}}/><div className="flex-1"><span className="text-sm" style={{color:C.tx}}>{b.name}</span><p className="text-[10px]" style={{color:C.txD}}>{b.desc}</p></div>
              {added?<Bd color={C.ac} s>Added</Bd>:<button onClick={()=>{setBlocks(bs=>[...bs,b.id]);setShowAdd(false);}} className="px-3 py-1 rounded text-xs bg-indigo-600 text-white">Add</button>}
            </div>);
          })}
        </div>
      </div>}
    </div>
  );
};

// ============ STORAGE ============
const StorageView = () => {
  const files=[{name:"auth-schema-v2.md",proj:"AI SaaS Platform",worker:"Claude Opus",size:"12 KB",date:"2h ago",tags:["backend"]},{name:"competitor-analysis.md",proj:"AI SaaS Platform",worker:"Gemini Research",size:"45 KB",date:"4h ago",tags:["research"]},{name:"security-report.md",proj:"AI SaaS Platform",worker:"Kimi Analyzer",size:"28 KB",date:"1h ago",tags:["security"]},{name:"email-templates.html",proj:"Marketing Automation",worker:"Claude Opus",size:"8 KB",date:"30m ago",tags:["frontend"]}];
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6"><h2 className="text-lg font-semibold" style={{color:C.tx}}>Storage</h2><Btn primary><Upload size={14}/> Upload</Btn></div>
      <div className="grid grid-cols-4 gap-3 mb-6">{[{n:"Recent",c:4,i:Clock,cl:"#3b82f6"},{n:"Review",c:2,i:Eye,cl:"#a855f7"},{n:"Approved",c:8,i:CheckCircle2,cl:"#22c55e"},{n:"Task Files",c:12,i:Paperclip,cl:"#f59e0b"}].map(c=>{const I=c.i;return<div key={c.n} className="p-3 rounded-xl border cursor-pointer hover:border-indigo-500/30" style={{backgroundColor:C.bgC,borderColor:C.bd}}><div className="flex items-center gap-2 mb-1"><I size={14} style={{color:c.cl}}/><span className="text-sm" style={{color:C.tx}}>{c.n}</span></div><span className="text-xs" style={{color:C.txM}}>{c.c} files</span></div>;})}</div>
      <div className="rounded-xl border overflow-hidden" style={{borderColor:C.bd}}>
        {PROJECTS.map(p=><div key={p.id}><div className="flex items-center gap-2 p-3 border-b" style={{borderColor:C.bd,backgroundColor:C.bgC}}><FolderOpen size={16} style={{color:p.color}}/><span className="text-sm font-semibold" style={{color:C.tx}}>{p.name}</span></div>
          {files.filter(f=>f.proj===p.name).map(f=><div key={f.name} className="flex items-center gap-3 px-6 py-2 border-b hover:bg-white/5" style={{borderColor:C.bd}}><File size={14} style={{color:C.txD}}/><span className="text-sm flex-1" style={{color:C.tx}}>{f.name}</span><span className="text-xs" style={{color:C.txM}}>{f.size}</span><span className="text-xs" style={{color:C.txD}}>{f.date}</span></div>)}</div>)}
      </div>
    </div>
  );
};

// ============ SETTINGS (with Credentials Tiers + Custom Tabs) ============
const SettingsView = () => {
  const [tab,setTab]=useState("profile");
  const tabs=[{id:"profile",l:"Profile",i:User},{id:"api",l:"API Keys",i:Key},{id:"credentials",l:"Credentials",i:Shield},{id:"system",l:"System Files",i:FileText},{id:"notif",l:"Notifications",i:Bell},{id:"usage",l:"Usage & Billing",i:TrendingUp},{id:"defaults",l:"Agent Defaults",i:Bot},{id:"plugins",l:"Custom Tabs",i:Puzzle}];
  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="w-52 border-r p-4 overflow-y-auto" style={{borderColor:C.bd,backgroundColor:C.bgS}}>
        {tabs.map(t=>{const I=t.i;return<button key={t.id} onClick={()=>setTab(t.id)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm mb-1" style={{color:tab===t.id?C.ac:C.txM,backgroundColor:tab===t.id?`${C.ac}15`:"transparent"}}><I size={16}/>{t.l}</button>;})}
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {tab==="profile"&&<div className="max-w-xl space-y-4"><h2 className="text-lg font-semibold" style={{color:C.tx}}>Profile</h2><div><Lbl>Name</Lbl><Inp placeholder="Michael"/></div><div><Lbl>Email</Lbl><Inp placeholder="michael@example.com"/></div><div><Lbl>Timezone</Lbl><Sel><option>Europe/Bratislava (UTC+1)</option></Sel></div><Btn primary>Save</Btn></div>}

        {tab==="api"&&<div className="max-w-xl space-y-4"><h2 className="text-lg font-semibold" style={{color:C.tx}}>API Keys & Providers</h2>
          {[{n:"Anthropic",k:"sk-ant-***",s:true},{n:"Google",k:"AIza***",s:true},{n:"OpenAI",k:"sk-proj-***",s:true},{n:"Moonshot",k:"",s:false}].map(p=><div key={p.n} className="p-4 rounded-xl border" style={{backgroundColor:C.bgC,borderColor:C.bd}}><div className="flex items-center justify-between mb-2"><span className="text-sm font-medium" style={{color:C.tx}}>{p.n}</span><Bd color={p.s?"#22c55e":"#71717a"} s>{p.s?"Active":"Not Set"}</Bd></div><div className="flex gap-2"><input type="password" value={p.k} readOnly className="flex-1 px-3 py-1.5 rounded-lg text-sm border outline-none" style={{backgroundColor:C.bg,borderColor:C.bd,color:C.txM}} placeholder="Enter API key..."/><Btn>{p.k?"Rotate":"Add"}</Btn></div></div>)}</div>}

        {tab==="credentials"&&<div className="max-w-xl space-y-4"><h2 className="text-lg font-semibold" style={{color:C.tx}}>Credentials Vault</h2>
          <p className="text-sm" style={{color:C.txM}}>Manage secrets agents may need. Three access tiers control how workers interact with each credential.</p>
          {/* Tier explanation */}
          <div className="grid grid-cols-3 gap-3">
            {[{t:"Open",c:"#22c55e",d:"Worker reads directly. For non-sensitive config.",i:"🟢"},{t:"Gated",c:"#f59e0b",d:"Requires your approval per use. Default.",i:"🟡"},{t:"Ephemeral",c:"#ef4444",d:"Subagent uses it and discards. Never enters context.",i:"🔴"}].map(tier=>
              <div key={tier.t} className="p-3 rounded-xl border" style={{backgroundColor:C.bgC,borderColor:C.bd}}>
                <div className="flex items-center gap-2 mb-1"><span>{tier.i}</span><span className="text-sm font-semibold" style={{color:tier.c}}>{tier.t}</span></div>
                <p className="text-[10px]" style={{color:C.txD}}>{tier.d}</p>
              </div>
            )}
          </div>
          {/* Credentials list */}
          {[{n:"Stripe API Key",tier:"Gated",scope:"AI SaaS Platform"},{n:"AWS Access Key",tier:"Ephemeral",scope:"Global"},{n:"Test DB Password",tier:"Open",scope:"Data Pipeline v2"},{n:"GitHub Token",tier:"Gated",scope:"Global"}].map(cr=>(
            <div key={cr.n} className="p-4 rounded-xl border" style={{backgroundColor:C.bgC,borderColor:C.bd}}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{color:C.tx}}>{cr.n}</span>
                <div className="flex items-center gap-2">
                  <Bd color={cr.tier==="Open"?"#22c55e":cr.tier==="Gated"?"#f59e0b":"#ef4444"} s>{cr.tier}</Bd>
                  <Bd color="#71717a" bg="#27272a" s>{cr.scope}</Bd>
                </div>
              </div>
              <div className="flex gap-2">
                <input type="password" value="••••••••••" readOnly className="flex-1 px-3 py-1.5 rounded-lg text-sm border outline-none" style={{backgroundColor:C.bg,borderColor:C.bd,color:C.txM}}/>
                <Btn>Edit</Btn>
              </div>
            </div>
          ))}
          <button className="w-full p-3 rounded-xl border border-dashed flex items-center justify-center gap-2 hover:border-indigo-500/50" style={{borderColor:C.bd,color:C.txD}}><Plus size={14}/> Add Credential</button>
        </div>}

        {tab==="system"&&<div className="max-w-2xl space-y-4"><h2 className="text-lg font-semibold" style={{color:C.tx}}>System Files</h2>
          <p className="text-sm" style={{color:C.txM}}>Global config. Per-worker overrides are in each worker's settings.</p>
          {["memory.md","global-prompt.md"].map(f=><div key={f} className="rounded-xl border overflow-hidden" style={{borderColor:C.bd}}>
            <div className="flex items-center justify-between p-3 border-b" style={{borderColor:C.bd,backgroundColor:C.bgC}}><div className="flex items-center gap-2"><FileText size={14} style={{color:C.ac}}/><span className="text-sm font-medium" style={{color:C.tx}}>{f}</span></div><button className="px-3 py-1 rounded text-xs bg-indigo-600 text-white">Save</button></div>
            <textarea className="w-full p-4 font-mono text-xs bg-transparent outline-none resize-none" rows={4} style={{color:C.tx,backgroundColor:C.bg}} defaultValue={f==="memory.md"?"# Project Context\n\n## AI SaaS Platform\n- Stack: Next.js, Supabase, Tailwind":"You are an AI orchestrator managing tasks across workers..."}/>
          </div>)}</div>}

        {tab==="notif"&&<div className="max-w-xl space-y-3"><h2 className="text-lg font-semibold mb-2" style={{color:C.tx}}>Notifications</h2>
          {[{l:"Task completed",on:true},{l:"Agent blocked",on:true},{l:"Review ready",on:true},{l:"Daily briefing",on:false},{l:"Rate limit hit",on:true},{l:"Master plan stage done",on:true}].map(n=><div key={n.l} className="flex items-center justify-between p-3 rounded-xl border" style={{backgroundColor:C.bgC,borderColor:C.bd}}><span className="text-sm" style={{color:C.tx}}>{n.l}</span><div className="w-10 h-5 rounded-full cursor-pointer flex items-center px-0.5" style={{backgroundColor:n.on?"#22c55e":C.bd}}><div className="w-4 h-4 rounded-full bg-white" style={{transform:n.on?"translateX(20px)":"translateX(0)",transition:"transform 0.2s"}}/></div></div>)}</div>}

        {tab==="usage"&&<div className="max-w-xl space-y-4"><h2 className="text-lg font-semibold" style={{color:C.tx}}>Usage & Billing</h2>
          <div className="p-4 rounded-xl border" style={{backgroundColor:C.bgC,borderColor:C.bd}}><div className="flex justify-between mb-2"><span className="text-sm" style={{color:C.tx}}>Current Plan</span><Bd color="#22c55e" bg="#052e16">Free</Bd></div><Btn primary>Upgrade to Pro</Btn></div>
          <div className="p-4 rounded-xl border" style={{backgroundColor:C.bgC,borderColor:C.bd}}><h3 className="text-sm font-semibold mb-3" style={{color:C.tx}}>This Month</h3>
            {[{n:"Claude",v:"1.2M",c:"$18"},{n:"Gemini",v:"800K",c:"$4"},{n:"GPT-4o",v:"200K",c:"$2"}].map(u=><div key={u.n} className="flex justify-between p-2"><span className="text-xs" style={{color:C.txM}}>{u.n}</span><span className="text-xs" style={{color:C.tx}}>{u.v}</span><span className="text-xs font-bold" style={{color:"#22c55e"}}>{u.c}</span></div>)}
            <div className="border-t mt-2 pt-2 flex justify-between" style={{borderColor:C.bd}}><span className="text-sm" style={{color:C.tx}}>Total</span><span className="text-sm font-bold" style={{color:"#22c55e"}}>$24.00</span></div>
          </div></div>}

        {tab==="defaults"&&<div className="max-w-xl space-y-4"><h2 className="text-lg font-semibold" style={{color:C.tx}}>Agent Defaults</h2>
          <p className="text-sm mb-2" style={{color:C.txM}}>Platform-controlled settings that apply to all workers.</p>
          <div><Lbl>Default System Prompt</Lbl><textarea className="w-full px-3 py-2 rounded-lg text-sm border outline-none resize-none font-mono" rows={3} style={{backgroundColor:C.bgC,borderColor:C.bd,color:C.tx}} defaultValue="Follow instructions precisely. Report progress clearly."/></div>
          <div><Lbl>Task Routing</Lbl><Sel><option>Orchestrator decides</option><option>Round-robin</option><option>Skill-based</option></Sel></div>
          <div><Lbl>Default Review Mode</Lbl><Sel><option>Human Review</option><option>AI Review</option><option>Hybrid</option></Sel></div>
          <Btn primary>Save</Btn>
          <div className="border-t pt-4 mt-4" style={{borderColor:C.bd}}><h3 className="text-sm font-semibold mb-2" style={{color:C.tx}}>Worker Setup Guides</h3><p className="text-xs mb-3" style={{color:C.txD}}>Step-by-step setup for each worker type. Settings the user configures locally.</p>
            {["Claude CLI","Gemini CLI","ChatGPT CLI","Kimi CLI"].map(t=><div key={t} className="flex items-center justify-between p-3 rounded-lg mb-1" style={{backgroundColor:C.bgC}}><span className="text-sm" style={{color:C.tx}}>{t}</span><button className="px-3 py-1 rounded text-xs border" style={{borderColor:C.bd,color:C.acH}}>View Guide</button></div>)}
          </div></div>}

        {tab==="plugins"&&<div className="max-w-xl space-y-4"><h2 className="text-lg font-semibold" style={{color:C.tx}}>Custom Tabs (Plugins)</h2>
          <p className="text-sm" style={{color:C.txM}}>Add custom tabs powered by iframe plugins. Use our JS SDK to access Orchestria data.</p>
          <div className="p-4 rounded-xl border" style={{backgroundColor:C.bgC,borderColor:C.bd}}>
            <div className="flex items-center gap-3 mb-2"><Globe size={16} style={{color:C.ac}}/><span className="text-sm font-medium" style={{color:C.tx}}>Marketing Dashboard</span><Bd color="#22c55e" s>Active</Bd></div>
            <span className="text-xs block" style={{color:C.txD}}>https://my-company.vercel.app/marketing</span>
          </div>
          <div className="p-4 rounded-xl border" style={{backgroundColor:C.bgC,borderColor:C.bd}}>
            <div className="flex items-center gap-3 mb-2"><Globe size={16} style={{color:C.ac}}/><span className="text-sm font-medium" style={{color:C.tx}}>Market Research Tracker</span><Bd color="#22c55e" s>Active</Bd></div>
            <span className="text-xs block" style={{color:C.txD}}>https://my-company.vercel.app/research</span>
          </div>
          <button className="w-full p-3 rounded-xl border border-dashed flex items-center justify-center gap-2 hover:border-indigo-500/50" style={{borderColor:C.bd,color:C.txD}}><Plus size={14}/> Add Custom Tab</button>
          <div className="p-4 rounded-xl border" style={{backgroundColor:`${C.ac}08`,borderColor:`${C.ac}30`}}>
            <h3 className="text-sm font-semibold mb-2" style={{color:C.ac}}>SDK Documentation</h3>
            <pre className="text-[10px] p-3 rounded-lg overflow-x-auto" style={{backgroundColor:C.bg,color:C.txM}}>{`const orchestria = new OrchestriaPlugin();
const tasks = await orchestria.tasks.list();
const files = await orchestria.storage.search("auth");
orchestria.on("task.completed", cb);`}</pre>
          </div>
        </div>}
      </div>
    </div>
  );
};

// ============ MAIN APP ============
export default function App() {
  const [view,setView]=useState("dashboard");
  const [proj,setProj]=useState("p1");
  const [col,setCol]=useState(false);
  const [task,setTask]=useState(null);
  const renderView = () => {
    switch(view){
      case "dashboard": return <DashboardView/>;
      case "tasks": return <TasksView proj={proj} onTask={setTask}/>;
      case "workers": return <WorkersView/>;
      case "chat": return <ChatView/>;
      case "planner": return <PlannerView/>;
      case "notes": return <NotesView/>;
      case "briefings": return <BriefingsView/>;
      case "storage": return <StorageView/>;
      case "settings": return <SettingsView/>;
      default: return <DashboardView/>;
    }
  };
  return (
    <div className="h-screen flex overflow-hidden" style={{backgroundColor:C.bg,color:C.tx,fontFamily:"'Inter',system-ui,sans-serif"}}>
      <Sidebar view={view} setView={setView} proj={proj} setProj={setProj} col={col} setCol={setCol}/>
      <div className="flex-1 flex flex-col overflow-hidden"><TopBar proj={proj} view={view}/>{renderView()}</div>
      {task&&<TaskModal task={task} onClose={()=>setTask(null)}/>}
    </div>
  );
}
