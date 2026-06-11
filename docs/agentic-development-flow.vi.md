# Agentic Development Flow

## 1. Mục tiêu

Repo này được setup để cả team và coding agents cùng làm việc theo một flow nhất quán:

- mọi thay đổi đi qua TDD
- các user flow quan trọng có E2E
- local và remote environment có command chuẩn để chạy, đọc log, verify, deploy
- git workflow dùng worktree để tránh đè nhau
- kiến thức bền vững được lưu vào memory
- CI phản ánh đúng chất lượng tối thiểu cần có trước khi merge

## 2. Các lớp của hệ thống

### Rules

Nằm ở `.codex/rules/`. Đây là guardrail của repo.

### Agents

Nằm ở `.codex/agents/`. Đây là các role chuyên trách để Codex hoặc con người phân vai tư duy.

### Skills

Nằm ở `.agents/skills/`. Đây là playbook tái sử dụng cho các workflow lặp lại.

### Scripts

Nằm ở `scripts/ops/`. Đây là các command chuẩn để vận hành repo.

### Memory

Nằm ở `.codex/memory/`. Đây là nơi lưu quyết định, bug pattern và environment notes.

### Specs, plans, runlogs

Nằm ở `docs/specs/`, `docs/plans/`, `docs/runlogs/`. Đây là lớp documentation vừa đủ cho các task không còn là sửa nhỏ.

## 3. Flow mặc định cho một task

1. Tạo worktree mới nếu task đủ lớn hoặc có thể chạy song song.
2. Đọc skill/rule liên quan.
3. Review `docs/plans/INDEX.md` và các plan cũ liên quan trước khi code.
4. Viết test fail trước.
5. Implement tối thiểu để test pass.
6. Chạy local verification.
7. Nếu đụng UI flow, thêm hoặc cập nhật E2E.
8. Nếu phát hiện kiến thức bền vững mới, ghi vào memory.
9. Nếu task đủ lớn, lưu spec/plan/runlog ngắn gọn.
10. Commit sau khi check pass.

## 4. Các command chính

- `pnpm dev:stack`
- `pnpm ops:logs -- --env local --service web --follow`
- `pnpm ops:verify -- local`
- `pnpm ops:ci`
- `pnpm ops:deploy -- staging`
- `pnpm ops:worktree:create -- codex/feat/my-task`
- `pnpm ops:memory:add -- decisions "..."`

## 5. Cách dùng environment config

1. Copy `.codex/environments.example.json` thành `.codex/environments.json`
2. Điền command deploy/logs/verify thật cho từng môi trường
3. Dùng toàn bộ flow qua `pnpm ops:*` thay vì gõ command rời rạc

## 6. Kỳ vọng khi dự án lớn dần

Flow này đủ nhẹ cho giai đoạn hiện tại, nhưng vẫn có chỗ để mở rộng:

- thêm smoke/full E2E split
- thêm preview/staging/prod verify sâu hơn
- thêm stricter hooks hoặc CI gates
- thêm domain-specific agents khi product logic bắt đầu dày lên
