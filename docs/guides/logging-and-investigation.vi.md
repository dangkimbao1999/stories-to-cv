# Logging and Investigation Guide

## Mục tiêu

Codex chỉ debug nhanh khi hệ thống để lại đủ dấu vết. Vì vậy logging không phải phần phụ.

## Logging cần có ở đâu

### Web/API

- request bắt đầu
- request kết thúc
- validation failure
- auth/permission failure
- external provider call nếu quan trọng

### Worker

- job enqueued
- job started
- step transition
- retry
- job failed
- job completed

### AI flows

- conversation session id
- extraction run id
- jd analysis id
- cv generation id
- provider/model name

## Identifier nên log

- `user_id`
- `conversation_id`
- `job_description_id`
- `cv_version_id`
- `worker_job_id`

## Quy trình investigate

1. Chốt environment: local / preview / staging / prod
2. Chốt symptom thật sự
3. Tìm identifier gần nhất
4. Xác định boundary đầu tiên bị hỏng
5. Đọc log theo timeline
6. Kiểm tra persisted record liên quan
7. Viết hypothesis ngắn
8. Verify hypothesis bằng test hoặc reproduce

## Command hữu ích

- `pnpm ops:logs -- --env local --service web --follow`
- `pnpm ops:logs -- --env local --service worker --follow`
- `pnpm ops:verify -- local`
- `pnpm ops:verify -- staging`
