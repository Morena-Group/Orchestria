import { useState } from "react";
import { Star, Heart, Zap } from "lucide-react";

// Test 1: Dynamic component from variable
const icons = { star: Star, heart: Heart, zap: Zap };

// Test 2: Dynamic component from array
const items = [
  { id: "a", name: "Star", icon: Star },
  { id: "b", name: "Heart", icon: Heart },
  { id: "c", name: "Zap", icon: Zap },
];

export default function App() {
  const [view, setView] = useState("main");

  // Test 3: renderView as function call (not component)
  const renderView = () => {
    if (view === "main") return <MainView />;
    if (view === "second") return <SecondView />;
    return <MainView />;
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif", color: "white", backgroundColor: "#111" }}>
      <h1>React Pattern Tests</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button onClick={() => setView("main")} style={{ padding: "8px 16px", backgroundColor: view === "main" ? "#6366f1" : "#333", color: "white", border: "none", borderRadius: 8 }}>Main</button>
        <button onClick={() => setView("second")} style={{ padding: "8px 16px", backgroundColor: view === "second" ? "#6366f1" : "#333", color: "white", border: "none", borderRadius: 8 }}>Second</button>
      </div>
      {renderView()}
    </div>
  );
}

function MainView() {
  return (
    <div>
      <h2>Test A: Static icons</h2>
      <div style={{ display: "flex", gap: 8 }}>
        <Star size={24} color="gold" />
        <Heart size={24} color="red" />
        <Zap size={24} color="yellow" />
      </div>

      <h2 style={{ marginTop: 20 }}>Test B: Dynamic icon from variable</h2>
      <DynIcon />

      <h2 style={{ marginTop: 20 }}>Test C: Icons from array map</h2>
      <IconList />
    </div>
  );
}

function DynIcon() {
  const I = icons.star;
  return <I size={24} color="cyan" />;
}

function IconList() {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {items.map(item => {
        const I = item.icon;
        return <I key={item.id} size={24} color="lime" />;
      })}
    </div>
  );
}

function SecondView() {
  return (
    <div>
      <h2>Second View Works!</h2>
      <p>If you see this, view switching is fine.</p>
      {items.map(item => {
        const Icon = item.icon;
        return (
          <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: 8 }}>
            <Icon size={20} color="orange" />
            <span>{item.name}</span>
          </div>
        );
      })}
    </div>
  );
}
