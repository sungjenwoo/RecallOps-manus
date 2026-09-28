import { runAgentCoordinatorEvaluation } from "../server/agents/evaluation";

const confirmationFlag = "--confirm-live";
const configuredApiKey = process.env.GROQ_API_KEY?.trim() ?? "";

if (process.argv.includes("--help")) {
  console.log(
    "Usage: pnpm eval:agents -- --confirm-live\n" +
      "Runs 7 sequential synthetic-only Groq requests (maximum 21,000 completion tokens). " +
      "No Hindsight access, production data, prompts, or model responses are stored or printed."
  );
} else if (!process.argv.includes(confirmationFlag)) {
  console.log(
    "Dry run only: no provider requests were made. Review the seven-case synthetic evaluation, " +
      `then rerun with ${confirmationFlag} to send it to Groq.`
  );
} else if (!configuredApiKey) {
  console.error("GROQ_API_KEY is required; no provider request was made.");
  process.exitCode = 2;
} else {
  runAgentCoordinatorEvaluation({
    apiKey: configuredApiKey,
    model: process.env.GROQ_MODEL?.trim() || "openai/gpt-oss-120b",
  })
    .then(report => {
      console.log(JSON.stringify(report, null, 2));
      if (!report.safetyGatePassed) process.exitCode = 1;
    })
    .catch(() => {
      console.error(
        "Agent evaluation failed. Check provider configuration and rerun; raw requests and responses were not recorded."
      );
      process.exitCode = 1;
    });
}
