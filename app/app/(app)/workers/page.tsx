"use client";

import { useState } from "react";
import { Plus, Bot } from "lucide-react";
import type { Worker } from "@/lib/types";
import { useWorkers } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { WorkerCard } from "@/components/workers/worker-card";
import { AddWorkerModal } from "@/components/workers/add-worker-modal";
import { WorkerDetailModal } from "@/components/workers/worker-detail-modal";

export default function WorkersPage() {
  const { workers } = useWorkers();
  const [showModal, setShowModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Workers &amp; Orchestrators</h2>
          <p className="text-sm mt-1 text-text-secondary">AI agents and human team members</p>
        </div>
        <Button primary onClick={() => setShowModal(true)}>
          <Plus size={16} /> Add Worker
        </Button>
      </div>

      {workers.length === 0 ? (
        <EmptyState
          icon={Bot}
          title="No workers configured"
          desc="Add AI agents or human team members to start processing tasks. The orchestrator will route work to the best available worker."
          action="Add First Worker"
          onAction={() => setShowModal(true)}
        />
      ) : (
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}
        >
          {workers.map((w) => (
            <WorkerCard key={w.id} worker={w} onClick={() => setSelectedWorker(w)} />
          ))}
        </div>
      )}

      <AddWorkerModal open={showModal} onClose={() => setShowModal(false)} />
      <WorkerDetailModal worker={selectedWorker} onClose={() => setSelectedWorker(null)} />
    </div>
  );
}
