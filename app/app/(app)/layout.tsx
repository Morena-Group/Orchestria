import { AmbientBackground } from "@/components/layout/ambient-background";
import { AppShell } from "@/components/layout/app-shell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex overflow-hidden relative">
      <AmbientBackground />
      <div className="relative z-[1] flex flex-1 overflow-hidden">
        <AppShell>{children}</AppShell>
      </div>
    </div>
  );
}
