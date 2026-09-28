import { describe, expect, it } from "vitest";
import {
  clearDemoSeedOnLogin,
  consumeDemoSeedOnLogin,
  PENDING_DEMO_SEED_KEY,
  PENDING_DEMO_SEED_TTL_MS,
  queueDemoSeedOnLogin,
  type SessionValueStore,
} from "./pendingDemoSeed";

function createStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  const storage: SessionValueStore = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
    removeItem: key => {
      values.delete(key);
    },
  };
  return { storage, values };
}

describe("pending demo seed sign-in intent", () => {
  it("queues and consumes the explicit seed action only once", () => {
    const { storage, values } = createStorage();
    const queuedAt = 1_000_000;

    expect(queueDemoSeedOnLogin(storage, queuedAt)).toBe(true);
    expect(values.get(PENDING_DEMO_SEED_KEY)).toBe(String(queuedAt));
    expect(consumeDemoSeedOnLogin(storage, queuedAt + 1000)).toBe(true);
    expect(consumeDemoSeedOnLogin(storage, queuedAt + 1001)).toBe(false);
    expect(values.has(PENDING_DEMO_SEED_KEY)).toBe(false);
  });

  it("discards expired, future-dated, and malformed intents", () => {
    const now = 2_000_000;
    const expired = createStorage({
      [PENDING_DEMO_SEED_KEY]: String(now - PENDING_DEMO_SEED_TTL_MS - 1),
    });
    const future = createStorage({
      [PENDING_DEMO_SEED_KEY]: String(now + 1),
    });
    const malformed = createStorage({ [PENDING_DEMO_SEED_KEY]: "not-a-time" });

    expect(consumeDemoSeedOnLogin(expired.storage, now)).toBe(false);
    expect(consumeDemoSeedOnLogin(future.storage, now)).toBe(false);
    expect(consumeDemoSeedOnLogin(malformed.storage, now)).toBe(false);
    expect(expired.values.has(PENDING_DEMO_SEED_KEY)).toBe(false);
    expect(future.values.has(PENDING_DEMO_SEED_KEY)).toBe(false);
    expect(malformed.values.has(PENDING_DEMO_SEED_KEY)).toBe(false);
  });

  it("fails closed if session storage is unavailable", () => {
    const blockedStorage: SessionValueStore = {
      getItem: () => {
        throw new Error("storage blocked");
      },
      setItem: () => {
        throw new Error("storage blocked");
      },
      removeItem: () => {
        throw new Error("storage blocked");
      },
    };

    expect(queueDemoSeedOnLogin(blockedStorage)).toBe(false);
    expect(consumeDemoSeedOnLogin(blockedStorage)).toBe(false);
    expect(() => clearDemoSeedOnLogin(blockedStorage)).not.toThrow();
  });

  it("clears a queued action if sign-in cannot be started", () => {
    const { storage, values } = createStorage({
      [PENDING_DEMO_SEED_KEY]: "1000000",
    });

    clearDemoSeedOnLogin(storage);

    expect(values.has(PENDING_DEMO_SEED_KEY)).toBe(false);
  });
});
