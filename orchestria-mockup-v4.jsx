import { useState, useRef, useCallback, useEffect } from "react";
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
const C = { bg: "#050507", bgS: "#0a0a0f", bgC: "#141720", bgH: "#1c1f2e", bgO: "#252836", bd: "rgba(200,169,110,0.1)", bdS: "rgba(200,169,110,0.08)", bdSub: "rgba(255,255,255,0.04)", tx: "#ededef", txS: "#a1a1aa", txM: "#71717a", txF: "#52525b", ac: "#c9a96e", acH: "#d4b87e", acM: "#3d3222", acSub: "#2a2318", acFg: "#0f0e0a", err: "#f87171", errM: "#2a1215", glass: "rgba(200,169,110,0.03)", glassBd: "rgba(200,169,110,0.08)", glassHov: "rgba(200,169,110,0.06)", glassCard: "rgba(12,12,18,0.6)", acDim: "rgba(201,169,110,0.15)", acGlow: "rgba(201,169,110,0.08)" };
const ST = { draft:{l:"Draft",c:"#a1a1aa",bg:"#1c1f2e",i:Edit3}, pending:{l:"Pending",c:"#a1a1aa",bg:"#1c1f2e",i:Clock}, approved:{l:"Approved",c:"#a1a1aa",bg:"#1c1f2e",i:Check}, running:{l:"Running",c:"#c9a96e",bg:"rgba(201,169,110,0.15)",i:Play}, awaiting_input:{l:"Awaiting Input",c:"#c9a96e",bg:"rgba(201,169,110,0.15)",i:AlertTriangle}, review:{l:"Review",c:"#c9a96e",bg:"rgba(201,169,110,0.15)",i:Eye}, completed:{l:"Completed",c:"#a1a1aa",bg:"#1c1f2e",i:CheckCircle2}, failed:{l:"Failed",c:"#f87171",bg:"#2a1215",i:XCircle}, throttled:{l:"Throttled",c:"#c9a96e",bg:"rgba(201,169,110,0.15)",i:Pause} };
const PRI = { urgent:{l:"Urgent",c:"#ededef",ic:""}, high:{l:"High",c:"#ededef",ic:""}, medium:{l:"Medium",c:"#a1a1aa",ic:""}, low:{l:"Low",c:"#71717a",ic:""} };
const WT = { "claude-cli":{n:"Claude",c:"#1c1f2e",a:"C"}, "gemini-cli":{n:"Gemini",c:"#1c1f2e",a:"G"}, "chatgpt-cli":{n:"ChatGPT",c:"#1c1f2e",a:"O"}, "kimi-cli":{n:"Kimi",c:"#1c1f2e",a:"K"}, "human":{n:"Human",c:"#1c1f2e",a:"H"} };

// ============ DATA ============
const PROJECTS = [
  { id:"p1", name:"AI SaaS Platform", color:"#c9a96e", total:24, done:8 },
  { id:"p2", name:"Marketing Automation", color:"#52525b", total:12, done:3 },
  { id:"p3", name:"Data Pipeline v2", color:"#71717a", total:18, done:15 },
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
const Av = ({type,size=28,role}) => { const c=WT[type]||{n:"?",c:"#1c1f2e",a:"?"}; return (<div className="rounded-full flex items-center justify-center font-semibold relative flex-shrink-0" style={{width:size,height:size,backgroundColor:c.c,border:"1px solid #1e2231",color:"#a1a1aa",fontSize:size*0.4}}>{c.a}{(role==="orchestrator"||role==="both")&&<div className="absolute -bottom-0.5 -right-0.5 rounded-full flex items-center justify-center" style={{width:size*0.45,height:size*0.45,backgroundColor:"#c9a96e"}}><Brain size={size*0.3} className="text-black"/></div>}</div>);};
const Dot = ({s}) => <span className="text-xs font-medium" style={{color:s==="online"?"#a1a1aa":s==="busy"?"#c9a96e":"#52525b"}}>{s==="online"?"Online":s==="busy"?"Busy":"Offline"}</span>;
const Inp = ({...p}) => <input {...p} className="w-full px-3 py-2 rounded-lg text-sm border outline-none" style={{backgroundColor:C.glass,borderColor:C.glassBd,color:C.tx,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}/>;
const Sel = ({children,...p}) => <select {...p} className="w-full px-3 py-2 rounded-lg text-sm border outline-none" style={{backgroundColor:C.glass,borderColor:C.glassBd,color:C.tx,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}>{children}</select>;
const Lbl = ({children}) => <span className="text-xs block mb-1" style={{color:C.txM}}>{children}</span>;
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

// ============ EMPTY STATE ============
const EmptyState = ({icon:Icon, title, desc, action, onAction, children}) => (
  <div className="flex-1 flex items-center justify-center p-8">
    <div className="text-center max-w-sm">
      <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{backgroundColor:`${C.ac}15`}}>
        <Icon size={28} style={{color:C.ac}}/>
      </div>
      <h3 className="text-base font-semibold mb-2" style={{color:C.tx}}>{title}</h3>
      <p className="text-sm mb-5 leading-relaxed" style={{color:C.txS}}>{desc}</p>
      {action && <Btn primary onClick={onAction}><Plus size={14}/> {action}</Btn>}
      {children}
    </div>
  </div>
);

// ============ SIDEBAR ============
// ============ PLUGINS (Level 2 — Data Pull Integrations) ============
const INSTALLED_PLUGINS = [
  {id:"plg-stripe",name:"Stripe",icon:"💳",cat:"Payments",status:"connected",auth:"oauth",lastSync:"2 min ago",items:14,desc:"Revenue, charges, subscriptions",color:"#635bff",
    data:[
      {id:"sd1",type:"metric",label:"MRR",value:"$4,280",change:"+12%",changeUp:true},
      {id:"sd2",type:"metric",label:"Active Subs",value:"38",change:"+3",changeUp:true},
      {id:"sd3",type:"metric",label:"Churn Rate",value:"2.1%",change:"-0.3%",changeUp:true},
      {id:"sd4",type:"row",label:"Last 5 Charges",rows:[
        {name:"Pro Plan — john@acme.co",amount:"$49",date:"Today 14:22",status:"succeeded"},
        {name:"Pro Plan — lisa@startup.io",amount:"$49",date:"Today 11:05",status:"succeeded"},
        {name:"Team Plan — dev@bigco.com",amount:"$149",date:"Yesterday",status:"succeeded"},
        {name:"Pro Plan — max@freelance.dev",amount:"$49",date:"Yesterday",status:"refunded"},
        {name:"Pro Plan — anna@design.co",amount:"$49",date:"Feb 23",status:"succeeded"},
      ]},
    ]},
  {id:"plg-github",name:"GitHub",icon:"🐙",cat:"Dev Tools",status:"connected",auth:"oauth",lastSync:"5 min ago",items:23,desc:"Issues, PRs, commits",color:"#238636",
    data:[
      {id:"gd1",type:"metric",label:"Open Issues",value:"12",change:"+2",changeUp:false},
      {id:"gd2",type:"metric",label:"Open PRs",value:"4",change:"0",changeUp:true},
      {id:"gd3",type:"metric",label:"Commits (7d)",value:"47",change:"+18",changeUp:true},
      {id:"gd4",type:"row",label:"Recent Issues",rows:[
        {name:"#142 — Auth token expires too early",amount:"bug",date:"Today",status:"open"},
        {name:"#141 — Add dark mode to settings",amount:"feature",date:"Today",status:"open"},
        {name:"#140 — Webhook retry fails on 429",amount:"bug",date:"Yesterday",status:"open"},
        {name:"#139 — Migrate to Node 20",amount:"chore",date:"Feb 23",status:"closed"},
      ]},
    ]},
  {id:"plg-slack",name:"Slack",icon:"💬",cat:"Communication",status:"connected",auth:"oauth",lastSync:"1 min ago",items:8,desc:"Messages, channels, alerts",color:"#e01e5a",
    data:[
      {id:"sld1",type:"metric",label:"Unread",value:"6",change:"",changeUp:true},
      {id:"sld2",type:"metric",label:"Mentions",value:"3",change:"today",changeUp:false},
      {id:"sld3",type:"row",label:"Recent Mentions",rows:[
        {name:"@michael can you review the pricing PR?",amount:"#dev",date:"12 min ago",status:"unread"},
        {name:"@michael standup notes posted",amount:"#general",date:"1h ago",status:"read"},
        {name:"@michael deploy to staging done",amount:"#deploys",date:"3h ago",status:"read"},
      ]},
    ]},
];
const PLUGIN_MARKETPLACE = [
  {id:"mk-notion",name:"Notion",icon:"📝",cat:"Docs",desc:"Pages, databases, wikis",color:"#000",installed:false},
  {id:"mk-linear",name:"Linear",icon:"🔷",cat:"Dev Tools",desc:"Issues, projects, cycles",color:"#5e6ad2",installed:false},
  {id:"mk-analytics",name:"Google Analytics",icon:"📊",cat:"Analytics",desc:"Traffic, events, conversions",color:"#e37400",installed:false},
  {id:"mk-sentry",name:"Sentry",icon:"🐛",cat:"Dev Tools",desc:"Errors, performance, alerts",color:"#362d59",installed:false},
  {id:"mk-hubspot",name:"HubSpot",icon:"🔶",cat:"CRM",desc:"Contacts, deals, pipelines",color:"#ff7a59",installed:false},
  {id:"mk-vercel",name:"Vercel",icon:"▲",cat:"Dev Tools",desc:"Deployments, domains, logs",color:"#fff",installed:false},
  {id:"mk-posthog",name:"PostHog",icon:"🦔",cat:"Analytics",desc:"Events, funnels, feature flags",color:"#1d4aff",installed:false},
  {id:"mk-mailchimp",name:"Mailchimp",icon:"📧",cat:"Marketing",desc:"Campaigns, lists, analytics",color:"#ffe01b",installed:false},
];
const Sidebar = ({view,setView,proj,setProj,col,setCol}) => {
  const [exp,setExp]=useState(true);
  const nav=[{id:"dashboard",l:"Dashboard",ic:LayoutDashboard},{id:"tasks",l:"My Tasks",ic:ListTodo},{id:"workers",l:"Workers",ic:Bot},{id:"chat",l:"Chat",ic:MessageSquare},{id:"planner",l:"Master Planner",ic:Workflow},{id:"notes",l:"Notes",ic:FileText},{id:"briefings",l:"Briefings",ic:BarChart3},{id:"storage",l:"Storage",ic:HardDrive},{id:"settings",l:"Settings",ic:Settings}];
  return (
    <div className="h-full flex flex-col border-r" style={{width:col?60:240,backgroundColor:"rgba(8,8,12,0.8)",backdropFilter:"blur(40px)",WebkitBackdropFilter:"blur(40px)",borderColor:C.bdSub,transition:"width 0.2s"}}>
      <div className="flex items-center gap-2.5 px-4 py-4 border-b" style={{borderColor:C.bdSub}}>
        {!col&&<><div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{backgroundColor:C.ac}}><Zap size={18} style={{color:C.acFg}}/></div><span className="font-bold text-lg" style={{color:C.tx}}>Orchestria</span></>}
        <button onClick={()=>setCol(!col)} className="ml-auto p-1 rounded" style={{color:C.txS}}>{col?<ChevronRight size={16}/>:<ChevronLeft size={16}/>}</button>
      </div>
      <nav className="flex-1 py-2 overflow-y-auto">
        {nav.map(n=>{const I=n.ic;const a=view===n.id;return(<button key={n.id} onClick={()=>setView(n.id)} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium ${col?'justify-center':''}`} title={col?n.l:undefined} style={{color:a?C.ac:C.txS,backgroundColor:a?C.acSub:"transparent",borderLeft:a?`2px solid ${C.ac}`:"2px solid transparent",transition:"all 150ms"}}><I size={18} style={{opacity:a?1:0.6}}/>{!col&&<span>{n.l}</span>}</button>);})}
        {/* Installed plugin tabs */}
        {INSTALLED_PLUGINS.length>0&&<>
          {!col&&<div className="mt-5 mb-1 px-4"><span className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.txF}}>Plugins</span></div>}
          {INSTALLED_PLUGINS.map(plg=>{const a=view===plg.id;return(<button key={plg.id} onClick={()=>setView(plg.id)} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium ${col?'justify-center':''}`} title={col?plg.name:undefined} style={{color:a?C.ac:C.txS,backgroundColor:a?C.acSub:"transparent",borderLeft:a?`2px solid ${C.ac}`:"2px solid transparent",transition:"all 150ms"}}><span className="text-base">{plg.icon}</span>{!col&&<span className="truncate">{plg.name}</span>}{!col&&plg.items>0&&<span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full" style={{backgroundColor:C.bgH,color:C.txS}}>{plg.items}</span>}</button>);})}
        </>}
        {!col&&<div className="mt-5 px-4">
          <button onClick={()=>setExp(!exp)} className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-widest mb-2" style={{color:C.txF}}>{exp?<ChevronDown size={12}/>:<ChevronRight size={12}/>} Projects</button>
          {exp&&PROJECTS.map(p=>(<button key={p.id} onClick={()=>{setProj(p.id);setView("dashboard");}} className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md mb-0.5" style={{color:proj===p.id?C.tx:C.txS,backgroundColor:proj===p.id?C.bgH:"transparent",transition:"all 150ms"}}><div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{backgroundColor:proj===p.id?C.ac:C.txF}}/><span className="truncate">{p.name}</span><span className="ml-auto text-[11px]" style={{color:C.txM}}>{p.done}/{p.total}</span></button>))}
          <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md mt-1" style={{color:C.txM}}><Plus size={14}/> New Project</button>
        </div>}
      </nav>
    </div>
  );
};

const NOTIFICATIONS = [
  {id:"n1",type:"completed",title:"Task completed",desc:"'Design database schema' finished by Claude Opus",time:"2m ago",read:false,icon:CheckCircle2,color:"#a1a1aa"},
  {id:"n2",type:"blocked",title:"Agent blocked",desc:"ChatGPT Writer needs API key for 'Write API documentation'",time:"15m ago",read:false,icon:AlertTriangle,color:"#f87171"},
  {id:"n3",type:"review",title:"Ready for review",desc:"'Implement Kanban drag-and-drop' awaiting your approval",time:"1h ago",read:false,icon:Eye,color:"#c9a96e"},
  {id:"n4",type:"completed",title:"Task completed",desc:"'Research competitor pricing' finished by Gemini Research",time:"2h ago",read:true,icon:CheckCircle2,color:"#a1a1aa"},
  {id:"n5",type:"system",title:"Rate limit warning",desc:"Claude Opus approaching 80% of daily token budget",time:"3h ago",read:true,icon:AlertTriangle,color:"#c9a96e"},
  {id:"n6",type:"plan",title:"Plan stage completed",desc:"'Research & Architecture' phase fully completed",time:"4h ago",read:true,icon:Workflow,color:"#a1a1aa"},
];

const TopBar = ({proj,view,onOpenCmd}) => {
  const p=PROJECTS.find(x=>x.id===proj);
  const pluginLabel = INSTALLED_PLUGINS.find(x=>x.id===view);
  const labels={dashboard:"Dashboard",tasks:"My Tasks",workers:"Workers",chat:"Orchestrator Chat",planner:"Master Planner",notes:"Notes",briefings:"Briefings",storage:"Storage",settings:"Settings",
    ...(pluginLabel?{[view]:pluginLabel.name}:{})
  };
  const [showNotif,setShowNotif]=useState(false);
  const [notifs,setNotifs]=useState(NOTIFICATIONS);
  const unread=notifs.filter(n=>!n.read).length;
  const markAllRead=()=>setNotifs(ns=>ns.map(n=>({...n,read:true})));
  const markRead=(id)=>setNotifs(ns=>ns.map(n=>n.id===id?{...n,read:true}:n));
  return (
    <div className="h-14 flex items-center justify-between px-6 border-b" style={{backgroundColor:"rgba(8,8,12,0.5)",backdropFilter:"blur(30px)",WebkitBackdropFilter:"blur(30px)",borderColor:C.bd}}>
      <div className="flex items-center gap-3">
        {p&&<><div className="w-4 h-4 rounded" style={{backgroundColor:p.color}}/><span className="text-sm font-medium" style={{color:C.tx}}>{p.name}</span><ChevronRight size={14} style={{color:C.txM}}/></>}
        <span className="text-sm font-semibold" style={{color:C.tx}}>{labels[view]}</span>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={onOpenCmd} className="relative flex items-center gap-2 pl-8 pr-3 py-1.5 rounded-lg text-sm border" style={{backgroundColor:C.glass,borderColor:C.glassBd,color:C.txM,width:220,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}><Search size={16} className="absolute left-2.5" style={{color:C.txM}}/>Search... <span className="ml-auto text-[10px] px-1 py-0.5 rounded border" style={{borderColor:C.bd,color:C.txM}}>⌘K</span></button>
        <div className="relative">
          <button onClick={()=>setShowNotif(!showNotif)} className="relative p-2 rounded-lg" style={{color:showNotif?C.ac:C.txS}}><Bell size={18}/>{unread>0&&<span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{backgroundColor:C.ac}}/>}</button>
          {showNotif&&<>
            <div className="fixed inset-0 z-40" onClick={()=>setShowNotif(false)}/>
            <div className="absolute right-0 top-full mt-1 w-96 rounded-xl border overflow-hidden z-50" style={{backgroundColor:C.bg,borderColor:C.bd,boxShadow:"0 12px 40px rgba(0,0,0,0.5)"}}>
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{borderColor:C.bd}}>
                <div className="flex items-center gap-2"><span className="text-sm font-semibold" style={{color:C.tx}}>Notifications</span>{unread>0&&<span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{backgroundColor:C.ac,color:C.acFg}}>{unread}</span>}</div>
                {unread>0&&<button onClick={markAllRead} className="text-[10px]" style={{color:C.acH}}>Mark all read</button>}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifs.length===0?(
                  <div className="py-8 text-center"><Bell size={24} className="mx-auto mb-2" style={{color:C.txM}}/><p className="text-xs" style={{color:C.txM}}>No notifications yet</p></div>
                ):notifs.map(n=>{const Ic=n.icon;return(
                  <div key={n.id} onClick={()=>markRead(n.id)} className="flex gap-3 px-4 py-3 border-b cursor-pointer" style={{borderColor:C.bd,backgroundColor:!n.read?`${C.ac}05`:"transparent"}}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{backgroundColor:`${n.color}15`}}><Ic size={16} style={{color:n.color}}/></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2"><span className="text-xs font-medium" style={{color:C.tx}}>{n.title}</span>{!n.read&&<div className="w-1.5 h-1.5 rounded-full "/>}</div>
                      <p className="text-[11px] mt-0.5 line-clamp-2" style={{color:C.txS}}>{n.desc}</p>
                      <span className="text-[10px] mt-0.5 block" style={{color:C.txM}}>{n.time}</span>
                    </div>
                  </div>
                );})}
              </div>
              <div className="px-4 py-2.5 border-t text-center" style={{borderColor:C.bd}}>
                <button className="text-xs" style={{color:C.acH}}>View all notifications</button>
              </div>
            </div>
          </>}
        </div>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{backgroundColor:C.bgH,color:C.txS}}>M</div>
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
  if(id==="total-tasks") return (<div className="grid grid-cols-3 gap-2">{[{l:"Running",v:TASKS.filter(t=>t.s==="running").length,c:C.ac},{l:"Blocked",v:TASKS.filter(t=>t.s==="awaiting_input").length,c:C.ac},{l:"Review",v:TASKS.filter(t=>t.s==="review").length,c:C.ac},{l:"Completed",v:TASKS.filter(t=>t.s==="completed").length,c:C.tx},{l:"Pending",v:TASKS.filter(t=>t.s==="pending").length,c:C.tx},{l:"Draft",v:TASKS.filter(t=>t.s==="draft").length,c:C.txS}].map(s=><div key={s.l} className="p-2 rounded" style={{backgroundColor:C.bg}}><span className="text-[10px] block" style={{color:C.txM}}>{s.l}</span><span className="text-xl font-bold" style={{color:s.c}}>{s.v}</span></div>)}</div>);
  if(id==="worker-hours"){const hrs=[{pct:72,h:"4.3"},{pct:35,h:"2.1"},{pct:12,h:"0.7"},{pct:58,h:"3.5"},{pct:28,h:"1.7"}];return (<div className="space-y-2">{WORKERS.map((w,i)=>{const d=hrs[i]||{pct:40,h:"2.4"};return <div key={w.id} className="flex items-center gap-2"><Av type={w.type} size={20} role={w.role}/><span className="text-xs w-24 truncate" style={{color:C.tx}}>{w.name}</span><div className="flex-1 h-3 rounded-full overflow-hidden" style={{backgroundColor:C.bg}}><div className="h-full rounded-full" style={{width:`${d.pct}%`,backgroundColor:WT[w.type]?.c||"#666"}}/></div><span className="text-xs w-10 text-right" style={{color:C.txS}}>{d.h}h</span></div>;})}</div>);}
  if(id==="token-usage") return (<div className="space-y-2">{[{n:"Claude",v:"1.2M",c:"$18.00"},{n:"Gemini",v:"800K",c:"$4.00"},{n:"GPT-4o",v:"200K",c:"$2.00"}].map(u=><div key={u.n} className="flex items-center justify-between p-2 rounded" style={{backgroundColor:C.bg}}><span className="text-xs" style={{color:C.txS}}>{u.n}</span><span className="text-xs font-medium" style={{color:C.tx}}>{u.v} tokens</span><span className="text-xs font-bold" style={{color:C.tx}}>{u.c}</span></div>)}<div className="flex justify-between pt-2 border-t" style={{borderColor:C.bd}}><span className="text-xs" style={{color:C.txS}}>Total today</span><span className="text-sm font-bold" style={{color:C.tx}}>$24.00</span></div></div>);
  if(id==="cost-tracker") return (<div><div className="text-3xl font-bold mb-1" style={{color:C.tx}}>$24.00</div><span className="text-xs" style={{color:C.txM}}>Today's spend • Budget: $50/day</span><div className="h-2 rounded-full mt-2 overflow-hidden" style={{backgroundColor:C.bg}}><div className="h-full rounded-full" style={{width:"48%",backgroundColor:C.ac}}/></div></div>);
  if(id==="project-health") return (<div className="space-y-2">{PROJECTS.map(p=>{const pct=Math.round((p.done/p.total)*100);return(<div key={p.id} className="flex items-center gap-3"><div className="w-3 h-3 rounded-sm" style={{backgroundColor:p.color}}/><span className="text-xs w-36 truncate" style={{color:C.tx}}>{p.name}</span><div className="flex-1 h-2 rounded-full overflow-hidden" style={{backgroundColor:C.bg}}><div className="h-full rounded-full" style={{width:`${pct}%`,backgroundColor:p.color}}/></div><span className="text-xs w-10 text-right" style={{color:C.txS}}>{pct}%</span></div>);})}</div>);
  if(id==="worker-activity") return (<div className="space-y-2">{WORKERS.filter(w=>w.active>0).map(w=><div key={w.id} className="flex items-center gap-2 p-2 rounded" style={{backgroundColor:C.bg}}><Av type={w.type} size={24} role={w.role}/><div className="flex-1 min-w-0"><span className="text-sm block truncate" style={{color:C.tx}}>{w.name}</span><span className="text-[10px]" style={{color:C.txM}}>{w.active} task{w.active>1?"s":""} active</span></div><Dot s={w.status}/></div>)}</div>);
  if(id==="needs-attention") return (<div className="space-y-2">{TASKS.filter(t=>t.s==="awaiting_input"||t.s==="review").map(t=>{const sc=ST[t.s];return(<div key={t.id} className="p-2 rounded flex items-center gap-2" style={{backgroundColor:C.bg}}><sc.i size={14} style={{color:sc.c}}/><span className="text-xs flex-1 truncate" style={{color:C.tx}}>{t.title}</span><Bd color={sc.c} bg={sc.bg} s>{sc.l}</Bd></div>);})}</div>);
  if(id==="recent-activity") return (<div className="space-y-1">{[{t:"2m",e:"Claude completed 'DB schema'",c:C.ac},{t:"15m",e:"Kimi started 'Security audit'",c:C.ac},{t:"1h",e:"ChatGPT blocked on 'API docs'",c:C.ac},{t:"2h",e:"Gemini completed 'Market research'",c:C.ac}].map((a,i)=><div key={i} className="flex items-center gap-2 p-1"><div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{backgroundColor:a.c}}/><span className="text-xs flex-1" style={{color:C.tx}}>{a.e}</span><span className="text-[10px]" style={{color:C.txM}}>{a.t}</span></div>)}</div>);
  if(id==="quick-task") return (<div className="space-y-2"><Inp placeholder="Task title..."/><div className="flex gap-2"><Sel><option>Medium</option><option>Urgent</option><option>High</option><option>Low</option></Sel><Btn primary><Plus size={14}/> Add</Btn></div></div>);
  if(id==="quick-note") return (<div><textarea className="w-full px-3 py-2 rounded-lg text-sm border outline-none resize-none" rows={2} style={{backgroundColor:C.glass,borderColor:C.glassBd,color:C.tx,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}} placeholder="Jot something down..."/><Btn primary className="mt-2"><Edit3 size={14}/> Save Note</Btn></div>);
  if(id==="chat-preview") return (<div className="p-2 rounded" style={{backgroundColor:C.bg}}><div className="flex items-center gap-2 mb-1"><Av type="claude-cli" size={18} role="orchestrator"/><span className="text-[10px]" style={{color:C.txM}}>10:25 AM</span></div><p className="text-xs line-clamp-3" style={{color:C.txS}}>Done! Created 6 subtasks under 'Auth Module'. All in Draft.</p></div>);
  if(id==="custom-code") return (<div><textarea className="w-full px-3 py-2 rounded-lg text-xs font-mono border outline-none resize-none" rows={3} style={{backgroundColor:C.bg,borderColor:C.bd,color:C.tx}} defaultValue={"// Access data via orchestria.tasks, orchestria.workers\nconst blocked = orchestria.tasks.filter(t => t.status === 'blocked');\nreturn { value: blocked.length, label: 'Blocked' };"}/><span className="text-[10px] mt-1 block" style={{color:C.txM}}>Runs in sandboxed Web Worker</span></div>);
  return <span className="text-xs" style={{color:C.txM}}>Widget content</span>;
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
        <span className="text-xs" style={{color:C.txM}}>{widgets.length} widgets active</span>
        <div className="flex items-center gap-2">
          <Btn onClick={()=>setShowCatalog(true)}><Plus size={14}/> Add Widget</Btn>
          <Btn><Download size={14}/> Export PDF</Btn>
        </div>
      </div>
      {widgets.length===0 ? (
        <EmptyState icon={LayoutDashboard} title="Your dashboard is empty" desc="Add widgets to build your personalized overview. Track tasks, monitor workers, and see project progress at a glance." action="Add Widget" onAction={()=>setShowCatalog(true)}/>
      ) : (
      <div className="grid grid-cols-2 gap-4">
        {widgets.map(wId => {
          const wDef = WIDGET_CATALOG.find(w=>w.id===wId);
          if(!wDef) return null;
          const I = wDef.icon;
          return (
            <div key={wId} className="rounded-xl border group" style={{backgroundColor:C.glassCard,backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderColor:C.bd,borderTop:`1px solid rgba(201,169,110,0.12)`}}>
              <div className="flex items-center justify-between p-3 border-b" style={{borderColor:C.bd}}>
                <div className="flex items-center gap-2"><I size={14} style={{color:C.ac}}/><span className="text-sm font-medium" style={{color:C.tx}}>{wDef.name}</span></div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                  <button className="p-1 rounded hover:bg-white/5" title="Remove" onClick={()=>removeWidget(wId)}><X size={12} style={{color:C.txM}}/></button>
                </div>
              </div>
              <div className="p-3"><WidgetContent id={wId}/></div>
            </div>
          );
        })}
        {/* Add widget placeholder */}
        <button onClick={()=>setShowCatalog(true)} className="rounded-xl border border-dashed flex flex-col items-center justify-center py-8 transition-colors" style={{borderColor:C.bd,transitionProperty:"border-color"}} onMouseOver={e=>e.currentTarget.style.borderColor=C.ac} onMouseOut={e=>e.currentTarget.style.borderColor=C.bd}>
          <Plus size={24} style={{color:C.txM}}/><span className="text-sm mt-2" style={{color:C.txM}}>Add Widget</span>
        </button>
      </div>
      )}

      {/* Widget Catalog Modal */}
      {showCatalog && <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={()=>setShowCatalog(false)}>
        <div className="rounded-xl border w-full max-w-lg max-h-[70vh] overflow-hidden flex flex-col" style={{backgroundColor:C.bg,borderColor:C.bd}} onClick={e=>e.stopPropagation()}>
          <div className="flex items-center justify-between p-4 border-b" style={{borderColor:C.bd}}>
            <h3 className="text-lg font-semibold" style={{color:C.tx}}>Add Widget</h3>
            <button onClick={()=>setShowCatalog(false)} className="p-1 rounded hover:bg-white/5"><X size={16} style={{color:C.txS}}/></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {cats.map(cat => {
              const isOpen = expandedCats[cat] || false;
              const catWidgets = WIDGET_CATALOG.filter(w=>w.cat===cat);
              const addedCount = catWidgets.filter(w=>widgets.includes(w.id)).length;
              return (
              <div key={cat} className="rounded-lg border overflow-hidden" style={{borderColor:C.bd}}>
                <button onClick={()=>toggleCat(cat)} className="w-full flex items-center gap-2 p-3" style={{backgroundColor:C.bgC}}>
                  {isOpen?<ChevronDown size={14} style={{color:C.txS}}/>:<ChevronRight size={14} style={{color:C.txS}}/>}
                  <span className="text-xs font-semibold uppercase tracking-wider flex-1 text-left" style={{color:C.txM}}>{cat}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{backgroundColor:C.bg,color:C.txS}}>{addedCount}/{catWidgets.length}</span>
                </button>
                {isOpen && <div className="p-2 space-y-1">
                  {catWidgets.map(w => {
                    const I=w.icon; const added=widgets.includes(w.id);
                    return (<div key={w.id} className="flex items-center gap-3 p-3 rounded-lg" style={{backgroundColor:added?`${C.ac}10`:C.bg}}>
                      <I size={16} style={{color:added?C.ac:C.txM}}/>
                      <div className="flex-1"><span className="text-sm" style={{color:C.tx}}>{w.name}</span><p className="text-[10px]" style={{color:C.txM}}>{w.desc}</p></div>
                      {added?<Bd color={C.ac} s>Added</Bd>:<button onClick={()=>addWidget(w.id)} className="px-3 py-1 rounded-lg text-xs" style={{backgroundColor:C.ac,color:C.acFg}}>Add</button>}
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
          <button onClick={onClose} className="p-1 rounded hover:bg-white/5"><X size={16} style={{color:C.txS}}/></button>
        </div>
        <div className="p-4 space-y-4">
          <div><Lbl>Title *</Lbl><Inp placeholder="What needs to be done?"/></div>
          <div><Lbl>Description</Lbl><textarea className="w-full px-3 py-2 rounded-lg text-sm border outline-none resize-none" rows={3} style={{backgroundColor:C.glass,borderColor:C.glassBd,color:C.tx,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}} placeholder="Detailed description, requirements, context..."/></div>
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
            <div className="rounded-lg border p-2" style={{backgroundColor:C.glass,borderColor:C.glassBd,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}>
              <input placeholder="Search tasks..." className="w-full bg-transparent text-sm outline-none mb-2 px-1" style={{color:C.tx}}/>
              <div className="max-h-28 overflow-y-auto space-y-1">
                {TASKS.slice(0,6).map(t=>{const sc=ST[t.s];return(
                  <label key={t.id} className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer">
                    <input type="checkbox" className="accent-[#c9a96e]"/>
                    <span className="text-xs flex-1 truncate" style={{color:C.tx}}>{t.title}</span>
                    <Bd color={sc.c} bg={sc.bg} s>{sc.l}</Bd>
                  </label>);})}
              </div>
            </div>
            <span className="text-[10px] mt-1 block" style={{color:C.txM}}>Task won't start until all selected dependencies are completed</span>
          </div>

          {/* Subtasks */}
          <div>
            <Lbl>Subtasks</Lbl>
            <div className="space-y-1.5">
              {["Set up project scaffold","Write unit tests"].map((st,i)=>
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{backgroundColor:C.glass,borderColor:C.glassBd,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}>
                  <GripVertical size={12} style={{color:C.txM}} className="cursor-grab"/>
                  <span className="text-sm flex-1" style={{color:C.tx}}>{st}</span>
                  <button className="p-0.5 rounded hover:bg-white/5"><X size={12} style={{color:C.txM}}/></button>
                </div>
              )}
              <div className="flex gap-2">
                <input placeholder="Add subtask..." className="flex-1 px-3 py-2 rounded-lg text-sm border outline-none" style={{backgroundColor:C.glass,borderColor:C.glassBd,color:C.tx,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}/>
                <button className="px-3 py-2 rounded-lg text-sm flex items-center gap-1" style={{backgroundColor:C.ac,color:C.acFg}}><Plus size={12}/> Add</button>
              </div>
            </div>
            <span className="text-[10px] mt-1 block" style={{color:C.txM}}>Subtasks inherit parent's project and worker unless overridden</span>
          </div>

          {/* Scheduling */}
          <div className="border-t pt-4" style={{borderColor:C.bd}}>
            <button onClick={()=>setShowSchedule(!showSchedule)} className="flex items-center gap-2 text-sm" style={{color:showSchedule?C.ac:C.txS}}>
              <Calendar size={14}/> Scheduling {showSchedule?<ChevronDown size={12}/>:<ChevronRight size={12}/>}
            </button>
            {showSchedule && <div className="mt-3 space-y-3 p-3 rounded-lg" style={{backgroundColor:C.bgC}}>
              <div><Lbl>When</Lbl><div className="flex gap-2">
                {["Now","Scheduled","Recurring"].map(o=><button key={o} className="flex-1 px-3 py-1.5 rounded-lg text-xs border text-center" style={{borderColor:o==="Now"?C.ac:C.bd,color:o==="Now"?C.ac:C.txS,backgroundColor:o==="Now"?`${C.ac}20`:"transparent"}}>{o}</button>)}
              </div></div>
              <div><Lbl>Start Date</Lbl><Inp type="date"/></div>
              <div><Lbl>Repeat</Lbl><Sel><option>No repeat</option><option>Daily</option><option>Weekly</option><option>Monthly</option><option>Custom (cron)</option></Sel></div>
            </div>}
          </div>

          {/* Lock */}
          <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer" style={{backgroundColor:C.bgC}}>
            <input type="checkbox" className="accent-[#c9a96e]"/>
            <div><span className="text-sm" style={{color:C.tx}}>Lock task</span><p className="text-[10px]" style={{color:C.txM}}>Orchestrator cannot modify this task</p></div>
            <Lock size={14} className="ml-auto" style={{color:C.ac}}/>
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
  <div onClick={onClick} className="p-3 rounded-lg border cursor-pointer group" style={{backgroundColor:C.glass,borderColor:C.glassBd,transitionProperty:"border-color"}} onMouseOver={e=>e.currentTarget.style.borderColor=C.ac} onMouseOut={e=>e.currentTarget.style.borderColor=C.bd}>
    <div className="flex items-center gap-1.5 mb-2 min-w-0">{task.lock&&<Lock size={12} style={{color:C.ac}}/>}<span className="text-sm font-medium truncate" style={{color:C.tx}}>{task.title}</span></div>
    {task.block&&<div className="mb-2 p-2 rounded text-xs flex items-start gap-1.5" style={{backgroundColor:`${C.ac}20`,color:C.ac}}><AlertTriangle size={12} className="flex-shrink-0 mt-0.5"/><span className="line-clamp-2">{task.block}</span></div>}
    <div className="flex items-center gap-1.5 mb-2 flex-wrap">{task.tags.map(t=><span key={t} className="px-1.5 py-0.5 rounded text-[10px]" style={{backgroundColor:`${C.ac}20`,color:C.acH}}>{t}</span>)}</div>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">{w?<Av type={w.type} size={22} role={w.role}/>:<div className="w-[22px] h-[22px] rounded-full border border-dashed flex items-center justify-center" style={{borderColor:C.txM}}><Plus size={10} style={{color:C.txM}}/></div>}{task.sub>0&&<span className="text-[11px] flex items-center gap-1" style={{color:C.txS}}><CheckCircle2 size={11}/>{task.subD}/{task.sub}</span>}</div>
      {PRI[task.p]&&<span className="text-[11px]">{PRI[task.p].ic}</span>}
    </div>
  </div>
);};

const TasksView = ({proj,onTask}) => {
  const [showNew,setShowNew]=useState(false);
  const [viewMode,setViewMode]=useState("kanban");
  const [sortBy,setSortBy]=useState("status");
  const tasks=TASKS.filter(t=>t.pr===proj);
  const cols=["draft","pending","approved","running","awaiting_input","review","completed"];
  const sortedTasks = [...tasks].sort((a,b)=>{
    if(sortBy==="status") return cols.indexOf(a.s)-cols.indexOf(b.s);
    if(sortBy==="priority"){const po=["urgent","high","medium","low"];return po.indexOf(a.p)-po.indexOf(b.p);}
    if(sortBy==="title") return a.title.localeCompare(b.title);
    return 0;
  });
  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="flex items-center gap-4 px-6 py-3 border-b" style={{borderColor:C.bd}}>
        <span className="text-xs" style={{color:C.txS}}>Total: <strong style={{color:C.tx}}>{tasks.length}</strong></span>
        <div className="flex items-center gap-0.5 rounded-lg border p-0.5" style={{borderColor:C.bd}}>
          {[{id:"kanban",l:"Board",i:Layers},{id:"list",l:"List",i:ListTodo}].map(m=>(
            <button key={m.id} onClick={()=>setViewMode(m.id)} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px]" style={{backgroundColor:viewMode===m.id?`${C.ac}20`:"transparent",color:viewMode===m.id?C.ac:C.txM}}><m.i size={12}/>{m.l}</button>
          ))}
        </div>
        {viewMode==="list"&&<select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="px-2 py-1 rounded text-[11px] border outline-none" style={{backgroundColor:C.glass,borderColor:C.glassBd,color:C.tx,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}>
          <option value="status">Sort: Status</option>
          <option value="priority">Sort: Priority</option>
          <option value="title">Sort: Title</option>
        </select>}
        <div className="ml-auto flex items-center gap-2">
          <Btn><Filter size={12}/> Filter</Btn>
          <Btn primary onClick={()=>setShowNew(true)}><Plus size={12}/> New Task</Btn>
        </div>
      </div>
      {tasks.length===0 ? (
        <EmptyState icon={ListTodo} title="No tasks yet" desc="Create your first task and let the orchestrator assign it to the best available worker. Tasks flow through Draft → Running → Completed." action="Create First Task" onAction={()=>setShowNew(true)}/>
      ) : viewMode==="kanban" ? (
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4" style={{minWidth:"max-content"}}>
          {cols.map(st=>{const s=ST[st];const I=s.i;const ct=tasks.filter(t=>t.s===st);return(
            <div key={st} className="flex-shrink-0" style={{width:260}}>
              <div className="flex items-center gap-2 mb-3 px-1"><I size={14} style={{color:s.c}}/><span className="text-sm font-semibold" style={{color:s.c}}>{s.l}</span><span className="text-xs px-1.5 py-0.5 rounded-full" style={{backgroundColor:s.bg,color:s.c}}>{ct.length}</span></div>
              <div className="space-y-2 min-h-[100px] p-1 rounded-lg" style={{backgroundColor:`${s.c}08`}}>
                {ct.map(t=><TaskCard key={t.id} task={t} onClick={()=>onTask(t)}/>)}
                <button onClick={()=>setShowNew(true)} className="w-full p-2 rounded-lg border border-dashed text-sm flex items-center justify-center gap-1" style={{borderColor:C.bd,color:C.txM,transitionProperty:"border-color"}} onMouseOver={e=>e.currentTarget.style.borderColor=C.ac} onMouseOut={e=>e.currentTarget.style.borderColor=C.bd}><Plus size={14}/></button>
              </div>
            </div>
          );})}
        </div>
      </div>
      ) : (
      <div className="flex-1 overflow-y-auto">
        {/* List/Table view */}
        <div className="min-w-full">
          <div className="flex items-center gap-3 px-6 py-2 border-b text-[10px] uppercase tracking-wider" style={{borderColor:C.bd,color:C.txM,backgroundColor:C.bgS}}>
            <span className="w-8"></span>
            <span className="flex-1">Task</span>
            <span className="w-28">Status</span>
            <span className="w-20">Priority</span>
            <span className="w-28">Worker</span>
            <span className="w-20">Subtasks</span>
            <span className="w-24">Tags</span>
          </div>
          {sortedTasks.map(t=>{const w=WORKERS.find(x=>x.id===t.w);const sc=ST[t.s];const pc=PRI[t.p];return(
            <div key={t.id} onClick={()=>onTask(t)} className="flex items-center gap-3 px-6 py-2.5 border-b cursor-pointer" style={{borderColor:C.bd}}>
              <div className="w-8 flex items-center justify-center">{t.lock&&<Lock size={12} style={{color:C.ac}}/>}</div>
              <div className="flex-1 min-w-0">
                <span className="text-sm truncate block" style={{color:C.tx}}>{t.title}</span>
                {t.block&&<span className="text-[10px] flex items-center gap-1 mt-0.5" style={{color:C.ac}}><AlertTriangle size={10}/> Blocked</span>}
              </div>
              <div className="w-28"><Bd color={sc.c} bg={sc.bg} s>{sc.l}</Bd></div>
              <div className="w-20"><span className="text-xs">{pc.ic} {pc.l}</span></div>
              <div className="w-28">{w?<div className="flex items-center gap-1.5"><Av type={w.type} size={18} role={w.role}/><span className="text-xs truncate" style={{color:C.txS}}>{w.name}</span></div>:<span className="text-xs" style={{color:C.txM}}>Unassigned</span>}</div>
              <div className="w-20">{t.sub>0?<span className="text-xs" style={{color:C.txS}}>{t.subD}/{t.sub}</span>:<span className="text-xs" style={{color:C.txM}}>—</span>}</div>
              <div className="w-24 flex gap-1 flex-wrap">{t.tags.slice(0,2).map(tag=><span key={tag} className="px-1 py-0.5 rounded text-[9px]" style={{backgroundColor:`${C.ac}20`,color:C.acH}}>{tag}</span>)}{t.tags.length>2&&<span className="text-[9px]" style={{color:C.txM}}>+{t.tags.length-2}</span>}</div>
            </div>
          );})}
        </div>
      </div>
      )}
      {showNew&&<NewTaskModal onClose={()=>setShowNew(false)}/>}
    </div>
  );
};

// Mock data for task details
const TASK_SUBTASKS = {
  "t1":["Create users table with UUID PKs","Add sessions table with JWT storage","Define roles & permissions tables"],
  "t2":["Analyze Linear pricing & features","Analyze Notion pricing & features","Analyze Monday pricing & features","Compare feature matrices","Write final pricing recommendation"],
  "t4":["Set up React DnD provider","Implement column drag handles","Add card drag between columns","Optimistic UI updates on drop"],
  "t5":["Configure GitHub Actions workflow","Set up Docker build pipeline","Add Supabase migration step","Configure Vercel deployment","Add staging environment","Add production environment"],
  "t8":["Test SQL injection vectors","Check XSS in input fields","Verify CSRF token implementation","Test session hijacking scenarios","Audit rate limiting logic","Check password hashing strength","Review OAuth token storage","Test 2FA bypass attempts"],
  "t10":["Design onboarding wizard layout","Implement step progress indicator"],
};
const TASK_DESCRIPTIONS = {"t1":"Design the complete database schema for user authentication including users, sessions, roles, and permissions tables. Must support OAuth providers and 2FA tokens.","t2":"Research 5 competitor pricing models (Linear, Notion, Monday, ClickUp, Asana). Document tiers, limits, and unique selling points.","t3":"Write comprehensive API documentation covering all endpoints, authentication, rate limits, and error codes. Include code examples in JS and Python.","t4":"Implement drag-and-drop Kanban board using React DnD. Support column reordering, task moving between columns, and optimistic updates.","t5":"Set up GitHub Actions CI/CD pipeline with staging and production environments. Include Docker builds, Supabase migrations, and Vercel deploys.","t8":"Conduct security audit of the authentication flow. Check for SQL injection, XSS, CSRF, session hijacking, and rate limit bypass.","t9":"Review and approve the proposed AWS infrastructure spend increase from $200/mo to $500/mo for production scaling."};
const TASK_TIMELINE = [
  {time:"Today 10:30",actor:"Claude Opus",type:"step",text:"Started analyzing existing auth tables"},
  {time:"Today 10:31",actor:"Claude Opus",type:"step",text:"Queried Supabase schema for current user table structure"},
  {time:"Today 10:32",actor:"Claude Opus",type:"tool",text:"Tool call: supabase.query('SELECT * FROM information_schema.tables')"},
  {time:"Today 10:33",actor:"Claude Opus",type:"decision",text:"Decision: Use UUID for user IDs instead of serial integers for better security"},
  {time:"Today 10:35",actor:"Claude Opus",type:"step",text:"Designed sessions table with JWT token storage and expiry"},
  {time:"Today 10:38",actor:"Claude Opus",type:"output",text:"Generated schema.sql with 4 tables: users, sessions, roles, user_roles"},
  {time:"Today 10:39",actor:"System",type:"status",text:"Task moved to Review"},
  {time:"Today 10:42",actor:"Michael",type:"comment",text:"Looks good, but add a refresh_token column to sessions"},
];
const TASK_ARTIFACTS = [
  {name:"schema.sql",size:"4.2 KB",type:"code",date:"Today 10:38"},
  {name:"er-diagram.png",size:"128 KB",type:"image",date:"Today 10:37"},
  {name:"migration-001.sql",size:"1.8 KB",type:"code",date:"Today 10:39"},
];
const TASK_COMMENTS = [
  {id:"c1",author:"Michael",isHuman:true,time:"Today 10:42",text:"Looks good, but add a refresh_token column to sessions table."},
  {id:"c2",author:"Claude Opus",isHuman:false,type:"claude-cli",time:"Today 10:43",text:"Good catch. I'll add refresh_token (TEXT) and refresh_token_expires_at (TIMESTAMPTZ) to the sessions table. Updating schema now."},
];

const TaskModal = ({task,onClose}) => {
  const w=WORKERS.find(x=>x.id===task.w);const sc=ST[task.s];
  const [tab,setTab]=useState("overview");
  const [commentInput,setCommentInput]=useState("");
  const desc = TASK_DESCRIPTIONS[task.id] || "No description provided.";
  const tabs = [{id:"overview",l:"Overview"},{id:"activity",l:"Activity"},{id:"files",l:"Files"},{id:"settings",l:"Settings"}];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="rounded-xl border w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" style={{backgroundColor:C.bg,borderColor:C.bd}} onClick={e=>e.stopPropagation()}>
        {/* Header */}
        <div className="p-4 border-b flex-shrink-0" style={{borderColor:C.bd}}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Bd color={sc.c} bg={sc.bg}>{sc.l}</Bd>
              {task.lock&&<Lock size={14} style={{color:C.ac}}/>}
              {PRI[task.p]&&<span className="text-xs">{PRI[task.p].ic} {PRI[task.p].l}</span>}
              {task.tags.map(t => <span key={t} className="px-1.5 py-0.5 rounded text-[10px]" style={{backgroundColor:`${C.ac}20`,color:C.acH}}>{t}</span>)}
            </div>
            <button onClick={onClose} className="p-1.5 rounded hover:bg-white/5"><X size={16} style={{color:C.txS}}/></button>
          </div>
          <h2 className="text-lg font-semibold mb-1" style={{color:C.tx}}>{task.title}</h2>
          <div className="flex items-center gap-4">
            {w&&<div className="flex items-center gap-2"><Av type={w.type} size={20} role={w.role}/><span className="text-xs" style={{color:C.txS}}>{w.name}{w.isHuman?" (Human)":""}</span></div>}
            <span className="text-[10px]" style={{color:C.txM}}>Created 2 days ago</span>
            {task.sub>0&&<span className="text-xs flex items-center gap-1" style={{color:C.txS}}><CheckCircle2 size={12}/> {task.subD}/{task.sub} subtasks</span>}
          </div>
        </div>

        {/* Blocked banner */}
        {task.block&&<div className="px-4 py-3 border-b flex items-start gap-3 flex-shrink-0" style={{borderColor:C.bd,backgroundColor:`${C.ac}10`}}>
          <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" style={{color:C.ac}}/>
          <div className="flex-1"><p className="text-xs font-medium" style={{color:C.ac}}>Agent Blocked — Input Required</p><p className="text-xs mt-0.5" style={{color:C.txS}}>{task.block}</p></div>
          <div className="flex items-center gap-2 flex-shrink-0"><input placeholder="Provide input..." className="px-3 py-1.5 rounded-lg text-xs border outline-none w-48" style={{backgroundColor:C.glass,borderColor:C.glassBd,color:C.tx,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}/><button className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1" style={{backgroundColor:C.ac,color:C.acFg}}><Send size={12}/> Resume</button></div>
        </div>}

        {/* Tabs */}
        <div className="flex border-b flex-shrink-0" style={{borderColor:C.bd}}>
          {tabs.map(t => <button key={t.id} onClick={() => setTab(t.id)} className="px-4 py-2.5 text-xs font-medium" style={{color:tab===t.id?C.ac:C.txS,borderBottom:tab===t.id?`2px solid ${C.ac}`:"2px solid transparent"}}>{t.l}</button>)}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">

          {/* OVERVIEW TAB */}
          {tab==="overview"&&<div className="flex">
            {/* Left: main content */}
            <div className="flex-1 p-5 border-r" style={{borderColor:C.bd}}>
              {/* Description */}
              <div className="mb-5">
                <span className="text-[10px] uppercase tracking-wider block mb-1.5" style={{color:C.txM}}>Description</span>
                <p className="text-sm leading-relaxed" style={{color:C.tx}}>{desc}</p>
              </div>

              {/* Subtasks */}
              {task.sub>0&&<div className="mb-5">
                <span className="text-[10px] uppercase tracking-wider block mb-1.5" style={{color:C.txM}}>Subtasks ({task.subD}/{task.sub})</span>
                <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{backgroundColor:"rgba(255,255,255,0.05)"}}>
                  <div className="h-full rounded-full " style={{background:"linear-gradient(90deg,#c9a96e,#d4b87e)",boxShadow:"0 0 8px rgba(201,169,110,0.3)",width:`${Math.round(task.subD/task.sub*100)}%`}}/>
                </div>
                <div className="space-y-1">
                  {Array.from({length:task.sub},(_, i)=>{const done=i<task.subD;const subNames=TASK_SUBTASKS[task.id];const name=subNames&&subNames[i]?subNames[i]:`Subtask ${i+1}`;return(
                    <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{backgroundColor:C.glass}}>
                      {done?<CheckCircle2 size={14} style={{color:C.ac}}/>:<div className="w-3.5 h-3.5 rounded-full border" style={{borderColor:C.txM}}/>}
                      <span className="text-xs flex-1" style={{color:done?C.txM:C.tx,textDecoration:done?"line-through":"none"}}>{name}</span>
                      {done&&<span className="text-[9px]" style={{color:C.txM}}>Completed</span>}
                    </div>
                  );})}
                </div>
              </div>}

              {/* Dependencies */}
              <div className="mb-5">
                <span className="text-[10px] uppercase tracking-wider block mb-1.5" style={{color:C.txM}}>Dependencies</span>
                {task.id==="t4"?<div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{backgroundColor:C.glass}}>
                  <Link size={12} style={{color:C.ac}}/><span className="text-xs" style={{color:C.tx}}>Design database schema for user auth</span><Bd color={C.txS} bg={C.bgH} s>Completed</Bd>
                </div>:<span className="text-xs" style={{color:C.txM}}>No dependencies</span>}
              </div>

              {/* Comments section */}
              <div>
                <span className="text-[10px] uppercase tracking-wider block mb-2" style={{color:C.txM}}>Comments ({TASK_COMMENTS.length})</span>
                <div className="space-y-3 mb-3">
                  {TASK_COMMENTS.map(c=>(
                    <div key={c.id} className="flex gap-2.5">
                      {c.isHuman?<div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{backgroundColor:C.bgH,color:C.txS}}>M</div>:<Av type={c.type||"claude-cli"} size={28} role="worker"/>}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5"><span className="text-xs font-medium" style={{color:C.tx}}>{c.author}</span><span className="text-[10px]" style={{color:C.txM}}>{c.time}</span></div>
                        <p className="text-xs leading-relaxed" style={{color:C.txS}}>{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={commentInput} onChange={e=>setCommentInput(e.target.value)} placeholder="Add a comment..." className="flex-1 px-3 py-2 rounded-lg text-xs border outline-none" style={{backgroundColor:C.glass,borderColor:C.glassBd,color:C.tx,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}/>
                  <button className="px-3 py-2 rounded-lg text-xs" style={{backgroundColor:C.ac,color:C.acFg}}><Send size={12}/></button>
                </div>
              </div>
            </div>

            {/* Right sidebar: metadata */}
            <div className="w-56 p-4 flex-shrink-0 space-y-3">
              <div><Lbl>Status</Lbl><Sel defaultValue={task.s}>{Object.entries(ST).map(([k,v])=><option key={k} value={k}>{v.l}</option>)}</Sel></div>
              <div><Lbl>Priority</Lbl><Sel defaultValue={task.p}><option value="urgent">{"\ud83d\udd34"} Urgent</option><option value="high">{"\ud83d\udfe0"} High</option><option value="medium">{"\ud83d\udfe1"} Medium</option><option value="low">{"\ud83d\udfe2"} Low</option></Sel></div>
              <div><Lbl>Worker</Lbl><Sel defaultValue={task.w||"auto"}><option value="auto">Auto</option>{WORKERS.map(wr=><option key={wr.id} value={wr.id}>{wr.name}</option>)}</Sel></div>
              <div><Lbl>Review By</Lbl><Sel><option>Orchestrator decides</option><option>Orchestrator review</option><option>Human Review</option>{WORKERS.filter(wr=>wr.isHuman).map(wr=><option key={wr.id}>{wr.name}</option>)}</Sel></div>
              <div><Lbl>Project</Lbl><Sel defaultValue={task.pr}>{PROJECTS.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</Sel></div>
              <div className="border-t pt-3" style={{borderColor:C.bd}}>
                <Lbl>Files ({TASK_ARTIFACTS.length})</Lbl>
                {TASK_ARTIFACTS.slice(0,2).map(f=><div key={f.name} className="flex items-center gap-2 py-1"><File size={12} style={{color:C.ac}}/><span className="text-[10px] truncate flex-1" style={{color:C.tx}}>{f.name}</span><span className="text-[9px]" style={{color:C.txM}}>{f.size}</span></div>)}
                {TASK_ARTIFACTS.length>2&&<button className="text-[10px] mt-1" style={{color:C.acH}}>+{TASK_ARTIFACTS.length-2} more</button>}
              </div>
              <div className="border-t pt-3" style={{borderColor:C.bd}}>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked={task.lock} className="accent-[#c9a96e]"/><span className="text-xs" style={{color:C.tx}}>Lock task</span><Lock size={12} className="ml-auto" style={{color:C.ac}}/></label>
              </div>
            </div>
          </div>}

          {/* ACTIVITY TAB */}
          {tab==="activity"&&<div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase tracking-wider" style={{color:C.txM}}>Execution Timeline</span>
              <div className="flex gap-1">{["All","Steps","Decisions","Tools"].map(f=><button key={f} className="px-2 py-1 rounded text-[10px]" style={{backgroundColor:f==="All"?`${C.ac}20`:"transparent",color:f==="All"?C.acH:C.txM}}>{f}</button>)}</div>
            </div>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[15px] top-0 bottom-0 w-px" style={{backgroundColor:C.bd}}/>
              <div className="space-y-0">
                {TASK_TIMELINE.map((ev,i)=>{
                  const colors = {step:C.ac,tool:C.ac,decision:C.ac,output:C.ac,status:C.txS,comment:C.ac};
                  const icons = {step:Play,tool:Code,decision:Check,output:File,status:RefreshCw,comment:MessageSquare};
                  const Ic = icons[ev.type]||Play;
                  return (
                    <div key={i} className="flex gap-3 py-2 relative">
                      <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center flex-shrink-0 z-10" style={{backgroundColor:C.bg,border:`2px solid ${colors[ev.type]||C.bd}`}}>
                        <Ic size={12} style={{color:colors[ev.type]||C.txM}}/>
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-center gap-2"><span className="text-xs font-medium" style={{color:C.tx}}>{ev.actor}</span><span className="text-[10px]" style={{color:C.txM}}>{ev.time}</span><Bd color={colors[ev.type]} s>{ev.type}</Bd></div>
                        <p className="text-xs mt-0.5" style={{color:C.txS}}>{ev.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {task.s!=="completed"&&<div className="mt-4 p-3 rounded-lg text-center" style={{backgroundColor:C.glass}}>
              <span className="text-xs" style={{color:C.txM}}>Task is still {sc.l.toLowerCase()} — new activity will appear here in real-time</span>
            </div>}
          </div>}

          {/* FILES TAB */}
          {tab==="files"&&<div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase tracking-wider" style={{color:C.txM}}>Artifacts & Files ({TASK_ARTIFACTS.length})</span>
              <Btn><Upload size={12}/> Upload</Btn>
            </div>
            <div className="space-y-2">
              {TASK_ARTIFACTS.map(f=>(
                <div key={f.name} className="flex items-center gap-3 p-3 rounded-lg border" style={{backgroundColor:C.glass,borderColor:C.glassBd,transitionProperty:"border-color"}} onMouseOver={e=>e.currentTarget.style.borderColor=C.ac} onMouseOut={e=>e.currentTarget.style.borderColor=C.bd}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{backgroundColor:C.bgH}}>
                    {f.type==="code"?<Code size={18} style={{color:C.txS}}/>:f.type==="image"?<Eye size={18} style={{color:C.txS}}/>:<File size={18} style={{color:C.txS}}/>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm block truncate" style={{color:C.tx}}>{f.name}</span>
                    <span className="text-[10px]" style={{color:C.txM}}>{f.size} • {f.date}</span>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded hover:bg-white/5"><Eye size={14} style={{color:C.txS}}/></button>
                    <button className="p-1.5 rounded hover:bg-white/5"><Download size={14} style={{color:C.txS}}/></button>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 p-3 rounded-xl border border-dashed flex items-center justify-center gap-2" style={{borderColor:C.bd,color:C.txM,transitionProperty:"border-color"}} onMouseOver={e=>e.currentTarget.style.borderColor=C.ac} onMouseOut={e=>e.currentTarget.style.borderColor=C.bd}><Upload size={14}/> Drop files here or click to upload</button>
          </div>}

          {/* SETTINGS TAB */}
          {tab==="settings"&&<div className="p-5 max-w-lg space-y-4">
            <div><Lbl>Task Title</Lbl><Inp defaultValue={task.title}/></div>
            <div><Lbl>Description</Lbl><textarea className="w-full px-3 py-2 rounded-lg text-sm border outline-none resize-none" rows={4} style={{backgroundColor:C.glass,borderColor:C.glassBd,color:C.tx,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}} defaultValue={desc}/></div>
            <div><Lbl>Tags</Lbl><Inp defaultValue={task.tags.join(", ")}/></div>
            <div><Lbl>Scheduling</Lbl><div className="flex gap-2">{["Now","Scheduled","Recurring"].map(o=><button key={o} className="flex-1 px-3 py-1.5 rounded-lg text-xs border text-center" style={{borderColor:o==="Now"?C.ac:C.bd,color:o==="Now"?C.ac:C.txS}}>{o}</button>)}</div></div>
            <div className="border-t pt-4" style={{borderColor:C.bd}}>
              <h4 className="text-xs font-semibold mb-2" style={{color:C.err}}>Danger Zone</h4>
              <div className="flex gap-2"><Btn><Archive size={12}/> Archive</Btn><button className="px-4 py-2 rounded-lg text-sm flex items-center gap-2 border" style={{borderColor:C.bd,color:C.err,transitionProperty:"background-color"}} onMouseOver={e=>e.currentTarget.style.backgroundColor=`${C.err}10`} onMouseOut={e=>e.currentTarget.style.backgroundColor="transparent"}><Trash2 size={14}/> Delete</button></div>
            </div>
          </div>}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between p-4 border-t flex-shrink-0" style={{borderColor:C.bd}}>
          <div className="flex items-center gap-2">
            {task.s==="review"&&<><Btn primary><Check size={14}/> Approve</Btn><Btn><XCircle size={14}/> Reject</Btn></>}
            {task.s==="draft"&&<Btn primary><ArrowRight size={14}/> Move to Pending</Btn>}
            {task.s==="pending"&&<Btn primary><Play size={14}/> Start</Btn>}
            {task.s==="completed"&&<Btn><RefreshCw size={14}/> Rerun</Btn>}
            {task.s==="running"&&<Btn><Pause size={14}/> Pause</Btn>}
          </div>
          <span className="text-[10px]" style={{color:C.txM}}>ID: {task.id} • Last updated 2h ago</span>
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
        <div><h2 className="text-lg font-semibold" style={{color:C.tx}}>Workers & Orchestrators</h2><p className="text-sm mt-1" style={{color:C.txS}}>AI agents and human team members</p></div>
        <Btn primary onClick={()=>setModal(true)}><Plus size={16}/> Add Worker</Btn>
      </div>
      {WORKERS.length===0 ? (
        <EmptyState icon={Bot} title="No workers configured" desc="Add AI agents or human team members to start processing tasks. The orchestrator will route work to the best available worker." action="Add First Worker" onAction={()=>setModal(true)}/>
      ) : (
      <div className="grid gap-4" style={{gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))"}}>
        {WORKERS.map(w=>(
          <div key={w.id} className="p-4 rounded-xl border" style={{backgroundColor:C.glassCard,backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderColor:C.bd,borderTop:`1px solid rgba(201,169,110,0.12)`,transitionProperty:"border-color"}} onMouseOver={e=>e.currentTarget.style.borderColor=C.ac} onMouseOut={e=>e.currentTarget.style.borderColor=C.bd}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3"><Av type={w.type} size={40} role={w.role}/>
                <div><div className="flex items-center gap-2"><span className="text-sm font-semibold" style={{color:C.tx}}>{w.name}</span><Dot s={w.status}/></div>
                  <span className="text-xs" style={{color:C.txS}}>{w.isHuman?"Human Team Member":w.model}</span></div></div>
            </div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {w.isHuman?<Bd color={C.ac} bg={C.acM} s>Human</Bd>:<Bd color={w.role==="both"?C.ac:w.role==="orchestrator"?C.ac:C.ac} bg={w.role==="both"?C.acM:w.role==="orchestrator"?C.acM:C.bgH} s>{w.role==="both"?"Worker + Orchestrator":w.role}</Bd>}
              {w.isHuman&&w.skills?.map(sk=>{const s=HUMAN_SKILLS.find(x=>x.id===sk);return s?<Bd key={sk} color="#71717a" bg={C.bgH} s>{s.l}</Bd>:null;})}
              {!w.isHuman&&<Bd color="#71717a" bg={C.bgH} s>Think: {w.think}</Bd>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2 rounded-lg" style={{backgroundColor:C.bg}}><span className="text-[10px] block" style={{color:C.txM}}>Active</span><span className="text-lg font-bold" style={{color:C.tx}}>{w.active}</span></div>
              <div className="p-2 rounded-lg" style={{backgroundColor:C.bg}}><span className="text-[10px] block" style={{color:C.txM}}>Done</span><span className="text-lg font-bold" style={{color:C.tx}}>{w.done}</span></div>
            </div>
          </div>
        ))}
      </div>
      )}
      {/* Create Worker Modal */}
      {modal&&<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={()=>setModal(false)}>
        <div className="rounded-xl border p-6 w-full max-w-md max-h-[85vh] overflow-y-auto" style={{backgroundColor:C.bg,borderColor:C.bd}} onClick={e=>e.stopPropagation()}>
          <h3 className="text-lg font-semibold mb-4" style={{color:C.tx}}>Add Worker</h3>
          {/* Type toggle */}
          <div className="flex gap-2 mb-4">{["AI Agent","Human"].map(t=><button key={t} onClick={()=>setIsHuman(t==="Human")} className="flex-1 px-4 py-2 rounded-lg text-sm border text-center" style={{borderColor:(t==="Human"?isHuman:!isHuman)?C.ac:C.bd,backgroundColor:(t==="Human"?isHuman:!isHuman)?`${C.ac}20`:"transparent",color:(t==="Human"?isHuman:!isHuman)?C.ac:C.txS}}>{t==="AI Agent"?<Bot size={14} className="inline mr-2"/>:<User size={14} className="inline mr-2"/>}{t}</button>)}</div>
          <div className="space-y-4">
            <div><Lbl>Name</Lbl><Inp placeholder={isHuman?"e.g. Sarah Designer":"e.g. Claude Research"}/></div>
            {isHuman?<>
              <div><Lbl>Email</Lbl><Inp placeholder="sarah@company.com" type="email"/></div>
              <div><Lbl>Contact Method</Lbl><div className="flex gap-2">{[{l:"In-App",i:Smartphone},{l:"Email",i:Mail},{l:"Webhook",i:Globe}].map(m=><button key={m.l} className="flex-1 px-3 py-2 rounded-lg text-xs border text-center flex items-center justify-center gap-1" style={{borderColor:m.l==="In-App"?C.ac:C.bd,color:m.l==="In-App"?C.ac:C.txS}}><m.i size={12}/>{m.l}</button>)}</div></div>
              <div><Lbl>Description</Lbl><textarea className="w-full px-3 py-2 rounded-lg text-sm border outline-none resize-none" rows={2} style={{backgroundColor:C.glass,borderColor:C.glassBd,color:C.tx,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}} placeholder="Role, responsibilities, expertise areas..."/></div>
              <div>
                <div className="flex items-center gap-2 mb-2"><Lbl>Skills</Lbl>
                  <div className="relative group"><span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 cursor-help" style={{color:C.txM}}>?</span>
                    <div className="absolute bottom-full left-0 mb-1 w-48 p-2 rounded-lg text-[10px] bg-black/90 text-white hidden group-hover:block z-10">Skills help the orchestrator decide which tasks to assign to this person.</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">{HUMAN_SKILLS.map(sk=>(
                  <label key={sk.id} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border cursor-pointer" style={{borderColor:C.bd,backgroundColor:C.bgC,transitionProperty:"border-color"}} onMouseOver={e=>e.currentTarget.style.borderColor=C.ac} onMouseOut={e=>e.currentTarget.style.borderColor=C.bd} title={sk.d}>
                    <input type="checkbox" className="accent-[#c9a96e]"/>
                    <span className="text-xs" style={{color:C.tx}}>{sk.l}</span>
                  </label>
                ))}</div>
                <Inp placeholder="+ Add custom skill..." className="mt-2"/>
              </div>
              <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer" style={{backgroundColor:C.bgC}}>
                <input type="checkbox" defaultChecked className="accent-[#c9a96e]"/>
                <div><span className="text-sm" style={{color:C.tx}}>Auto-escalate blocked tasks</span><p className="text-[10px]" style={{color:C.txM}}>Automatically assign AI-blocked tasks matching this person's skills</p></div>
              </label>
            </>:<>
              <div><Lbl>Type</Lbl><Sel><option>Claude CLI</option><option>Gemini CLI</option><option>ChatGPT CLI</option><option>Kimi CLI</option><option>Other</option></Sel></div>
              <div><Lbl>Role</Lbl><div className="flex gap-2">{["Worker","Orchestrator","Both"].map(r=><button key={r} className="flex-1 px-3 py-2 rounded-lg text-sm border text-center" style={{borderColor:C.bd,color:C.txS}}>{r}</button>)}</div></div>
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
        <div className="p-3 border-b" style={{borderColor:C.bd}}><button className="w-full px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-1" style={{backgroundColor:C.ac,color:C.acFg}}><Plus size={14}/> New Chat</button></div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {[{id:"p",l:"AI SaaS Platform",s:"Break down auth...",t:"10m"},{id:"g",l:"Global Overview",s:"Cross-project report",t:"2h"}].map(c=>(<button key={c.id} className="w-full text-left p-2 rounded-lg" style={{backgroundColor:c.id==="p"?C.bgH:"transparent"}}><span className="text-sm block truncate" style={{color:C.tx}}>{c.l}</span><span className="text-xs truncate block" style={{color:C.txM}}>{c.s}</span></button>))}
          {/* Empty state hint for no chats */}
          <div className="px-2 pt-2"><p className="text-[10px] leading-relaxed" style={{color:C.txM}}>Each project gets its own chat context. Start typing to begin.</p></div>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b flex items-center justify-between" style={{borderColor:C.bd}}>
          <div className="flex items-center gap-3"><Av type="claude-cli" size={28} role="orchestrator"/><span className="text-sm font-medium" style={{color:C.tx}}>Claude Opus</span></div>
          <button onClick={()=>setShowCtx(!showCtx)} className="px-3 py-1.5 rounded-lg text-xs border flex items-center gap-1" style={{borderColor:showCtx?C.ac:C.bd,color:showCtx?C.ac:C.txS}}><Database size={12}/> Context</button>
        </div>
        <div className="flex-1 flex">
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">{CHATS.length===0 ? (
              <div className="flex-1 flex items-center justify-center h-full">
                <div className="text-center max-w-xs">
                  <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{backgroundColor:`${C.ac}15`}}><MessageSquare size={24} style={{color:C.ac}}/></div>
                  <h3 className="text-sm font-semibold mb-1" style={{color:C.tx}}>Start a conversation</h3>
                  <p className="text-xs leading-relaxed" style={{color:C.txS}}>Ask the orchestrator to break down features, assign tasks, generate reports, or query your connected plugins.</p>
                </div>
              </div>
            ) : CHATS.map(m=>(<div key={m.id} className={`flex ${m.role==="user"?"justify-end":"justify-start"} gap-2`}>{m.role!=="user"&&<Av type="claude-cli" size={28} role="orchestrator"/>}<div className="max-w-[70%]"><div className="p-3 rounded-xl text-sm" style={{backgroundColor:m.role==="user"?C.acM:C.bgC,color:C.tx}}><p className="whitespace-pre-wrap">{m.content}</p></div></div></div>))}</div>
            <div className="p-4 border-t" style={{borderColor:C.bd}}><div className="rounded-xl border p-2" style={{backgroundColor:C.glass,borderColor:C.glassBd,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}><textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask the orchestrator..." className="w-full bg-transparent text-sm outline-none resize-none" style={{color:C.tx,minHeight:40}} rows={1}/><div className="flex items-center justify-between mt-1"><button className="p-1 rounded hover:bg-white/5" style={{color:C.txM}}><Paperclip size={14}/></button><button className="p-1.5 rounded-lg" style={{backgroundColor:C.ac,color:C.acFg}}><Send size={14}/></button></div></div></div>
          </div>
          {showCtx&&<div className="w-60 border-l p-4 overflow-y-auto" style={{borderColor:C.bd,backgroundColor:C.bgS}}>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{color:C.txM}}>Active Context</h4>
            <div className="space-y-2">{["memory.md","project-overview.md","db-schema.md"].map(f=><div key={f} className="flex items-center gap-2 p-2 rounded" style={{backgroundColor:C.bgC}}><FileText size={12} style={{color:C.ac}}/><span className="text-xs flex-1" style={{color:C.tx}}>{f}</span><button className="p-0.5 rounded hover:bg-white/5"><X size={10} style={{color:C.txM}}/></button></div>)}<button className="w-full p-2 rounded border border-dashed text-xs flex items-center justify-center gap-1" style={{borderColor:C.bd,color:C.txM}}><Plus size={10}/> Add</button></div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mt-4 mb-2" style={{color:C.txM}}>Data Sources</h4>
            <div className="space-y-2">{INSTALLED_PLUGINS.map(plg=><div key={plg.id} className="flex items-center gap-2 p-2 rounded" style={{backgroundColor:C.bgC}}><span className="text-sm">{plg.icon}</span><span className="text-xs flex-1" style={{color:C.tx}}>{plg.name}</span><span className="text-[9px]" style={{color:C.ac}}>live</span></div>)}<p className="text-[9px]" style={{color:C.txM}}>The orchestrator can query connected plugins when answering.</p></div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mt-4 mb-2" style={{color:C.txM}}>Tokens</h4>
            <div className="p-2 rounded" style={{backgroundColor:C.bgC}}><div className="flex justify-between text-xs mb-1"><span style={{color:C.txS}}>Used</span><span style={{color:C.tx}}>42K / 128K</span></div><div className="h-1.5 rounded-full overflow-hidden" style={{backgroundColor:C.bg}}><div className="h-full rounded-full " style={{width:"33%"}}/></div></div>
          </div>}
        </div>
      </div>
    </div>
  );
};

// ============ MASTER PLANNER (Full Pyramid DAG) ============
// Activity colors: what type of work does this node do?
const ACT = {
  gather:{l:"Gather",c:C.ac,bg:C.acM,ic:Search,desc:"Research, collect info"},
  build:{l:"Build",c:C.ac,bg:C.acM,ic:Zap,desc:"Implement, create, code"},
  assess:{l:"Assess",c:C.ac,bg:C.acM,ic:Eye,desc:"Evaluate, review, QA"},
  synthesize:{l:"Synthesize",c:C.ac,bg:C.acM,ic:Layers,desc:"Aggregate, report, summarize"},
  fix:{l:"Fix",c:C.err,bg:C.errM,ic:RefreshCw,desc:"Correct, debug, follow-up"},
};
const PLAN_TEMPLATES = [
  {id:"blank",name:"Blank Plan",desc:"Start from scratch",icon:"📋"},
  {id:"saas",name:"SaaS Feature",desc:"Gather → Build → Assess → Deploy",icon:"🚀"},
  {id:"research",name:"Deep Research",desc:"Gather → Synthesize → Assess → Report",icon:"🔬"},
  {id:"migration",name:"Migration",desc:"Gather → Build → Assess → Fix → Deploy",icon:"🔄"},
  {id:"security",name:"Security Audit",desc:"Gather → Assess → Fix → Synthesize",icon:"🛡️"},
];

const PLANS = [
  {id:"plan1",name:"Auth System Overhaul",created:"Feb 24"},
  {id:"plan2",name:"Stripe Integration",created:"Feb 20"},
  {id:"plan3",name:"Q1 Marketing Push",created:"Feb 15"},
];
const PYRAMID = [
  {id:"r0",level:0,label:"Auth System Overhaul",status:"running",priority:"urgent",worker:null,act:null,review:"Orchestrator decides",tags:["master-plan"],children:["r1","r2"],description:"Complete auth system overhaul with JWT, OAuth, 2FA"},
  {id:"r1",level:1,label:"Research & Architecture",status:"completed",priority:"high",worker:"w2",act:"gather",review:"Orchestrator review",tags:["research"],children:["r3","r4"],description:"Analyze requirements and design schemas"},
  {id:"r2",level:1,label:"Implementation",status:"running",priority:"high",worker:"w1",act:"build",review:"Human Review",tags:["dev"],children:["r5","r6","r7"],description:"Build all auth components"},
  {id:"r3",level:2,label:"Vulnerability analysis report",status:"completed",priority:"medium",worker:"w2",act:"gather",review:"Orchestrator review",tags:["security"],children:[],description:"Map attack surface and document findings"},
  {id:"r4",level:2,label:"Auth schema design doc",status:"completed",priority:"high",worker:"w1",act:"synthesize",review:"Human Review",tags:["backend","db"],children:[],description:"User, session, token table specs"},
  {id:"r5",level:2,label:"JWT service",status:"running",priority:"high",worker:"w1",act:"build",review:"Human Review",tags:["backend"],children:["r8","r9"],description:"Token generation and validation"},
  {id:"r6",level:2,label:"OAuth providers",status:"pending",priority:"medium",worker:"w1",act:"build",review:"Orchestrator review",tags:["backend"],children:[],description:"Google, GitHub OAuth integration"},
  {id:"r7",level:2,label:"2FA module",status:"draft",priority:"medium",worker:"w4",act:"build",review:"Human Review",tags:["security"],children:[],description:"TOTP and SMS fallback"},
  {id:"r8",level:3,label:"Token generation",status:"running",priority:"high",worker:"w1",act:"build",review:"Orchestrator review",tags:["backend"],children:[],description:"JWT creation with RS256"},
  {id:"r9",level:3,label:"Token validation middleware",status:"pending",priority:"high",worker:"w1",act:"assess",review:"Orchestrator review",tags:["backend"],children:[],description:"Validate and test JWT verify middleware"},
];

const PLAN_CHATS = [
  {role:"user",content:"Break down the auth system into phases. JWT first, then OAuth.",time:"10:15 AM"},
  {role:"bot",content:"I've created a pyramid plan:\n\nLevel 0: Auth System Overhaul\nLevel 1: Research & Architecture → Implementation\nLevel 2: Individual components (JWT, OAuth, 2FA)\nLevel 3: Granular subtasks\n\nJWT service is prioritized. Want me to add testing phases?",time:"10:16 AM"},
  {role:"user",content:"Yes, add testing as Level 1 after Implementation",time:"10:18 AM"},
];

// Helper: compute progress for a node (recursive child completion %)
const getProgress = (node, all) => {
  if (node.children.length === 0) return node.status === "completed" ? 100 : node.status === "running" ? 50 : 0;
  const kids = all.filter(n => node.children.includes(n.id));
  const total = kids.reduce((s, k) => s + getProgress(k, all), 0);
  return Math.round(total / kids.length);
};

/*
 * Tree connector strategy: each child column draws its OWN horizontal line
 * segments. First child draws right-half, last child draws left-half,
 * middle children draw both halves. This guarantees perfect alignment
 * regardless of varying child widths because every segment is relative
 * to its own column center.
 */
const ChildCol = ({kid, idx, total, allNodes, selected, onSelect, onExpand, expanded, selectMode, selectedNodes, onToggleSelect, filterDimmed}) => {
  const isFirst = idx === 0;
  const isLast = idx === total - 1;
  return (
    <div className="flex flex-col items-center relative" style={{minWidth: 0}}>
      {/* Horizontal connector segments — extends 6px past edge to bridge the flex gap */}
      <div className="relative w-full" style={{height: 2}}>
        {/* Left half — from (left edge - 6px gap bridge) to center */}
        {!isFirst && <div className="absolute top-0 h-full" style={{left: -6, right: "50%", backgroundColor: C.bd}} />}
        {/* Right half — from center to (right edge + 6px gap bridge) */}
        {!isLast && <div className="absolute top-0 h-full" style={{left: "50%", right: -6, backgroundColor: C.bd}} />}
      </div>
      {/* Vertical stub down from horizontal line to child node */}
      <div style={{width: 2, height: 14, backgroundColor: C.bd, flexShrink: 0}} />
      <PyramidNode node={kid} allNodes={allNodes} selected={selected} onSelect={onSelect} onExpand={onExpand} expanded={expanded} selectMode={selectMode} selectedNodes={selectedNodes} onToggleSelect={onToggleSelect} filterDimmed={filterDimmed} />
    </div>
  );
};

const PyramidNode = ({node, allNodes, selected, onSelect, onExpand, expanded, selectMode, selectedNodes, onToggleSelect, filterDimmed}) => {
  const w = WORKERS.find(x => x.id === node.worker);
  const sc = ST[node.status] || ST.draft;
  const pc = PRI[node.priority] || PRI.medium;
  const ac = node.act ? ACT[node.act] : null;
  const isSel = selected === node.id;
  const hasKids = node.children.length > 0;
  const isExp = expanded[node.id];
  const kids = allNodes.filter(n => node.children.includes(n.id));
  const progress = hasKids ? getProgress(node, allNodes) : null;
  const dimmed = filterDimmed && !filterDimmed(node);
  const isChecked = selectedNodes.includes(node.id);
  // Visual sizing by level
  const minW = node.level === 0 ? 280 : node.level === 1 ? 250 : node.level === 2 ? 220 : 200;
  const borderW = node.level === 0 ? 2 : 1;
  const actColor = ac ? ac.c : sc.c;

  return (
    <div className="flex flex-col items-center">
      <div className={`rounded-xl cursor-pointer group relative transition-all`}
        style={{borderWidth: borderW, borderStyle: "solid", borderColor: actColor, backgroundColor: `${actColor}08`, minWidth: minW, maxWidth: minW + 60, opacity: dimmed ? 0.3 : 1, ring: isSel ? `2px solid ${C.ac}` : "none"}}
        onClick={() => selectMode ? onToggleSelect(node.id) : onSelect(isSel ? null : node.id)}>
        {/* Activity color strip on left */}
        {ac && <div className="absolute left-0 top-2 bottom-2 w-1 rounded-full" style={{backgroundColor: ac.c}} />}
        <div className="px-3 py-2" style={{paddingLeft: ac ? 14 : 12}}>
          <div className="flex items-center gap-1.5 mb-1">
            {selectMode && <input type="checkbox" checked={isChecked} onChange={() => onToggleSelect(node.id)} className="accent-[#c9a96e]" onClick={e => e.stopPropagation()} />}
            {!selectMode && hasKids && <button onClick={e => { e.stopPropagation(); onExpand(node.id); }} className="p-0.5 rounded hover:bg-white/5">
              {isExp ? <ChevronDown size={12} style={{color: actColor}} /> : <ChevronRight size={12} style={{color: actColor}} />}
            </button>}
            <span className="text-[10px]">{pc.ic}</span>
            <span className={`font-semibold flex-1 truncate ${node.level === 0 ? 'text-sm' : 'text-xs'}`} style={{color: C.tx}}>{node.label}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Bd color={sc.c} bg={sc.bg} s>{sc.l}</Bd>
            {ac && <Bd color={ac.c} bg={ac.bg} s>{ac.l}</Bd>}
            {w && <div className="flex items-center gap-1"><Av type={w.type} size={14} role={w.role} /><span className="text-[10px]" style={{color: C.txM}}>{w.name}</span></div>}
            {!w && node.level > 0 && <span className="text-[10px]" style={{color: C.txM}}>Unassigned</span>}
          </div>
          {/* Progress bar for parents */}
          {progress !== null && <div className="mt-1.5 flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{backgroundColor: C.bg}}>
              <div className="h-full rounded-full transition-all" style={{width: `${progress}%`, backgroundColor: progress === 100 ? C.ac : actColor}} />
            </div>
            <span className="text-[9px] w-7 text-right" style={{color: C.txM}}>{progress}%</span>
          </div>}
        </div>
        {/* Hover actions */}
        {!selectMode && <div className="absolute -top-2 -right-2 flex gap-0.5 opacity-0 group-hover:opacity-100 z-20">
          <button className="w-5 h-5 rounded-full flex items-center justify-center" style={{backgroundColor: C.ac, color: C.acFg}} title="Add child"><Plus size={10} /></button>
          <button className="w-5 h-5 rounded-full flex items-center justify-center" style={{backgroundColor: "#71717a", color: "#ffffff"}} title="Edit"><Edit3 size={10} /></button>
        </div>}
      </div>
      {/* Tree connectors + children */}
      {hasKids && isExp && <>
        {/* Vertical line down from parent to the horizontal rail */}
        <div style={{width: 2, height: 16, backgroundColor: C.bd, flexShrink: 0}} />
        {kids.length === 1 ? (
          <PyramidNode node={kids[0]} allNodes={allNodes} selected={selected} onSelect={onSelect} onExpand={onExpand} expanded={expanded} selectMode={selectMode} selectedNodes={selectedNodes} onToggleSelect={onToggleSelect} filterDimmed={filterDimmed} />
        ) : (
          /* Each child column draws its own horizontal segments — guaranteed aligned */
          <div className="flex items-start gap-3">
            {kids.map((kid, idx) => (
              <ChildCol key={kid.id} kid={kid} idx={idx} total={kids.length} allNodes={allNodes} selected={selected} onSelect={onSelect} onExpand={onExpand} expanded={expanded} selectMode={selectMode} selectedNodes={selectedNodes} onToggleSelect={onToggleSelect} filterDimmed={filterDimmed} />
            ))}
          </div>
        )}
      </>}
    </div>
  );
};

const PlannerView = () => {
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState({"r0":true,"r1":true,"r2":true,"r5":true});
  const [showVersions, setShowVersions] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const isPanning = useRef(false);
  const panStart = useRef({x: 0, y: 0, px: 0, py: 0});
  const canvasRef = useRef(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [filterWorker, setFilterWorker] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterAct, setFilterAct] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [activePlan, setActivePlan] = useState("plan1");
  const versions = [{id:"v3",name:"v3 — After adding 2FA",date:"Today 10:30"},{id:"v2",name:"v2 — Expanded testing",date:"Today 09:15"},{id:"v1",name:"v1 — Initial plan",date:"Yesterday"}];
  const toggleExp = (id) => setExpanded(p => ({...p, [id]: !p[id]}));
  const selNode = PYRAMID.find(n => n.id === selected);
  const roots = PYRAMID.filter(n => n.level === 0);
  const onToggleSelect = (id) => setSelectedNodes(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const hasFilter = filterWorker !== "all" || filterStatus !== "all" || filterAct !== "all";
  const filterDimmed = hasFilter ? (node) => {
    if (filterWorker !== "all" && node.worker !== filterWorker) return false;
    if (filterStatus !== "all" && node.status !== filterStatus) return false;
    if (filterAct !== "all" && node.act !== filterAct) return false;
    return true;
  } : null;
  // Chat context: show which node is selected
  const chatCtx = selNode ? selNode.label : null;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b flex-shrink-0" style={{borderColor:C.bd}}>
        <div className="flex items-center gap-2">
          {/* Plan selector */}
          <select value={activePlan} onChange={e => setActivePlan(e.target.value)} className="px-3 py-1.5 rounded-lg text-sm border font-semibold outline-none" style={{backgroundColor:C.glass,borderColor:C.glassBd,color:C.tx,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}>
            {PLANS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            <option value="new">+ New Plan...</option>
          </select>
          <span className="text-[10px]" style={{color:C.txM}}>{PYRAMID.length} nodes</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Btn onClick={() => setShowTemplates(!showTemplates)}><Layers size={12}/> Templates</Btn>
          <Btn onClick={() => setShowFilter(!showFilter)}><Filter size={12}/> Filter {hasFilter && <span className="w-1.5 h-1.5 rounded-full " />}</Btn>
          <Btn onClick={() => { setSelectMode(!selectMode); setSelectedNodes([]); }}>{selectMode ? <><Check size={12}/> Done</> : <><CheckCircle2 size={12}/> Select</>}</Btn>
          <div className="flex items-center gap-0.5 rounded-lg border px-1.5 py-1" style={{borderColor:C.bd}}>
            <button onClick={() => setZoom(z => Math.max(0.3, z - 0.15))} className="text-xs px-1" style={{color:C.txS}}>−</button>
            <span className="text-[10px] w-8 text-center" style={{color:C.txS}}>{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(2, z + 0.15))} className="text-xs px-1" style={{color:C.txS}}>+</button>
          </div>
          <Btn><RotateCcw size={12}/> Undo</Btn>
          <div className="relative">
            <Btn onClick={() => setShowVersions(!showVersions)}><Save size={12}/> Versions</Btn>
            {showVersions && <div className="absolute right-0 top-full mt-1 w-64 rounded-xl border p-3 z-30" style={{backgroundColor:C.bg,borderColor:C.bd}}>
              <h4 className="text-xs font-semibold mb-2" style={{color:C.txM}}>Version History</h4>
              {versions.map(v => <div key={v.id} className="flex items-center gap-2 p-2 rounded cursor-pointer"><GitBranch size={12} style={{color:C.ac}}/><div><span className="text-xs block" style={{color:C.tx}}>{v.name}</span><span className="text-[10px]" style={{color:C.txM}}>{v.date}</span></div></div>)}
              <div className="mt-2 pt-2 border-t" style={{borderColor:C.bd}}><Inp placeholder="Name this version..."/><button className="w-full mt-2 px-3 py-1.5 rounded-lg text-xs" style={{backgroundColor:C.ac,color:C.acFg}}>Save</button></div>
            </div>}
          </div>
          <Btn onClick={() => setShowChat(!showChat)}><MessageSquare size={12}/> Chat</Btn>
          <Btn><Download size={12}/> Export</Btn>
          <Btn primary><Zap size={14}/> Launch</Btn>
        </div>
      </div>

      {/* Filter bar */}
      {showFilter && <div className="px-4 py-2 border-b flex items-center gap-3 flex-shrink-0" style={{borderColor:C.bd,backgroundColor:C.bgS}}>
        <span className="text-[10px] uppercase tracking-wider" style={{color:C.txM}}>Filter:</span>
        <select value={filterWorker} onChange={e => setFilterWorker(e.target.value)} className="px-2 py-1 rounded text-xs border outline-none" style={{backgroundColor:C.glass,borderColor:C.glassBd,color:C.tx,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}>
          <option value="all">All Workers</option>
          {WORKERS.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-2 py-1 rounded text-xs border outline-none" style={{backgroundColor:C.glass,borderColor:C.glassBd,color:C.tx,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}>
          <option value="all">All Statuses</option>
          {Object.entries(ST).map(([k, v]) => <option key={k} value={k}>{v.l}</option>)}
        </select>
        <select value={filterAct} onChange={e => setFilterAct(e.target.value)} className="px-2 py-1 rounded text-xs border outline-none" style={{backgroundColor:C.glass,borderColor:C.glassBd,color:C.tx,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}>
          <option value="all">All Activities</option>
          {Object.entries(ACT).map(([k, v]) => <option key={k} value={k}>{v.l}</option>)}
        </select>
        {hasFilter && <button onClick={() => { setFilterWorker("all"); setFilterStatus("all"); setFilterAct("all"); }} className="text-[10px] px-2 py-1 rounded bg-white/10" style={{color:C.txS}}>Clear</button>}
      </div>}

      {/* Templates strip */}
      {showTemplates && <div className="px-4 py-2 border-b flex items-center gap-2 overflow-x-auto flex-shrink-0" style={{borderColor:C.bd,backgroundColor:C.bgS}}>
        <span className="text-[10px] uppercase tracking-wider flex-shrink-0" style={{color:C.txM}}>New from:</span>
        {PLAN_TEMPLATES.map(t => <button key={t.id} className="flex items-center gap-2 px-3 py-2 rounded-xl border whitespace-nowrap flex-shrink-0" style={{borderColor:C.bd,backgroundColor:C.bgC,transitionProperty:"border-color"}} onMouseOver={e=>e.currentTarget.style.borderColor=C.ac} onMouseOut={e=>e.currentTarget.style.borderColor=C.bd}>
          <span>{t.icon}</span>
          <div className="text-left"><span className="text-xs block" style={{color:C.tx}}>{t.name}</span><span className="text-[9px]" style={{color:C.txM}}>{t.desc}</span></div>
        </button>)}
      </div>}

      <div className="flex-1 flex overflow-hidden">
        {/* Pyramid Canvas — pan with mouse drag, zoom with scroll wheel */}
        <div
          ref={canvasRef}
          className="flex-1 overflow-hidden relative"
          style={{
            backgroundColor: C.bgS,
            backgroundImage: `radial-gradient(circle, ${C.bd} 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
            cursor: isPanning.current ? "grabbing" : "grab",
          }}
          onMouseDown={e => {
            if (e.button !== 0) return;
            isPanning.current = true;
            panStart.current = {x: e.clientX, y: e.clientY, px: panX, py: panY};
            e.currentTarget.style.cursor = "grabbing";
          }}
          onMouseMove={e => {
            if (!isPanning.current) return;
            const dx = e.clientX - panStart.current.x;
            const dy = e.clientY - panStart.current.y;
            setPanX(panStart.current.px + dx);
            setPanY(panStart.current.py + dy);
          }}
          onMouseUp={() => {
            isPanning.current = false;
            if (canvasRef.current) canvasRef.current.style.cursor = "grab";
          }}
          onMouseLeave={() => {
            isPanning.current = false;
            if (canvasRef.current) canvasRef.current.style.cursor = "grab";
          }}
          onWheel={e => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.08 : 0.08;
            setZoom(z => Math.min(2, Math.max(0.3, z + delta)));
          }}
        >
          <div className="p-8 inline-block" style={{
            transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
            transformOrigin: "0 0",
            minWidth: "100%",
            minHeight: "100%",
          }}>
            {roots.map(root => <PyramidNode key={root.id} node={root} allNodes={PYRAMID} selected={selected} onSelect={setSelected} onExpand={toggleExp} expanded={expanded} selectMode={selectMode} selectedNodes={selectedNodes} onToggleSelect={onToggleSelect} filterDimmed={filterDimmed} />)}
            <div className="flex justify-center mt-6">
              <button className="px-4 py-2 rounded-xl border border-dashed flex items-center gap-2" style={{borderColor:C.bd,color:C.txM,backgroundColor:C.bgC,transitionProperty:"border-color"}} onMouseOver={e=>e.currentTarget.style.borderColor=C.ac} onMouseOut={e=>e.currentTarget.style.borderColor=C.bd}><Plus size={14}/> Add Phase</button>
            </div>
          </div>
          {/* Minimap */}
          <div className="absolute bottom-3 right-3 w-32 h-20 rounded-lg border overflow-hidden" style={{backgroundColor:C.bg,borderColor:C.bd,opacity:0.85}}>
            <div className="p-1.5">
              <div className="flex flex-col items-center gap-0.5">
                <div className="w-12 h-1.5 rounded-full" style={{backgroundColor:"#c9a96e"}} />
                <div className="flex gap-1"><div className="w-8 h-1 rounded-full" style={{backgroundColor:C.ac}} /><div className="w-8 h-1 rounded-full" style={{backgroundColor:C.ac}} /></div>
                <div className="flex gap-0.5"><div className="w-5 h-0.5 rounded-full" style={{backgroundColor:C.ac}} /><div className="w-5 h-0.5 rounded-full" style={{backgroundColor:C.ac}} /><div className="w-5 h-0.5 rounded-full" style={{backgroundColor:C.ac}} /><div className="w-5 h-0.5 rounded-full" style={{backgroundColor:C.ac}} /><div className="w-5 h-0.5 rounded-full" style={{backgroundColor:"#71717a"}} /></div>
              </div>
            </div>
            <span className="text-[8px] absolute bottom-0.5 right-1.5" style={{color:C.txM}}>minimap</span>
          </div>
          {/* Zoom reset button */}
          <button
            onClick={() => { setZoom(1); setPanX(0); setPanY(0); }}
            className="absolute bottom-3 left-3 px-2 py-1 rounded-lg border text-[10px]"
            style={{backgroundColor: C.bg, borderColor: C.bd, color: C.txM}}
          >
            Reset View
          </button>
        </div>

        {/* Bulk action bar */}
        {selectMode && selectedNodes.length > 0 && <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 px-5 py-3 rounded-xl border z-30" style={{backgroundColor:C.bg,borderColor:C.ac,boxShadow:"0 8px 30px rgba(0,0,0,0.5)"}}>
          <span className="text-xs font-semibold" style={{color:C.tx}}>{selectedNodes.length} selected</span>
          <select className="px-2 py-1 rounded text-xs border outline-none" style={{backgroundColor:C.glass,borderColor:C.glassBd,color:C.tx,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}>
            <option>Set Worker...</option>
            {WORKERS.map(w => <option key={w.id}>{w.name}</option>)}
          </select>
          <select className="px-2 py-1 rounded text-xs border outline-none" style={{backgroundColor:C.glass,borderColor:C.glassBd,color:C.tx,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}>
            <option>Set Status...</option>
            {Object.entries(ST).map(([k, v]) => <option key={k}>{v.l}</option>)}
          </select>
          <select className="px-2 py-1 rounded text-xs border outline-none" style={{backgroundColor:C.glass,borderColor:C.glassBd,color:C.tx,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}>
            <option>Set Activity...</option>
            {Object.entries(ACT).map(([k, v]) => <option key={k}>{v.l}</option>)}
          </select>
          <button className="p-1.5 rounded hover:bg-white/5" title="Delete selected"><Trash2 size={14} style={{color:C.err}} /></button>
          <button onClick={() => { setSelectMode(false); setSelectedNodes([]); }} className="p-1.5 rounded hover:bg-white/5"><X size={14} style={{color:C.txS}} /></button>
        </div>}

        {/* Right panel: detail or chat */}
        {(selNode || showChat) && <div className="w-80 border-l flex flex-col overflow-hidden flex-shrink-0" style={{borderColor:C.bd,backgroundColor:C.bg}}>
          {selNode && showChat && <div className="flex border-b flex-shrink-0" style={{borderColor:C.bd}}>
            <button onClick={() => setShowChat(false)} className="flex-1 px-3 py-2 text-xs text-center" style={{color:!showChat?C.ac:C.txS,backgroundColor:!showChat?`${C.ac}10`:"transparent"}}>Details</button>
            <button onClick={() => setShowChat(true)} className="flex-1 px-3 py-2 text-xs text-center" style={{color:showChat?C.ac:C.txS,backgroundColor:showChat?`${C.ac}10`:"transparent"}}>Chat</button>
          </div>}

          {/* Detail panel */}
          {selNode && !showChat && <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold" style={{color:C.tx}}>{selNode.label}</h3>
              <button onClick={() => setSelected(null)} className="p-1 rounded hover:bg-white/5"><X size={14} style={{color:C.txS}} /></button>
            </div>
            <p className="text-xs mb-4" style={{color:C.txS}}>{selNode.description}</p>
            <div className="space-y-3">
              <div><Lbl>Status</Lbl><Sel defaultValue={selNode.status}><option value="draft">Draft</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="running">Running</option><option value="awaiting_input">Awaiting Input</option><option value="review">Review</option><option value="completed">Completed</option></Sel></div>
              <div><Lbl>Priority</Lbl><Sel defaultValue={selNode.priority}><option value="urgent">🔴 Urgent</option><option value="high">🟠 High</option><option value="medium">🟡 Medium</option><option value="low">🟢 Low</option></Sel></div>
              <div><Lbl>Activity</Lbl><Sel defaultValue={selNode.act||"none"}><option value="none">None</option>{Object.entries(ACT).map(([k, v]) => <option key={k} value={k}>{v.l} — {v.desc}</option>)}</Sel></div>
              <div><Lbl>Worker</Lbl><Sel defaultValue={selNode.worker||"auto"}><option value="auto">Auto (Orchestrator)</option>{WORKERS.map(w => <option key={w.id} value={w.id}>{w.isHuman?"👤":"🤖"} {w.name}</option>)}</Sel></div>
              <div><Lbl>Review By</Lbl><Sel defaultValue={selNode.review}><option>Orchestrator decides</option><option>Orchestrator review</option><option>Human Review</option>{WORKERS.filter(w => w.isHuman).map(w => <option key={w.id}>{w.name}</option>)}</Sel></div>
              <div><Lbl>Tags</Lbl><div className="flex flex-wrap gap-1">{selNode.tags.map(t => <span key={t} className="px-1.5 py-0.5 rounded text-[10px]" style={{backgroundColor:`${C.ac}20`,color:C.acH}}>{t}</span>)}<button className="px-1.5 py-0.5 rounded text-[10px] border border-dashed" style={{borderColor:C.bd,color:C.txM}}>+</button></div></div>
              {selNode.children.length > 0 && <div><Lbl>Children ({selNode.children.length})</Lbl>
                <div className="space-y-1">{PYRAMID.filter(n => selNode.children.includes(n.id)).map(ch => { const chSc = ST[ch.status] || ST.draft; return <div key={ch.id} className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer" style={{backgroundColor:C.bgC}} onClick={() => setSelected(ch.id)}><Bd color={chSc.c} bg={chSc.bg} s>{chSc.l}</Bd><span className="text-xs flex-1 truncate" style={{color:C.tx}}>{ch.label}</span></div>; })}</div>
              </div>}
              {selNode.level > 0 && <div><Lbl>Depends on</Lbl>
                <div className="space-y-1">{PYRAMID.filter(n => n.children.includes(selNode.id)).map(p => <div key={p.id} className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer" style={{backgroundColor:C.bgC}} onClick={() => setSelected(p.id)}><Link size={10} style={{color:C.ac}} /><span className="text-xs" style={{color:C.tx}}>{p.label}</span></div>)}</div>
              </div>}
              <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer" style={{backgroundColor:C.bgC}}>
                <input type="checkbox" className="accent-[#c9a96e]" />
                <div><span className="text-xs" style={{color:C.tx}}>Lock node</span><p className="text-[10px]" style={{color:C.txM}}>Prevent orchestrator from modifying</p></div>
              </label>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t" style={{borderColor:C.bd}}>
              <Btn primary><Check size={12}/> Save</Btn>
              <button className="p-2 rounded hover:bg-white/5" title="Delete"><Trash2 size={14} style={{color:C.err}} /></button>
            </div>
          </div>}

          {/* Chat panel */}
          {showChat && <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-3 border-b flex items-center justify-between flex-shrink-0" style={{borderColor:C.bd}}>
              <div className="flex items-center gap-2"><Av type="claude-cli" size={22} role="orchestrator" /><span className="text-xs font-medium" style={{color:C.tx}}>Plan Chat</span></div>
              {!selNode && <button onClick={() => setShowChat(false)} className="p-1 rounded hover:bg-white/5"><X size={14} style={{color:C.txS}} /></button>}
            </div>
            {/* Chat context indicator */}
            {chatCtx && <div className="px-3 py-1.5 border-b flex items-center gap-2 flex-shrink-0" style={{borderColor:C.bd,backgroundColor:`${C.ac}08`}}>
              <Target size={10} style={{color:C.ac}} />
              <span className="text-[10px]" style={{color:C.acH}}>Context: {chatCtx}</span>
            </div>}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {PLAN_CHATS.map((m, i) => <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} gap-1.5`}>
                {m.role !== "user" && <Av type="claude-cli" size={20} role="orchestrator" />}
                <div className="max-w-[85%] p-2.5 rounded-xl text-xs" style={{backgroundColor:m.role === "user" ? C.acM : C.bgC,color:C.tx}}>
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  <span className="text-[9px] block mt-1" style={{color:C.txM}}>{m.time}</span>
                </div>
              </div>)}
            </div>
            <div className="p-3 border-t flex-shrink-0" style={{borderColor:C.bd}}>
              <div className="flex gap-2">
                <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder={chatCtx ? `Ask about "${chatCtx}"...` : "Ask about this plan..."} className="flex-1 px-3 py-2 rounded-lg text-xs border outline-none" style={{backgroundColor:C.glass,borderColor:C.glassBd,color:C.tx,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}} />
                <button className="p-2 rounded-lg" style={{backgroundColor:C.ac,color:C.acFg}}><Send size={14} /></button>
              </div>
            </div>
          </div>}

          {!selNode && !showChat && <div className="flex-1 flex items-center justify-center p-6"><p className="text-xs text-center" style={{color:C.txM}}>Click a node to see details, or open Chat to talk to the orchestrator.</p></div>}
        </div>}
      </div>
    </div>
  );
};

// ============ NOTES (with Condense) ============
const NOTES_DATA = [
  {id:"n1",title:"Payment Integration",proj:"AI SaaS Platform",content:"# Payment Integration\n\nStripe as primary payment processor.\nPaddle for EU transactions (VAT handling).\n\n## Key Decisions\n- Monthly + yearly billing\n- Free tier: 100 tasks/day, 1 project\n- Pro: $29/mo, unlimited tasks, 10 projects\n- Team: $49/mo/seat, shared workers\n\n## TODO\n- Set up Stripe test environment\n- Design pricing page\n- Implement webhook handlers",proposed:0,pinned:false,updated:"2h ago"},
  {id:"n2",title:"Performance Optimization",proj:"Data Pipeline v2",content:"# Performance Issues\n\nSlow queries identified in the data pipeline.\n\n## Bottlenecks\n1. N+1 query in task fetching (fix with JOIN)\n2. Missing index on task_runs.created_at\n3. Unoptimized vector search (add IVFFlat index)\n\n## Benchmarks\n- Current: 450ms avg query time\n- Target: <100ms\n- After indexing: ~80ms (tested locally)",proposed:3,pinned:true,updated:"30m ago"},
  {id:"n3",title:"Competitor Analysis",proj:"AI SaaS Platform",content:"# Competitor Gap Analysis\n\nMonday has timeline view we're missing.\nLinear has keyboard-first UX.\nNotion has flexible databases.\n\n## Our Advantages\n- AI-native orchestration\n- Multi-agent support\n- Master Planner (pyramid DAG)\n- Real-time agent monitoring\n\n## Features to Consider\n- Timeline / Gantt view\n- Keyboard shortcuts everywhere\n- Custom fields on tasks",proposed:0,pinned:false,updated:"1d ago"},
  {id:"n4",title:"API Rate Strategy",proj:"AI SaaS Platform",content:"# API Rate Limiting Strategy\n\n## Tiers\n- Free: 100 req/day\n- Pro: 10,000 req/day\n- Team: 50,000 req/day\n- Enterprise: Custom\n\n## Implementation\n- Use Supabase edge functions\n- Redis for rate counting\n- Return X-RateLimit headers\n- Graceful degradation on limit hit",proposed:0,pinned:false,updated:"3d ago"},
];

const NotesView = () => {
  const [condense,setCondense]=useState(false);
  const [activeNote,setActiveNote]=useState(null);
  const [noteContent,setNoteContent]=useState("");
  const openNote=(n)=>{setActiveNote(n);setNoteContent(n.content);};
  const notes=NOTES_DATA;

  if(activeNote) return (
    <div className="flex-1 flex overflow-hidden">
      {/* Note list sidebar */}
      <div className="w-64 border-r flex flex-col" style={{borderColor:C.bd,backgroundColor:C.bgS}}>
        <div className="p-3 border-b flex items-center gap-2" style={{borderColor:C.bd}}>
          <button onClick={()=>setActiveNote(null)} className="p-1 rounded hover:bg-white/5"><ChevronLeft size={16} style={{color:C.txS}}/></button>
          <span className="text-sm font-medium" style={{color:C.tx}}>Notes</span>
          <button className="ml-auto p-1 rounded hover:bg-white/5"><Plus size={16} style={{color:C.txS}}/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {notes.map(n=>(
            <button key={n.id} onClick={()=>openNote(n)} className="w-full text-left p-2.5 rounded-lg" style={{backgroundColor:activeNote.id===n.id?C.bgH:"transparent"}}>
              <div className="flex items-center gap-1.5">{n.pinned&&<Pin size={10} style={{color:C.ac}}/>}<span className="text-sm font-medium truncate" style={{color:activeNote.id===n.id?C.tx:C.txS}}>{n.title}</span></div>
              <span className="text-[10px] block mt-0.5" style={{color:C.txM}}>{n.updated}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Editor area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-3 border-b flex-shrink-0" style={{borderColor:C.bd}}>
          <div className="flex items-center gap-3">
            {activeNote.pinned&&<Pin size={14} style={{color:C.ac}}/>}
            <input defaultValue={activeNote.title} className="text-lg font-semibold bg-transparent outline-none" style={{color:C.tx}}/>
            <Bd color="#c9a96e" s>{activeNote.proj}</Bd>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px]" style={{color:C.txM}}>Edited {activeNote.updated}</span>
            <button className="p-1.5 rounded hover:bg-white/5" title={activeNote.pinned?"Unpin":"Pin"}><Pin size={14} style={{color:activeNote.pinned?C.ac:C.txM}}/></button>
            <Btn><Sparkles size={12}/> Propose Tasks</Btn>
            <Btn primary><Save size={12}/> Save</Btn>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <textarea value={noteContent} onChange={e=>setNoteContent(e.target.value)} className="w-full h-full bg-transparent text-sm outline-none resize-none font-mono leading-relaxed" style={{color:C.tx,minHeight:"100%"}} placeholder="Start writing..."/>
        </div>
        {/* AI assist bar */}
        <div className="px-6 py-2.5 border-t flex items-center gap-3" style={{borderColor:C.bd,backgroundColor:C.bgS}}>
          <Sparkles size={14} style={{color:C.ac}}/>
          <input placeholder="Ask AI to expand, summarize, or restructure this note..." className="flex-1 bg-transparent text-xs outline-none" style={{color:C.tx}}/>
          <button className="px-3 py-1.5 rounded-lg text-[10px]" style={{backgroundColor:C.ac,color:C.acFg}}>Generate</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold" style={{color:C.tx}}>Notes</h2>
        <div className="flex gap-2"><Btn onClick={()=>setCondense(!condense)}><Shrink size={14}/> Condense</Btn><Btn primary><Plus size={16}/> New Note</Btn></div>
      </div>
      {condense&&<div className="mb-6 p-4 rounded-xl border" style={{backgroundColor:`${C.ac}10`,borderColor:`${C.ac}40`}}>
        <p className="text-xs mb-3" style={{color:C.txS}}>AI will group notes by theme. Pinned notes won't be affected.</p>
        <div className="flex items-center gap-3"><Lbl>Worker:</Lbl><select className="px-2 py-1 rounded text-xs border" style={{backgroundColor:C.glass,borderColor:C.glassBd,color:C.tx,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}>{WORKERS.map(w=><option key={w.id}>{w.name}</option>)}</select>
          <Btn primary><Sparkles size={14}/> Preview</Btn><span className="text-[10px]" style={{color:C.txM}}>Revert anytime.</span></div>
      </div>}
      {notes.length===0 ? (
        <EmptyState icon={FileText} title="No notes yet" desc="Capture ideas, decisions, and context. The AI can propose tasks from your notes or condense them by theme." action="Create First Note"/>
      ) : (
      <div className="grid gap-4" style={{gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))"}}>
        {notes.map(n=><div key={n.id} onClick={()=>openNote(n)} className="p-4 rounded-xl border cursor-pointer" style={{backgroundColor:C.glassCard,backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderColor:C.bd,borderTop:`1px solid rgba(201,169,110,0.12)`,transitionProperty:"border-color"}} onMouseOver={e=>e.currentTarget.style.borderColor=C.ac} onMouseOut={e=>e.currentTarget.style.borderColor=C.bd}>
          <div className="flex items-center gap-2 mb-2">{n.pinned&&<Pin size={12} style={{color:C.ac}}/>}<h3 className="text-sm font-semibold flex-1" style={{color:C.tx}}>{n.title}</h3>
            {!n.pinned&&<button className="p-1 rounded hover:bg-white/5" title="Pin" onClick={e=>e.stopPropagation()}><Pin size={12} style={{color:C.txM}}/></button>}</div>
          <Bd color="#c9a96e" s>{n.proj}</Bd>
          <p className="text-sm mt-2 line-clamp-2" style={{color:C.txS}}>{n.content.split("\n").filter(l=>!l.startsWith("#")&&l.trim()).slice(0,2).join(" ")}</p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{borderColor:C.bd}}>
            {n.proposed>0?<Bd color={C.tx} bg={C.bgH} s>{n.proposed} tasks proposed</Bd>:<button className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 border" style={{borderColor:C.bd,color:C.acH}} onClick={e=>e.stopPropagation()}><Sparkles size={12}/> Propose Tasks</button>}
            <span className="text-[10px]" style={{color:C.txM}}>{n.updated}</span>
          </div>
        </div>)}
      </div>
      )}
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
        {["all","p1","p2","p3"].map(s=><button key={s} onClick={()=>setScope(s)} className="px-3 py-1 rounded-lg text-xs border" style={{borderColor:scope===s?C.ac:C.bd,color:scope===s?C.ac:C.txS,backgroundColor:scope===s?`${C.ac}20`:"transparent"}}>{s==="all"?"All Projects":PROJECTS.find(p=>p.id===s)?.name}</button>)}
        <div className="ml-auto flex gap-1">{["24h","7d","30d"].map(p=><button key={p} onClick={()=>setPeriod(p)} className="px-2 py-1 rounded text-xs" style={{backgroundColor:period===p?`${C.ac}20`:"transparent",color:period===p?C.ac:C.txS}}>{p}</button>)}</div>
      </div>
      {/* Active blocks */}
      {blocks.length===0 ? (
        <EmptyState icon={BarChart3} title="No report blocks" desc="Build your custom briefing by adding report blocks. Choose from executive summaries, task stats, worker performance, and more." action="Add Report Block" onAction={()=>setShowAdd(true)}/>
      ) : (<>
      <div className="space-y-3 mb-4">
        {blocks.map(bId=>{const bDef=REPORT_BLOCKS.find(b=>b.id===bId);if(!bDef)return null;const I=bDef.icon;
          return (<div key={bId} className="rounded-xl border group" style={{backgroundColor:C.glassCard,backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderColor:C.bd,borderTop:`1px solid rgba(201,169,110,0.12)`}}>
            <div className="flex items-center gap-3 p-3 border-b" style={{borderColor:C.bd}}>
              <GripVertical size={14} style={{color:C.txM}} className="cursor-grab"/>
              <I size={14} style={{color:C.ac}}/><span className="text-sm font-medium flex-1" style={{color:C.tx}}>{bDef.name}</span>
              <button onClick={()=>setBlocks(bs=>bs.filter(b=>b!==bId))} className="p-1 rounded hover:bg-white/5 opacity-0 group-hover:opacity-100"><X size={12} style={{color:C.txM}}/></button>
            </div>
            <div className="p-4">
              {bId==="exec-summary"&&<p className="text-sm" style={{color:C.txS}}>Strong progress across projects. 5 tasks completed, 1 blocked (API docs awaiting credentials). Auth module nearing completion — recommend starting Stripe integration.</p>}
              {bId==="task-stats"&&<div className="grid grid-cols-4 gap-3">{[{l:"Completed",v:"5",c:C.ac},{l:"Running",v:"3",c:C.ac},{l:"Blocked",v:"1",c:C.ac},{l:"Failed",v:"0",c:C.err}].map(s=><div key={s.l} className="p-2 rounded" style={{backgroundColor:C.bg}}><span className="text-[10px] block" style={{color:C.txM}}>{s.l}</span><span className="text-2xl font-bold" style={{color:s.c}}>{s.v}</span></div>)}</div>}
              {bId==="per-project"&&<div className="space-y-2">{PROJECTS.map(p=>{const pct=Math.round(p.done/p.total*100);return <div key={p.id} className="flex items-center gap-3"><div className="w-3 h-3 rounded-sm" style={{backgroundColor:p.color}}/><span className="text-xs w-36" style={{color:C.tx}}>{p.name}</span><div className="flex-1 h-2 rounded-full" style={{backgroundColor:C.bg}}><div className="h-full rounded-full" style={{width:`${pct}%`,backgroundColor:p.color}}/></div><span className="text-xs" style={{color:C.txS}}>{pct}%</span></div>})}</div>}
              {bId==="recommendations"&&<div className="space-y-2">{["Unblock API docs — provide test API key","Start Stripe integration — deps met","Schedule security audit next week"].map((r,i)=><div key={i} className="flex items-center justify-between p-2 rounded" style={{backgroundColor:C.bg}}><span className="text-sm" style={{color:C.tx}}>{r}</span><button className="px-2 py-1 rounded text-[10px] ml-2" style={{backgroundColor:C.ac,color:C.acFg}}>Create Task</button></div>)}</div>}
              {bId==="worker-perf"&&<div className="space-y-2">{WORKERS.filter(w=>!w.isHuman).map(w=>{const rate=[92,87,78,95][WORKERS.indexOf(w)]||80;const cost=["$18.00","$4.00","$2.00","$6.50"][WORKERS.indexOf(w)]||"$0";return <div key={w.id} className="flex items-center gap-3 p-2 rounded" style={{backgroundColor:C.bg}}><Av type={w.type} size={24} role={w.role}/><span className="text-xs w-28 truncate" style={{color:C.tx}}>{w.name}</span><div className="flex-1 h-2 rounded-full" style={{backgroundColor:C.bgC}}><div className="h-full rounded-full" style={{width:`${rate}%`,backgroundColor:rate>85?C.ac:rate>70?C.ac:C.err}}/></div><span className="text-xs w-10 text-right" style={{color:rate>85?C.ac:C.ac}}>{rate}%</span><span className="text-xs w-14 text-right" style={{color:C.txS}}>{cost}</span></div>})}<div className="flex justify-between pt-2 mt-1 border-t" style={{borderColor:C.bd}}><span className="text-[10px]" style={{color:C.txM}}>Success rate</span><span className="text-[10px]" style={{color:C.txM}}>Cost this period</span></div></div>}
              {bId==="token-cost"&&<div><div className="grid grid-cols-3 gap-3 mb-3">{[{n:"Claude",t:"1.2M",c:"$18.00",cl:C.ac},{n:"Gemini",t:"800K",c:"$4.00",cl:C.ac},{n:"GPT-4o",t:"200K",c:"$2.00",cl:C.ac}].map(u=><div key={u.n} className="p-2 rounded" style={{backgroundColor:C.bg}}><div className="flex items-center gap-1.5 mb-1"><div className="w-2 h-2 rounded-full" style={{backgroundColor:u.cl}}/><span className="text-[10px]" style={{color:C.txM}}>{u.n}</span></div><span className="text-sm font-bold" style={{color:C.tx}}>{u.t}</span><span className="text-xs block" style={{color:C.ac}}>{u.c}</span></div>)}</div><div className="flex justify-between p-2 rounded" style={{backgroundColor:C.bg}}><span className="text-sm" style={{color:C.tx}}>Total Spend</span><span className="text-sm font-bold" style={{color:C.ac}}>$24.00</span></div></div>}
              {bId==="completed-list"&&<div className="space-y-1">{TASKS.filter(t=>t.s==="completed").map(t=>{const w=WORKERS.find(x=>x.id===t.w);return <div key={t.id} className="flex items-center gap-2 p-2 rounded" style={{backgroundColor:C.bg}}><CheckCircle2 size={14} style={{color:C.ac}}/><span className="text-xs flex-1 truncate" style={{color:C.tx}}>{t.title}</span>{w&&<span className="text-[10px]" style={{color:C.txM}}>{w.name}</span>}<span className="text-[10px]" style={{color:C.txM}}>2h ago</span></div>})}{TASKS.filter(t=>t.s==="completed").length===0&&<p className="text-xs" style={{color:C.txM}}>No completed tasks in this period.</p>}</div>}
              {bId==="blocked-analysis"&&<div className="space-y-2">{TASKS.filter(t=>t.s==="awaiting_input"||t.s==="failed").map(t=>{const sc=ST[t.s];return <div key={t.id} className="p-3 rounded" style={{backgroundColor:C.bg}}><div className="flex items-center gap-2 mb-1"><sc.i size={12} style={{color:sc.c}}/><span className="text-xs font-medium" style={{color:C.tx}}>{t.title}</span><Bd color={sc.c} bg={sc.bg} s>{sc.l}</Bd></div>{t.block?<p className="text-[11px] pl-5" style={{color:C.txS}}>{t.block}</p>:<p className="text-[11px] pl-5" style={{color:C.txM}}>No blocker details.</p>}</div>})}</div>}
              {bId==="timeline"&&<div className="relative"><div className="absolute left-3 top-0 bottom-0 w-px" style={{backgroundColor:C.bd}}/>{[{t:"Today 14:00",e:"Security audit started",c:C.ac},{t:"Today 11:00",e:"Kanban moved to Review",c:C.ac},{t:"Today 10:30",e:"DB schema completed",c:C.ac},{t:"Yesterday",e:"Competitor research started",c:C.ac},{t:"Feb 23",e:"Project created",c:"#c9a96e"}].map((ev,i)=><div key={i} className="flex gap-3 py-1.5 relative"><div className="w-6 h-6 rounded-full flex items-center justify-center z-10 flex-shrink-0" style={{backgroundColor:C.bg,border:`2px solid ${ev.c}`}}><div className="w-2 h-2 rounded-full" style={{backgroundColor:ev.c}}/></div><div className="pt-0.5"><span className="text-xs" style={{color:C.tx}}>{ev.e}</span><span className="text-[10px] block" style={{color:C.txM}}>{ev.t}</span></div></div>)}</div>}
              {bId==="notes-summary"&&<div className="space-y-2">{NOTES_DATA.slice(0,3).map(n=><div key={n.id} className="p-2 rounded" style={{backgroundColor:C.bg}}><div className="flex items-center gap-2 mb-0.5">{n.pinned&&<Pin size={10} style={{color:C.ac}}/>}<span className="text-xs font-medium" style={{color:C.tx}}>{n.title}</span><Bd color="#c9a96e" s>{n.proj}</Bd></div><p className="text-[11px] line-clamp-2" style={{color:C.txS}}>{n.content.split("\n").filter(l=>!l.startsWith("#")&&l.trim()).slice(0,2).join(" ")}</p></div>)}</div>}
              {bId==="custom-block"&&<div><textarea className="w-full px-3 py-2 rounded-lg text-xs font-mono border outline-none resize-none mb-2" rows={3} style={{backgroundColor:C.bg,borderColor:C.bd,color:C.tx}} defaultValue={"// Custom JS — orchestria.tasks, orchestria.workers\nconst blocked = orchestria.tasks.filter(t => t.status === 'blocked');\nreturn { value: blocked.length, label: 'Blocked' };"}/><div className="flex items-center justify-between"><span className="text-[10px]" style={{color:C.txM}}>Sandboxed execution</span><button className="px-3 py-1 rounded text-[10px]" style={{backgroundColor:C.ac,color:C.acFg}}>Run</button></div></div>}
              {!["exec-summary","task-stats","per-project","recommendations","worker-perf","token-cost","completed-list","blocked-analysis","timeline","notes-summary","custom-block"].includes(bId)&&<p className="text-xs" style={{color:C.txM}}>Content for "{bDef.name}" will be generated.</p>}
            </div>
          </div>);
        })}
      </div>
      <button onClick={()=>setShowAdd(true)} className="w-full p-4 rounded-xl border border-dashed flex items-center justify-center gap-2" style={{borderColor:C.bd,color:C.txM,transitionProperty:"border-color"}} onMouseOver={e=>e.currentTarget.style.borderColor=C.ac} onMouseOut={e=>e.currentTarget.style.borderColor=C.bd}><Plus size={16}/> Add Report Block</button>
      </>)}
      {showAdd&&<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={()=>setShowAdd(false)}>
        <div className="rounded-xl border w-full max-w-md max-h-[60vh] overflow-y-auto p-4" style={{backgroundColor:C.bg,borderColor:C.bd}} onClick={e=>e.stopPropagation()}>
          <h3 className="text-lg font-semibold mb-3" style={{color:C.tx}}>Add Report Block</h3>
          {REPORT_BLOCKS.map(b=>{const I=b.icon;const added=blocks.includes(b.id);return(
            <div key={b.id} className="flex items-center gap-3 p-3 rounded-lg mb-1" style={{backgroundColor:added?`${C.ac}10`:C.bgC}}>
              <I size={16} style={{color:added?C.ac:C.txM}}/><div className="flex-1"><span className="text-sm" style={{color:C.tx}}>{b.name}</span><p className="text-[10px]" style={{color:C.txM}}>{b.desc}</p></div>
              {added?<Bd color={C.ac} s>Added</Bd>:<button onClick={()=>{setBlocks(bs=>[...bs,b.id]);setShowAdd(false);}} className="px-3 py-1 rounded text-xs" style={{backgroundColor:C.ac,color:C.acFg}}>Add</button>}
            </div>);
          })}
        </div>
      </div>}
    </div>
  );
};

// ============ STORAGE ============
// ============ STORAGE DATA ============
const STORAGE_FILES = [
  {id:"f1",name:"schema.sql",type:"code",proj:"p1",projName:"AI SaaS Platform",worker:"Claude Opus",workerType:"claude-cli",task:"Design database schema",size:"4.2 KB",date:"2h ago",recency:3,status:"approved",tags:["backend","db"]},
  {id:"f2",name:"competitor-analysis.md",type:"doc",proj:"p1",projName:"AI SaaS Platform",worker:"Gemini Research",workerType:"gemini-cli",task:"Research competitor pricing",size:"45 KB",date:"4h ago",recency:5,status:"review",tags:["research"]},
  {id:"f3",name:"security-report.md",type:"doc",proj:"p1",projName:"AI SaaS Platform",worker:"Kimi Analyzer",workerType:"kimi-cli",task:"Security audit - auth flow",size:"28 KB",date:"1h ago",recency:2,status:"review",tags:["security"]},
  {id:"f4",name:"email-templates.html",type:"code",proj:"p2",projName:"Marketing Automation",worker:"Claude Opus",workerType:"claude-cli",task:"Create landing page copy",size:"8 KB",date:"30m ago",recency:1,status:"approved",tags:["frontend"]},
  {id:"f5",name:"er-diagram.png",type:"image",proj:"p1",projName:"AI SaaS Platform",worker:"Claude Opus",workerType:"claude-cli",task:"Design database schema",size:"128 KB",date:"2h ago",recency:4,status:"approved",tags:["backend"]},
  {id:"f6",name:"migration-001.sql",type:"code",proj:"p1",projName:"AI SaaS Platform",worker:"Claude Opus",workerType:"claude-cli",task:"Design database schema",size:"1.8 KB",date:"2h ago",recency:3,status:"approved",tags:["backend","db"]},
  {id:"f7",name:"pipeline-config.yml",type:"code",proj:"p3",projName:"Data Pipeline v2",worker:"Kimi Analyzer",workerType:"kimi-cli",task:"Set up CI/CD pipeline",size:"3.1 KB",date:"1d ago",recency:6,status:"approved",tags:["devops"]},
  {id:"f8",name:"api-spec.yaml",type:"doc",proj:"p1",projName:"AI SaaS Platform",worker:null,workerType:null,task:null,size:"22 KB",date:"3d ago",recency:7,status:"uploaded",tags:["docs"],isUpload:true},
  {id:"f9",name:"brand-guidelines.pdf",type:"doc",proj:null,projName:"Shared",worker:null,workerType:null,task:null,size:"2.4 MB",date:"1w ago",recency:8,status:"uploaded",tags:["design"],isUpload:true,isShared:true},
];

const KNOWLEDGE_INDEX = [
  {id:"ki1",type:"artifact",label:"DB schema for auth module",proj:"AI SaaS Platform",summary:"Postgres schema with users, sessions, roles tables. UUID PKs, RS256 JWT.",tags:["backend","db"],updated:"2h ago",tokens:320},
  {id:"ki2",type:"memory_fact",label:"JWT decision: RS256 chosen",proj:"AI SaaS Platform",summary:"Team decided on RS256 over HS256 for JWT signing. Supports key rotation.",tags:["backend","security"],updated:"2h ago",tokens:85},
  {id:"ki3",type:"plugin_data",label:"Stripe MRR — Feb 2026",proj:"AI SaaS Platform",summary:"$4,280 MRR, 38 active subscribers, 2.1% churn. Growing +12% MoM.",tags:["revenue","metrics"],updated:"2m ago",tokens:120},
  {id:"ki4",type:"file",label:"Competitor analysis (5 companies)",proj:"AI SaaS Platform",summary:"12-page analysis: Linear, Notion, Monday, ClickUp, Asana. Pricing, features, gaps.",tags:["research","strategy"],updated:"4h ago",tokens:450},
  {id:"ki5",type:"task_output",label:"CI/CD pipeline config",proj:"Data Pipeline v2",summary:"GitHub Actions workflow. Docker build → Supabase migration → Vercel deploy.",tags:["devops","infra"],updated:"1d ago",tokens:210},
  {id:"ki6",type:"memory_fact",label:"N+1 query fix strategy",proj:"Data Pipeline v2",summary:"Identified N+1 in task fetching. Fix: JOIN with eager loading. Target <100ms.",tags:["performance","backend"],updated:"30m ago",tokens:95},
  {id:"ki7",type:"artifact",label:"Security audit findings",proj:"AI SaaS Platform",summary:"Auth flow audit: no SQL injection found, XSS risk in input fields, CSRF tokens needed.",tags:["security"],updated:"1h ago",tokens:380},
  {id:"ki8",type:"plugin_data",label:"GitHub open issues snapshot",proj:"AI SaaS Platform",summary:"12 open issues, 4 open PRs, 47 commits in last 7 days.",tags:["dev","metrics"],updated:"5m ago",tokens:90},
];

const MEMORY_FACTS = [
  {id:"mf1",content:"JWT signing uses RS256 (not HS256) to support key rotation in production. Decision made during auth schema design.",source:"Design database schema",proj:"AI SaaS Platform",date:"2h ago",tags:["jwt","auth","decision"]},
  {id:"mf2",content:"User table uses UUID primary keys instead of serial integers for better security and distributed ID generation.",source:"Design database schema",proj:"AI SaaS Platform",date:"2h ago",tags:["db","auth","decision"]},
  {id:"mf3",content:"Competitor Linear has keyboard-first UX as key differentiator. Orchestria should prioritize ⌘K and shortcuts.",source:"Research competitor pricing",proj:"AI SaaS Platform",date:"4h ago",tags:["competitive","ux"]},
  {id:"mf4",content:"N+1 query identified in task fetching endpoint. Fix: replace sequential queries with JOINs. Benchmarked: 450ms → 80ms.",source:"Optimize database queries",proj:"Data Pipeline v2",date:"30m ago",tags:["performance","fix"]},
  {id:"mf5",content:"Auth flow has no SQL injection vulnerability. XSS risk found in 2 input fields (task title, note content). CSRF tokens not yet implemented.",source:"Security audit - auth flow",proj:"AI SaaS Platform",date:"1h ago",tags:["security","finding"]},
  {id:"mf6",content:"Free tier pricing: 100 tasks/day, 1 project. Pro: $29/mo unlimited. Team: $49/mo/seat. Based on competitor analysis.",source:"Research competitor pricing",proj:"AI SaaS Platform",date:"4h ago",tags:["pricing","decision"]},
];

const COMPACTION_LOG = [
  {id:"cl1",task:"Design database schema",run:"run-047",factsExtracted:3,stepsDeleted:12,date:"2h ago",status:"done"},
  {id:"cl2",task:"Research competitor pricing",run:"run-044",factsExtracted:4,stepsDeleted:28,date:"4h ago",status:"done"},
  {id:"cl3",task:"Security audit - auth flow",run:"run-051",factsExtracted:0,stepsDeleted:0,date:"1h ago",status:"pending",note:"Task still running"},
];

const StorageView = () => {
  const [tab,setTab]=useState("files");
  const [fileFilter,setFileFilter]=useState("all");
  const [fileSearch,setFileSearch]=useState("");
  const [selectedFile,setSelectedFile]=useState(null);
  const [kiSearch,setKiSearch]=useState("");
  const [mfSearch,setMfSearch]=useState("");
  const [contextMode,setContextMode]=useState("recency");
  const [tokenBudget,setTokenBudget]=useState(8000);
  const [pinnedDocs,setPinnedDocs]=useState(["ki1","ki2"]);
  const [excludedProjects,setExcludedProjects]=useState([]);

  const storeTabs=[{id:"files",l:"Files",i:File},{id:"knowledge",l:"Knowledge",i:Brain},{id:"context",l:"Context",i:Target}];
  const typeIcons={code:Code,doc:FileText,image:Eye,data:Database};
  const statusColors={approved:C.tx,review:C.ac,uploaded:C.txS};
  const kiTypeColors={artifact:C.ac,memory_fact:C.ac,plugin_data:C.ac,file:C.ac,task_output:C.ac};

  const filteredFiles = STORAGE_FILES.filter(f=>{
    if(fileFilter==="review") return f.status==="review";
    if(fileFilter==="artifacts") return !f.isUpload;
    if(fileFilter==="uploads") return f.isUpload;
    return true;
  }).filter(f=>{
    if(!fileSearch) return true;
    const q=fileSearch.toLowerCase();
    return f.name.toLowerCase().includes(q)||f.tags.some(t=>t.includes(q))||(f.worker||"").toLowerCase().includes(q);
  }).sort((a,b)=>fileFilter==="recent"?a.recency-b.recency:0).slice(0,fileFilter==="recent"?5:Infinity);

  const filteredKI = KNOWLEDGE_INDEX.filter(ki=>{
    if(!kiSearch) return true;
    const q=kiSearch.toLowerCase();
    return ki.label.toLowerCase().includes(q)||ki.summary.toLowerCase().includes(q)||ki.tags.some(t=>t.includes(q));
  });

  const filteredMF = MEMORY_FACTS.filter(mf=>{
    if(!mfSearch) return true;
    const q=mfSearch.toLowerCase();
    return mf.content.toLowerCase().includes(q)||mf.tags.some(t=>t.includes(q));
  });

  const totalIndexTokens = KNOWLEDGE_INDEX.reduce((s,ki)=>s+ki.tokens,0);
  const pinnedTokens = KNOWLEDGE_INDEX.filter(ki=>pinnedDocs.includes(ki.id)).reduce((s,ki)=>s+ki.tokens,0);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center gap-4 px-6 py-2.5 border-b flex-shrink-0" style={{borderColor:C.bd}}>
        <div className="flex gap-0.5 rounded-lg border p-0.5" style={{borderColor:C.bd}}>
          {storeTabs.map(t=>{const I=t.i;return <button key={t.id} onClick={()=>setTab(t.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs" style={{backgroundColor:tab===t.id?`${C.ac}20`:"transparent",color:tab===t.id?C.ac:C.txM}}><I size={14}/>{t.l}</button>;})}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-[10px]" style={{color:C.txM}}>Total: <strong style={{color:C.tx}}>2.6 MB</strong> / 1 GB</span>
          <div className="w-20 h-1.5 rounded-full" style={{backgroundColor:C.bgC}}><div className="h-full rounded-full " style={{width:"0.3%"}}/></div>
        </div>
      </div>

      {/* ===== FILES TAB ===== */}
      {tab==="files"&&<div className="flex-1 flex overflow-hidden">
        <div className={`flex-1 flex flex-col overflow-hidden ${selectedFile?"":""}` }>
          {/* File toolbar */}
          <div className="flex items-center gap-3 px-6 py-2.5 border-b flex-shrink-0" style={{borderColor:C.bd}}>
            <div className="relative flex-1 max-w-sm"><Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{color:C.txM}}/><input value={fileSearch} onChange={e=>setFileSearch(e.target.value)} placeholder="Search files by name, tag, worker..." className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs border outline-none" style={{backgroundColor:C.glass,borderColor:C.glassBd,color:C.tx,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}/></div>
            <div className="flex gap-1">
              {[{id:"all",l:"All",c:STORAGE_FILES.length},{id:"recent",l:"Recent",c:STORAGE_FILES.length},{id:"review",l:"Review",c:STORAGE_FILES.filter(f=>f.status==="review").length},{id:"artifacts",l:"Artifacts",c:STORAGE_FILES.filter(f=>!f.isUpload).length},{id:"uploads",l:"Uploads",c:STORAGE_FILES.filter(f=>f.isUpload).length}].map(f=>
                <button key={f.id} onClick={()=>setFileFilter(f.id)} className="px-2 py-1 rounded-full text-[10px]" style={{backgroundColor:fileFilter===f.id?`${C.ac}20`:"transparent",color:fileFilter===f.id?C.acH:C.txM,border:`1px solid ${fileFilter===f.id?C.ac:C.bd}`}}>{f.l} ({f.c})</button>
              )}
            </div>
            <Btn primary><Upload size={12}/> Upload</Btn>
          </div>
          {/* File list */}
          <div className="flex-1 overflow-y-auto">
            {filteredFiles.length===0?(
              <EmptyState icon={HardDrive} title="No files found" desc={fileSearch?"No files match your search. Try different keywords.":"Files generated by agents and your uploads will appear here."} action="Upload File"/>
            ):(
            <div>
              <div className="flex items-center gap-3 px-6 py-1.5 text-[10px] uppercase tracking-wider" style={{color:C.txM,backgroundColor:C.bgS}}>
                <span className="flex-1">File</span>
                <span className="w-36">Source</span>
                <span className="w-20">Size</span>
                <span className="w-16">Status</span>
                <span className="w-16 text-right">Date</span>
              </div>
              {filteredFiles.map(f=>{const TI=typeIcons[f.type]||File;return(
                <div key={f.id} onClick={()=>setSelectedFile(selectedFile?.id===f.id?null:f)} className="flex items-center gap-3 px-6 py-2.5 border-b cursor-pointer" style={{borderColor:C.bd,backgroundColor:selectedFile?.id===f.id?`${C.ac}08`:"transparent"}}>
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{backgroundColor:f.type==="code"?C.bgH:f.type==="image"?C.bgH:f.type==="doc"?C.acM:C.bgH}}>
                      <TI size={16} style={{color:f.type==="code"?C.ac:f.type==="image"?C.ac:f.type==="doc"?C.ac:"#71717a"}}/>
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm block truncate" style={{color:C.tx}}>{f.name}</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px]" style={{color:f.isShared?C.ac:PROJECTS.find(p=>p.id===f.proj)?.color||C.txM}}>{f.projName}</span>
                        {f.tags.slice(0,2).map(t=><span key={t} className="text-[9px] px-1 py-0.5 rounded" style={{backgroundColor:`${C.ac}15`,color:C.acH}}>{t}</span>)}
                      </div>
                    </div>
                  </div>
                  <div className="w-36 flex items-center gap-1.5 min-w-0">{f.workerType?<><Av type={f.workerType} size={16} role="worker"/><span className="text-[10px] truncate" style={{color:C.txS}}>{f.worker}</span></>:f.isUpload?<span className="text-[10px]" style={{color:C.txS}}>User upload</span>:<span className="text-[10px]" style={{color:C.txM}}>—</span>}</div>
                  <span className="w-20 text-xs" style={{color:C.txS}}>{f.size}</span>
                  <div className="w-16"><Bd color={statusColors[f.status]||"#71717a"} s>{f.status}</Bd></div>
                  <span className="w-16 text-[10px] text-right" style={{color:C.txM}}>{f.date}</span>
                </div>
              );})}
            </div>
            )}
            {/* Upload zone */}
            {filteredFiles.length>0&&<div className="p-6"><button className="w-full p-4 rounded-xl border border-dashed flex items-center justify-center gap-2" style={{borderColor:C.bd,color:C.txM,transitionProperty:"border-color"}} onMouseOver={e=>e.currentTarget.style.borderColor=C.ac} onMouseOut={e=>e.currentTarget.style.borderColor=C.bd}><Upload size={14}/> Drop files here or click to upload</button></div>}
          </div>
        </div>
        {/* File detail panel */}
        {selectedFile&&<div className="w-72 border-l flex-shrink-0 overflow-y-auto" style={{borderColor:C.bd,backgroundColor:C.bgS}}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold" style={{color:C.tx}}>File Details</span>
              <button onClick={()=>setSelectedFile(null)} className="p-1 rounded hover:bg-white/5"><X size={12} style={{color:C.txS}}/></button>
            </div>
            <div className="w-full h-32 rounded-lg mb-3 flex items-center justify-center" style={{backgroundColor:C.bg}}>
              {(()=>{const TI=typeIcons[selectedFile.type]||File;return <TI size={32} style={{color:C.txM}}/>;})()}
            </div>
            <h3 className="text-sm font-semibold mb-1 break-all" style={{color:C.tx}}>{selectedFile.name}</h3>
            <div className="space-y-2.5 mt-3">
              <div><Lbl>Project</Lbl><span className="text-xs" style={{color:C.tx}}>{selectedFile.projName}</span></div>
              <div><Lbl>Type</Lbl><span className="text-xs" style={{color:C.tx}}>{selectedFile.type}</span></div>
              <div><Lbl>Size</Lbl><span className="text-xs" style={{color:C.tx}}>{selectedFile.size}</span></div>
              <div><Lbl>Created</Lbl><span className="text-xs" style={{color:C.tx}}>{selectedFile.date}</span></div>
              {selectedFile.worker&&<div><Lbl>Created by</Lbl><div className="flex items-center gap-1.5 mt-0.5"><Av type={selectedFile.workerType} size={18} role="worker"/><span className="text-xs" style={{color:C.tx}}>{selectedFile.worker}</span></div></div>}
              {selectedFile.task&&<div><Lbl>Task</Lbl><span className="text-xs" style={{color:C.acH}}>{selectedFile.task}</span></div>}
              <div><Lbl>Tags</Lbl><div className="flex flex-wrap gap-1 mt-0.5">{selectedFile.tags.map(t=><span key={t} className="px-1.5 py-0.5 rounded text-[10px]" style={{backgroundColor:`${C.ac}20`,color:C.acH}}>{t}</span>)}</div></div>
              <div><Lbl>Status</Lbl><Bd color={statusColors[selectedFile.status]} s>{selectedFile.status}</Bd></div>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t" style={{borderColor:C.bd}}>
              <Btn><Download size={12}/> Download</Btn>
              <button className="p-2 rounded-lg border" style={{borderColor:C.bd,transitionProperty:"background-color"}} onMouseOver={e=>e.currentTarget.style.backgroundColor=`${C.err}10`} onMouseOut={e=>e.currentTarget.style.backgroundColor="transparent"}><Trash2 size={14} style={{color:C.err}}/></button>
            </div>
            <div className="mt-4 p-3 rounded-lg" style={{backgroundColor:`${C.ac}08`,border:`1px solid ${C.ac}30`}}>
              <div className="flex items-center gap-2 mb-1.5"><Brain size={12} style={{color:C.ac}}/><span className="text-[10px] font-medium" style={{color:C.ac}}>Ask Orchestrator</span></div>
              <input placeholder={`"Summarize this file" or "Create tasks from this"`} className="w-full px-2 py-1.5 rounded text-[10px] border outline-none" style={{backgroundColor:C.bg,borderColor:C.bd,color:C.tx}}/>
            </div>
          </div>
        </div>}
      </div>}

      {/* ===== KNOWLEDGE TAB ===== */}
      {tab==="knowledge"&&<div className="flex-1 overflow-y-auto p-6">
        {/* Knowledge Index */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div><h3 className="text-sm font-semibold" style={{color:C.tx}}>Knowledge Index</h3><p className="text-[10px] mt-0.5" style={{color:C.txM}}>The orchestrator's high-level map. Always loaded in context ({totalIndexTokens} tokens).</p></div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1"><Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2" style={{color:C.txM}}/><input value={kiSearch} onChange={e=>setKiSearch(e.target.value)} placeholder="Search index..." className="pl-7 pr-3 py-1.5 rounded-lg text-[10px] border outline-none" style={{backgroundColor:C.glass,borderColor:C.glassBd,color:C.tx,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)",width:200}}/></div>
              <Btn><Plus size={12}/> Add Entry</Btn>
            </div>
          </div>
          <div className="rounded-xl border overflow-hidden" style={{borderColor:C.bd}}>
            <div className="flex items-center gap-3 px-4 py-1.5 text-[9px] uppercase tracking-wider" style={{color:C.txM,backgroundColor:C.bgS}}>
              <span className="w-5"></span>
              <span className="w-20">Type</span>
              <span className="flex-1">Label & Summary</span>
              <span className="w-28">Project</span>
              <span className="w-12">Tokens</span>
              <span className="w-16 text-right">Updated</span>
            </div>
            {filteredKI.map(ki=>{const isPinned=pinnedDocs.includes(ki.id);return(
              <div key={ki.id} className="flex items-center gap-3 px-4 py-2.5 border-t" style={{borderColor:C.bd,backgroundColor:isPinned?`${C.ac}05`:"transparent"}}>
                <button onClick={()=>setPinnedDocs(p=>p.includes(ki.id)?p.filter(x=>x!==ki.id):[...p,ki.id])} className="w-5" title={isPinned?"Unpin from context":"Pin to context"}><Pin size={12} style={{color:isPinned?C.ac:C.txM}}/></button>
                <div className="w-20"><Bd color={kiTypeColors[ki.type]} s>{ki.type.replace("_"," ")}</Bd></div>
                <div className="flex-1 min-w-0"><span className="text-xs block truncate" style={{color:C.tx}}>{ki.label}</span><span className="text-[10px] block truncate" style={{color:C.txS}}>{ki.summary}</span></div>
                <span className="w-28 text-[10px] truncate" style={{color:C.txS}}>{ki.proj}</span>
                <span className="w-12 text-[10px] text-center" style={{color:C.txM}}>{ki.tokens}</span>
                <span className="w-16 text-[10px] text-right" style={{color:C.txM}}>{ki.updated}</span>
              </div>
            );})}
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[10px]" style={{color:C.txM}}>{KNOWLEDGE_INDEX.length} entries • {totalIndexTokens} tokens total • {pinnedDocs.length} pinned ({pinnedTokens} tokens)</span>
          </div>
        </div>

        {/* Memory Facts */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div><h3 className="text-sm font-semibold" style={{color:C.tx}}>Memory Facts</h3><p className="text-[10px] mt-0.5" style={{color:C.txM}}>Extracted knowledge from completed tasks. Searchable via semantic similarity (pgvector).</p></div>
            <div className="relative"><Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2" style={{color:C.txM}}/><input value={mfSearch} onChange={e=>setMfSearch(e.target.value)} placeholder="Semantic search: ask a question..." className="pl-7 pr-3 py-1.5 rounded-lg text-[10px] border outline-none" style={{backgroundColor:C.glass,borderColor:C.glassBd,color:C.tx,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)",width:280}}/></div>
          </div>
          <div className="space-y-2">
            {filteredMF.map(mf=>(
              <div key={mf.id} className="p-3 rounded-xl border" style={{backgroundColor:C.glass,borderColor:C.glassBd}}>
                <p className="text-xs leading-relaxed mb-2" style={{color:C.tx}}>{mf.content}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] flex items-center gap-1" style={{color:C.txM}}><ArrowRight size={10}/> from: <span style={{color:C.acH}}>{mf.source}</span></span>
                  <span className="text-[10px]" style={{color:C.txM}}>•</span>
                  <span className="text-[10px]" style={{color:C.txM}}>{mf.proj}</span>
                  <span className="text-[10px]" style={{color:C.txM}}>•</span>
                  <span className="text-[10px]" style={{color:C.txM}}>{mf.date}</span>
                  <div className="ml-auto flex gap-1">{mf.tags.map(t=><span key={t} className="px-1 py-0.5 rounded text-[9px]" style={{backgroundColor:`${C.ac}15`,color:C.acH}}>{t}</span>)}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2"><span className="text-[10px]" style={{color:C.txM}}>{MEMORY_FACTS.length} facts stored • vector embeddings: text-embedding-3-small (1536d)</span></div>
        </div>
      </div>}

      {/* ===== CONTEXT TAB ===== */}
      {tab==="context"&&<div className="flex-1 overflow-y-auto p-6">
        {/* Context Modes */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold mb-1" style={{color:C.tx}}>Context Mode</h3>
          <p className="text-[10px] mb-4" style={{color:C.txM}}>Controls how the orchestrator selects which knowledge to load into its context window.</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              {id:"full",l:"Full Overview",desc:"Top N facts across ALL projects and time. Wide coverage, less depth per item.",icon:Globe,best:"New projects, small knowledge bases"},
              {id:"recency",l:"Recency Bias",desc:"Similarity × 0.7 + Recency × 0.3. Recent info prioritized, older not excluded.",icon:Clock,best:"Active dev, fast-moving projects"},
              {id:"custom",l:"Custom",desc:"Set weights, pin docs, exclude projects, adjust thresholds. Full control.",icon:Settings,best:"Power users, multi-project setups"},
            ].map(m=>{const I=m.icon;return(
              <div key={m.id} onClick={()=>setContextMode(m.id)} className="p-4 rounded-xl border cursor-pointer" style={{backgroundColor:contextMode===m.id?`${C.ac}10`:C.bgC,borderColor:contextMode===m.id?C.ac:C.bd}}>
                <div className="flex items-center gap-2 mb-2">
                  {contextMode===m.id?<div className="w-4 h-4 rounded-full  flex items-center justify-center" style={{backgroundColor:C.ac,color:C.acFg}}><Check size={10} /></div>:<div className="w-4 h-4 rounded-full border" style={{borderColor:C.txM}}/>}
                  <I size={16} style={{color:contextMode===m.id?C.ac:C.txS}}/>
                  <span className="text-sm font-semibold" style={{color:contextMode===m.id?C.ac:C.tx}}>{m.l}</span>
                </div>
                <p className="text-[11px] leading-relaxed mb-2" style={{color:C.txS}}>{m.desc}</p>
                <span className="text-[9px]" style={{color:C.txM}}>Best for: {m.best}</span>
              </div>
            );})}
          </div>
        </div>

        {/* Custom mode settings */}
        {contextMode==="custom"&&<div className="mb-8 p-4 rounded-xl border" style={{backgroundColor:C.glass,borderColor:C.glassBd,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}>
          <h4 className="text-xs font-semibold mb-3" style={{color:C.tx}}>Custom Mode Settings</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-4"><Lbl>Similarity Weight</Lbl><input type="range" min="0" max="100" defaultValue="70" className="flex-1 accent-[#c9a96e]"/><span className="text-xs w-8" style={{color:C.tx}}>0.7</span></div>
            <div className="flex items-center gap-4"><Lbl>Recency Weight</Lbl><input type="range" min="0" max="100" defaultValue="30" className="flex-1 accent-[#c9a96e]"/><span className="text-xs w-8" style={{color:C.tx}}>0.3</span></div>
            <div className="flex items-center gap-4"><Lbl>Similarity Threshold</Lbl><input type="range" min="0" max="100" defaultValue="60" className="flex-1 accent-[#c9a96e]"/><span className="text-xs w-8" style={{color:C.tx}}>0.6</span></div>
            <div>
              <Lbl>Pinned Documents ({pinnedDocs.length})</Lbl>
              <div className="flex flex-wrap gap-1.5 mt-1">{KNOWLEDGE_INDEX.filter(ki=>pinnedDocs.includes(ki.id)).map(ki=>
                <div key={ki.id} className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{backgroundColor:C.bg}}>
                  <Pin size={10} style={{color:C.ac}}/>
                  <span className="text-[10px]" style={{color:C.tx}}>{ki.label}</span>
                  <button onClick={()=>setPinnedDocs(p=>p.filter(x=>x!==ki.id))} className="p-0.5 rounded hover:bg-white/5"><X size={8} style={{color:C.txM}}/></button>
                </div>
              )}<button className="px-2 py-1 rounded-lg text-[10px] border border-dashed" style={{borderColor:C.bd,color:C.txM}}>+ Pin</button></div>
            </div>
            <div>
              <Lbl>Excluded Projects</Lbl>
              <div className="flex gap-2 mt-1">{PROJECTS.map(p=>{const ex=excludedProjects.includes(p.id);return(
                <label key={p.id} className="flex items-center gap-1.5 px-2 py-1 rounded-lg cursor-pointer" style={{backgroundColor:ex?C.errM:C.bg}}>
                  <input type="checkbox" checked={ex} onChange={()=>setExcludedProjects(prev=>prev.includes(p.id)?prev.filter(x=>x!==p.id):[...prev,p.id])} className="accent-red-500"/>
                  <span className="text-[10px]" style={{color:ex?C.err:C.tx}}>{p.name}</span>
                </label>
              );})}</div>
            </div>
          </div>
        </div>}

        {/* Token Budget */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold mb-1" style={{color:C.tx}}>Token Budget</h3>
          <p className="text-[10px] mb-4" style={{color:C.txM}}>Maximum tokens allocated to historical knowledge in the orchestrator's context window.</p>
          <div className="p-4 rounded-xl border" style={{backgroundColor:C.glass,borderColor:C.glassBd}}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold" style={{color:C.tx}}>{totalIndexTokens.toLocaleString()}</span>
                <span className="text-xs" style={{color:C.txS}}>/ {tokenBudget.toLocaleString()} tokens</span>
              </div>
              <select value={tokenBudget} onChange={e=>setTokenBudget(Number(e.target.value))} className="px-2 py-1 rounded text-xs border outline-none" style={{backgroundColor:C.bg,borderColor:C.bd,color:C.tx}}>
                <option value={4000}>4K (minimal)</option>
                <option value={8000}>8K (default)</option>
                <option value={16000}>16K (expanded)</option>
                <option value={32000}>32K (maximum)</option>
              </select>
            </div>
            <div className="h-3 rounded-full overflow-hidden flex" style={{backgroundColor:C.bg}}>
              <div className="h-full" style={{width:`${Math.min((pinnedTokens/tokenBudget)*100,100)}%`,backgroundColor:C.ac}} title="Pinned Docs"/>
              <div className="h-full" style={{width:`${Math.min(((totalIndexTokens-pinnedTokens)/tokenBudget)*100,100)}%`,backgroundColor:C.acH}} title="Unpinned Index"/>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{backgroundColor:C.ac}}/><span className="text-[10px]" style={{color:C.txS}}>Pinned ({pinnedTokens})</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{backgroundColor:C.acH}}/><span className="text-[10px]" style={{color:C.txS}}>Index ({totalIndexTokens-pinnedTokens})</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{backgroundColor:C.bg,border:`1px solid ${C.bd}`}}/><span className="text-[10px]" style={{color:C.txS}}>Available ({(tokenBudget-totalIndexTokens).toLocaleString()})</span></div>
            </div>
          </div>
        </div>

        {/* Compaction Log */}
        <div>
          <h3 className="text-sm font-semibold mb-1" style={{color:C.tx}}>Compaction Log</h3>
          <p className="text-[10px] mb-3" style={{color:C.txM}}>After task completion, raw steps are compacted into memory facts. This keeps the database lean.</p>
          <div className="space-y-2">
            {COMPACTION_LOG.map(cl=>(
              <div key={cl.id} className="flex items-center gap-3 p-3 rounded-xl border" style={{backgroundColor:C.glass,borderColor:C.glassBd,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{backgroundColor:C.bgH}}>
                  {cl.status==="done"?<CheckCircle2 size={16} style={{color:C.ac}}/>:<Clock size={16} style={{color:C.ac}}/>}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs block truncate" style={{color:C.tx}}>{cl.task}</span>
                  <span className="text-[10px]" style={{color:C.txM}}>{cl.run} • {cl.date}</span>
                </div>
                {cl.status==="done"?<>
                  <div className="text-center"><span className="text-sm font-bold block" style={{color:C.ac}}>{cl.factsExtracted}</span><span className="text-[9px]" style={{color:C.txM}}>facts</span></div>
                  <div className="text-center"><span className="text-sm font-bold block" style={{color:C.err}}>{cl.stepsDeleted}</span><span className="text-[9px]" style={{color:C.txM}}>steps deleted</span></div>
                </>:<span className="text-[10px]" style={{color:C.ac}}>{cl.note}</span>}
              </div>
            ))}
          </div>
          <div className="mt-3 p-3 rounded-xl" style={{backgroundColor:`${C.ac}08`,border:`1px solid ${C.ac}30`}}>
            <div className="flex items-center gap-2"><Sparkles size={14} style={{color:C.ac}}/><span className="text-xs" style={{color:C.tx}}>How compaction works</span></div>
            <p className="text-[10px] mt-1 leading-relaxed" style={{color:C.txS}}>During execution, every agent step is logged for full transparency. After completion, key facts and decisions are extracted into Memory Facts with vector embeddings. Raw steps are then deleted. This preserves knowledge while keeping the database lean.</p>
          </div>
        </div>
      </div>}
    </div>
  );
};

// ============ SETTINGS (with Credentials Tiers + Custom Tabs) ============
const SettingsView = () => {
  const [tab,setTab]=useState("profile");
  const tabs=[{id:"profile",l:"Profile",i:User},{id:"api",l:"API Keys",i:Key},{id:"credentials",l:"Credentials",i:Shield},{id:"system",l:"System Files",i:FileText},{id:"notif",l:"Notifications",i:Bell},{id:"usage",l:"Usage & Billing",i:TrendingUp},{id:"defaults",l:"Agent Defaults",i:Bot},{id:"plugins",l:"Plugins",i:Puzzle}];
  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="w-52 border-r p-4 overflow-y-auto" style={{borderColor:C.bd,backgroundColor:C.bgS}}>
        {tabs.map(t=>{const I=t.i;return <button key={t.id} onClick={()=>setTab(t.id)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm mb-1" style={{color:tab===t.id?C.ac:C.txS,backgroundColor:tab===t.id?`${C.ac}15`:"transparent"}}><I size={16}/>{t.l}</button>;})}
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {tab==="profile"&&<div className="max-w-xl space-y-4"><h2 className="text-lg font-semibold" style={{color:C.tx}}>Profile</h2><div><Lbl>Name</Lbl><Inp defaultValue="Michael"/></div><div><Lbl>Email</Lbl><Inp defaultValue="michael@example.com"/></div><div><Lbl>Timezone</Lbl><Sel><option>Europe/Bratislava (UTC+1)</option></Sel></div><Btn primary>Save</Btn></div>}

        {tab==="api"&&<div className="max-w-xl space-y-4"><h2 className="text-lg font-semibold" style={{color:C.tx}}>API Keys & Providers</h2>
          {[{n:"Anthropic",k:"sk-ant-***",s:true},{n:"Google",k:"AIza***",s:true},{n:"OpenAI",k:"sk-proj-***",s:true},{n:"Moonshot",k:"",s:false}].map(p=><div key={p.n} className="p-4 rounded-xl border" style={{backgroundColor:C.glass,borderColor:C.glassBd,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}><div className="flex items-center justify-between mb-2"><span className="text-sm font-medium" style={{color:C.tx}}>{p.n}</span><Bd color={p.s?C.tx:C.txS} s>{p.s?"Active":"Not Set"}</Bd></div><div className="flex gap-2"><input type="password" value={p.k} readOnly className="flex-1 px-3 py-1.5 rounded-lg text-sm border outline-none" style={{backgroundColor:C.bg,borderColor:C.bd,color:C.txS}} placeholder="Enter API key..."/><Btn>{p.k?"Rotate":"Add"}</Btn></div></div>)}</div>}

        {tab==="credentials"&&<div className="max-w-xl space-y-4"><h2 className="text-lg font-semibold" style={{color:C.tx}}>Credentials Vault</h2>
          <p className="text-sm" style={{color:C.txS}}>Manage secrets agents may need. Three access tiers control how workers interact with each credential.</p>
          {/* Tier explanation */}
          <div className="grid grid-cols-3 gap-3">
            {[{t:"Open",c:C.tx,d:"Worker reads directly. For non-sensitive config.",i:"🟢"},{t:"Gated",c:C.ac,d:"Requires your approval per use. Default.",i:"🟡"},{t:"Ephemeral",c:C.err,d:"Subagent uses it and discards. Never enters context.",i:"🔴"}].map(tier=>
              <div key={tier.t} className="p-3 rounded-xl border" style={{backgroundColor:C.glass,borderColor:C.glassBd,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}>
                <div className="flex items-center gap-2 mb-1"><span>{tier.i}</span><span className="text-sm font-semibold" style={{color:tier.c}}>{tier.t}</span></div>
                <p className="text-[10px]" style={{color:C.txM}}>{tier.d}</p>
              </div>
            )}
          </div>
          {/* Credentials list */}
          {[{n:"Stripe API Key",tier:"Gated",scope:"AI SaaS Platform"},{n:"AWS Access Key",tier:"Ephemeral",scope:"Global"},{n:"Test DB Password",tier:"Open",scope:"Data Pipeline v2"},{n:"GitHub Token",tier:"Gated",scope:"Global"}].map(cr=>(
            <div key={cr.n} className="p-4 rounded-xl border" style={{backgroundColor:C.glass,borderColor:C.glassBd,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{color:C.tx}}>{cr.n}</span>
                <div className="flex items-center gap-2">
                  <Bd color={cr.tier==="Open"?C.tx:cr.tier==="Gated"?C.ac:C.err} s>{cr.tier}</Bd>
                  <Bd color="#71717a" bg={C.bgH} s>{cr.scope}</Bd>
                </div>
              </div>
              <div className="flex gap-2">
                <input type="password" value="••••••••••" readOnly className="flex-1 px-3 py-1.5 rounded-lg text-sm border outline-none" style={{backgroundColor:C.bg,borderColor:C.bd,color:C.txS}}/>
                <Btn>Edit</Btn>
              </div>
            </div>
          ))}
          <button className="w-full p-3 rounded-xl border border-dashed flex items-center justify-center gap-2" style={{borderColor:C.bd,color:C.txM,transitionProperty:"border-color"}} onMouseOver={e=>e.currentTarget.style.borderColor=C.ac} onMouseOut={e=>e.currentTarget.style.borderColor=C.bd}><Plus size={14}/> Add Credential</button>
        </div>}

        {tab==="system"&&<div className="max-w-2xl space-y-4"><h2 className="text-lg font-semibold" style={{color:C.tx}}>System Files</h2>
          <p className="text-sm" style={{color:C.txS}}>Global config. Per-worker overrides are in each worker's settings.</p>
          {["memory.md","global-prompt.md"].map(f=><div key={f} className="rounded-xl border overflow-hidden" style={{borderColor:C.bd}}>
            <div className="flex items-center justify-between p-3 border-b" style={{borderColor:C.bd,backgroundColor:C.bgC}}><div className="flex items-center gap-2"><FileText size={14} style={{color:C.ac}}/><span className="text-sm font-medium" style={{color:C.tx}}>{f}</span></div><button className="px-3 py-1 rounded text-xs" style={{backgroundColor:C.ac,color:C.acFg}}>Save</button></div>
            <textarea className="w-full p-4 font-mono text-xs bg-transparent outline-none resize-none" rows={4} style={{color:C.tx,backgroundColor:C.bg}} defaultValue={f==="memory.md"?"# Project Context\n\n## AI SaaS Platform\n- Stack: Next.js, Supabase, Tailwind":"You are an AI orchestrator managing tasks across workers..."}/>
          </div>)}</div>}

        {tab==="notif"&&<div className="max-w-xl space-y-3"><h2 className="text-lg font-semibold mb-2" style={{color:C.tx}}>Notifications</h2>
          {[{l:"Task completed",on:true},{l:"Agent blocked",on:true},{l:"Review ready",on:true},{l:"Daily briefing",on:false},{l:"Rate limit hit",on:true},{l:"Master plan stage done",on:true}].map(n=><div key={n.l} className="flex items-center justify-between p-3 rounded-xl border" style={{backgroundColor:C.glass,borderColor:C.glassBd,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}><span className="text-sm" style={{color:C.tx}}>{n.l}</span><div className="w-10 h-5 rounded-full cursor-pointer flex items-center px-0.5" style={{backgroundColor:n.on?C.ac:C.bd}}><div className="w-4 h-4 rounded-full" style={{backgroundColor:C.tx,transform:n.on?"translateX(20px)":"translateX(0)",transition:"transform 0.2s"}}/></div></div>)}</div>}

        {tab==="usage"&&<div className="max-w-xl space-y-4"><h2 className="text-lg font-semibold" style={{color:C.tx}}>Usage & Billing</h2>
          <div className="p-4 rounded-xl border" style={{backgroundColor:C.glass,borderColor:C.glassBd,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}><div className="flex justify-between mb-2"><span className="text-sm" style={{color:C.tx}}>Current Plan</span><Bd color={C.tx} bg={C.bgH}>Free</Bd></div><Btn primary>Upgrade to Pro</Btn></div>
          <div className="p-4 rounded-xl border" style={{backgroundColor:C.glass,borderColor:C.glassBd,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}><h3 className="text-sm font-semibold mb-3" style={{color:C.tx}}>This Month</h3>
            {[{n:"Claude",v:"1.2M",c:"$18"},{n:"Gemini",v:"800K",c:"$4"},{n:"GPT-4o",v:"200K",c:"$2"}].map(u=><div key={u.n} className="flex justify-between p-2"><span className="text-xs" style={{color:C.txS}}>{u.n}</span><span className="text-xs" style={{color:C.tx}}>{u.v}</span><span className="text-xs font-bold" style={{color:C.tx}}>{u.c}</span></div>)}
            <div className="border-t mt-2 pt-2 flex justify-between" style={{borderColor:C.bd}}><span className="text-sm" style={{color:C.tx}}>Total</span><span className="text-sm font-bold" style={{color:C.tx}}>$24.00</span></div>
          </div></div>}

        {tab==="defaults"&&<div className="max-w-xl space-y-4"><h2 className="text-lg font-semibold" style={{color:C.tx}}>Agent Defaults</h2>
          <p className="text-sm mb-2" style={{color:C.txS}}>Platform-controlled settings that apply to all workers.</p>
          <div><Lbl>Default System Prompt</Lbl><textarea className="w-full px-3 py-2 rounded-lg text-sm border outline-none resize-none font-mono" rows={3} style={{backgroundColor:C.glass,borderColor:C.glassBd,color:C.tx,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}} defaultValue="Follow instructions precisely. Report progress clearly."/></div>
          <div><Lbl>Task Routing</Lbl><Sel><option>Orchestrator decides</option><option>Round-robin</option><option>Skill-based</option></Sel></div>
          <div><Lbl>Default Review Mode</Lbl><Sel><option>Human Review</option><option>AI Review</option><option>Hybrid</option></Sel></div>
          <Btn primary>Save</Btn>
          <div className="border-t pt-4 mt-4" style={{borderColor:C.bd}}><h3 className="text-sm font-semibold mb-2" style={{color:C.tx}}>Worker Setup Guides</h3><p className="text-xs mb-3" style={{color:C.txM}}>Step-by-step setup for each worker type. Settings the user configures locally.</p>
            {["Claude CLI","Gemini CLI","ChatGPT CLI","Kimi CLI"].map(t=><div key={t} className="flex items-center justify-between p-3 rounded-lg mb-1" style={{backgroundColor:C.glass}}><span className="text-sm" style={{color:C.tx}}>{t}</span><button className="px-3 py-1 rounded text-xs border" style={{borderColor:C.bd,color:C.acH}}>View Guide</button></div>)}
          </div></div>}

        {tab==="plugins"&&<div className="max-w-2xl space-y-5">
          <div className="flex items-center justify-between">
            <div><h2 className="text-lg font-semibold" style={{color:C.tx}}>Plugins</h2><p className="text-sm mt-0.5" style={{color:C.txS}}>Connect external services so your orchestrator can pull live data.</p></div>
          </div>

          {/* Installed plugins */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{color:C.txM}}>Installed ({INSTALLED_PLUGINS.length})</h3>
            {INSTALLED_PLUGINS.map(plg => (
              <div key={plg.id} className="p-4 rounded-xl border mb-3" style={{backgroundColor:C.glass,borderColor:C.glassBd,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">{plg.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2"><span className="text-sm font-semibold" style={{color:C.tx}}>{plg.name}</span><Bd color={C.tx} bg={C.bgH} s>Connected</Bd></div>
                    <span className="text-[10px]" style={{color:C.txM}}>{plg.desc}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] block" style={{color:C.txM}}>Last sync: {plg.lastSync}</span>
                    <span className="text-[10px]" style={{color:C.txM}}>{plg.items} items pulled</span>
                  </div>
                </div>
                {/* Data access toggles */}
                <div className="flex items-center gap-2 mt-2 pt-2 border-t" style={{borderColor:C.bd}}>
                  <span className="text-[10px]" style={{color:C.txM}}>Orchestrator access:</span>
                  <Bd color={C.tx} s>Read</Bd>
                  <span className="text-[10px]" style={{color:C.txM}}>•</span>
                  <span className="text-[10px]" style={{color:C.txM}}>Auth: {plg.auth === "oauth" ? "OAuth 2.0" : "API Key"}</span>
                  <div className="ml-auto flex gap-1.5">
                    <button className="px-2 py-1 rounded text-[10px] border" style={{borderColor:C.bd,color:C.txS}}>Sync Now</button>
                    <button className="px-2 py-1 rounded text-[10px] border" style={{borderColor:C.bd,color:C.txS}}>Configure</button>
                    <button className="px-2 py-1 rounded text-[10px] border" style={{borderColor:C.bd,color:C.err,transitionProperty:"background-color"}} onMouseOver={e=>e.currentTarget.style.backgroundColor=`${C.err}10`} onMouseOut={e=>e.currentTarget.style.backgroundColor="transparent"}>Disconnect</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Marketplace */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{color:C.txM}}>Marketplace</h3>
              <div className="flex gap-1">
                {["All","Dev Tools","Analytics","CRM","Marketing","Docs","Communication"].map(c => <button key={c} className="px-2 py-1 rounded-full text-[10px]" style={{backgroundColor:c==="All"?`${C.ac}20`:C.bg,color:c==="All"?C.acH:C.txM,border:`1px solid ${c==="All"?C.ac:C.bd}`}}>{c}</button>)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {PLUGIN_MARKETPLACE.map(mk => (
                <div key={mk.id} className="p-4 rounded-xl border cursor-pointer" style={{backgroundColor:C.glass,borderColor:C.glassBd,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)",transitionProperty:"border-color"}} onMouseOver={e=>e.currentTarget.style.borderColor=C.ac} onMouseOut={e=>e.currentTarget.style.borderColor=C.bd}>
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-lg">{mk.icon}</span>
                    <div className="flex-1"><span className="text-sm font-semibold block" style={{color:C.tx}}>{mk.name}</span><span className="text-[10px]" style={{color:C.txM}}>{mk.cat}</span></div>
                  </div>
                  <p className="text-xs mb-3" style={{color:C.txS}}>{mk.desc}</p>
                  <button className="w-full px-3 py-1.5 rounded-lg text-xs border flex items-center justify-center gap-1.5 transition-colors" style={{borderColor:C.bd,color:C.acH}} onMouseOver={e=>{e.currentTarget.style.backgroundColor=C.ac;e.currentTarget.style.color=C.acFg;e.currentTarget.style.borderColor=C.ac;}} onMouseOut={e=>{e.currentTarget.style.backgroundColor="transparent";e.currentTarget.style.color=C.acH;e.currentTarget.style.borderColor=C.bd;}}><Plus size={12}/> Install</button>
                </div>
              ))}
            </div>
          </div>

          {/* What orchestrator can do */}
          <div className="p-4 rounded-xl border" style={{backgroundColor:`${C.ac}08`,borderColor:`${C.ac}30`}}>
            <h3 className="text-sm font-semibold mb-2" style={{color:C.ac}}>What can the orchestrator do with plugins?</h3>
            <div className="space-y-1.5 text-xs" style={{color:C.txS}}>
              <p>• <strong style={{color:C.tx}}>Pull data</strong> — ask "what are our open GitHub issues?" and get live results</p>
              <p>• <strong style={{color:C.tx}}>Create tasks from data</strong> — "create tasks for each critical Sentry error"</p>
              <p>• <strong style={{color:C.tx}}>Reference in briefings</strong> — daily briefings can include Stripe MRR, deploy status, etc.</p>
              <p>• <strong style={{color:C.tx}}>Alert on changes</strong> — get notified when a metric crosses a threshold</p>
            </div>
          </div>
        </div>}
      </div>
    </div>
  );
};

// ============ COMMAND PALETTE (⌘K) ============
const CommandPalette = ({onClose,onNavigate}) => {
  const [query,setQuery]=useState("");
  const [cat,setCat]=useState("all");
  const items = [
    {id:"nav-dash",cat:"nav",label:"Go to Dashboard",icon:LayoutDashboard,desc:"Overview & widgets",action:()=>onNavigate("dashboard")},
    {id:"nav-tasks",cat:"nav",label:"Go to My Tasks",icon:ListTodo,desc:"Kanban board",action:()=>onNavigate("tasks")},
    {id:"nav-workers",cat:"nav",label:"Go to Workers",icon:Bot,desc:"AI agents & humans",action:()=>onNavigate("workers")},
    {id:"nav-chat",cat:"nav",label:"Go to Chat",icon:MessageSquare,desc:"Orchestrator chat",action:()=>onNavigate("chat")},
    {id:"nav-planner",cat:"nav",label:"Go to Master Planner",icon:Workflow,desc:"Pyramid DAG",action:()=>onNavigate("planner")},
    {id:"nav-notes",cat:"nav",label:"Go to Notes",icon:FileText,desc:"Notes & ideas",action:()=>onNavigate("notes")},
    {id:"nav-brief",cat:"nav",label:"Go to Briefings",icon:BarChart3,desc:"Reports",action:()=>onNavigate("briefings")},
    {id:"nav-storage",cat:"nav",label:"Go to Storage",icon:HardDrive,desc:"Files & artifacts",action:()=>onNavigate("storage")},
    {id:"nav-settings",cat:"nav",label:"Go to Settings",icon:Settings,desc:"Profile, API keys, plugins",action:()=>onNavigate("settings")},
    ...TASKS.map(t=>({id:`task-${t.id}`,cat:"task",label:t.title,icon:ListTodo,desc:`${ST[t.s].l} • ${PRI[t.p].l} • ${t.tags.join(", ")}`,action:()=>onNavigate("tasks")})),
    ...WORKERS.map(w=>({id:`worker-${w.id}`,cat:"worker",label:w.name,icon:Bot,desc:`${w.isHuman?"Human":w.model} • ${w.active} active`,action:()=>onNavigate("workers")})),
    {id:"act-newtask",cat:"action",label:"Create New Task",icon:Plus,desc:"Open new task form",action:()=>onNavigate("tasks")},
    {id:"act-newnote",cat:"action",label:"Create New Note",icon:Edit3,desc:"Start a new note",action:()=>onNavigate("notes")},
    {id:"act-newplan",cat:"action",label:"Create New Plan",icon:Workflow,desc:"Start a master plan",action:()=>onNavigate("planner")},
    {id:"act-brief",cat:"action",label:"Generate Briefing",icon:Sparkles,desc:"Generate a new report",action:()=>onNavigate("briefings")},
    ...PROJECTS.map(p=>({id:`proj-${p.id}`,cat:"project",label:p.name,icon:FolderOpen,desc:`${p.done}/${p.total} tasks done`,action:()=>onNavigate("dashboard")})),
  ];
  const catLabels = {all:"All",nav:"Navigate",task:"Tasks",worker:"Workers",action:"Actions",project:"Projects"};
  const filtered = items.filter(i=>{
    if(cat!=="all"&&i.cat!==cat) return false;
    if(!query) return true;
    const q=query.toLowerCase();
    return i.label.toLowerCase().includes(q)||i.desc.toLowerCase().includes(q);
  });
  const [sel,setSel]=useState(0);
  const runItem=(item)=>{item.action();onClose();};
  return (
    <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 pt-[15vh]" onClick={onClose}>
      <div className="w-full max-w-xl rounded-xl border overflow-hidden" style={{backgroundColor:C.bg,borderColor:C.bd,boxShadow:"0 20px 60px rgba(0,0,0,0.6)"}} onClick={e=>e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b" style={{borderColor:C.bd}}>
          <Search size={18} style={{color:C.txM}}/>
          <input value={query} onChange={e=>{setQuery(e.target.value);setSel(0);}} placeholder="Search tasks, navigate, run actions..." className="flex-1 bg-transparent text-sm outline-none" style={{color:C.tx}} autoFocus onKeyDown={e=>{
            if(e.key==="ArrowDown"){e.preventDefault();setSel(s=>Math.min(s+1,Math.min(filtered.length,15)-1));}
            if(e.key==="ArrowUp"){e.preventDefault();setSel(s=>Math.max(s-1,0));}
            if(e.key==="Enter"&&filtered[sel]){e.preventDefault();runItem(filtered[sel]);}
            if(e.key==="Escape") onClose();
          }}/>
          <span className="text-[10px] px-1.5 py-0.5 rounded border" style={{borderColor:C.bd,color:C.txM}}>ESC</span>
        </div>
        <div className="flex gap-1 px-4 py-2 border-b overflow-x-auto" style={{borderColor:C.bd}}>
          {Object.entries(catLabels).map(([k,v])=><button key={k} onClick={()=>{setCat(k);setSel(0);}} className="px-2.5 py-1 rounded-full text-[10px] whitespace-nowrap" style={{backgroundColor:cat===k?`${C.ac}20`:"transparent",color:cat===k?C.acH:C.txM,border:`1px solid ${cat===k?C.ac:C.bd}`}}>{v}</button>)}
        </div>
        <div className="max-h-72 overflow-y-auto">
          {filtered.length===0?(
            <div className="py-8 text-center"><Search size={24} className="mx-auto mb-2" style={{color:C.txM}}/><p className="text-xs" style={{color:C.txM}}>No results for "{query}"</p></div>
          ):filtered.slice(0,15).map((item,i)=>{const Ic=item.icon;return(
            <div key={item.id} onClick={()=>runItem(item)} onMouseEnter={()=>setSel(i)} className="flex items-center gap-3 px-4 py-2.5 cursor-pointer" style={{backgroundColor:sel===i?`${C.ac}10`:"transparent"}}>
              <Ic size={16} style={{color:sel===i?C.ac:C.txM}}/>
              <div className="flex-1 min-w-0"><span className="text-sm block truncate" style={{color:C.tx}}>{item.label}</span><span className="text-[10px] block truncate" style={{color:C.txM}}>{item.desc}</span></div>
              <span className="text-[9px] px-1.5 py-0.5 rounded" style={{backgroundColor:C.bgC,color:C.txM}}>{catLabels[item.cat]}</span>
              {sel===i&&<span className="text-[10px]" style={{color:C.txM}}>↵</span>}
            </div>
          );})}
        </div>
        <div className="px-4 py-2 border-t flex items-center justify-between" style={{borderColor:C.bd}}>
          <span className="text-[10px]" style={{color:C.txM}}>{filtered.length} result{filtered.length!==1?"s":""}</span>
          <div className="flex items-center gap-3"><span className="text-[10px]" style={{color:C.txM}}>↑↓ navigate</span><span className="text-[10px]" style={{color:C.txM}}>↵ select</span><span className="text-[10px]" style={{color:C.txM}}>esc close</span></div>
        </div>
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
  const [cmdPalette,setCmdPalette]=useState(false);
  useEffect(()=>{
    const handler=(e)=>{if((e.metaKey||e.ctrlKey)&&e.key==="k"){e.preventDefault();setCmdPalette(p=>!p);}};
    window.addEventListener("keydown",handler);
    return ()=>window.removeEventListener("keydown",handler);
  },[]);
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
      default: {
        const plg = INSTALLED_PLUGINS.find(p => p.id === view);
        if (plg) return (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Plugin header */}
            <div className="px-6 py-3 border-b flex items-center gap-3 flex-shrink-0" style={{borderColor:C.bd}}>
              <span className="text-lg">{plg.icon}</span>
              <span className="text-sm font-semibold" style={{color:C.tx}}>{plg.name}</span>
              <Bd color={C.tx} bg={C.bgH} s>Connected</Bd>
              <span className="text-[10px]" style={{color:C.txM}}>Synced {plg.lastSync}</span>
              <div className="ml-auto flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-lg text-xs border flex items-center gap-1.5" style={{borderColor:C.bd,color:C.txS}}><RefreshCw size={12}/> Sync</button>
                <button className="px-3 py-1.5 rounded-lg text-xs border flex items-center gap-1.5" style={{borderColor:C.bd,color:C.txS}}><Settings size={12}/> Configure</button>
              </div>
            </div>
            {/* Plugin data view */}
            <div className="flex-1 overflow-y-auto p-6" style={{backgroundColor:C.bgS}}>
              {/* Metric cards */}
              {plg.data.filter(d => d.type === "metric").length > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {plg.data.filter(d => d.type === "metric").map(m => (
                    <div key={m.id} className="p-4 rounded-xl border" style={{backgroundColor:C.glassCard,backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderColor:C.bd,borderTop:`1px solid rgba(201,169,110,0.12)`}}>
                      <span className="text-[10px] uppercase tracking-wider" style={{color:C.txM}}>{m.label}</span>
                      <div className="flex items-end gap-2 mt-1">
                        <span className="text-2xl font-bold" style={{color:C.tx}}>{m.value}</span>
                        {m.change && <span className="text-xs mb-1" style={{color:m.changeUp?C.ac:C.err}}>{m.change}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* Data tables */}
              {plg.data.filter(d => d.type === "row").map(table => (
                <div key={table.id} className="rounded-xl border overflow-hidden mb-5" style={{borderColor:C.bd,backgroundColor:C.glassCard,backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)"}}>
                  <div className="px-4 py-3 border-b flex items-center justify-between" style={{borderColor:C.bd,backgroundColor:"transparent"}}>
                    <span className="text-sm font-semibold" style={{color:C.tx}}>{table.label}</span>
                    <span className="text-[10px]" style={{color:C.txM}}>{table.rows.length} items</span>
                  </div>
                  {table.rows.map((row, ri) => (
                    <div key={ri} className="flex items-center gap-3 px-4 py-2.5 border-b" style={{borderColor:C.bd}}>
                      <span className="text-xs flex-1" style={{color:C.tx}}>{row.name}</span>
                      <Bd color={row.status==="succeeded"||row.status==="closed"||row.status==="read"?C.tx:row.status==="refunded"||row.status==="open"||row.status==="unread"?C.ac:C.txS} s>{row.status}</Bd>
                      <span className="text-xs w-16 text-right" style={{color:row.amount.startsWith("$")?C.tx:C.txS}}>{row.amount}</span>
                      <span className="text-[10px] w-20 text-right" style={{color:C.txM}}>{row.date}</span>
                    </div>
                  ))}
                </div>
              ))}
              {/* Ask orchestrator prompt */}
              <div className="p-4 rounded-xl border flex items-center gap-3" style={{backgroundColor:`${C.ac}08`,borderColor:`${C.ac}30`}}>
                <Brain size={18} style={{color:C.ac}} />
                <div className="flex-1">
                  <p className="text-xs" style={{color:C.tx}}>Ask the orchestrator about this data</p>
                  <p className="text-[10px]" style={{color:C.txM}}>e.g. "Create tasks for each open issue" or "Summarize revenue this week"</p>
                </div>
                <button className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5" style={{backgroundColor:C.ac,color:C.acFg}}><MessageSquare size={12}/> Ask</button>
              </div>
            </div>
          </div>
        );
        return <DashboardView />;
      }
    }
  };
  return (
    <div className="h-screen flex overflow-hidden" style={{backgroundColor:C.bg,color:C.tx,fontFamily:"'Inter',system-ui,sans-serif",position:"relative"}}>
      <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"radial-gradient(ellipse 600px 400px at 20% 30%, rgba(201,169,110,0.04) 0%, transparent 70%), radial-gradient(ellipse 500px 500px at 80% 70%, rgba(201,169,110,0.03) 0%, transparent 70%), radial-gradient(ellipse 300px 300px at 50% 50%, rgba(201,169,110,0.02) 0%, transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"relative",zIndex:1,display:"flex",flex:1,overflow:"hidden"}}>
        <Sidebar view={view} setView={setView} proj={proj} setProj={setProj} col={col} setCol={setCol}/>
        <div className="flex-1 flex flex-col overflow-hidden"><TopBar proj={proj} view={view} onOpenCmd={()=>setCmdPalette(true)}/>{renderView()}</div>
      </div>
      {task&&<TaskModal task={task} onClose={()=>setTask(null)}/>}
      {cmdPalette&&<CommandPalette onClose={()=>setCmdPalette(false)} onNavigate={(v)=>{setView(v);setCmdPalette(false);}}/>}
    </div>
  );
}
