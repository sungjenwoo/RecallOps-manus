import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../../server/routers";
import type {
  AuditUsageAction,
  AuditUsageRange,
} from "../../../server/auditUsage";
import {
  AlertTriangle,
  Activity,
  BarChart3,
  CheckCircle2,
  Clock3,
  Download,
  Fingerprint,
  LoaderCircle,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Users,
  Workflow,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const ranges = [
  { id: "24h", label: "24 hours" },
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
] as const;
const actions = [
  { id: "all", label: "All actions" },
  { id: "analysis", label: "Incident analysis" },
  { id: "seed-pack", label: "Synthetic seed" },
  { id: "verified-outcome", label: "Verified outcome" },
] as const;
const chartConfig = {
  operations: { label: "API actions", color: "#378363" },
};
type AuditDashboardData =
  inferRouterOutputs<AppRouter>["auditUsage"]["dashboard"];

function createSampleDashboardData(
  range: AuditUsageRange,
  action: AuditUsageAction
): AuditDashboardData {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const actors = [
    "sample-user-01",
    "sample-user-02",
    "sample-user-03",
    "sample-user-04",
    "sample-user-05",
  ];
  const allEvents = Array.from({ length: 127 }, (_, index) => {
    const actionRank = (index * 37) % 127;
    const eventAction =
      actionRank < 84
        ? "analysis"
        : actionRank < 100
          ? "seed-pack"
          : "verified-outcome";
    const createdAt = now - Math.floor((index / 126) * 28 * dayMs);
    const actorIndex = index % actors.length;
    return {
      id: 50_000 + index,
      actorLabel: actors[actorIndex],
      action: eventAction,
      target:
        eventAction === "analysis"
          ? "incident-analysis"
          : eventAction === "seed-pack"
            ? "synthetic-seed-pack"
            : "human-confirmed-postmortem",
      createdAt,
      expiresAt: createdAt + 30 * dayMs,
    };
  });
  const bucketCount = range === "24h" ? 24 : range === "7d" ? 7 : 30;
  const bucketMs = range === "24h" ? 60 * 60 * 1000 : dayMs;
  const lastBucket = Math.floor(now / bucketMs) * bucketMs;
  const firstBucket = lastBucket - (bucketCount - 1) * bucketMs;
  const eventsInRange = allEvents.filter(
    event => event.createdAt >= firstBucket
  );
  const filteredEvents = eventsInRange.filter(
    event => action === "all" || event.action === action
  );
  const series = Array.from({ length: bucketCount }, (_, index) => {
    const bucketStart = firstBucket + index * bucketMs;
    return {
      bucketStart,
      operations: filteredEvents.filter(
        event =>
          Math.floor(event.createdAt / bucketMs) * bucketMs === bucketStart
      ).length,
    };
  });
  const actorEvents = new Map<string, typeof eventsInRange>();
  for (const event of eventsInRange) {
    actorEvents.set(event.actorLabel, [
      ...(actorEvents.get(event.actorLabel) ?? []),
      event,
    ]);
  }
  const minuteAttempts = [18, 4, 3, 2, 0];
  const users = actors
    .map((actorLabel, index) => {
      const events = actorEvents.get(actorLabel) ?? [];
      return {
        actorLabel,
        operations: events.length,
        attemptsThisMinute: minuteAttempts[index] ?? 0,
        lastActiveAt: events.length
          ? Math.max(...events.map(event => event.createdAt))
          : null,
      };
    })
    .filter(user => user.operations > 0 || user.attemptsThisMinute > 0);
  const countAction = (kind: string) =>
    eventsInRange.filter(event => event.action === kind).length;
  const attemptsThisMinute = minuteAttempts.reduce(
    (sum, value) => sum + value,
    0
  );

  return {
    generatedAt: now,
    range,
    action,
    scope: "workspace",
    requestLimitPerMinute: 30,
    summary: {
      totalOperations: eventsInRange.length,
      analyses: countAction("analysis"),
      seedWrites: countAction("seed-pack"),
      verifiedOutcomeWrites: countAction("verified-outcome"),
      activeActors: actorEvents.size,
      activeActorsThisMinute: minuteAttempts.filter(value => value > 0).length,
      attemptsThisMinute,
      allowedThisMinute: attemptsThisMinute,
      blockedThisMinute: 0,
      remainingThisMinute: null,
    },
    series,
    alerts: [
      {
        id: "sample-user-01-usage-spike",
        severity: "warning",
        kind: "unusual-usage",
        actorLabel: actors[0]!,
        requestCount: 18,
        threshold: 10,
        title: "Unusual request-volume spike",
        detail:
          "18 attempts are at least 3× the median of the other active accounts (minimum 10 requests).",
      },
    ],
    recentEvents: filteredEvents
      .toSorted((a, b) => b.createdAt - a.createdAt)
      .slice(0, 50),
    users: users.toSorted((a, b) => b.operations - a.operations).slice(0, 20),
  };
}

function actionLabel(action: string) {
  switch (action) {
    case "analysis":
      return "Incident analysis";
    case "seed-pack":
      return "Synthetic seed";
    case "verified-outcome":
      return "Verified outcome";
    default:
      return action;
  }
}

function dateTime(timestamp: number) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(timestamp);
}

function bucketLabel(timestamp: number, range: "24h" | "7d" | "30d") {
  return new Intl.DateTimeFormat(
    undefined,
    range === "24h" ? { hour: "numeric" } : { weekday: "short", day: "numeric" }
  ).format(timestamp);
}

function exportCsv(data: AuditDashboardData, isSamplePreview: boolean) {
  const escape = (value: unknown) =>
    `"${String(value ?? "").replaceAll('"', '""')}"`;
  const rows = [
    [
      "Data source",
      isSamplePreview ? "Synthetic sample preview" : "Live audit records",
    ],
    ["Scope", isSamplePreview ? "synthetic-preview" : data.scope],
    ["Range", data.range],
    ["Action filter", data.action],
    ["Generated at", new Date(data.generatedAt).toISOString()],
    [],
    ["Summary", "Count"],
    [
      isSamplePreview ? "Sample operations" : "Live operations",
      data.summary.totalOperations,
    ],
    ["Incident analyses", data.summary.analyses],
    ["Synthetic seed writes", data.summary.seedWrites],
    ["Verified outcome writes", data.summary.verifiedOutcomeWrites],
    [],
    ["Actor", "Action", "Target", "Created at", "Expires at"],
    ...data.recentEvents.map(event => [
      event.actorLabel,
      actionLabel(event.action),
      event.target,
      new Date(event.createdAt).toISOString(),
      new Date(event.expiresAt).toISOString(),
    ]),
  ];
  const contents = rows.map(row => row.map(escape).join(",")).join("\r\n");
  const blob = new Blob([contents], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `recallops-audit-${isSamplePreview ? "sample-" : ""}${data.range}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

export default function AuditUsageDashboard() {
  const auth = useAuth();
  const isAdmin = auth.user?.role === "admin";
  const [showSamplePreview, setShowSamplePreview] = useState(
    () => new URLSearchParams(window.location.search).get("sample") === "1"
  );
  const [range, setRange] = useState<(typeof ranges)[number]["id"]>("7d");
  const [action, setAction] = useState<(typeof actions)[number]["id"]>("all");
  const [adminScope, setAdminScope] = useState<"personal" | "workspace">(
    "workspace"
  );
  const isSamplePreview = showSamplePreview;
  const scope = isSamplePreview
    ? "workspace"
    : isAdmin
      ? adminScope
      : "personal";
  const queryInput = useMemo(
    () => ({ range, action, scope }),
    [range, action, scope]
  );
  const query = trpc.auditUsage.dashboard.useQuery(queryInput, {
    enabled: auth.isAuthenticated && !isSamplePreview,
    retry: false,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });
  const sampleData = useMemo(
    () => createSampleDashboardData(range, action),
    [range, action]
  );
  const setSampleMode = (enabled: boolean) => {
    setShowSamplePreview(enabled);
    const url = new URL(window.location.href);
    url.searchParams.set("section", "usage");
    if (enabled) url.searchParams.set("sample", "1");
    else url.searchParams.delete("sample");
    window.history.replaceState(
      {},
      "",
      `${url.pathname}${url.search}${url.hash}`
    );
  };
  const data = isSamplePreview ? sampleData : query.data;
  const displayAttempts = data
    ? Math.min(data.summary.attemptsThisMinute, data.requestLimitPerMinute)
    : 0;
  const workspaceCapacity = data
    ? data.requestLimitPerMinute * data.summary.activeActorsThisMinute
    : 0;
  const usagePercent = data
    ? scope === "workspace"
      ? workspaceCapacity > 0
        ? Math.min(
            100,
            (data.summary.allowedThisMinute / workspaceCapacity) * 100
          )
        : 0
      : Math.min(100, (displayAttempts / data.requestLimitPerMinute) * 100)
    : 0;

  if (auth.loading) {
    return (
      <div className="audit-loading" role="status">
        <LoaderCircle className="h-5 w-5 animate-spin" />
        <span>Checking access to audit and usage data…</span>
      </div>
    );
  }
  if (!auth.isAuthenticated && !isSamplePreview) {
    return (
      <section className="audit-auth-card">
        <span className="audit-auth-icon">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div>
          <div className="panel-kicker">PRIVATE ACCOUNT DATA</div>
          <h2>Sign in to view API usage</h2>
          <p>
            Your personal audit events are private. Admins can switch to a
            workspace view that uses pseudonymous user labels only.
          </p>
        </div>
        <Button onClick={startLogin}>Sign in securely</Button>
        <Button
          variant="outline"
          onClick={() => {
            setSampleMode(true);
          }}
        >
          View synthetic preview
        </Button>
      </section>
    );
  }

  return (
    <section className="audit-dashboard" aria-labelledby="audit-title">
      {isSamplePreview && (
        <div className="audit-sample-banner" role="status">
          <div>
            <strong>SYNTHETIC PREVIEW · FICTIONAL COUNTS ONLY</strong>
            <span>
              These example accounts and events are generated in the browser;
              they are not real users, API requests, or retained audit records.
            </span>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setSampleMode(false);
              if (!auth.isAuthenticated) startLogin();
            }}
          >
            {auth.isAuthenticated
              ? "Return to live data"
              : "Sign in for live data"}
          </Button>
        </div>
      )}
      <div className="page-heading audit-heading">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" />
            {isSamplePreview ? "SAMPLE DATA" : "GOVERNANCE"}{" "}
            <span className="eyebrow-dot">·</span> REQUEST OBSERVABILITY
          </div>
          <h1 id="audit-title">Usage, with a clear trail.</h1>
          <p>
            {isSamplePreview
              ? "Explore the filters and charts using generated sample activity."
              : "Live memory actions, rate-limit activity, and the 30-day audit window."}
          </p>
        </div>
        <div className="heading-aside">
          <span className="quiet-chip">
            <ShieldCheck className="h-3.5 w-3.5" />
            {isSamplePreview ? "Fictional sample" : "Pseudonymous audit"}
          </span>
          <span className="text-[11px] text-slate-500">
            No incident text or identity data
          </span>
        </div>
      </div>

      <div className="audit-toolbar">
        <div className="audit-control-group" aria-label="Reporting period">
          {ranges.map(item => (
            <button
              key={item.id}
              className={`audit-range-button ${range === item.id ? "active" : ""}`}
              aria-pressed={range === item.id}
              onClick={() => setRange(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <label className="audit-select-label">
          <span>Action</span>
          <select
            value={action}
            onChange={event => setAction(event.target.value as typeof action)}
          >
            {actions.map(item => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        {isAdmin && (
          <div className="audit-scope-group" aria-label="Analytics scope">
            <button
              className={scope === "workspace" ? "active" : ""}
              aria-pressed={scope === "workspace"}
              onClick={() => setAdminScope("workspace")}
            >
              Workspace
            </button>
            <button
              className={scope === "personal" ? "active" : ""}
              aria-pressed={scope === "personal"}
              onClick={() => setAdminScope("personal")}
            >
              My account
            </button>
          </div>
        )}
        <div className="audit-toolbar-spacer" />
        <span className="audit-updated">
          {data
            ? isSamplePreview
              ? `Sample generated ${dateTime(data.generatedAt)}`
              : `Updated ${dateTime(data.generatedAt)}`
            : "Live data"}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void query.refetch()}
          disabled={isSamplePreview || query.isFetching}
          aria-label="Refresh usage data"
        >
          <RefreshCw
            className={`mr-2 h-3.5 w-3.5 ${query.isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => data && exportCsv(data, isSamplePreview)}
          disabled={!data || data.recentEvents.length === 0}
        >
          <Download className="mr-2 h-3.5 w-3.5" />
          Export CSV
        </Button>
        {auth.isAuthenticated && !isSamplePreview && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSampleMode(!isSamplePreview)}
          >
            {isSamplePreview ? "Return to live" : "Sample preview"}
          </Button>
        )}
      </div>
      <p className="audit-filter-note">
        The action filter applies to the trend and event list; summary cards
        show all actions in the selected reporting period.
      </p>

      {query.isLoading ? (
        <div className="audit-loading" role="status">
          <LoaderCircle className="h-5 w-5 animate-spin" />
          Loading retained analytics…
        </div>
      ) : query.error ? (
        <div className="audit-error" role="alert">
          <ShieldCheck className="h-5 w-5" />
          <div>
            <strong>Audit data unavailable</strong>
            <p>{query.error.message}</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => void query.refetch()}
          >
            Try again
          </Button>
        </div>
      ) : data ? (
        <>
          <div className="audit-kpi-grid">
            <article className="audit-kpi-card">
              <span className="audit-kpi-icon">
                <Activity className="h-4 w-4" />
              </span>
              <span className="audit-kpi-label">
                {isSamplePreview ? "SAMPLE OPERATIONS" : "LIVE OPERATIONS"} ·{" "}
                {range.toUpperCase()}
              </span>
              <strong>{data.summary.totalOperations.toLocaleString()}</strong>
              <small>
                {isSamplePreview
                  ? "Generated example events—not actual usage"
                  : "Accepted memory API actions"}
              </small>
            </article>
            <article className="audit-kpi-card">
              <span className="audit-kpi-icon audit-kpi-blue">
                <BarChart3 className="h-4 w-4" />
              </span>
              <span className="audit-kpi-label">
                {isSamplePreview ? "SAMPLE ANALYSES" : "INCIDENT ANALYSES"}
              </span>
              <strong>{data.summary.analyses.toLocaleString()}</strong>
              <small>Evidence retrieval and planning requests</small>
            </article>
            <article className="audit-kpi-card">
              <span className="audit-kpi-icon audit-kpi-violet">
                <Workflow className="h-4 w-4" />
              </span>
              <span className="audit-kpi-label">
                {isSamplePreview ? "SAMPLE WRITES" : "MEMORY WRITES"}
              </span>
              <strong>
                {(
                  data.summary.seedWrites + data.summary.verifiedOutcomeWrites
                ).toLocaleString()}
              </strong>
              <small>
                {data.summary.seedWrites} seed ·{" "}
                {data.summary.verifiedOutcomeWrites} verified outcome
              </small>
            </article>
            <article className="audit-kpi-card">
              <span className="audit-kpi-icon audit-kpi-amber">
                <Users className="h-4 w-4" />
              </span>
              <span className="audit-kpi-label">
                {scope === "workspace"
                  ? isSamplePreview
                    ? "SAMPLE ACCOUNTS"
                    : "PSEUDONYMOUS USERS"
                  : "CURRENT MINUTE"}
              </span>
              <strong>
                {scope === "workspace"
                  ? data.summary.activeActors.toLocaleString()
                  : `${data.summary.allowedThisMinute}/${data.requestLimitPerMinute}`}
              </strong>
              <small>
                {scope === "workspace"
                  ? isSamplePreview
                    ? "Fictional accounts in this preview"
                    : "Accounts with a retained action in this range"
                  : `${data.summary.remainingThisMinute ?? 0} requests remaining`}
              </small>
            </article>
          </div>

          <div className="audit-live-limit">
            <div className="audit-limit-icon">
              <Clock3 className="h-4 w-4" />
            </div>
            <div className="audit-limit-copy">
              <strong>
                {scope === "workspace"
                  ? isSamplePreview
                    ? "Illustrative request activity"
                    : "Workspace request activity"
                  : "Your rolling request limit"}
              </strong>
              <span>
                {scope === "workspace"
                  ? isSamplePreview
                    ? "Generated example counts only; no live rate-limit records are queried."
                    : `${data.summary.attemptsThisMinute} attempts across ${data.summary.activeActorsThisMinute} active pseudonymous users${data.summary.blockedThisMinute ? `; ${data.summary.blockedThisMinute} over per-user limits` : ""}`
                  : `${data.summary.attemptsThisMinute} attempts in the current minute; ${data.summary.blockedThisMinute} were over the per-user limit`}
              </span>
            </div>
            <div
              className="audit-limit-track"
              aria-label={
                scope === "workspace"
                  ? `${data.summary.allowedThisMinute} of ${workspaceCapacity} allowed requests used across active users`
                  : `${displayAttempts} of ${data.requestLimitPerMinute} requests used`
              }
            >
              <div style={{ width: `${usagePercent}%` }} />
            </div>
            <span className="audit-limit-count">
              {scope === "workspace"
                ? data.summary.activeActorsThisMinute
                  ? `${data.summary.allowedThisMinute} / ${workspaceCapacity}`
                  : "0 active"
                : `${displayAttempts} / ${data.requestLimitPerMinute}`}
            </span>
          </div>

          {(isSamplePreview || (isAdmin && scope === "workspace")) && (
            <section
              className={`audit-alert-panel ${data.alerts.length ? "has-alerts" : "no-alerts"}`}
              aria-label="Admin usage alerts"
              aria-live="polite"
            >
              <div className="audit-alert-heading">
                <div>
                  <div className="panel-kicker">ADMIN ALERTS · IN-APP ONLY</div>
                  <h2>Usage signals</h2>
                  <p>
                    {isSamplePreview
                      ? "A fictional alert demonstrates the rule; no live counters are queried."
                      : "Current-minute signals from pseudonymous request counters."}
                  </p>
                </div>
                <span className="audit-alert-total">
                  {data.alerts.length
                    ? `${data.alerts.length} active`
                    : "No active alerts"}
                </span>
              </div>
              {data.alerts.length ? (
                <div className="audit-alert-list">
                  {data.alerts.map(alert => (
                    <div
                      className={`audit-alert-card audit-alert-${alert.severity}`}
                      key={alert.id}
                    >
                      <span className="audit-alert-icon">
                        {alert.severity === "critical" ? (
                          <ShieldAlert className="h-4 w-4" />
                        ) : (
                          <AlertTriangle className="h-4 w-4" />
                        )}
                      </span>
                      <div className="audit-alert-copy">
                        <div className="audit-alert-title-row">
                          <strong>{alert.title}</strong>
                          <code>{alert.actorLabel}</code>
                        </div>
                        <p>{alert.detail}</p>
                      </div>
                      <div className="audit-alert-metric">
                        <b>{alert.requestCount}</b>
                        <small>requests/min</small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="audit-alert-empty">
                  <CheckCircle2 className="h-4 w-4" />
                  No threshold or unusual-usage signals in the current minute.
                </div>
              )}
              <p className="audit-alert-note">
                Signals fire at 24/30 requests per minute, above the 30-request
                cap, or at 3× the median of at least three peer accounts (with a
                10-request minimum). These heuristics are not proof of misuse.
                Alert history and external notifications are not stored.
              </p>
            </section>
          )}

          <div
            className={`audit-content-grid ${scope === "workspace" ? "audit-content-workspace" : ""}`}
          >
            <article className="audit-panel audit-trend-panel">
              <div className="audit-panel-heading">
                <div>
                  <div className="panel-kicker">REQUEST VOLUME</div>
                  <h2>
                    {isSamplePreview
                      ? "Sample API activity"
                      : "Live API activity"}
                  </h2>
                </div>
                <span className="quiet-chip">
                  <Activity className="h-3.5 w-3.5" />
                  {action === "all" ? "All actions" : actionLabel(action)}
                </span>
              </div>
              {data.series.every(bucket => bucket.operations === 0) ? (
                <div className="audit-chart-empty">
                  <BarChart3 className="h-6 w-6" />
                  <strong>
                    {isSamplePreview
                      ? "No sample actions match this filter"
                      : "No live actions match this filter"}
                  </strong>
                  <span>
                    {isSamplePreview
                      ? "Choose another action type or reporting period to explore the sample."
                      : "Simulation-mode activity is local to the browser and is not written to the server audit log."}
                  </span>
                </div>
              ) : (
                <ChartContainer
                  config={chartConfig}
                  className="audit-chart-wrap"
                >
                  <AreaChart
                    data={data.series}
                    margin={{ top: 12, right: 12, bottom: 0, left: -12 }}
                  >
                    <defs>
                      <linearGradient
                        id="auditFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#378363"
                          stopOpacity={0.22}
                        />
                        <stop
                          offset="95%"
                          stopColor="#378363"
                          stopOpacity={0.01}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      vertical={false}
                      stroke="#e8eee9"
                      strokeDasharray="3 4"
                    />
                    <XAxis
                      dataKey="bucketStart"
                      tickFormatter={value => bucketLabel(Number(value), range)}
                      tickLine={false}
                      axisLine={false}
                      minTickGap={18}
                    />
                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                      width={36}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          labelFormatter={(_, payload) =>
                            payload?.[0]?.payload?.bucketStart
                              ? bucketLabel(
                                  Number(payload[0].payload.bucketStart),
                                  range
                                )
                              : ""
                          }
                        />
                      }
                    />
                    <Area
                      dataKey="operations"
                      type="monotone"
                      stroke="var(--color-operations)"
                      strokeWidth={2.5}
                      fill="url(#auditFill)"
                      dot={false}
                      activeDot={{
                        r: 4,
                        fill: "#378363",
                        stroke: "#fff",
                        strokeWidth: 2,
                      }}
                    />
                  </AreaChart>
                </ChartContainer>
              )}
              <div className="audit-chart-footnote">
                {isSamplePreview
                  ? "Every value in this chart is illustrative sample data, not a measurement of API usage."
                  : "Only accepted live memory operations are shown in this trend. Status checks, simulation calls, and rate-limited attempts are tracked separately or not retained."}
              </div>
            </article>

            {scope === "workspace" && (
              <article className="audit-panel audit-users-panel">
                <div className="audit-panel-heading">
                  <div>
                    <div className="panel-kicker">PRIVACY-SAFE BREAKDOWN</div>
                    <h2>
                      {isSamplePreview
                        ? "Sample account usage"
                        : "Usage by account"}
                    </h2>
                  </div>
                  <span className="audit-private-tag">
                    <Fingerprint className="h-3.5 w-3.5" />
                    {isSamplePreview ? "Fictional" : "Pseudonymous"}
                  </span>
                </div>
                {data.users.length === 0 ? (
                  <div className="audit-users-empty">
                    No users have recorded live actions in this period.
                  </div>
                ) : (
                  <div className="audit-user-list">
                    {data.users.map(user => (
                      <div className="audit-user-row" key={user.actorLabel}>
                        <span className="audit-user-avatar">
                          <Fingerprint className="h-4 w-4" />
                        </span>
                        <div className="audit-user-copy">
                          <strong>{user.actorLabel}</strong>
                          <small>
                            {user.lastActiveAt
                              ? `Last active ${dateTime(user.lastActiveAt)}`
                              : "Active this minute"}
                          </small>
                        </div>
                        <div className="audit-user-metric">
                          <b>{user.operations.toLocaleString()}</b>
                          <small>actions</small>
                        </div>
                        <div className="audit-user-minute">
                          <b>{user.attemptsThisMinute}</b>
                          <small>/ min</small>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="audit-users-note">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {isSamplePreview
                    ? "These sample account labels are fictional."
                    : "No emails, OAuth IDs, or incident content are exposed."}
                </div>
              </article>
            )}
          </div>

          <article className="audit-panel audit-events-panel">
            <div className="audit-panel-heading audit-events-heading">
              <div>
                <div className="panel-kicker">RETENTION WINDOW · 30 DAYS</div>
                <h2>Recent audit events</h2>
                <p>Metadata-only records expire automatically after 30 days.</p>
              </div>
              <span className="quiet-chip">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {data.recentEvents.length} shown · newest first
              </span>
            </div>
            {data.recentEvents.length === 0 ? (
              <div className="audit-events-empty">
                <Clock3 className="h-5 w-5" />
                <span>No audit events match these filters.</span>
              </div>
            ) : (
              <div className="audit-table-scroll">
                <table className="audit-table">
                  <thead>
                    <tr>
                      <th>
                        {scope === "workspace"
                          ? isSamplePreview
                            ? "SAMPLE ACCOUNT"
                            : "PSEUDONYMOUS USER"
                          : "ACTOR"}
                      </th>
                      <th>ACTION</th>
                      <th>TARGET</th>
                      <th>RECORDED</th>
                      <th>EXPIRES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentEvents.map(event => (
                      <tr key={event.id}>
                        <td>
                          <span className="audit-actor">
                            <Fingerprint className="h-3.5 w-3.5" />
                            {event.actorLabel}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`audit-action-tag audit-action-${event.action}`}
                          >
                            {actionLabel(event.action)}
                          </span>
                        </td>
                        <td>
                          <code>{event.target}</code>
                        </td>
                        <td>{dateTime(event.createdAt)}</td>
                        <td>{dateTime(event.expiresAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="audit-retention-note">
              <ShieldCheck className="h-4 w-4" />
              <span>
                {isSamplePreview
                  ? "This preview is generated locally. In live mode, audit records contain only a pseudonymous actor hash, action type, safe target label, and timestamps; expired rows are removed during subsequent live writes."
                  : "Audit records contain only a pseudonymous actor hash, action type, safe target label, and timestamps. Expired rows are removed during subsequent live writes."}
              </span>
            </div>
          </article>
          <div className="audit-disclaimer">
            <ShieldCheck className="h-4 w-4" />
            <span>
              {isSamplePreview
                ? "Synthetic preview only. Sign in to access your own private audit data; admins can access workspace analytics with pseudonymous labels."
                : "Workspace scope is admin-only. Standard users can see only their own activity. Counts reflect live memory operations, not simulated demo requests."}
            </span>
          </div>
          <div className="audit-footer-meta">
            {isSamplePreview
              ? "SYNTHETIC PREVIEW · FICTIONAL ACCOUNTS"
              : data.scope === "workspace"
                ? "WORKSPACE SCOPE · PSEUDONYMOUS ACTORS"
                : "PERSONAL SCOPE · YOUR ACCOUNT ONLY"}{" "}
            <span>·</span> Auto-refreshes every 30 seconds
          </div>
        </>
      ) : null}
    </section>
  );
}
