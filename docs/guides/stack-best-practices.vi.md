# Stack Best Practices

## Next.js

- để business logic ra `packages/domain`, `packages/ai`, `packages/db`
- route handler chỉ nên làm orchestration mỏng
- tránh nhét prompt hoặc query phức tạp trực tiếp vào page/route

## Postgres + pgvector

- dùng Postgres làm nguồn dữ liệu chính
- chỉ thêm hạ tầng khác khi Postgres thật sự không đủ
- tách raw transcript, structured facts và generated artifacts

## Worker + pg-boss

- mọi tác vụ chậm hoặc có retry nên chuyển sang worker
- mỗi job nên có payload schema rõ ràng
- log step transition để debug được

## AI orchestration

- schema-first với `zod`
- input/output của mỗi bước phải rõ
- tách prompt khỏi UI và DB layer
- đánh giá quality bằng test fixture và eval dần dần

## Monorepo

- package boundary phải có ý nghĩa nghiệp vụ
- tránh vòng phụ thuộc giữa `domain`, `db`, `ai`, `ui`
- ưu tiên shared contracts thay vì copy type
