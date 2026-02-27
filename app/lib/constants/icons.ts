import {
  Edit3, Clock, Check, Play, AlertTriangle, Eye, CheckCircle2,
  XCircle, Pause, Search, Zap, Layers, RefreshCw,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Edit3,
  Clock,
  Check,
  Play,
  AlertTriangle,
  Eye,
  CheckCircle2,
  XCircle,
  Pause,
  Search,
  Zap,
  Layers,
  RefreshCw,
};

export function getStatusIcon(name: string): LucideIcon {
  return ICON_MAP[name] || Clock;
}
