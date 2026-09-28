export type DemoIncident = {
  id: string;
  service: string;
  title: string;
  occurred: string;
  trigger: string;
  failedAction: string;
  resolution: string;
  lesson: string;
};

/** Fictional incidents only. Never present these as customer or production data. */
export const DEMO_INCIDENTS: DemoIncident[] = [
  {
    id: "INC-2841",
    service: "checkout-api",
    title: "Checkout 502s after worker-pool change",
    occurred: "2026-09-12",
    trigger: "Release rc.16 raised WORKER_CONCURRENCY from 16 to 48. Gateway 502s rose while queue depth climbed.",
    failedAction: "Three rolling pod restarts did not reduce the error rate; the queue immediately saturated again.",
    resolution: "The on-call engineer rolled WORKER_CONCURRENCY back to 16 and waited for the queue to drain. Errors returned to baseline.",
    lesson: "On a similar checkout incident, compare the current concurrency/config diff and queue saturation before considering a restart. This is a prior pattern, not proof of the current cause.",
  },
  {
    id: "INC-2810",
    service: "orders-api",
    title: "Order latency from database pool exhaustion",
    occurred: "2026-08-27",
    trigger: "A new autoscaling ceiling multiplied each pod's default connection pool; Postgres active connections approached the configured limit.",
    failedAction: "Restarting the API reduced latency briefly, then saturation returned as replicas warmed up.",
    resolution: "The team reduced per-pod pool size, verified active connections with read-only metrics, and then gradually restored replica capacity.",
    lesson: "When latency tracks replica count, check total possible DB connections (replicas × pool size) before changing the database or restarting services.",
  },
  {
    id: "INC-2774",
    service: "identity-gateway",
    title: "Authentication failures after secret rotation",
    occurred: "2026-08-03",
    trigger: "A rotated credential was updated in the secret store, but a subset of long-lived pods still had the previous mounted value.",
    failedAction: "Retrying login requests increased noise but did not refresh the mounted credential.",
    resolution: "The team verified secret-version annotations and performed a controlled rollout after confirming the new version was available.",
    lesson: "For post-rotation auth failures, inspect secret version and pod age first. Do not print secret values or assume the identity provider is at fault.",
  },
];

export const DEMO_SCENARIOS = [
  {
    id: "checkout",
    label: "Checkout 502s",
    service: "checkout-api",
    environment: "production · eu-west-1",
    summary: "502 responses rose from 0.3% to 8.1% within five minutes of the latest release. Queue depth is climbing; two of six pods are failing readiness checks.",
    recentChange: "Release rc.17 raised WORKER_CONCURRENCY from 16 to 48.",
    impact: "Payments are intermittently blocked; customers can retry, but some carts are timing out.",
  },
  {
    id: "database",
    label: "Orders API latency",
    service: "orders-api",
    environment: "production · us-central-1",
    summary: "p95 latency climbed to 1.8s as the service scaled from 8 to 24 replicas. Postgres reports elevated active connections, while CPU remains moderate.",
    recentChange: "Autoscaler maximum increased from 12 to 30 replicas; per-pod pool settings were unchanged.",
    impact: "Order confirmations are delayed, but no data loss is observed.",
  },
  {
    id: "identity",
    label: "Identity 401s",
    service: "identity-gateway",
    environment: "production · ap-south-1",
    summary: "A subset of authentication requests began returning 401 after the scheduled credential rotation. The issue is isolated to older pods.",
    recentChange: "Credential version rotated 12 minutes before the alert; no code deployment occurred.",
    impact: "Some users cannot sign in. Existing sessions remain active.",
  },
] as const;
