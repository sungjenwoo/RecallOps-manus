export type SessionValueStore = Pick<
  Storage,
  "getItem" | "setItem" | "removeItem"
>;

export const PENDING_DEMO_SEED_KEY = "recallops-pending-demo-seed-v1";
export const PENDING_DEMO_SEED_TTL_MS = 10 * 60 * 1000;

/** Queue only the explicit seed-button intent; never store account or provider data. */
export function queueDemoSeedOnLogin(
  storage: SessionValueStore,
  now = Date.now()
): boolean {
  try {
    storage.setItem(PENDING_DEMO_SEED_KEY, String(now));
    return true;
  } catch {
    return false;
  }
}

export function clearDemoSeedOnLogin(storage: SessionValueStore): void {
  try {
    storage.removeItem(PENDING_DEMO_SEED_KEY);
  } catch {
    // An unavailable session store cannot retain a seed intent.
  }
}

/** Consume the intent once, and only shortly after the OAuth round-trip. */
export function consumeDemoSeedOnLogin(
  storage: SessionValueStore,
  now = Date.now()
): boolean {
  let queuedAtValue: string | null;
  try {
    queuedAtValue = storage.getItem(PENDING_DEMO_SEED_KEY);
    if (queuedAtValue === null) return false;
    storage.removeItem(PENDING_DEMO_SEED_KEY);
  } catch {
    return false;
  }

  const queuedAt = Number(queuedAtValue);
  return (
    Number.isSafeInteger(queuedAt) &&
    queuedAt <= now &&
    now - queuedAt <= PENDING_DEMO_SEED_TTL_MS
  );
}
