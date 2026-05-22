import type { AuditLog, Filters } from "@/models/AuditLogs";
import { useState, useEffect, useCallback } from "react";
import { localCache } from "@saintrelion/cache";
import type { AuthProof } from "@saintrelion/auth-lib/dist/models/types";

const BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";

const AUTH_PROOF_KEY = "auth_proof";

async function authHeaders(): Promise<Record<string, string>> {
  const proof = (await localCache.get(AUTH_PROOF_KEY, "indexed")) as AuthProof;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (proof?.type === "jwt" && proof.access)
    headers["Authorization"] = `Bearer ${proof.access}`;

  return headers;
}

function useAuditLogs(filters: Filters, page: number) {
  const [data, setData] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.action) params.set("action", filters.action);
      if (filters.model_name) params.set("model_name", filters.model_name);
      if (filters.search) params.set("search", filters.search);
      params.set("page", String(page));

      const res = await fetch(`${BASE}/api/audit/logs/?${params}`, {
        headers: await authHeaders(),
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      setData(await res.json());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetch_();
  }, [fetch_]);

  return { data, loading, error, refetch: fetch_ };
}

const ACTION_COLORS: Record<string, string> = {
  create: "bg-emerald-100 text-emerald-700 border-emerald-200",
  update: "bg-amber-100 text-amber-700 border-amber-200",
  delete: "bg-red-100 text-red-700 border-red-200",
  custom: "bg-sky-100 text-sky-700 border-sky-200",
};

const ACTION_ICONS: Record<string, string> = {
  create: "＋",
  update: "✎",
  delete: "✕",
  custom: "◎",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  };
}

function DataDiff({ data }: { data: Record<string, unknown> }) {
  if (!data || typeof data !== "object")
    return <span className="text-xs text-slate-400">—</span>;
  const entries = Object.entries(data);

  if (!entries.length) return <span className="text-xs text-slate-400">—</span>;

  // UPDATE diff: { field: { old, new } }
  const isUpdate = entries.every(
    ([, v]) => v && typeof v === "object" && "old" in (v as object),
  );

  if (isUpdate) {
    return (
      <div className="space-y-1">
        {entries.map(([key, val]) => {
          const { old: o, new: n } = val as { old: unknown; new: unknown };
          return (
            <div key={key} className="flex items-start gap-2 text-xs">
              <span className="min-w-[80px] font-mono text-slate-500">
                {key}
              </span>
              <span className="text-red-400 line-through">
                {String(o ?? "—")}
              </span>
              <span className="text-slate-400">→</span>
              <span className="text-emerald-600">{String(n ?? "—")}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1">
      {entries.slice(0, 4).map(([k, v]) => (
        <span
          key={k}
          className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-600"
        >
          {k}: {String(v ?? "—").slice(0, 24)}
        </span>
      ))}
      {entries.length > 4 && (
        <span className="text-xs text-slate-400">
          +{entries.length - 4} more
        </span>
      )}
    </div>
  );
}

const ACTIONS = ["", "create", "update", "delete", "custom"];
const PAGE_SIZE = 20;

export default function AuditLogsPage() {
  const [filters, setFilters] = useState<Filters>({
    action: "",
    model_name: "",
    search: "",
  });
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<number | null>(null);

  const { data, loading, error } = useAuditLogs(filters, page);

  const logs = data;
  const totalPages = Math.ceil(logs.length / PAGE_SIZE);

  const models = [...new Set(data.map((log) => log.model_name))].filter(
    Boolean,
  );

  function setFilter(key: keyof Filters, val: string) {
    setFilters((p) => ({ ...p, [key]: val }));
    setPage(1);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Audit Logs
        </h1>
        <p className="mt-0.5 text-sm text-slate-500">
          {`${logs.length.toLocaleString()} total events`}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search event or email…"
          value={filters.search}
          onChange={(e) => setFilter("search", e.target.value)}
          className="w-56 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <select
          value={filters.action}
          onChange={(e) => setFilter("action", e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">All actions</option>
          {ACTIONS.filter(Boolean).map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <select
          value={filters.model_name}
          onChange={(e) => setFilter("model_name", e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">All models</option>
          {models.filter(Boolean).map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Head */}
        <div className="grid grid-cols-[140px_1fr_100px_120px_1fr] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">
          <span>Time</span>
          <span>Actor</span>
          <span>Action</span>
          <span>Model</span>
          <span>Changes</span>
        </div>

        {/* Rows */}
        {loading ? (
          <div className="py-16 text-center text-sm text-slate-400">
            Loading…
          </div>
        ) : error ? (
          <div className="py-16 text-center text-sm text-red-400">{error}</div>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-400">
            No logs found
          </div>
        ) : (
          logs.map((log) => {
            const { date, time } = formatDate(log.timestamp);
            const isOpen = expanded === log.id;
            return (
              <div
                key={log.id}
                className="border-b border-slate-100 last:border-0"
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : log.id)}
                  className="grid w-full grid-cols-[140px_1fr_100px_120px_1fr] gap-4 px-5 py-3.5 text-left transition-colors hover:bg-slate-50"
                >
                  <div>
                    <div className="text-xs font-medium text-slate-700">
                      {date}
                    </div>
                    <div className="text-xs text-slate-400">{time}</div>
                  </div>
                  <div>
                    <div className="truncate text-xs font-medium text-slate-700">
                      {log.user_email ?? "system"}
                    </div>
                    {log.event && (
                      <div className="truncate text-xs text-slate-400">
                        {log.event}
                      </div>
                    )}
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-xs font-medium ${ACTION_COLORS[log.action]}`}
                    >
                      <span>{ACTION_ICONS[log.action]}</span>
                      {log.action}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-700">
                      {log.model_name || "—"}
                    </div>
                    {log.object_id && (
                      <div className="text-xs text-slate-400">
                        #{log.object_id}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    <DataDiff data={log.data} />
                  </div>
                </button>

                {/* Expanded raw JSON */}
                {isOpen && (
                  <div className="px-5 pb-4">
                    <pre className="max-h-48 overflow-auto rounded-xl bg-slate-900 p-4 font-mono text-xs text-emerald-400">
                      {JSON.stringify(log.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      <div className="mt-5 flex items-center justify-between rounded-xl border bg-white p-4">
        <p className="text-sm text-slate-600">
          Page <span className="font-semibold">{page}</span> of{" "}
          <span className="font-semibold">{totalPages}</span>
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="h-9 w-9 rounded-lg border hover:bg-slate-50 disabled:opacity-40"
          >
            ‹
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(
            (p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-9 w-9 rounded-lg text-sm font-medium ${
                  page === p
                    ? "bg-blue-600 text-white"
                    : "border hover:bg-slate-50"
                }`}
              >
                {p}
              </button>
            ),
          )}
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="h-9 w-9 rounded-lg border hover:bg-slate-50 disabled:opacity-40"
          >
            ›
          </button>
        </div>
      </div>
    </main>
  );
}
