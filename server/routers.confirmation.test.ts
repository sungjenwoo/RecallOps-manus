import { describe, expect, it } from "vitest";
import { saveOutcomeInputSchema } from "./routers";

const validOutcome = {
  incidentId: "INC-SYNTHETIC-1",
  service: "checkout-api",
  summary: "Fictional checkout errors followed a configuration change.",
  rootCause: "The human verified a worker concurrency mismatch.",
  failedActions: "A fictional retry did not help.",
  successfulResolution: "The human confirmed restoring the prior setting.",
  followUp: "Compare live metrics before applying this historical lesson.",
};

describe("human confirmation before outcome retention", () => {
  it("accepts an explicitly confirmed postmortem", () => {
    expect(
      saveOutcomeInputSchema.parse({ ...validOutcome, confirmed: true })
        .confirmed
    ).toBe(true);
  });

  it("rejects an unconfirmed or missing confirmation before the retain route", () => {
    expect(() =>
      saveOutcomeInputSchema.parse({ ...validOutcome, confirmed: false })
    ).toThrow();
    expect(() => saveOutcomeInputSchema.parse(validOutcome)).toThrow();
  });
});
