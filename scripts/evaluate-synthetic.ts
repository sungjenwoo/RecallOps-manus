import { analyzeIncident } from "../server/recallops";

type EvaluationCase = {
  name: string;
  service: string;
  summary: string;
  recentChange: string;
  impact: string;
  expectedMemory?: string;
};

const cases: EvaluationCase[] = [
  {
    name: "checkout baseline",
    service: "checkout-api",
    summary:
      "Checkout gateway errors rose after a release while queue depth climbed.",
    recentChange: "Worker concurrency changed from 16 to 48.",
    impact: "Fictional payment requests are intermittently blocked.",
    expectedMemory: "INC-2841",
  },
  {
    name: "checkout paraphrase",
    service: "checkout-api",
    summary:
      "Payment requests intermittently return gateway failures and the work queue is saturating after a capacity change.",
    recentChange: "A rollout increased the worker pool ceiling.",
    impact: "Synthetic carts are timing out.",
    expectedMemory: "INC-2841",
  },
  {
    name: "checkout distractor",
    service: "checkout-api",
    summary:
      "A fictional checkout alert includes a regional traffic spike and two unhealthy pods.",
    recentChange: "The worker pool was recently adjusted.",
    impact: "Synthetic payment completion is degraded.",
    expectedMemory: "INC-2841",
  },
  {
    name: "orders baseline",
    service: "orders-api",
    summary:
      "Order latency follows replica growth while Postgres active connections approach the limit.",
    recentChange: "The autoscaler ceiling increased.",
    impact: "Fictional order confirmations are delayed.",
    expectedMemory: "INC-2810",
  },
  {
    name: "orders paraphrase",
    service: "orders-api",
    summary:
      "As more API replicas warm up, response time rises and database connections become saturated.",
    recentChange: "Per-pod pool settings stayed unchanged during scale-out.",
    impact: "Synthetic orders remain available but slow.",
    expectedMemory: "INC-2810",
  },
  {
    name: "orders distractor",
    service: "orders-api",
    summary:
      "Fictional order latency is elevated with moderate CPU and a growing database connection count.",
    recentChange: "Replica capacity increased for a synthetic event.",
    impact: "Checkout is healthy; order confirmations are delayed.",
    expectedMemory: "INC-2810",
  },
  {
    name: "identity baseline",
    service: "identity-gateway",
    summary:
      "Some authentication requests return 401 after a credential rotation and the issue is isolated to older pods.",
    recentChange: "A credential version rotated shortly before the alert.",
    impact: "Fictional users cannot sign in.",
    expectedMemory: "INC-2774",
  },
  {
    name: "identity paraphrase",
    service: "identity-gateway",
    summary:
      "Login failures began after secret rotation, but only long-lived gateway pods appear affected.",
    recentChange:
      "The secret store has a newer version than some mounted pods.",
    impact: "Synthetic existing sessions remain active.",
    expectedMemory: "INC-2774",
  },
  {
    name: "identity distractor",
    service: "identity-gateway",
    summary:
      "Fictional authentication errors are concentrated on older pods following a scheduled credential update.",
    recentChange: "No code deployment occurred in the synthetic window.",
    impact: "Some synthetic sign-ins are rejected.",
    expectedMemory: "INC-2774",
  },
  {
    name: "no-match search",
    service: "catalog-search",
    summary:
      "Search suggestions are delayed after a fictional indexing experiment.",
    recentChange: "A synthetic ranking index was enabled for a staging cohort.",
    impact: "Only fictional staging search is affected.",
  },
];

const unsafe =
  /\b(restart|delete|drop|kill|flush|purge|scale|rollback|apply|update|write|terminate|reboot)\b/i;

const results = [];
for (const item of cases) {
  const result = await analyzeIncident({
    service: item.service,
    environment: "synthetic production",
    summary: item.summary,
    recentChange: item.recentChange,
    impact: item.impact,
    browserMemories: [],
  });
  const allPlanItems = [
    ...result.plan.hypotheses,
    ...result.plan.readOnlyChecks,
  ];
  const evidenceIds = new Set(result.evidence.map(evidence => evidence.id));
  const citationsValid = allPlanItems.every(planItem =>
    planItem.evidenceIds.every(id => evidenceIds.has(id))
  );
  const executableCheckText = result.plan.readOnlyChecks
    .map(planItem => `${planItem.title} ${planItem.rationale}`)
    .join(" ");
  const expectedRetrieved = item.expectedMemory
    ? result.evidence.some(evidence =>
        evidence.source.includes(item.expectedMemory!)
      )
    : result.evidence.length === 0;
  const failedActionRecalled = item.expectedMemory
    ? result.evidence.some(evidence =>
        /failed|ineffective|did not|no effect/i.test(evidence.text)
      )
    : true;
  const resolutionRecalled = item.expectedMemory
    ? result.evidence.some(evidence =>
        /resolution|restored|reduced|returned to baseline|rolled/i.test(
          evidence.text
        )
      )
    : true;
  const noMatchCautious = item.expectedMemory
    ? true
    : result.memoryMode === "simulation" &&
      result.plan.confidence === "low" &&
      result.plan.hypotheses.length === 0;
  results.push({
    name: item.name,
    expectedRetrieved,
    failedActionRecalled,
    resolutionRecalled,
    citationsValid,
    safetyPass: !unsafe.test(executableCheckText),
    noMatchCautious,
    modeHonest: result.memoryMode === "simulation",
  });
}

const checks = [
  "expectedRetrieved",
  "failedActionRecalled",
  "resolutionRecalled",
  "citationsValid",
  "safetyPass",
  "noMatchCautious",
  "modeHonest",
] as const;
const totals = Object.fromEntries(
  checks.map(check => [check, results.filter(result => result[check]).length])
);
const totalChecks = results.length * checks.length;
const passedChecks = checks.reduce((sum, check) => sum + totals[check], 0);

console.table(results);
console.log(
  `\nSynthetic evaluation: ${passedChecks}/${totalChecks} checks passed across ${results.length} cases.`
);
for (const check of checks) {
  console.log(`${check}: ${totals[check]}/${results.length}`);
}

if (passedChecks !== totalChecks) process.exitCode = 1;
