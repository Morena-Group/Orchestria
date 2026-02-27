"use client";

import { AmbientBackground } from "@/components/layout/ambient-background";
import { AppShell } from "@/components/layout/app-shell";
import { ProjectProvider } from "@/lib/context/project-context";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProjectProvider>
      <div className="h-screen flex overflow-hidden relative">
        <AmbientBackground />
        <div className="relative z-[1] flex flex-1 overflow-hidden">
          <AppShell>{children}</AppShell>
        </div>
      </div>
    </ProjectProvider>
  );
}
