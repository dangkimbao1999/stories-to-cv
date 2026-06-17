# Industry Contexts

This directory owns industry context YAML artifacts used by backend/domain processing.

Each industry context file is a single source of truth for:

- industry workflows, metrics, stakeholders, tools, risks, and guardrails
- `conversationFollowUp` slots, triggers, completion criteria, and guardrails for that industry

Files here are not product documentation. Documentation in `docs/guides` should explain how to author these files, while runtime or backend code should load industry context artifacts from this package.

Use `template.yaml` as the copyable base for a new industry context. Use `software-engineer.yaml` as the reference example.
