# App Foundation V1 Implementation Plan

> For future Codex work: read related plans in `docs/plans/` before implementation. Use this file as the baseline plan for the first product foundation pass.

**Goal:** Build the first application foundation for Stories to CV around two core surfaces: `Knowledge Base` and `Generate CV`. The implementation must support Google login, first-login onboarding, conversation-based knowledge capture, explicit user-controlled promotion of chat sessions into knowledge base assets, JD intake, and template-based CV generation.

**Architecture:** A single product shell with two main areas after login. `Knowledge Base` is driven by chat sessions plus curated knowledge assets. `Generate CV` is driven by JD intake, company/JD findings, refinement chat, and template-based CV rendering. Raw chat history, curated KB assets, domain starter content, uploaded files, JD snapshots, and CV outputs are all separate first-class concepts in the data model.

**Tech stack direction:** Next.js app shell, Google auth, Postgres + pgvector, worker-based ingestion/extraction, structured AI orchestration, template-driven CV rendering, and data-driven domain/question content rather than hard-coded prompt trees.

**Reference docs:**
- Product concept: [docs/stories-to-cv-product-concept.vi.md](C:\Users\dangk\Documents\stories-to-cv\docs\stories-to-cv-product-concept.vi.md)
- PRD: [docs/stories-to-cv-prd.vi.md](C:\Users\dangk\Documents\stories-to-cv\docs\stories-to-cv-prd.vi.md)
- Solution architecture: [docs/solution-architecture.vi.md](C:\Users\dangk\Documents\stories-to-cv\docs\solution-architecture.vi.md)

---

## Product Flow To Implement

## 1. Authentication and first-login onboarding

### Desired flow

- Users sign in with Google.
- If the user signs in for the first time:
  - show a short onboarding survey
  - use checkbox/select style inputs
  - initial examples: usage goal, age range
  - allow more fields to be added later without redesigning the model

### Implementation requirements

- Google must be the initial auth provider.
- Auth identity must be separate from user profile data.
- Onboarding answers must not live only in UI state.
- The onboarding questionnaire must be schema-driven and extendable.

---

## 2. Post-login application shell

### Desired flow

- The main application screen has two sections:
  - left: navigation bar
  - right: content area

### Initial nav sections

- `Knowledge Base`
- `Generate CV`

### Implementation requirements

- Build a stable shell layout that can later host more sections.
- Keep routing and access control simple and explicit from the start.

---

## 3. Knowledge Base area

### Desired flow

The main content area shows previous chat sessions.

Each session can be:

- a normal chat session
- or a session selected as knowledge base material

Selected knowledge-base sessions must show a small visible indicator.

The core product rule is:

- not every chat session should automatically enter the knowledge base
- users must control which sessions become trusted knowledge input

### User actions

- browse previous sessions
- start a new session
- open an existing session
- select or unselect a session as knowledge-base input
- save the session conclusion into the knowledge base

### Implementation requirements

- `chat_session` must be a first-class entity.
- The knowledge base must not simply equal the full chat history.
- A clear relation or state flag must define whether a session contributes to KB.
- The system must support end-of-session summary/conclusion generation as a reusable knowledge asset.

---

## 4. Start new session flow

### Desired flow

When users start a new session:

1. select an industry/domain
2. select skills or topics they want to talk about
3. use that selection as the starting context
4. the AI opens the conversation first

Example:

- if the user selects `AI Engineer`
- the AI may open with something like:
  - "How many years of AI experience do you have so far?"

### Implementation requirements

- Each session must store `industry`, `skills`, and `conversation intent`.
- The AI opener must not be fully hard-coded in application code.
- The system needs a content model for:
  - domain packs
  - starter questions
  - follow-up question strategies

---

## 5. Domain knowledge and question system

### Desired flow

Industry/domain knowledge and question sets will be updated frequently.

They should not be:

- fixed permanently in code
- tightly coupled to one role only

### Implementation requirements

- Design a database-backed or registry-backed model for:
  - domains
  - role archetypes
  - skill clusters
  - starter questions
  - follow-up question strategies
- Support active/inactive content and versioning where practical.
- Keep the model ready for future admin or community updates.

---

## 6. File ingestion into conversation

### Desired flow

In addition to plain chat, users can upload text-based documents such as:

- `.docx`
- `.pdf`
- `.md`
- plain text files

These files provide starting knowledge so users do not need to tell everything from scratch.

### Implementation requirements

- Uploaded files must be first-class entities.
- Build an ingestion flow for:
  - upload
  - text extraction
  - attachment to session
  - marking the file as source material
- Support source trace from knowledge facts back to uploaded files.

---

## 7. Save session to knowledge base

### Desired flow

Users can chat for as long as they want.

Once they are satisfied with a session:

- they click `Save to my knowledge base`
- the AI generates the strongest conclusion or summary from that conversation
- that conclusion is stored as a knowledge-base asset about the user

### Implementation requirements

- Sessions need explicit states such as:
  - `draft`
  - `active`
  - `reviewed`
  - `selected_for_kb`
- A KB asset must not be just raw transcript data. It should include:
  - summary
  - extracted facts
  - curated conclusion
  - source trace
- The model must clearly separate:
  - raw conversation
  - structured facts
  - curated knowledge-base output

---

## 8. Generate CV area

### Desired flow

The `Generate CV` section:

- stores previously generated CVs
- provides a button to generate a new CV

### Implementation requirements

- CV generation sessions need their own lifecycle.
- CV history must be queryable and visible.
- Output versions must be stored, not overwritten.

---

## 9. Start new CV generation flow

### Desired flow

The first step allows the user to:

- upload a JD as a text-based file
- or paste a JD link

After that:

- the AI summarizes company and role findings
- the AI proposes a CV generation direction
- the user can chat to refine it
- the AI can ask for any missing user info such as:
  - workplace history
  - phone number
  - email
  - other missing profile details

When the user is satisfied:

- they click `Generate CV`

### Implementation requirements

- JD intake must support:
  - raw text
  - uploaded file
  - URL
- The system needs dedicated objects for:
  - JD snapshot
  - company/JD findings summary
  - missing-info checklist
  - generation strategy discussion

---

## 10. CV output and template handling

### Desired flow

- Multiple CV templates will exist later.
- For V1, build one simple template first.
- Generated output must follow the chosen template layout.

### Implementation requirements

- Separate content generation from template rendering.
- Treat CV templates as first-class concepts.
- Store both:
  - structured CV content
  - rendered template output
- Keep template V1 simple but expandable into a multi-template system later.

---

## Data Model Implications

## Core entities

- `users`
- `auth_identities`
- `profiles`
- `onboarding_forms`
- `onboarding_responses`
- `chat_sessions`
- `chat_messages`
- `session_tags`
- `session_sources`
- `uploaded_documents`
- `document_extractions`
- `knowledge_assets`
- `knowledge_facts`
- `knowledge_fact_sources`
- `domains`
- `domain_skill_clusters`
- `domain_question_sets`
- `job_descriptions`
- `job_description_sources`
- `company_research_snapshots`
- `cv_generation_sessions`
- `cv_versions`
- `cv_templates`
- `consents`
- `audit_logs`

## Important modeling rules

- A `chat_session` must not automatically become knowledge base data.
- A `knowledge_asset` is created only from a user-chosen session.
- A `knowledge_asset` must include summary/conclusion plus source trace.
- Domain questions must be data-driven.
- CV templates must be separate from CV content.
- JD input must be stored as a reproducible snapshot.

## Privacy implications

- Every chat session is private by default.
- Sessions enter the knowledge base only via explicit user action.
- Uploaded documents must be treated as sensitive data.
- AI-generated conclusions must remain traceable back to source sessions/documents.

---

## Risks

- If session data is modeled as KB by default, the knowledge base will become noisy very quickly.
- If question logic is hard-coded, domain-pack expansion will be painful.
- If CV generation does not separate strategy, content, and template rendering, template expansion will become messy.
- If file ingestion lacks source trace, KB reliability will degrade.
- If onboarding is modeled too rigidly, later survey expansion will be painful.

---

## Implementation Phases

## Phase 1: Auth, shell, and KB session foundation

**Deliverables:**
- Google login
- first-login survey
- shell layout with navbar + content area
- KB session list
- create/open session flow
- session metadata for domain, skills, and KB selection state

**Verification:**
- login works
- first-time users see onboarding
- returning users are not forced through onboarding again
- users can create and reopen sessions
- KB indicator behaves correctly

## Phase 2: Conversation, file ingestion, and save-to-KB

**Deliverables:**
- AI opener based on selected domain/skills
- conversation persistence
- upload for doc/pdf/md/text
- text ingestion into session
- save session to KB
- generated KB conclusion

**Verification:**
- AI opens with context-aware questions
- sessions can contain both chat and uploaded sources
- saving to KB produces a distinct knowledge asset with traceable source material

## Phase 3: Generate CV foundation

**Deliverables:**
- CV history list
- start-new-generation flow
- JD input via text, file, and link
- company/JD findings summary
- refinement chat loop
- missing-info collection
- generate CV action
- simple CV template V1

**Verification:**
- the generation flow runs end to end
- rendered output follows the selected template layout
- generation session history is persisted

## Phase 4: Hardening

**Deliverables:**
- audit log
- consent flow
- stronger source-trace UX
- regression coverage
- E2E coverage for:
  - KB flow
  - CV generation flow

---

## Execution Steps

1. Finalize the schema foundation around the core rule: `session != KB`.
2. Design the content registry for `domains`, `skills`, and `question sets`.
3. Build auth, onboarding, and the application shell.
4. Build the KB session flow first.
5. Add file ingestion and save-to-KB behavior.
6. Build the CV generation flow after the KB foundation is stable.
7. Harden the system with logging, auditability, privacy controls, and E2E coverage.

---

## Verification

- The schema plan must accurately represent `chat_session`, `knowledge_asset`, `cv_generation_session`, `cv_template`, and `question_set`.
- The product flow above must map cleanly to concrete entities and future routes/screens.
- This plan should be the baseline input for follow-up plans covering:
  - DB/schema foundation
  - frontend app flow foundation
  - AI orchestration foundation
