export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center relative overflow-hidden">
      {/* Ambient gold gradients */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 600px 400px at 30% 30%, rgba(201,169,110,0.06) 0%, transparent 70%), radial-gradient(ellipse 500px 500px at 70% 70%, rgba(201,169,110,0.04) 0%, transparent 70%)",
        }}
      />

      <main className="relative z-10 text-center max-w-xl px-6">
        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-accent">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-fg">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-text-primary mb-3">
          Orchestria
        </h1>
        <p className="text-lg text-text-secondary mb-8 leading-relaxed">
          AI-first project management. You conduct, AI agents play.
        </p>

        {/* CTA */}
        <button
          className="px-6 py-3 rounded-xl text-sm font-semibold text-accent-fg"
          style={{
            background: "linear-gradient(135deg, #c9a96e, #b89555)",
            boxShadow: "0 0 30px rgba(201,169,110,0.2), inset 0 1px 0 rgba(255,255,255,0.15)",
          }}
        >
          Coming Soon
        </button>

        {/* Feature hints */}
        <div className="grid grid-cols-3 gap-4 mt-16">
          {[
            { label: "AI Workers", desc: "Claude, Gemini, ChatGPT, Kimi" },
            { label: "Master Planner", desc: "Pyramid DAG task decomposition" },
            { label: "Live Plugins", desc: "Stripe, GitHub, Slack data" },
          ].map((f) => (
            <div
              key={f.label}
              className="p-4 rounded-xl border backdrop-blur-xl"
              style={{
                backgroundColor: "rgba(12,12,18,0.6)",
                borderColor: "rgba(200,169,110,0.08)",
                borderTop: "1px solid rgba(201,169,110,0.12)",
              }}
            >
              <span className="text-xs font-semibold text-accent block mb-1">{f.label}</span>
              <span className="text-[11px] text-text-muted">{f.desc}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
