import DashboardLayout from "@/components/DashboardLayout";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { DEMO_INCIDENTS, DEMO_SCENARIOS } from "@shared/incidentSeeds";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  BarChart3,
  Brain,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  Database,
  Fingerprint,
  GitBranch,
  History,
  Layers3,
  LoaderCircle,
  Network,
  Radio,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Timer,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

const AuditUsageDashboard = lazy(
  () => import("@/components/AuditUsageDashboard")
);

type Evidence = {
  id: string;
  text: string;
  source: string;
  kind: "hindsight" | "synthetic" | "browser-memory";
};
type PlanItem = { title: string; rationale: string; evidenceIds: string[] };
type AnalysisResult = {
  id: string;
  createdAt: number;
  service: string;
  environment: string;
  summary: string;
  recentChange: string;
  evidence: Evidence[];
  plan: {
    confidence: "low" | "medium" | "high";
    hypotheses: PlanItem[];
    readOnlyChecks: PlanItem[];
    caution: string;
  };
  baseline: {
    confidence: "low" | "medium" | "high";
    hypotheses: PlanItem[];
    readOnlyChecks: PlanItem[];
    caution: string;
  };
  memoryMode: "hindsight" | "simulation" | "fallback";
  modelSource: string;
  memoryNote: string;
  redactionApplied: boolean;
};
type StoredOutcome = {
  id: string;
  service: string;
  text: string;
  rootCause: string;
  resolution: string;
  savedAt: number;
};
type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  createdAt: number;
  kind: "analysis" | "outcome" | "seed";
};
type Section = "incident" | "memory" | "playbooks" | "activity" | "usage";

const STORAGE_KEY = "recallops-outcomes-v1";
const ACTIVITY_KEY = "recallops-activity-v1";
const navigation = [
  { id: "incident", label: "Incident room", icon: Radio },
  { id: "memory", label: "Memory bank", icon: Brain },
  { id: "playbooks", label: "Playbooks", icon: BookOpenCheck },
  { id: "activity", label: "Activity", icon: History },
  { id: "usage", label: "Usage & audit", icon: BarChart3 },
];

function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function formatTime(timestamp: number) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(timestamp);
}

function shortTime(timestamp: number) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(timestamp);
}

function StatusPill({
  live,
  authenticated,
}: {
  live: boolean;
  authenticated: boolean;
}) {
  return (
    <span
      className={`status-pill ${live ? "status-pill-live" : "status-pill-demo"}`}
    >
      <span className="status-dot" />
      {live
        ? authenticated
          ? "Private Hindsight memory"
          : "Hindsight sign-in required"
        : "Synthetic demo mode"}
    </span>
  );
}

export default function Home() {
  const auth = useAuth();
  const [section, setSection] = useState<Section>(() => {
    const requested = new URLSearchParams(window.location.search).get(
      "section"
    );
    return navigation.some(item => item.id === requested)
      ? (requested as Section)
      : "incident";
  });
  const [scenarioId, setScenarioId] = useState<string>(DEMO_SCENARIOS[0].id);
  const scenario = useMemo(
    () =>
      DEMO_SCENARIOS.find(item => item.id === scenarioId) ?? DEMO_SCENARIOS[0],
    [scenarioId]
  );
  const [service, setService] = useState<string>(scenario.service);
  const [environment, setEnvironment] = useState<string>(scenario.environment);
  const [summary, setSummary] = useState<string>(scenario.summary);
  const [recentChange, setRecentChange] = useState<string>(
    scenario.recentChange
  );
  const [impact, setImpact] = useState<string>(scenario.impact);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [rootCause, setRootCause] = useState("");
  const [failedActions, setFailedActions] = useState("");
  const [resolution, setResolution] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [outcomes, setOutcomes] = useState<StoredOutcome[]>(() =>
    readStorage(STORAGE_KEY, [])
  );
  const [activity, setActivity] = useState<ActivityItem[]>(() =>
    readStorage(ACTIVITY_KEY, [])
  );
  const [seeded, setSeeded] = useState(false);
  const [showMemoryComparison, setShowMemoryComparison] = useState(true);
  const statusQuery = trpc.recallOps.status.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });
  const analyzeMutation = trpc.recallOps.analyze.useMutation();
  const saveMutation = trpc.recallOps.saveOutcome.useMutation();
  const seedMutation = trpc.recallOps.seedDemo.useMutation();
  const live = Boolean(statusQuery.data?.hindsightConfigured);
  const needsLiveSignIn = live && !auth.isAuthenticated;
  const loading = analyzeMutation.isPending;

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(outcomes));
  }, [outcomes]);
  useEffect(() => {
    window.localStorage.setItem(
      ACTIVITY_KEY,
      JSON.stringify(activity.slice(0, 40))
    );
  }, [activity]);

  function addActivity(item: ActivityItem) {
    setActivity(current => [item, ...current].slice(0, 40));
  }

  function selectScenario(id: string) {
    const next = DEMO_SCENARIOS.find(item => item.id === id);
    if (!next) return;
    setScenarioId(id);
    setService(next.service);
    setEnvironment(next.environment);
    setSummary(next.summary);
    setRecentChange(next.recentChange);
    setImpact(next.impact);
    setAnalysis(null);
    setIsRecording(false);
  }

  async function runAnalysis() {
    if (needsLiveSignIn) {
      toast.info("Sign in to access your private incident memory.");
      startLogin();
      return;
    }
    if (summary.trim().length < 12) {
      toast.error("Add a little more detail about the current symptoms.");
      return;
    }
    try {
      const browserMemories = outcomes.map(item => ({
        id: item.id,
        text: item.text,
      }));
      const result = await analyzeMutation.mutateAsync({
        service,
        environment,
        summary,
        recentChange,
        impact,
        browserMemories,
      });
      setAnalysis(result as AnalysisResult);
      setIsRecording(false);
      addActivity({
        id: result.id,
        title: `Analysis started · ${service}`,
        detail: `${result.evidence.length} evidence items · ${result.memoryMode === "hindsight" ? "Hindsight recall" : result.memoryMode === "fallback" ? "fallback evidence" : "simulation memory"}`,
        createdAt: Date.now(),
        kind: "analysis",
      });
      toast.success(
        result.memoryMode === "hindsight"
          ? "Analysis grounded in Hindsight memory."
          : "Demo analysis ready. Synthetic data is clearly labelled."
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Analysis failed. Check your inputs and try again."
      );
    }
  }

  async function saveOutcome() {
    if (!analysis) return;
    if (needsLiveSignIn) {
      toast.info("Sign in to retain a lesson in your private memory bank.");
      startLogin();
      return;
    }
    if (!confirmed) {
      toast.error(
        "Confirm that the root cause and resolution were verified by a human."
      );
      return;
    }
    try {
      const incidentId = analysis.id;
      const result = await saveMutation.mutateAsync({
        incidentId,
        service: analysis.service,
        summary: analysis.summary,
        rootCause,
        failedActions,
        successfulResolution: resolution,
        followUp,
        confirmed: true,
      });
      const localItem: StoredOutcome = {
        id: `LOCAL-${Date.now().toString(36).toUpperCase()}`,
        service: analysis.service,
        text: `Human-confirmed postmortem for ${analysis.service}. Symptoms: ${analysis.summary} Confirmed root cause: ${rootCause}. Failed actions: ${failedActions || "None reported."} Successful resolution: ${resolution}. Follow-up lesson: ${followUp || "Verify current evidence before acting on this pattern."}`,
        rootCause,
        resolution,
        savedAt: Date.now(),
      };
      if (result.mode === "simulation")
        setOutcomes(current => [localItem, ...current].slice(0, 20));
      addActivity({
        id: `OUT-${Date.now()}`,
        title:
          result.mode === "hindsight"
            ? "Outcome retained in Hindsight"
            : "Outcome saved to this browser",
        detail: `${analysis.service} · human-confirmed memory`,
        createdAt: Date.now(),
        kind: "outcome",
      });
      setIsRecording(false);
      setConfirmed(false);
      setRootCause("");
      setFailedActions("");
      setResolution("");
      setFollowUp("");
      toast.success(
        result.mode === "hindsight"
          ? "Confirmed lesson retained in Hindsight."
          : "Lesson saved in this browser. Re-analyze to see how it changes the plan."
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "The outcome could not be saved. Nothing was added to memory."
      );
    }
  }

  async function seedMemoryBank() {
    if (needsLiveSignIn) {
      toast.info("Sign in to seed your private memory bank.");
      startLogin();
      return;
    }
    try {
      const result = await seedMutation.mutateAsync();
      if (result.mode === "hindsight" && result.saved) {
        setSeeded(true);
        addActivity({
          id: `SEED-${Date.now()}`,
          title: "Synthetic pack retained in Hindsight",
          detail: `${result.count} clearly labelled fictional postmortems`,
          createdAt: Date.now(),
          kind: "seed",
        });
        toast.success(
          `${result.count} synthetic postmortems retained in Hindsight.`
        );
      } else {
        toast.info(
          "The synthetic examples are already available in simulation mode. Connect Hindsight to persist them to a memory bank."
        );
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "The demo pack could not be loaded into Hindsight."
      );
    }
  }

  const navAction = (id: string) => {
    const next = id as Section;
    setSection(next);
    const url = new URL(window.location.href);
    if (next === "incident") url.searchParams.delete("section");
    else url.searchParams.set("section", next);
    window.history.replaceState(
      {},
      "",
      `${url.pathname}${url.search}${url.hash}`
    );
  };
  const memoryCount =
    outcomes.length + (live && !seeded ? 0 : DEMO_INCIDENTS.length);

  return (
    <DashboardLayout
      publicMode
      navItems={navigation}
      activeNav={section}
      onNavigate={navAction}
    >
      <div className="ro-app min-h-screen">
        <header className="ro-topbar">
          <div className="flex min-w-0 items-center gap-3">
            <span className="topbar-label">OPERATIONS</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <span className="truncate text-[13px] font-medium text-slate-700">
              {navigation.find(item => item.id === section)?.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <StatusPill live={live} authenticated={auth.isAuthenticated} />
            {needsLiveSignIn && (
              <Button size="sm" onClick={startLogin}>
                Sign in
              </Button>
            )}
            <button
              className="topbar-icon"
              aria-label="Help and safety information"
              onClick={() =>
                toast.info(
                  "RecallOps is advisory only. Use synthetic data in this demo and independently verify every hypothesis."
                )
              }
            >
              <CircleHelp className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main className="ro-main">
          {section === "incident" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">
                    <span className="eyebrow-line" />
                    ON-CALL WORKSPACE <span className="eyebrow-dot">
                      ·
                    </span>{" "}
                    {new Intl.DateTimeFormat(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    }).format(new Date())}
                  </div>
                  <h1>Resolve with context.</h1>
                  <p>Start with the evidence your team already earned.</p>
                </div>
                <div className="heading-aside">
                  <span className="synthetic-label">
                    <Fingerprint className="h-3.5 w-3.5" />
                    SYNTHETIC TELEMETRY
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Demo workspace · no production changes
                  </span>
                </div>
              </div>

              <section className="incident-banner">
                <div className="incident-banner-main">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="severity-tag">
                      <span />
                      SEV-2 · INVESTIGATING
                    </span>
                    <span className="incident-id">
                      {analysis?.id ?? "INCIDENT · NEW"}
                    </span>
                  </div>
                  <h2>
                    {analysis ? analysis.service : service} <span>·</span>{" "}
                    {analysis ? "analysis ready" : "degraded performance"}
                  </h2>
                  <p>
                    {analysis
                      ? "Review the historical evidence and confirm a cause before taking any action."
                      : "Symptoms and recent changes are fictional training data for the demo."}
                  </p>
                </div>
                <div className="incident-banner-meta">
                  <div>
                    <span className="meta-label">ENVIRONMENT</span>
                    <strong>{environment}</strong>
                  </div>
                  <div>
                    <span className="meta-label">FIRST SEEN</span>
                    <strong>
                      <Clock3 className="mr-1 inline h-3.5 w-3.5" />
                      {analysis ? formatTime(analysis.createdAt) : "8 min ago"}
                    </strong>
                  </div>
                </div>
              </section>

              <section
                className="metric-row"
                aria-label="Synthetic service telemetry"
              >
                <div className="metric-card">
                  <div className="metric-label">
                    Error rate{" "}
                    <ArrowUpRight className="h-3.5 w-3.5 text-rose-500" />
                  </div>
                  <div className="metric-value">
                    8.1<span>%</span>
                  </div>
                  <div className="metric-foot">
                    <span className="metric-negative">
                      <ArrowUpRight className="h-3 w-3" /> +7.8%
                    </span>{" "}
                    <span>vs. baseline</span>
                  </div>
                  <div className="sparkline sparkline-red">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">
                    p95 latency{" "}
                    <ArrowUpRight className="h-3.5 w-3.5 text-rose-500" />
                  </div>
                  <div className="metric-value">
                    910<span>ms</span>
                  </div>
                  <div className="metric-foot">
                    <span className="metric-negative">
                      <ArrowUpRight className="h-3 w-3" /> +4.3×
                    </span>{" "}
                    <span>last 10 min</span>
                  </div>
                  <div className="sparkline sparkline-amber">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">
                    Queue depth{" "}
                    <Layers3 className="h-3.5 w-3.5 text-amber-500" />
                  </div>
                  <div className="metric-value">
                    12.4<span>k</span>
                  </div>
                  <div className="metric-foot">
                    <span className="metric-negative">
                      <ArrowUpRight className="h-3 w-3" /> climbing
                    </span>{" "}
                    <span>oldest 6m 12s</span>
                  </div>
                  <div className="sparkline sparkline-blue">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
                <div className="metric-card metric-card-last">
                  <div className="metric-label">
                    Healthy pods{" "}
                    <Activity className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <div className="metric-value">
                    4<span>/6</span>
                  </div>
                  <div className="metric-foot">
                    <span className="metric-warning">2 degraded</span>{" "}
                    <span>readiness checks</span>
                  </div>
                  <div className="pod-dots">
                    <i className="pod-ok" />
                    <i className="pod-ok" />
                    <i className="pod-bad" />
                    <i className="pod-ok" />
                    <i className="pod-bad" />
                    <i className="pod-ok" />
                  </div>
                </div>
              </section>

              <div className="workspace-grid">
                <section className="panel incident-form-panel">
                  <div className="panel-heading">
                    <div>
                      <div className="panel-kicker">01 · DESCRIBE</div>
                      <h3>What are you seeing?</h3>
                    </div>
                    <span className="quiet-chip">
                      <Activity className="h-3.5 w-3.5" />
                      Operator input
                    </span>
                  </div>
                  <div className="scenario-row">
                    <span className="field-label mb-0">DEMO SCENARIO</span>
                    <div className="scenario-buttons">
                      {DEMO_SCENARIOS.map(item => (
                        <button
                          key={item.id}
                          className={`scenario-button ${scenarioId === item.id ? "selected" : ""}`}
                          onClick={() => selectScenario(item.id)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="field-pair">
                    <label>
                      <span className="field-label">SERVICE</span>
                      <Input
                        value={service}
                        onChange={event => setService(event.target.value)}
                        placeholder="e.g. checkout-api"
                      />
                    </label>
                    <label>
                      <span className="field-label">ENVIRONMENT</span>
                      <Input
                        value={environment}
                        onChange={event => setEnvironment(event.target.value)}
                        placeholder="e.g. production · us-east-1"
                      />
                    </label>
                  </div>
                  <label className="form-field">
                    <span className="field-label">
                      SYMPTOMS & OBSERVED SIGNALS
                    </span>
                    <Textarea
                      value={summary}
                      onChange={event => setSummary(event.target.value)}
                      maxLength={1800}
                      rows={4}
                      placeholder="Describe observed errors, when they started, and what is affected. Avoid secrets and customer data."
                    />
                    <span className="field-helper">
                      Observed facts only · {summary.length}/1,800
                    </span>
                  </label>
                  <label className="form-field">
                    <span className="field-label">
                      RECENT CHANGE{" "}
                      <span className="field-optional">OPTIONAL</span>
                    </span>
                    <Input
                      value={recentChange}
                      onChange={event => setRecentChange(event.target.value)}
                      placeholder="Release, config, dependency, traffic pattern…"
                    />
                  </label>
                  <label className="form-field">
                    <span className="field-label">
                      CUSTOMER / BUSINESS IMPACT{" "}
                      <span className="field-optional">OPTIONAL</span>
                    </span>
                    <Input
                      value={impact}
                      onChange={event => setImpact(event.target.value)}
                      placeholder="What is affected? What remains healthy?"
                    />
                  </label>
                  <div className="form-notice">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-700" />
                    <span>
                      Secrets are redacted before external requests. Use
                      synthetic data in this public demo; never enter
                      credentials or personal data.
                    </span>
                  </div>
                  {needsLiveSignIn && (
                    <div className="auth-required-banner">
                      <ShieldCheck className="h-4 w-4 shrink-0" />
                      <div>
                        <strong>Live memory is private to your account</strong>
                        <p>
                          Sign in to analyze incidents against your own
                          Hindsight bank.
                        </p>
                      </div>
                      <Button size="sm" variant="outline" onClick={startLogin}>
                        Sign in
                      </Button>
                    </div>
                  )}
                  <Button
                    className="analyze-button"
                    onClick={runAnalysis}
                    disabled={loading || auth.loading || !service.trim()}
                  >
                    <span>
                      {loading ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                    </span>
                    {loading
                      ? "Searching memory & analyzing…"
                      : needsLiveSignIn
                        ? "Sign in for private analysis"
                        : "Analyze with incident memory"}
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </Button>
                  <div className="pipeline-note">
                    <span>
                      <span className="pipeline-dot" />
                      RECALL
                    </span>
                    <i />
                    <span>REASON</span>
                    <i />
                    <span>HUMAN CONFIRMS</span>
                    <i />
                    <span>RETAIN</span>
                  </div>
                </section>

                <section className="panel analysis-panel" aria-live="polite">
                  {!analysis && !loading && (
                    <EmptyAnalysis onAnalyze={runAnalysis} />
                  )}
                  {loading && <AnalysisLoading />}
                  {analysis && (
                    <AnalysisView
                      analysis={analysis}
                      showComparison={showMemoryComparison}
                      setShowComparison={setShowMemoryComparison}
                      onRecord={() => setIsRecording(true)}
                    />
                  )}
                </section>
              </div>

              {analysis && isRecording && (
                <section className="panel outcome-panel" id="outcome-form">
                  <div className="outcome-heading">
                    <div className="outcome-icon">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="panel-kicker">
                        HUMAN-IN-THE-LOOP · MEMORY FEEDBACK
                      </div>
                      <h3>What actually happened?</h3>
                      <p>
                        Only record the outcome after an engineer has verified
                        it.
                      </p>
                    </div>
                    <button
                      className="topbar-icon ml-auto"
                      aria-label="Close outcome form"
                      onClick={() => setIsRecording(false)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="outcome-fields">
                    <label className="form-field">
                      <span className="field-label">CONFIRMED ROOT CAUSE</span>
                      <Textarea
                        value={rootCause}
                        onChange={event => setRootCause(event.target.value)}
                        rows={2}
                        placeholder="State what evidence confirmed the cause. Do not repeat a hypothesis as fact."
                      />
                    </label>
                    <label className="form-field">
                      <span className="field-label">
                        WHAT DID NOT WORK?{" "}
                        <span className="field-optional">OPTIONAL</span>
                      </span>
                      <Textarea
                        value={failedActions}
                        onChange={event => setFailedActions(event.target.value)}
                        rows={2}
                        placeholder="Record ineffective attempts so the next responder can avoid repeating them."
                      />
                    </label>
                    <label className="form-field">
                      <span className="field-label">CONFIRMED RESOLUTION</span>
                      <Textarea
                        value={resolution}
                        onChange={event => setResolution(event.target.value)}
                        rows={2}
                        placeholder="What resolved it, and what evidence showed recovery?"
                      />
                    </label>
                    <label className="form-field">
                      <span className="field-label">
                        FOLLOW-UP LESSON{" "}
                        <span className="field-optional">OPTIONAL</span>
                      </span>
                      <Input
                        value={followUp}
                        onChange={event => setFollowUp(event.target.value)}
                        placeholder="A caution or check to carry into the next incident…"
                      />
                    </label>
                  </div>
                  <label className="confirmation-check">
                    <input
                      type="checkbox"
                      checked={confirmed}
                      onChange={event => setConfirmed(event.target.checked)}
                    />
                    <span>
                      I confirm this outcome was verified by a human engineer;
                      this is historical evidence, not an automatic instruction.
                    </span>
                  </label>
                  <div className="outcome-footer">
                    <span>
                      <ShieldAlert className="h-4 w-4" />
                      No infrastructure changes are made by RecallOps.
                    </span>
                    <Button
                      onClick={saveOutcome}
                      disabled={
                        saveMutation.isPending ||
                        !confirmed ||
                        rootCause.trim().length < 8 ||
                        resolution.trim().length < 8
                      }
                    >
                      {saveMutation.isPending ? (
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Brain className="mr-2 h-4 w-4" />
                      )}
                      {live
                        ? "Retain verified lesson"
                        : "Save lesson to this browser"}
                    </Button>
                  </div>
                </section>
              )}

              {analysis && (
                <div className="post-analysis-row">
                  <div className="post-analysis-note">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span>
                      Memory is evidence—not certainty. Verify the live system
                      before changing anything.
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setAnalysis(null);
                      setIsRecording(false);
                    }}
                  >
                    <RefreshCw className="mr-2 h-3.5 w-3.5" />
                    Start a fresh analysis
                  </Button>
                </div>
              )}
            </>
          )}

          {section === "memory" && (
            <MemoryPage
              live={live}
              authenticated={auth.isAuthenticated}
              authLoading={auth.loading}
              outcomes={outcomes}
              seeded={seeded}
              seeding={seedMutation.isPending}
              onSignIn={startLogin}
              onSeed={seedMemoryBank}
              onAnalyze={() => navAction("incident")}
            />
          )}
          {section === "playbooks" && (
            <PlaybooksPage
              onTryScenario={id => {
                selectScenario(id);
                navAction("incident");
              }}
            />
          )}
          {section === "activity" && (
            <ActivityPage activity={activity} outcomes={outcomes} />
          )}
          {section === "usage" && (
            <Suspense
              fallback={
                <div className="audit-loading" role="status">
                  Loading audit dashboard…
                </div>
              }
            >
              <AuditUsageDashboard />
            </Suspense>
          )}

          <footer className="ro-footer">
            <span>
              RECALLOPS <i>·</i> INCIDENT RESPONSE THAT REMEMBERS
            </span>
            <span>
              Advisory only <i>·</i> Verify before acting <i>·</i> Synthetic
              demo data
            </span>
          </footer>
        </main>
      </div>
    </DashboardLayout>
  );
}

function EmptyAnalysis({ onAnalyze }: { onAnalyze: () => void }) {
  return (
    <div className="empty-analysis">
      <div className="empty-orbit">
        <div className="orbit-ring orbit-ring-outer" />
        <div className="orbit-ring orbit-ring-inner" />
        <div className="orbit-center">
          <Brain className="h-7 w-7" />
        </div>
        <span className="orbit-dot dot-a" />
        <span className="orbit-dot dot-b" />
        <span className="orbit-dot dot-c" />
      </div>
      <div className="panel-kicker text-center">READY TO INVESTIGATE</div>
      <h3>Give the incident its history.</h3>
      <p>
        RecallOps will search related postmortems, surface failed fixes, and
        build a cautious investigation plan—before anyone touches production.
      </p>
      <div className="empty-steps">
        <span>
          <i>1</i>Recall prior incidents
        </span>
        <span>
          <i>2</i>Review cited evidence
        </span>
        <span>
          <i>3</i>Confirm the outcome
        </span>
      </div>
      <button onClick={onAnalyze} className="text-link">
        Run analysis on this synthetic scenario{" "}
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function AnalysisLoading() {
  return (
    <div className="analysis-loading">
      <div className="loading-core">
        <Brain className="h-6 w-6" />
      </div>
      <p className="panel-kicker">RECALLOPS IS WORKING</p>
      <h3>Connecting the incident to prior experience</h3>
      <p className="loading-sub">
        Reading relevant postmortems, checking for failed fixes, and shaping a
        read-only plan.
      </p>
      <div className="loading-steps">
        <span className="done">
          <Check className="h-3.5 w-3.5" />
          Incident context normalized
        </span>
        <span className="active">
          <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
          Searching the memory bank
        </span>
        <span>
          <span className="step-circle" />
          Building hypotheses
        </span>
      </div>
    </div>
  );
}

function AnalysisView({
  analysis,
  showComparison,
  setShowComparison,
  onRecord,
}: {
  analysis: AnalysisResult;
  showComparison: boolean;
  setShowComparison: (value: boolean) => void;
  onRecord: () => void;
}) {
  const sourceLabel =
    analysis.memoryMode === "hindsight"
      ? "HINDSIGHT RECALL"
      : analysis.memoryMode === "fallback"
        ? "SYNTHETIC FALLBACK"
        : "SIMULATION MEMORY";
  return (
    <div className="analysis-result">
      <div className="panel-heading analysis-panel-heading">
        <div>
          <div className="panel-kicker">02 · INVESTIGATE</div>
          <h3>Evidence-informed plan</h3>
        </div>
        <span
          className={`confidence-chip confidence-${analysis.plan.confidence}`}
        >
          {analysis.plan.confidence} confidence
        </span>
      </div>
      <div
        className={`memory-source-banner memory-source-${analysis.memoryMode}`}
      >
        <Brain className="h-4 w-4" />
        <div>
          <strong>{sourceLabel}</strong>
          <span>
            {analysis.evidence.length
              ? `${analysis.evidence.length} relevant ${analysis.evidence.length === 1 ? "memory" : "memories"} · ${analysis.modelSource}`
              : "No matching memories found · using cautious baseline checks"}
          </span>
        </div>
      </div>
      {analysis.memoryNote && (
        <div
          className={`memory-note ${analysis.memoryMode === "fallback" ? "memory-note-warning" : ""}`}
        >
          <CircleHelp className="h-3.5 w-3.5 shrink-0" />
          {analysis.memoryNote}
        </div>
      )}
      {analysis.redactionApplied && (
        <div className="memory-note">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0" />A token-like string
          was redacted before external processing.
        </div>
      )}
      {showComparison && (
        <div className="memory-delta-card">
          <div className="memory-delta-head">
            <div className="delta-badge">
              <Network className="h-3.5 w-3.5" />
              MEMORY DELTA
            </div>
            <button
              onClick={() => setShowComparison(false)}
              className="quiet-toggle"
            >
              Hide comparison <X className="h-3 w-3" />
            </button>
          </div>
          <div className="delta-columns">
            <div>
              <span className="delta-label">WITHOUT MEMORY</span>
              <p>
                Start with the release diff, then inspect live error and
                dependency metrics.
              </p>
            </div>
            <div className="delta-arrow">
              <ArrowRight className="h-4 w-4" />
            </div>
            <div>
              <span className="delta-label delta-label-green">
                WITH {analysis.evidence.length ? "HISTORY" : "NO MATCHES"}
              </span>
              <p>
                {analysis.plan.hypotheses[0]?.title ??
                  "No historical pattern matched. Keep the investigation broad and gather fresh evidence."}
                {analysis.plan.hypotheses[0]?.evidenceIds?.[0] && (
                  <b> [{analysis.plan.hypotheses[0].evidenceIds[0]}]</b>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
      {!showComparison && (
        <button
          className="show-comparison"
          onClick={() => setShowComparison(true)}
        >
          <Network className="h-3.5 w-3.5" />
          Show before / after memory comparison
        </button>
      )}
      <div className="recommendation-section">
        <div className="recommendation-title">
          <span className="rec-index">A</span>
          <span>Hypotheses to verify</span>
          <span className="rec-caption">NOT CONFIRMED FACTS</span>
        </div>
        {analysis.plan.hypotheses.length ? (
          analysis.plan.hypotheses.map((item, index) => (
            <div
              className="recommendation-card hypothesis-card"
              key={`${item.title}-${index}`}
            >
              <div className="rec-card-icon">
                <LightbulbIcon />
              </div>
              <div className="rec-card-copy">
                <div className="rec-card-title">
                  {item.title}
                  <EvidenceRefs ids={item.evidenceIds} />
                </div>
                <p>{item.rationale}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-memory-state">
            <Network className="h-4 w-4" />
            <span>
              No historical pattern was strong enough to suggest a likely cause.
              Gather fresh evidence before narrowing the investigation.
            </span>
          </div>
        )}
      </div>
      <div className="recommendation-section checks-section">
        <div className="recommendation-title">
          <span className="rec-index rec-index-blue">B</span>
          <span>Read-only checks</span>
          <span className="rec-caption">SAFE TO OBSERVE</span>
        </div>
        {analysis.plan.readOnlyChecks.map((item, index) => (
          <div className="check-row" key={`${item.title}-${index}`}>
            <div className="check-icon">
              <Check className="h-3.5 w-3.5" />
            </div>
            <div className="check-copy">
              <strong>
                {item.title}
                <EvidenceRefs ids={item.evidenceIds} />
              </strong>
              <p>{item.rationale}</p>
            </div>
            <span className="read-only-tag">READ ONLY</span>
          </div>
        ))}
      </div>
      {analysis.evidence.length > 0 && (
        <div className="evidence-section">
          <div className="evidence-section-head">
            <div className="recommendation-title">
              <span className="rec-index rec-index-violet">C</span>
              <span>Supporting memory</span>
            </div>
            <span>
              {analysis.evidence.length} SOURCE
              {analysis.evidence.length === 1 ? "" : "S"}
            </span>
          </div>
          <div className="evidence-list">
            {analysis.evidence.slice(0, 4).map(item => (
              <div className="evidence-item" key={item.id}>
                <div className="evidence-id">[{item.id}]</div>
                <div>
                  <div className="evidence-source">
                    {item.source}
                    <span
                      className={`evidence-kind evidence-kind-${item.kind}`}
                    >
                      {item.kind === "hindsight"
                        ? "HINDSIGHT"
                        : item.kind === "browser-memory"
                          ? "HUMAN CONFIRMED"
                          : "SYNTHETIC"}
                    </span>
                  </div>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="analysis-caution">
        <ShieldAlert className="h-4 w-4 shrink-0" />
        <span>{analysis.plan.caution}</span>
      </div>
      <div className="analysis-actions">
        <div>
          <div className="panel-kicker">CLOSE THE LEARNING LOOP</div>
          <p>After the incident is resolved, confirm what actually happened.</p>
        </div>
        <Button onClick={onRecord}>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Record verified outcome
        </Button>
      </div>
    </div>
  );
}

function LightbulbIcon() {
  return <Sparkles className="h-4 w-4" />;
}

function EvidenceRefs({ ids }: { ids: string[] }) {
  if (!ids.length) return null;
  return (
    <span className="evidence-refs">
      {ids.slice(0, 3).map(id => (
        <span key={id}>[{id}]</span>
      ))}
    </span>
  );
}

function MemoryPage({
  live,
  authenticated,
  authLoading,
  outcomes,
  seeded,
  seeding,
  onSignIn,
  onSeed,
  onAnalyze,
}: {
  live: boolean;
  authenticated: boolean;
  authLoading: boolean;
  outcomes: StoredOutcome[];
  seeded: boolean;
  seeding: boolean;
  onSignIn: () => void;
  onSeed: () => void;
  onAnalyze: () => void;
}) {
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" />
            PERSISTENT EXPERIENCE <span className="eyebrow-dot">·</span>{" "}
            HINDSIGHT
          </div>
          <h1>Memory that earns trust.</h1>
          <p>
            Keep failed fixes and verified resolutions connected to their
            evidence.
          </p>
        </div>
        <div className="heading-aside">
          <StatusPill live={live} authenticated={authenticated} />
          <span className="text-[11px] text-slate-500">
            {live
              ? "One isolated bank per signed-in user"
              : "Saved browser memories stay on this device"}
          </span>
        </div>
      </div>
      <div className="memory-overview-grid">
        <div className="memory-stat-card">
          <div className="memory-stat-icon">
            <Brain className="h-4 w-4" />
          </div>
          <span className="memory-stat-label">MEMORY MODE</span>
          <strong>
            {live
              ? authenticated
                ? "Private bank"
                : "Sign in required"
              : "Simulation"}
          </strong>
          <span>
            {live
              ? "Hindsight API · isolated per user"
              : "Fictional examples + browser storage"}
          </span>
        </div>
        <div className="memory-stat-card">
          <div className="memory-stat-icon">
            <Database className="h-4 w-4" />
          </div>
          <span className="memory-stat-label">VISIBLE OUTCOMES</span>
          <strong>
            {live
              ? seeded
                ? DEMO_INCIDENTS.length
                : "—"
              : DEMO_INCIDENTS.length + outcomes.length}
          </strong>
          <span>
            {live
              ? seeded
                ? "Synthetic pack loaded"
                : "Load the demo pack to begin"
              : "Synthetic + human-confirmed, local"}
          </span>
        </div>
        <div className="memory-stat-card">
          <div className="memory-stat-icon">
            <Workflow className="h-4 w-4" />
          </div>
          <span className="memory-stat-label">LEARNING LOOP</span>
          <strong>Recall → verify → retain</strong>
          <span>New lessons change later retrieval</span>
        </div>
      </div>
      <div className="memory-callout">
        <div className="callout-mark">
          <Brain className="h-5 w-5" />
        </div>
        <div>
          <strong>
            Hindsight is the experience layer—not model retraining.
          </strong>
          <p>
            RecallOps retrieves relevant past incidents, gives them to the
            planner with source IDs, and retains verified postmortems after a
            human confirms the outcome. It never treats similarity as proof.
          </p>
        </div>
        <div className="callout-flow">
          <span>RETAIN</span>
          <ArrowRight className="h-3 w-3" />
          <span>RECALL</span>
          <ArrowRight className="h-3 w-3" />
          <span>REFINE</span>
        </div>
      </div>
      <div className="section-toolbar">
        <div>
          <div className="panel-kicker">MEMORY LIBRARY</div>
          <h2>Postmortems & lessons</h2>
          <p>Fictional examples are labelled; no customer data is present.</p>
        </div>
        <Button
          onClick={live && !authenticated ? onSignIn : onSeed}
          disabled={seeding || !live || authLoading}
          variant="outline"
          className="seed-button"
        >
          {seeding ? (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          ) : seeded ? (
            <Check className="mr-2 h-4 w-4" />
          ) : live && !authenticated ? (
            <Fingerprint className="mr-2 h-4 w-4" />
          ) : (
            <Database className="mr-2 h-4 w-4" />
          )}
          {seeded
            ? "Synthetic pack loaded"
            : live && !authenticated
              ? "Sign in for your private pack"
              : "Load synthetic pack into my bank"}
        </Button>
      </div>
      {live && !authenticated && (
        <div className="auth-required-banner">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <div>
            <strong>Your Hindsight bank is private</strong>
            <p>
              Sign in to load the synthetic starter memories into your isolated
              personal bank.
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={onSignIn}>
            Sign in
          </Button>
        </div>
      )}
      {!live && (
        <div className="simulation-explainer">
          <CircleHelp className="h-4 w-4 shrink-0" />
          <span>
            This preview is in <b>simulation mode</b>: the three fictional
            memories below are visible immediately; human-confirmed outcomes are
            saved only to this browser. Configure Hindsight to persist them.
          </span>
        </div>
      )}
      <div className="memory-list">
        {DEMO_INCIDENTS.map((item, index) => (
          <article className="memory-card" key={item.id}>
            <div className="memory-card-top">
              <div className="memory-index">0{index + 1}</div>
              <div className="memory-card-title">
                <div>
                  <span className="memory-incident-id">{item.id}</span>
                  <span className="memory-date">{item.occurred}</span>
                </div>
                <h3>{item.title}</h3>
                <span className="memory-service">
                  <Activity className="h-3 w-3" />
                  {item.service}
                </span>
              </div>
              <span className="memory-origin-tag">SYNTHETIC</span>
            </div>
            <div className="memory-card-body">
              <div>
                <span className="memory-line-label">WHAT HAPPENED</span>
                <p>{item.trigger}</p>
              </div>
              <div>
                <span className="memory-line-label memory-line-failed">
                  <X className="h-3 w-3" />
                  WHAT DIDN'T WORK
                </span>
                <p>{item.failedAction}</p>
              </div>
              <div>
                <span className="memory-line-label memory-line-success">
                  <Check className="h-3 w-3" />
                  VERIFIED RESOLUTION
                </span>
                <p>{item.resolution}</p>
              </div>
            </div>
            <div className="memory-lesson">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              <span>
                <b>LESSON:</b> {item.lesson}
              </span>
            </div>
          </article>
        ))}
      </div>
      {outcomes.length > 0 && (
        <>
          <div className="section-toolbar outcomes-toolbar">
            <div>
              <div className="panel-kicker">
                THIS BROWSER'S CONFIRMED OUTCOMES
              </div>
              <h2>Recently recorded</h2>
              <p>Simulation-only memories are local to this browser.</p>
            </div>
            <button onClick={onAnalyze} className="text-link">
              Test the learning loop <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="local-outcome-list">
            {outcomes.map(item => (
              <div className="local-outcome" key={item.id}>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <div>
                  <strong>
                    {item.service} · {item.rootCause}
                  </strong>
                  <p>{item.resolution}</p>
                </div>
                <span>{shortTime(item.savedAt)}</span>
              </div>
            ))}
          </div>
        </>
      )}
      <div className="ro-footer">
        <span>
          RECALLOPS <i>·</i> INCIDENT RESPONSE THAT REMEMBERS
        </span>
        <span>
          Advisory only <i>·</i> Verify before acting <i>·</i> Synthetic demo
          data
        </span>
      </div>
    </>
  );
}

function PlaybooksPage({
  onTryScenario,
}: {
  onTryScenario: (id: string) => void;
}) {
  const items = [
    {
      title: "Change before restart",
      tag: "CHECK THE DIFF",
      icon: GitBranch,
      text: "A restart that previously failed may only add noise. Compare the release and configuration delta with the incident window before considering recovery steps.",
      scenario: "checkout",
      color: "green",
    },
    {
      title: "Capacity math before DB tuning",
      tag: "READ-ONLY FIRST",
      icon: Database,
      text: "Estimate total possible connections as replicas × per-pod pool size. Compare with live DB metrics; do not change limits based on a historical pattern alone.",
      scenario: "database",
      color: "blue",
    },
    {
      title: "Verify secret version metadata",
      tag: "NEVER REVEAL VALUES",
      icon: Fingerprint,
      text: "After a credential rotation, compare secret-version identifiers and affected pod age. Do not print, copy, or paste credential values into an incident ticket.",
      scenario: "identity",
      color: "violet",
    },
  ];
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" />
            INVESTIGATION GUIDANCE <span className="eyebrow-dot">·</span>{" "}
            HUMAN-OWNED
          </div>
          <h1>Patterns, not procedures.</h1>
          <p>
            Reusable checks informed by history—never automatic remediation.
          </p>
        </div>
        <div className="heading-aside">
          <span className="quiet-chip">
            <ShieldCheck className="h-3.5 w-3.5" />
            Read-only by design
          </span>
        </div>
      </div>
      <div className="playbook-note">
        <AlertTriangle className="h-4 w-4" />
        <span>
          These examples are fictional training guidance. Confirm current
          telemetry and your team's runbook before taking action.
        </span>
      </div>
      <div className="playbook-grid">
        {items.map((item, index) => (
          <article
            className={`playbook-card playbook-${item.color}`}
            key={item.title}
          >
            <div className="playbook-top">
              <span className="playbook-icon">
                <item.icon className="h-5 w-5" />
              </span>
              <span className="playbook-num">PATTERN 0{index + 1}</span>
            </div>
            <span className="playbook-tag">{item.tag}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <div className="playbook-bottom">
              <span>Human decides · no actions run</span>
              <button onClick={() => onTryScenario(item.scenario)}>
                Try this scenario <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </article>
        ))}
      </div>
      <div className="playbook-bottom-note">
        <ShieldAlert className="h-4 w-4" />
        RecallOps does not connect to production systems, run shell commands,
        restart services, or change infrastructure.
      </div>
      <div className="ro-footer">
        <span>
          RECALLOPS <i>·</i> INCIDENT RESPONSE THAT REMEMBERS
        </span>
        <span>
          Advisory only <i>·</i> Verify before acting <i>·</i> Synthetic demo
          data
        </span>
      </div>
    </>
  );
}

function ActivityPage({
  activity,
  outcomes,
}: {
  activity: ActivityItem[];
  outcomes: StoredOutcome[];
}) {
  const combined = useMemo(
    () =>
      [
        ...activity,
        ...outcomes.map(item => ({
          id: item.id,
          title: `Lesson saved · ${item.service}`,
          detail: `Confirmed root cause: ${item.rootCause}`,
          createdAt: item.savedAt,
          kind: "outcome" as const,
        })),
      ]
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 30),
    [activity, outcomes]
  );
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" />
            AUDIT TRAIL <span className="eyebrow-dot">·</span> THIS WORKSPACE
          </div>
          <h1>Every lesson leaves a trace.</h1>
          <p>
            See what was recalled, what a human confirmed, and what entered
            memory.
          </p>
        </div>
        <div className="heading-aside">
          <span className="quiet-chip">
            <ShieldCheck className="h-3.5 w-3.5" />
            No automated changes
          </span>
        </div>
      </div>
      <div className="activity-summary">
        <div>
          <span className="activity-summary-icon">
            <Activity className="h-4 w-4" />
          </span>
          <span>
            <b>{combined.length}</b>
            <small>workspace events</small>
          </span>
        </div>
        <div>
          <span className="activity-summary-icon activity-summary-green">
            <CheckCircle2 className="h-4 w-4" />
          </span>
          <span>
            <b>{outcomes.length}</b>
            <small>local confirmed lessons</small>
          </span>
        </div>
        <div>
          <span className="activity-summary-icon activity-summary-violet">
            <Brain className="h-4 w-4" />
          </span>
          <span>
            <b>0</b>
            <small>automated remediations</small>
          </span>
        </div>
      </div>
      <div className="activity-panel">
        <div className="section-toolbar">
          <div>
            <div className="panel-kicker">RECENT ACTIVITY</div>
            <h2>Incident learning timeline</h2>
          </div>
          <span className="quiet-chip">
            <Clock3 className="h-3.5 w-3.5" />
            Most recent first
          </span>
        </div>
        {combined.length === 0 ? (
          <div className="activity-empty">
            <History className="h-7 w-7" />
            <h3>Nothing recorded yet</h3>
            <p>
              Run an incident analysis, then capture the human-confirmed outcome
              to begin the learning loop.
            </p>
          </div>
        ) : (
          <div className="activity-timeline">
            {combined.map(item => (
              <div
                className="activity-event"
                key={`${item.id}-${item.createdAt}`}
              >
                <div className={`event-dot event-${item.kind}`} />{" "}
                <div className="event-content">
                  <div className="event-title-row">
                    <strong>{item.title}</strong>
                    <span>{shortTime(item.createdAt)}</span>
                  </div>
                  <p>{item.detail}</p>
                  <span className={`event-type event-type-${item.kind}`}>
                    {item.kind === "analysis"
                      ? "ANALYSIS"
                      : item.kind === "seed"
                        ? "SYNTHETIC SEED"
                        : "HUMAN-CONFIRMED"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="audit-note">
        <ShieldCheck className="h-4 w-4" />
        Demo activity is stored in this browser. Hindsight-backed memory writes
        are server-side and available to future recalls from the configured
        bank.
      </div>
      <div className="ro-footer">
        <span>
          RECALLOPS <i>·</i> INCIDENT RESPONSE THAT REMEMBERS
        </span>
        <span>
          Advisory only <i>·</i> Verify before acting <i>·</i> Synthetic demo
          data
        </span>
      </div>
    </>
  );
}
