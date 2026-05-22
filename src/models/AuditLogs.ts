export interface AuditLog {
  id: number;
  timestamp: string;
  user: number | null;
  user_email: string | null;
  action: "create" | "update" | "delete" | "custom";
  model_name: string;
  object_id: string;
  event: string;
  data: Record<string, unknown>;
}

export interface AuditLogsResponse {
  results: AuditLog[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface Filters {
  action: string;
  model_name: string;
  search: string;
}
