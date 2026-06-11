# Stories to CV Solution Architecture

## 1. Mục tiêu kiến trúc

Kiến trúc cho dự án này nên tối ưu theo 5 tiêu chí:

- Nhỏ vừa đủ để team nhỏ và coding agent có thể hiểu nhanh
- Dễ phát triển và maintain
- Dễ deploy với chi phí thấp ở giai đoạn đầu
- Đủ an toàn cho dữ liệu nghề nghiệp nhạy cảm của người dùng
- Có đường nâng cấp rõ ràng khi product bắt đầu tăng usage

Ràng buộc hiện tại:

- CCU ban đầu thấp, khoảng 50 user đồng thời là hợp lý
- Chưa cần microservices
- Muốn làm theo hướng monorepo để agent và con người cùng dùng chung domain model
- Cần support AI conversation, personal knowledge base, JD analysis, CV generation và về sau là portfolio

## 2. Khuyến nghị tổng thể

### Kiến trúc khuyến nghị

Chọn một kiến trúc `modular monolith + worker`.

Nghĩa là:

- Một product app chính cho UI và synchronous request
- Một worker app cho các tác vụ async và tốn thời gian
- Shared packages cho domain, data, AI, security và contracts
- Một database Postgres làm trung tâm dữ liệu

Đây là điểm cân bằng tốt nhất giữa:

- tốc độ phát triển,
- đơn giản vận hành,
- và khả năng tách thành service riêng sau này nếu cần.

### Không nên làm ở giai đoạn đầu

- Không cần microservices
- Không cần Kafka
- Không cần Kubernetes
- Không cần vector database riêng như Pinecone/Qdrant ngay từ đầu
- Không cần LangChain hoặc workflow framework nặng nếu chưa thật sự cần

## 3. Stack đề xuất

## 3.1 Workspace và tooling

- `pnpm` cho workspace management
- `turbo` cho task orchestration trong monorepo
- `TypeScript` xuyên suốt toàn repo
- `Biome` cho format + lint
- `Vitest` cho unit/integration test
- `Playwright` cho e2e sau khi có UI đủ lớn

### Lý do chọn

- `pnpm + turbo` rất hợp với monorepo nhỏ đến vừa
- Nhanh, phổ biến, ít phức tạp hơn Nx trong giai đoạn đầu
- Dễ cho agent hiểu package boundaries và chạy task theo filter

## 3.2 Frontend và product app

- `Next.js` App Router
- `React 19`
- `Tailwind CSS`
- `shadcn/ui` hoặc bộ component nội bộ mỏng
- `ai` SDK cho chat streaming và structured UI interaction

### Lý do chọn

- Một app có thể làm cả web app, dashboard, authenticated UI và route handlers
- Phù hợp để ship nhanh các flow như onboarding, chat, KB editor, CV editor
- Dễ deploy trên Vercel

## 3.3 Backend application style

Không cần tách một backend framework riêng ngay từ đầu.

Khuyến nghị:

- Dùng `Next.js server actions` và `route handlers` cho sync flows
- Dùng `apps/worker` cho async flows

Chỉ khi product bắt đầu có nhu cầu public API lớn hoặc nhiều client khác nhau thì mới tách `apps/api`.

## 3.4 Database và storage

- `Postgres 16`
- `pgvector` cho embedding retrieval
- `Drizzle ORM` + `drizzle-kit`
- `Supabase` cho managed Postgres + Auth + Storage ở giai đoạn đầu

### Lý do chọn

- Postgres đủ để chứa structured KB, audit logs, raw transcripts, JD snapshots, CV versions và vector embeddings
- `pgvector` đủ tốt cho quy mô đầu tiên, không cần vector DB riêng
- `Supabase` giảm rất nhiều effort vận hành vì gộp:
  - database
  - auth
  - object storage
  - row-level security nếu cần áp dụng sâu hơn

## 3.5 Async jobs và workflows

- `pg-boss` cho background jobs
- `tsx` để chạy worker TypeScript đơn giản ở local/dev

### Job nào nên đưa sang worker

- Parse CV upload
- Extract facts từ conversation transcript
- Generate embeddings
- Research JD / company
- Generate nhiều version CV
- Export PDF / DOCX

### Lý do chọn

- `pg-boss` dùng chính Postgres, không cần thêm Redis
- Giảm bớt một hạ tầng phải vận hành
- Rất hợp với giai đoạn nhỏ nhưng vẫn scale được thêm worker process sau này

## 3.6 AI layer

- `ai` SDK làm abstraction layer
- `OpenAI` làm provider đầu tiên
- `zod` cho structured output schemas
- `promptfoo` cho evaluation khi hệ thống prompt bắt đầu nhiều lên

### Quan điểm triển khai

- Không dùng framework agent nặng ngay từ đầu
- Viết orchestration dưới dạng TypeScript modules có test
- Mỗi step AI nên có input/output schema rõ ràng

### Các module AI nên có

- `conversation-interviewer`
- `knowledge-extractor`
- `jd-analyzer`
- `positioning-engine`
- `cv-generator`
- `portfolio-generator` về sau

## 3.7 Security và privacy

- `packages/security` chứa policy và helper dùng chung
- Mã hóa các field nhạy cảm trước khi lưu nếu cần
- Audit log cho các hành động nhạy cảm
- Consent tracking cho import, export, sharing và model usage
- Tách private KB khỏi public domain knowledge

### Gợi ý cụ thể

- Dùng `Supabase Auth` hoặc magic link flow để giảm effort auth
- Giữ `service role` chỉ ở worker/backend
- Không expose raw transcript hoặc file upload qua client quá mức cần thiết
- Nếu cần field-level encryption, có thể thêm ở `packages/security` thay vì rải logic khắp app

## 3.8 Observability

- `Sentry` cho error tracking
- `PostHog` cho product analytics
- Logging có structured fields theo:
  - user_id
  - conversation_id
  - job_description_id
  - cv_version_id
  - worker_job_id

## 4. Repo structure khuyến nghị

```text
apps/
  web/
  worker/
packages/
  ai/
  contracts/
  db/
  domain/
  security/
  ui/
docs/
.codex/
```

## 4.1 Vai trò từng phần

### `apps/web`

Chứa:

- landing page
- auth flow
- onboarding
- chat UI
- KB editor
- JD analyzer UI
- CV editor
- portfolio UI sau này

### `apps/worker`

Chứa:

- ingestion jobs
- extraction jobs
- embedding jobs
- research jobs
- export jobs
- nightly maintenance jobs nếu có

### `packages/domain`

Chứa ngôn ngữ nghiệp vụ:

- UserProfile
- CareerEvent
- Project
- Achievement
- Skill
- KnowledgeFact
- JobDescription
- CVVersion
- ConsentPolicy

Đây là package quan trọng nhất cho agentic coding vì mọi app đều phải nói cùng một ngôn ngữ.

### `packages/contracts`

Chứa:

- zod schema cho input/output
- DTO dùng giữa web và worker
- schema cho AI structured outputs

### `packages/db`

Chứa:

- Drizzle schema
- migration
- repository helpers
- query helpers cho retrieval

### `packages/ai`

Chứa:

- prompt definitions
- orchestrators
- evaluation fixtures
- retrieval composition
- structured output parsers

### `packages/security`

Chứa:

- consent helpers
- redaction helpers
- audit event types
- data classification helpers
- encryption wrapper nếu cần

### `packages/ui`

Chứa shared UI primitives và form patterns. Không nên đưa business logic nặng vào đây.

## 5. Kiến trúc dữ liệu cấp cao

## 5.1 Bảng chính

- `users`
- `profiles`
- `conversations`
- `conversation_messages`
- `knowledge_facts`
- `knowledge_fact_sources`
- `projects`
- `career_events`
- `skills`
- `artifacts`
- `job_descriptions`
- `company_research_snapshots`
- `cv_versions`
- `consents`
- `audit_logs`
- `embeddings`

## 5.2 Nguyên tắc dữ liệu

- Tách raw transcript khỏi structured facts
- Fact phải có source trace
- Inference cần trạng thái `proposed` hoặc `confirmed`
- Mọi output CV cần biết nó được sinh từ facts nào
- Dữ liệu người dùng phải xóa/export được

## 6. Deployment khuyến nghị

## 6.1 Setup giai đoạn đầu

### Option khuyến nghị nhất

- `Vercel` cho `apps/web`
- `Railway` hoặc `Fly.io` cho `apps/worker`
- `Supabase` cho Postgres + Auth + Storage

### Tại sao đây là option tốt nhất

- Dễ setup
- Ít DevOps burden
- Đủ tốt cho 50 CCU và workload ban đầu
- Dễ scale dần bằng cách tăng worker replica hoặc nâng compute plan

## 6.2 Setup local

- `docker compose up -d postgres`
- App web chạy local
- Worker chạy local
- Có thể dùng một Supabase dev project từ sớm thay vì self-host toàn bộ Supabase local để giảm complexity

## 6.3 Khi nào cần nâng cấp kiến trúc

Chỉ cân nhắc tách thêm service khi có tín hiệu rõ ràng như:

- export PDF gây block worker quá nhiều
- research jobs tăng mạnh và cần rate limiting riêng
- có public API cho bên thứ ba
- có nhiều loại client khác ngoài web app
- RAG/retrieval bắt đầu cần tối ưu rất sâu

## 7. Cách setup dự án theo giai đoạn

## 7.1 Phase 0: Repo bootstrap

Tạo:

- workspace root
- shared TypeScript config
- lint/format/test tooling
- `apps/web`
- `apps/worker`
- `packages/*`
- docs nền tảng
- `AGENTS.md` cho Codex

## 7.2 Phase 1: Product skeleton

Xây:

- auth
- profile
- conversation UI
- conversation persistence
- basic KB extraction pipeline
- JD input
- first CV generation flow

## 7.3 Phase 2: Reliability and trust

Thêm:

- consent screen
- audit logs
- delete/export flow
- source trace UI
- quality evaluation cho extraction và CV

## 7.4 Phase 3: Scale features

Thêm:

- domain packs
- deeper company research
- portfolio generation
- multiple output templates

## 8. Tại sao setup này hợp với agentic coding

- Monorepo giúp agent nhìn được toàn bộ nghiệp vụ
- Shared packages làm rõ ranh giới và tái sử dụng
- `packages/domain` giúp mọi phần dùng cùng ngôn ngữ
- `packages/contracts` giảm tình trạng mỗi nơi hiểu dữ liệu một kiểu
- `apps/web` và `apps/worker` đủ tách biệt để song song hóa công việc, nhưng chưa tạo overhead microservices

## 9. Gợi ý stack cuối cùng nên chọn

Nếu chốt một stack duy nhất để bắt đầu, mình khuyên:

- `pnpm + turbo`
- `Next.js + React + Tailwind`
- `Supabase + Postgres + pgvector`
- `Drizzle ORM`
- `pg-boss`
- `ai` SDK + `OpenAI`
- `Biome + Vitest + Playwright`
- `Vercel + Railway/Fly.io`

Đây là stack cân bằng tốt giữa:

- tốc độ ship,
- chi phí vận hành,
- trải nghiệm dev,
- độ thân thiện với agentic coding,
- và khả năng scale vừa phải về sau.

## 10. Bước tiếp theo nên làm ngay

1. Khởi tạo `apps/web` bằng Next.js
2. Thêm `packages/domain`, `packages/contracts`, `packages/db`
3. Thiết kế schema DB cho personal knowledge base
4. Dựng auth + conversation persistence trước
5. Tạo worker để chạy extraction jobs
6. Chỉ thêm research, export, portfolio sau khi flow KB -> CV đã chạy tốt
