import { Puzzle } from "lucide-react";

export default function PluginPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-accent-dim">
          <Puzzle size={28} className="text-accent" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary mb-2">Plugin</h2>
        <p className="text-sm text-text-secondary">Plugin views coming in Phase 8</p>
      </div>
    </div>
  );
}
