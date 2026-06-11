# Start Development

## Mục tiêu

Guide này là điểm vào nhanh nhất để bắt đầu làm việc trong repo.

## Flow mặc định

1. Tạo worktree mới bằng branch đúng chuẩn.
2. Setup environment local.
3. Start database và app stack.
4. Kiểm tra health và logs.
5. Bắt đầu task với TDD.

## Branch và worktree

Dùng:

- `pnpm ops:worktree:create -- codex/feat/<slug>`
- `pnpm ops:worktree:create -- codex/fix/<slug>`
- `pnpm ops:worktree:create -- codex/chore/<slug>`

Ví dụ:

- `pnpm ops:worktree:create -- codex/feat/kb-schema`
- `pnpm ops:worktree:create -- codex/fix/export-timeout`

## Setup local

1. Cài Node.js 22+
2. `corepack enable`
3. `corepack prepare pnpm@10.12.4 --activate`
4. `pnpm install`
5. `docker compose up -d postgres`
6. Copy `.codex/environments.example.json` thành `.codex/environments.json`

## Chạy app

- `pnpm dev:stack`
- `pnpm ops:verify -- local`
- `pnpm ops:logs -- --env local --service web --follow`

## Trước khi commit

- `pnpm ops:ci`
- nếu có UI flow đổi: `pnpm test:e2e`

## Nếu task đủ lớn

Tạo thêm:

- `docs/specs/YYYY-MM-DD-<topic>.md`
- `docs/plans/YYYY-MM-DD-<topic>.md`
