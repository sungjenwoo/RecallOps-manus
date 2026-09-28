import { describe, expect, it } from "vitest";
import { ENV } from "./env";
import { sdk } from "./sdk";

describe("session verification", () => {
  it("requires the current app ID and accepts an empty display name", async () => {
    const previousAppId = ENV.appId;
    const previousCookieSecret = ENV.cookieSecret;
    ENV.appId = "recallops-session-test";
    ENV.cookieSecret = "test-only-session-secret-with-at-least-32-bytes";

    try {
      const validToken = await sdk.signSession({
        openId: "test-oauth-subject",
        appId: ENV.appId,
        name: "",
      });
      await expect(sdk.verifySession(validToken)).resolves.toEqual({
        openId: "test-oauth-subject",
        appId: "recallops-session-test",
        name: "",
      });

      const crossAppToken = await sdk.signSession({
        openId: "test-oauth-subject",
        appId: "another-application",
        name: "Test User",
      });
      await expect(sdk.verifySession(crossAppToken)).resolves.toBeNull();
    } finally {
      ENV.appId = previousAppId;
      ENV.cookieSecret = previousCookieSecret;
    }
  });
});
