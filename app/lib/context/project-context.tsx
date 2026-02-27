"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface ProjectContextValue {
  activeProjectId: string;
  setActiveProjectId: (id: string) => void;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [activeProjectId, setActiveProjectId] = useState("p1");

  return (
    <ProjectContext.Provider value={{ activeProjectId, setActiveProjectId }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectContext() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProjectContext must be used within ProjectProvider");
  return ctx;
}
