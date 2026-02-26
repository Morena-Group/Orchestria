import { useState } from "react";
import {
  LayoutDashboard, ListTodo, Bot, MessageSquare, Settings,
  ChevronDown, ChevronRight, Plus, Search, Bell, Clock,
  CheckCircle2, XCircle, AlertTriangle, Play, Pause, Eye, Lock,
  ArrowRight, Filter, Zap, Brain, Send, ChevronLeft, Calendar,
  BarChart3, RefreshCw, Sparkles, X, Check, Edit3, User, Activity,
  TrendingUp, Code
} from "lucide-react";

// ============ THEME ============
const C = { bg: "#050507", bgS: "#0a0a0f", bgC: "#141720", bgH: "#1c1f2e", bgO: "#252836", bd: "rgba(200,169,110,0.1)", bdS: "rgba(200,169,110,0.08)", bdSub: "rgba(255,255,255,0.04)", tx: "#ededef", txS: "#a1a1aa", txM: "#71717a", txF: "#52525b", ac: "#c9a96e", acH: "#d4b87e", acM: "#3d3222", acSub: "#2a2318", acFg: "#0f0e0a", err: "#f87171", errM: "#2a1215", glass: "rgba(200,169,110,0.03)", glassBd: "rgba(200,169,110,0.08)", glassHov: "rgba(200,169,110,0.06)", glassCard: "rgba(12,12,18,0.6)", acDim: "rgba(201,169,110,0.15)", acGlow: "rgba(201,169,110,0.08)" };
const ST = { draft:{l:"Draft",c:"#a1a1aa",bg:"#1c1f2e",i:Edit3}, pending:{l:"Pending",c:"#a1a1aa",bg:"#1c1f2e",i:Clock}, approved:{l:"Approved",c:"#a1a1aa",bg:"#1c1f2e",i:Check}, running:{l:"Running",c:"#c9a96e",bg:"rgba(201,169,110,0.15)",i:Play}, awaiting_input:{l:"Awaiting",c:"#c9a96e",bg:"rgba(201,169,110,0.15)",i:AlertTriangle}, review:{l:"Review",c:"#c9a96e",bg:"rgba(201,169,110,0.15)",i:Eye}, completed:{l:"Completed",c:"#a1a1aa",bg:"#1c1f2e",i:CheckCircle2}, failed:{l:"Failed",c:"#f87171",bg:"#2a1215",i:XCircle} };
const PRI = { urgent:{l:"Urgent",c:"#ededef"}, high:{l:"High",c:"#ededef"}, medium:{l:"Medium",c:"#a1a1aa"}, low:{l:"Low",c:"#71717a"} };
const WT = { "claude-cli":{n:"Claude",c:"#1c1f2e",a:"C"}, "gemini-cli":{n:"Gemini",c:"#1c1f2e",a:"G"}, "chatgpt-cli":{n:"ChatGPT",c:"#1c1f2e",a:"O"} };

// ============ DATA ============
const PROJECTS = [
  { id:"p1", name:"AI SaaS Platform", color:"#c9a96e", total:24, done:8 },
  { id:"p2", name:"Marketing Site", color:"#52525b", total:12, done:3 },
];
const WORKERS = [
  { id:"w1", name:"Claude Opus", type:"claude-cli", role:"both", status:"online", active:3, done:47 },
  { id:"w2", name:"Gemini", type:"gemini-cli", role:"worker", status:"online", active:1, done:23 },
  { id:"w3", name:"ChatGPT", type:"chatgpt-cli", role:"worker", status:"offline", active:0, done:15 },
];
const TASKS = [
  { id:"t1", title:"Design database schema", s:"completed", p:"high", w:"w1", pr:"p1", sub:3, subD:3, lock:false, tags:["backend"] },
  { id:"t2", title:"Research pricing models", s:"running", p:"medium", w:"w2", pr:"p1", sub:2, subD:1, lock:false, tags:["research"] },
  { id:"t3", title:"Write API docs", s:"awaiting_input", p:"medium", w:"w3", pr:"p1", sub:0, subD:0, lock:false, tags:["docs"], block:"Needs API key" },
  { id:"t4", title:"Implement Kanban UI", s:"review", p:"high", w:"w1", pr:"p1", sub:2, subD:2, lock:false, tags:["frontend"] },
  { id:"t5", title:"Setup CI/CD", s:"pending", p:"urgent", w:null, pr:"p1", sub:2, subD:0, lock:false, tags:["devops"] },
];
const CHATS = [
  { id:"m1", role:"user", content:"Break down auth module into subtasks?", time:"10:23 AM" },
  { id:"m2", role:"bot", content:"I'll create:\n1. DB schema (Claude)\n2. JWT tokens (Claude)\n3. OAuth (Gemini)\n4. Password hashing (ChatGPT)\n\nCreate these?", time:"10:23 AM" },
  { id:"m3", role:"user", content:"Yes, assign OAuth to Claude", time:"10:25 AM" },
  { id:"m4", role:"bot", content:"Done! 4 subtasks created under Auth. All Draft status.", time:"10:25 AM" },
];

// ============ COMPONENTS ============
const Bd = ({children,color,bg}) => <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium" style={{color,backgroundColor:bg||`${color}20`}}>{children}</span>;
const Av = ({type,size=28,role}) => { const c=WT[type]||{n:"?",c:"#1c1f2e",a:"?"}; return (<div className="rounded-full flex items-center justify-center font-semibold relative flex-shrink-0" style={{width:size,height:size,backgroundColor:c.c,border:"1px solid #1e2231",color:"#a1a1aa",fontSize:size*0.4}}>{c.a}{(role==="orchestrator"||role==="both")&&<div className="absolute -bottom-0.5 -right-0.5 rounded-full flex items-center justify-center" style={{width:size*0.45,height:size*0.45,backgroundColor:"#c9a96e"}}><Brain size={size*0.3} className="text-black"/></div>}</div>);};
const Dot = ({s}) => <span className="text-xs font-medium" style={{color:s==="online"?"#a1a1aa":s==="busy"?"#c9a96e":"#52525b"}}>{s==="online"?"●":"○"}</span>;
const Inp = ({...p}) => <input {...p} className="w-full px-3 py-2 rounded-lg text-sm border outline-none" style={{backgroundColor:C.glass,borderColor:C.glassBd,color:C.tx,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}/>;
const Btn = ({children,primary,...p}) => {
  const sty = primary
    ? {background:"linear-gradient(135deg,#c9a96e,#b89555)",color:"#0f0e0a",boxShadow:"0 0 20px rgba(201,169,110,0.15),inset 0 1px 0 rgba(255,255,255,0.15)"}
    : {backgroundColor:C.glass,borderColor:C.glassBd,color:C.txS,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"};
  const onOver = (e) => {
    if(primary){e.currentTarget.style.boxShadow="0 0 30px rgba(201,169,110,0.25),inset 0 1px 0 rgba(255,255,255,0.2)";e.currentTarget.style.transform="translateY(-1px)";}
    else{e.currentTarget.style.backgroundColor=C.glassHov;e.currentTarget.style.borderColor="rgba(201,169,110,0.15)";}
  };
  const onOut = (e) => {
    if(primary){e.currentTarget.style.boxShadow="0 0 20px rgba(201,169,110,0.15),inset 0 1px 0 rgba(255,255,255,0.15)";e.currentTarget.style.transform="translateY(0)";}
    else{e.currentTarget.style.backgroundColor=C.glass;e.currentTarget.style.borderColor=C.glassBd;}
  };
  return <button {...p} className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${primary?"":"border"}`} style={sty} onMouseOver={onOver} onMouseOut={onOut}>{children}</button>;
};
const EmptyState = ({icon:Icon, title}) => (
  <div className="flex-1 flex items-center justify-center p-8">
    <div className="text-center max-w-sm">
      <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{backgroundColor:`${C.ac}15`}}>
        <Icon size={28} style={{color:C.ac}}/>
      </div>
      <h3 className="text-base font-semibold mb-2" style={{color:C.tx}}>{title}</h3>
    </div>
  </div>
);

// ============ SIDEBAR ============
const Sidebar = ({view,setView,proj,setProj,col,setCol}) => {
  const nav=[{id:"dashboard",l:"Dashboard",ic:LayoutDashboard},{id:"tasks",l:"My Tasks",ic:ListTodo},{id:"workers",l:"Workers",ic:Bot},{id:"chat",l:"Chat",ic:MessageSquare},{id:"settings",l:"Settings",ic:Settings}];
  return (
    <div className="h-full flex flex-col border-r" style={{width:col?60:240,backgroundColor:"rgba(8,8,12,0.8)",backdropFilter:"blur(40px)",WebkitBackdropFilter:"blur(40px)",borderColor:C.bdSub,transition:"width 0.2s"}}>
      <div className="flex items-center gap-2.5 px-4 py-4 border-b" style={{borderColor:C.bdSub}}>
        {!col&&<><div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{backgroundColor:C.ac}}><Zap size={18} style={{color:C.acFg}}/></div><span className="font-bold text-lg" style={{color:C.tx}}>Orchestria</span></>}
        <button onClick={()=>setCol(!col)} className="ml-auto p-1 rounded" style={{color:C.txS}}>{col?<ChevronRight size={16}/>:<ChevronLeft size={16}/>}</button>
      </div>
      <nav className="flex-1 py-2 overflow-y-auto">
        {nav.map(n=>{const I=n.ic;const a=view===n.id;return(<button key={n.id} onClick={()=>setView(n.id)} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium ${col?'justify-center':''}`} title={col?n.l:undefined} style={{color:a?C.ac:C.txS,backgroundColor:a?C.acSub:"transparent",borderLeft:a?`2px solid ${C.ac}`:"2px solid transparent",transition:"all 150ms"}}><I size={18} style={{opacity:a?1:0.6}}/>{!col&&<span>{n.l}</span>}</button>);})}
        {!col&&<div className="mt-5 px-4">
          <button className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-widest mb-2" style={{color:C.txF}}><ChevronDown size={12}/> Projects</button>
          {PROJECTS.map(p=>(<button key={p.id} onClick={()=>{setProj(p.id);setView("dashboard");}} className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md mb-0.5" style={{color:proj===p.id?C.tx:C.txS,backgroundColor:proj===p.id?C.bgH:"transparent",transition:"all 150ms"}}><div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{backgroundColor:proj===p.id?C.ac:C.txF}}/><span className="truncate">{p.name}</span><span className="ml-auto text-[11px]" style={{color:C.txM}}>{p.done}/{p.total}</span></button>))}
        </div>}
      </nav>
    </div>
  );
};

// ============ TOPBAR ============
const TopBar = ({proj,view}) => {
  const p=PROJECTS.find(x=>x.id===proj);
  const labels={dashboard:"Dashboard",tasks:"My Tasks",workers:"Workers",chat:"Chat",settings:"Settings"};
  const [showNotif,setShowNotif]=useState(false);
  const unread=2;
  return (
    <div className="h-14 flex items-center justify-between px-6 border-b" style={{backgroundColor:"rgba(8,8,12,0.5)",backdropFilter:"blur(30px)",WebkitBackdropFilter:"blur(30px)",borderColor:C.bd}}>
      <div className="flex items-center gap-3">
        {p&&<><div className="w-4 h-4 rounded" style={{backgroundColor:p.color}}/><span className="text-sm font-medium" style={{color:C.tx}}>{p.name}</span><ChevronRight size={14} style={{color:C.txM}}/></>}
        <span className="text-sm font-semibold" style={{color:C.tx}}>{labels[view]}</span>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative flex items-center gap-2 pl-8 pr-3 py-1.5 rounded-lg text-sm border" style={{backgroundColor:C.glass,borderColor:C.glassBd,color:C.txM,width:220,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}><Search size={16} className="absolute left-2.5" style={{color:C.txM}}/>Search...</button>
        <div className="relative">
          <button onClick={()=>setShowNotif(!showNotif)} className="relative p-2 rounded-lg" style={{color:showNotif?C.ac:C.txS}}><Bell size={18}/>{unread>0&&<span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{backgroundColor:C.ac}}/>}</button>
          {showNotif&&<div className="absolute right-0 top-full mt-1 w-80 rounded-xl border overflow-hidden z-50" style={{backgroundColor:C.bg,borderColor:C.bd}}>
            <div className="p-3 border-b" style={{borderColor:C.bd}}><span className="text-sm font-semibold" style={{color:C.tx}}>Notifications</span></div>
            <div className="max-h-48 overflow-y-auto text-xs p-3" style={{color:C.txS}}>Task 'Kanban UI' ready for review • 2m ago<br/>Task 'API docs' blocked • 15m ago</div>
          </div>}
        </div>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{backgroundColor:C.bgH,color:C.txS}}>M</div>
      </div>
    </div>
  );
};

// ============ DASHBOARD ============
const DashboardView = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border p-4" style={{backgroundColor:C.glassCard,backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderColor:C.bd,borderTop:`1px solid rgba(201,169,110,0.12)`}}>
          <div className="flex items-center gap-2 mb-3"><Activity size={14} style={{color:C.ac}}/><span className="text-sm font-medium" style={{color:C.tx}}>Task Status</span></div>
          <div className="grid grid-cols-3 gap-2">
            {[{l:"Running",v:TASKS.filter(t=>t.s==="running").length,c:C.ac},{l:"Review",v:TASKS.filter(t=>t.s==="review").length,c:C.ac},{l:"Done",v:TASKS.filter(t=>t.s==="completed").length,c:C.tx}].map(s=><div key={s.l} className="p-2 rounded text-center" style={{backgroundColor:C.bg}}><span className="text-[10px] block" style={{color:C.txM}}>{s.l}</span><span className="text-lg font-bold" style={{color:s.c}}>{s.v}</span></div>)}
          </div>
        </div>
        <div className="rounded-xl border p-4" style={{backgroundColor:C.glassCard,backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderColor:C.bd,borderTop:`1px solid rgba(201,169,110,0.12)`}}>
          <div className="flex items-center gap-2 mb-3"><TrendingUp size={14} style={{color:C.ac}}/><span className="text-sm font-medium" style={{color:C.tx}}>Progress</span></div>
          <div className="space-y-2">{PROJECTS.map(p=>{const pct=Math.round((p.done/p.total)*100);return(<div key={p.id}><span className="text-xs block" style={{color:C.txS}}>{p.name}</span><div className="flex-1 h-2 rounded-full overflow-hidden mt-1" style={{backgroundColor:C.bg}}><div className="h-full rounded-full" style={{width:`${pct}%`,backgroundColor:p.color}}/></div></div>);})}</div>
        </div>
        <div className="rounded-xl border p-4" style={{backgroundColor:C.glassCard,backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderColor:C.bd,borderTop:`1px solid rgba(201,169,110,0.12)`}}>
          <div className="flex items-center gap-2 mb-3"><Bot size={14} style={{color:C.ac}}/><span className="text-sm font-medium" style={{color:C.tx}}>Active Workers</span></div>
          <div className="space-y-2">{WORKERS.filter(w=>w.active>0).map(w=><div key={w.id} className="flex items-center gap-2 p-2 rounded" style={{backgroundColor:C.bg}}><Av type={w.type} size={20}/><div className="flex-1 min-w-0"><span className="text-xs block" style={{color:C.tx}}>{w.name}</span><span className="text-[10px]" style={{color:C.txM}}>{w.active} tasks</span></div><Dot s={w.status}/></div>)}</div>
        </div>
        <div className="rounded-xl border p-4" style={{backgroundColor:C.glassCard,backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderColor:C.bd,borderTop:`1px solid rgba(201,169,110,0.12)`}}>
          <div className="flex items-center gap-2 mb-3"><Clock size={14} style={{color:C.ac}}/><span className="text-sm font-medium" style={{color:C.tx}}>Recent</span></div>
          <div className="space-y-1 text-xs" style={{color:C.txS}}>Task 'DB schema' completed • 2m<br/>Task 'Research' running • 15m<br/>Task 'Kanban' in review • 45m</div>
        </div>
      </div>
    </div>
  );
};

// ============ TASKS ============
const TaskCard = ({task,onClick}) => { const w=WORKERS.find(x=>x.id===task.w); return (
  <div onClick={onClick} className="p-3 rounded-lg border cursor-pointer group" style={{backgroundColor:C.glass,borderColor:C.glassBd}} onMouseOver={e=>e.currentTarget.style.borderColor=C.ac} onMouseOut={e=>e.currentTarget.style.borderColor=C.glassBd}>
    <div className="flex items-center gap-1.5 mb-2">{task.lock&&<Lock size={12} style={{color:C.ac}}/>}<span className="text-sm font-medium truncate" style={{color:C.tx}}>{task.title}</span></div>
    {task.block&&<div className="mb-2 p-2 rounded text-xs" style={{backgroundColor:`${C.ac}20`,color:C.ac}}><AlertTriangle size={11} className="inline mr-1"/>{task.block}</div>}
    <div className="flex items-center gap-1.5 mb-2">{task.tags.map(t=><span key={t} className="px-1.5 py-0.5 rounded text-[10px]" style={{backgroundColor:`${C.ac}20`,color:C.acH}}>{t}</span>)}</div>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">{w?<Av type={w.type} size={20}/>:<div className="w-5 h-5 rounded-full border border-dashed" style={{borderColor:C.txM}}/>}{task.sub>0&&<span className="text-[10px]" style={{color:C.txS}}>{task.subD}/{task.sub}</span>}</div>
    </div>
  </div>
);};

const TasksView = ({proj,onTask}) => {
  const [viewMode,setViewMode]=useState("kanban");
  const tasks=TASKS.filter(t=>t.pr===proj);
  const cols=["draft","pending","approved","running","awaiting_input","review","completed"];
  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="flex items-center gap-4 px-6 py-3 border-b" style={{borderColor:C.bd}}>
        <span className="text-xs" style={{color:C.txS}}>Total: <strong style={{color:C.tx}}>{tasks.length}</strong></span>
        <div className="flex items-center gap-0.5 rounded-lg border p-0.5" style={{borderColor:C.bd}}>
          {[{id:"kanban",l:"Board",i:LayoutDashboard},{id:"list",l:"List",i:ListTodo}].map(m=>(
            <button key={m.id} onClick={()=>setViewMode(m.id)} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px]" style={{backgroundColor:viewMode===m.id?`${C.ac}20`:"transparent",color:viewMode===m.id?C.ac:C.txM}}><m.i size={12}/>{m.l}</button>
          ))}
        </div>
        <div className="ml-auto"><Btn primary><Plus size={12}/> New</Btn></div>
      </div>
      {viewMode==="kanban" ? (
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4" style={{minWidth:"max-content"}}>
          {cols.map(st=>{const s=ST[st];const I=s.i;const ct=tasks.filter(t=>t.s===st);return(
            <div key={st} className="flex-shrink-0" style={{width:260}}>
              <div className="flex items-center gap-2 mb-3 px-1"><I size={14} style={{color:s.c}}/><span className="text-sm font-semibold" style={{color:s.c}}>{s.l}</span><span className="text-xs px-1.5 py-0.5 rounded-full" style={{backgroundColor:s.bg,color:s.c}}>{ct.length}</span></div>
              <div className="space-y-2 min-h-[100px] p-1 rounded-lg" style={{backgroundColor:`${s.c}08`}}>
                {ct.map(t=><TaskCard key={t.id} task={t} onClick={()=>onTask(t)}/>)}
              </div>
            </div>
          );})}
        </div>
      </div>
      ) : (
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-2">{tasks.map(t=>{const s=ST[t.s];const w=WORKERS.find(x=>x.id===t.w);return(
          <div key={t.id} className="flex items-center gap-3 p-3 rounded-lg border" style={{backgroundColor:C.glass,borderColor:C.glassBd}}>
            <div className="flex-1"><span className="text-sm" style={{color:C.tx}}>{t.title}</span></div>
            <Bd color={s.c} bg={s.bg}>{s.l}</Bd>
            {w&&<Av type={w.type} size={20}/>}
          </div>
        );})}
        </div>
      </div>
      )}
    </div>
  );
};

// ============ WORKERS ============
const WorkersView = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="grid grid-cols-1 gap-4">
        {WORKERS.map(w=>(
          <div key={w.id} className="rounded-xl border p-4" style={{backgroundColor:C.glassCard,backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderColor:C.bd,borderTop:`1px solid rgba(201,169,110,0.12)`}}>
            <div className="flex items-center gap-3 mb-3">
              <Av type={w.type} size={32} role={w.role}/>
              <div className="flex-1">
                <span className="text-sm font-semibold block" style={{color:C.tx}}>{w.name}</span>
                <span className="text-xs" style={{color:C.txM}}>{w.role}</span>
              </div>
              <Dot s={w.status}/>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-2 rounded" style={{backgroundColor:C.bg}}>
                <span className="text-[10px] block" style={{color:C.txM}}>Active</span>
                <span className="text-lg font-bold" style={{color:C.tx}}>{w.active}</span>
              </div>
              <div className="p-2 rounded" style={{backgroundColor:C.bg}}>
                <span className="text-[10px] block" style={{color:C.txM}}>Completed</span>
                <span className="text-lg font-bold" style={{color:C.tx}}>{w.done}</span>
              </div>
              <div className="p-2 rounded" style={{backgroundColor:C.bg}}>
                <span className="text-[10px] block" style={{color:C.txM}}>Status</span>
                <span className="text-xs font-semibold" style={{color:C.ac}}>{w.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============ CHAT ============
const ChatView = () => {
  const [input,setInput]=useState("");
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {CHATS.map(m=>(
          <div key={m.id} className="flex gap-3" style={{justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
            {m.role==="bot"&&<Av type="claude-cli" size={24} role="orchestrator"/>}
            <div style={{maxWidth:"60%",backgroundColor:m.role==="user"?C.ac:C.glassCard,backdropFilter:m.role==="bot"?"blur(24px)":"none",WebkitBackdropFilter:m.role==="bot"?"blur(24px)":"none",color:m.role==="user"?C.acFg:C.tx,borderColor:m.role==="bot"?C.bd:"transparent",borderRadius:"12px",padding:"12px",border:`1px solid ${m.role==="bot"?C.bd:"transparent"}`}}>
              <p className="text-sm whitespace-pre-wrap">{m.content}</p>
              <span className="text-xs mt-2 block" style={{color:m.role==="user"?"rgba(15,14,10,0.7)":C.txM}}>{m.time}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 p-6 border-t" style={{borderColor:C.bd}}>
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask the orchestrator..." className="flex-1 px-4 py-2 rounded-lg border text-sm outline-none" style={{backgroundColor:C.glass,borderColor:C.glassBd,color:C.tx,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}/>
        <Btn primary><Send size={14}/></Btn>
      </div>
    </div>
  );
};

// ============ EMPTY PLACEHOLDER ============
const PlaceholderView = ({title}) => (
  <EmptyState icon={Sparkles} title={`${title} Coming Soon`} />
);

// ============ APP ============
export default function App() {
  const [view,setView]=useState("dashboard");
  const [proj,setProj]=useState("p1");
  const [col,setCol]=useState(false);
  const [selectedTask,setSelectedTask]=useState(null);

  return (
    <div className="flex h-screen overflow-hidden" style={{backgroundColor:C.bg}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        * { font-family: Inter, sans-serif; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${C.bd}; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: ${C.ac}; }
      `}</style>
      <Sidebar view={view} setView={setView} proj={proj} setProj={setProj} col={col} setCol={setCol}/>
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar proj={proj} view={view}/>
        <div className="flex-1 overflow-hidden" style={{background:`radial-gradient(circle at center, rgba(201,169,110,0.05) 0%, transparent 100%)`}}>
          {view==="dashboard"&&<DashboardView/>}
          {view==="tasks"&&<TasksView proj={proj} onTask={setSelectedTask}/>}
          {view==="workers"&&<WorkersView/>}
          {view==="chat"&&<ChatView/>}
          {view==="settings"&&<PlaceholderView title="Settings"/>}
          {selectedTask&&<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={()=>setSelectedTask(null)}>
            <div className="rounded-xl border w-full max-w-lg" style={{backgroundColor:C.bg,borderColor:C.bd}} onClick={e=>e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b" style={{borderColor:C.bd}}>
                <h3 className="text-lg font-semibold" style={{color:C.tx}}>Task Details</h3>
                <button onClick={()=>setSelectedTask(null)} className="p-1"><X size={16} style={{color:C.txS}}/></button>
              </div>
              <div className="p-4 space-y-3">
                <div><span className="text-xs" style={{color:C.txM}}>Title</span><p className="text-sm font-semibold mt-1" style={{color:C.tx}}>{selectedTask.title}</p></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="text-xs" style={{color:C.txM}}>Status</span><Bd color={ST[selectedTask.s].c} bg={ST[selectedTask.s].bg} className="mt-1">{ST[selectedTask.s].l}</Bd></div>
                  <div><span className="text-xs" style={{color:C.txM}}>Priority</span><Bd color={PRI[selectedTask.p].c} className="mt-1">{PRI[selectedTask.p].l}</Bd></div>
                </div>
                {selectedTask.block&&<div className="p-3 rounded text-sm" style={{backgroundColor:`${C.ac}20`,color:C.ac}}><AlertTriangle size={14} className="inline mr-2"/>Blocked: {selectedTask.block}</div>}
                <div className="flex gap-2 justify-end pt-4 border-t" style={{borderColor:C.bd}}>
                  <Btn onClick={()=>setSelectedTask(null)}>Close</Btn>
                  <Btn primary>Edit Task</Btn>
                </div>
              </div>
            </div>
          </div>}
        </div>
      </div>
    </div>
  );
}
