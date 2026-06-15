---
name: commit-and-pr-writing
description: |
  Write durable commit messages, draft PR descriptions, and git handoff summaries for Stories to CV. Use when Codex is asked to commit changes, draft or update a pull request, prepare a PR body, summarize a diff for review, or explain what changed so future agents can quickly understand the history.
---

# Commit and PR Writing

## Overview

Write for the next person who has only `git log`, the PR, and the diff. Capture why the change exists, what changed, how it was verified, and any follow-up or risk that future work should know.

## Before Writing

- Inspect the actual diff with `git diff --stat` and `git diff`.
- Check staged content separately with `git diff --cached` when writing a commit message.
- Prefer facts from the diff over assumptions from conversation.
- Mention sensitive-data handling when the change touches resumes, job descriptions, transcripts, generated CVs, auth, consent, audit, redaction, or storage boundaries.
- Keep unrelated local changes out of the message.

## Commit Messages

Use Conventional Commit style:

```text
<type>(optional-scope): <imperative summary>

Why:
- <reason this change was needed>

What:
- <important implementation or content changes>
- <contract/schema/migration/user-flow impact when relevant>

Verified:
- <commands or checks run>
```

Guidelines:

- Use the subject to describe the user-visible or repo-visible outcome, not the editing activity.
- Use the body for changes that future agents would otherwise need to rediscover.
- Include verification in the body for non-trivial changes.
- If no verification ran, say so plainly in `Verified` and give the reason.
- Avoid vague subjects such as `update files`, `fix stuff`, `changes`, or `wip`.

## Draft PR Descriptions

Draft PRs should be easy to scan and useful months later. Use this shape unless the repository provides a stricter template:

```markdown
## Summary
- <what changed>
- <why it changed>

## Verification
- <command/check and result>

## Notes
- <risks, decisions, migrations, privacy impact, or follow-up>
```

Omit `Notes` only when there is genuinely nothing useful to record.

## Quality Bar

- A future Codex session can answer "what happened here?" from the commit and PR without re-reading the whole conversation.
- The message names durable concepts from this repo, such as knowledge base, CV generation, worker jobs, contracts, audit, consent, or redaction when they are relevant.
- The wording distinguishes implementation details from product behavior.
- The verification section is specific enough to repeat.
