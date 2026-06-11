# Testing Checklist

## Khi hoàn thành một task

### Nếu là feature mới

- Có unit/integration test cho business logic mới
- Có test fail trước khi implement
- Có E2E nếu user workflow thay đổi

### Nếu là bug fix

- Có regression test tái hiện bug
- Test fail trước fix và pass sau fix
- Nếu bug user-facing, cân nhắc thêm E2E hoặc mở rộng E2E hiện có

### Nếu là thay đổi AI flow

- Có test cho contract/schema/output parsing
- Có test cho orchestration logic nếu behavior đổi
- Có logging đủ để debug run sau này

### Nếu là DB/schema

- Có test ở repository/query layer khi behavior đổi
- Có xem lại ảnh hưởng lên extraction/retrieval/export

### Trước khi commit

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm test:e2e` nếu phù hợp
