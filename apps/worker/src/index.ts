import { createLlmProviderConfig, redactLlmProviderConfig } from "@stories/ai";

const llmProvider = redactLlmProviderConfig(createLlmProviderConfig());

console.log(
  JSON.stringify({
    event: "worker_bootstrap",
    service: "worker",
    llmProvider,
  }),
);
