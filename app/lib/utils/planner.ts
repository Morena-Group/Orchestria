import type { PlanNode, ActivityType, TaskStatus } from "@/lib/types";

/** Recursive progress calculation for a plan node.
 *  Leaf: completed=100, running=50, else 0.
 *  Parent: average of children's progress, rounded. */
export function getProgress(node: PlanNode, allNodes: PlanNode[]): number {
  if (node.children.length === 0) {
    return node.status === "completed" ? 100 : node.status === "running" ? 50 : 0;
  }
  const kids = allNodes.filter((n) => node.children.includes(n.id));
  const total = kids.reduce((s, k) => s + getProgress(k, allNodes), 0);
  return Math.round(total / kids.length);
}

/** Creates a filter predicate for plan nodes, or null if no filters are active. */
export function createFilterFn(
  filterWorker: string,
  filterStatus: string,
  filterAct: string
): ((node: PlanNode) => boolean) | null {
  if (filterWorker === "all" && filterStatus === "all" && filterAct === "all") {
    return null;
  }
  return (node: PlanNode) => {
    if (filterWorker !== "all" && node.worker !== filterWorker) return false;
    if (filterStatus !== "all" && node.status !== (filterStatus as TaskStatus)) return false;
    if (filterAct !== "all" && node.act !== (filterAct as ActivityType)) return false;
    return true;
  };
}
