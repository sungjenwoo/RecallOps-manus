import { describe, expect, it } from "vitest";
import { TRPCError } from "@trpc/server";
import { resolveLiveMemoryAccess } from "./routers";
import { deriveActorHash, derivePrivateBankId } from "./recallops";

describe("private live memory access", () => {
  it("derives a stable opaque bank per user without exposing the OAuth identifier", () => {
    const secret = "test-only-stable-bank-secret";
    const first = derivePrivateBankId("oauth-user-alpha", secret);
    expect(first).toMatch(/^recallops-user-[a-f0-9]{32}$/);
    expect(first).toBe(derivePrivateBankId("oauth-user-alpha", secret));
    expect(first).not.toContain("oauth-user-alpha");
    expect(first).not.toBe(derivePrivateBankId("oauth-user-beta", secret));
    expect(deriveActorHash("oauth-user-alpha", secret)).toMatch(
      /^[a-f0-9]{64}$/
    );
  });

  it("keeps simulation mode public without assigning a live bank", () => {
    expect(resolveLiveMemoryAccess(null, false)).toBeNull();
  });

  it("rejects anonymous live memory access before any provider call", () => {
    try {
      resolveLiveMemoryAccess(null, true);
      throw new Error("Expected the live access guard to reject the request.");
    } catch (error) {
      expect(error).toBeInstanceOf(TRPCError);
      expect((error as TRPCError).code).toBe("UNAUTHORIZED");
    }
  });

  it("assigns authenticated users distinct private Hindsight banks", () => {
    const alpha = resolveLiveMemoryAccess(
      { openId: "oauth-user-alpha" },
      true,
      "test-only-secret"
    );
    const beta = resolveLiveMemoryAccess(
      { openId: "oauth-user-beta" },
      true,
      "test-only-secret"
    );
    expect(alpha?.bankId).not.toBe(beta?.bankId);
    expect(alpha?.actorHash).not.toBe(beta?.actorHash);
  });
});
