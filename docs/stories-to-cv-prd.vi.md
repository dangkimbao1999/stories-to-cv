# Stories to CV PRD

## 1. Tóm tắt

Stories to CV là một sản phẩm giúp ứng viên xây dựng một knowledge base nghề nghiệp cá nhân thông qua hội thoại với AI, sau đó dùng knowledge base này để tạo CV tối ưu cho từng JD.

Điểm khác biệt cốt lõi của sản phẩm không nằm ở việc "rewrite CV", mà ở việc:

- Khai thác sâu trải nghiệm thật của người dùng
- Biến trải nghiệm đó thành dữ liệu có cấu trúc và tái sử dụng được
- Tạo output phù hợp với từng bối cảnh ứng tuyển
- Bảo vệ dữ liệu cá nhân như một tài sản riêng tư của người dùng

## 2. Bối cảnh và vấn đề

### Từ phía ứng viên

- Việc tối ưu CV theo từng JD tốn thời gian và lặp lại.
- Nhiều người có nhiều trải nghiệm giá trị nhưng không biết cách kể lại.
- CV hiện tại thường chỉ phản ánh phần nổi, thiếu context, impact và chiều sâu.
- Người dùng ngại chia sẻ nhiều nếu không tin vào mức độ bảo mật của hệ thống.

### Từ phía tuyển dụng

- ATS và AI screening khiến CV ngày càng bị đánh giá qua các tín hiệu tóm tắt.
- Recruiter không có thời gian đào sâu từng ứng viên.
- Những năng lực gián tiếp và transferable skills dễ bị bỏ lỡ.

## 3. Mục tiêu sản phẩm

### Mục tiêu chính

- Giúp người dùng tạo CV tailored nhanh hơn cho từng vị trí.
- Tạo ra CV phản ánh đúng hơn giá trị thật của ứng viên.
- Biến CV generation thành một bài toán truy xuất từ knowledge base, không phải viết lại từ đầu.

### Mục tiêu chiến lược

- Xây dựng nền tảng personal career knowledge base cho mỗi người dùng.
- Tạo kiến trúc mở để cộng đồng đóng góp domain knowledge theo từng ngành.
- Đặt trust, privacy và user control thành lợi thế cạnh tranh của sản phẩm.

## 4. Non-goals cho MVP

- Không xây full portfolio builder ngay ở giai đoạn đầu.
- Không làm social network cho ứng viên.
- Không cố gắng hỗ trợ mọi ngành nghề ngay từ ngày đầu.
- Không thay thế hoàn toàn việc chỉnh sửa tay của người dùng.

## 5. Người dùng mục tiêu

### Persona 1: Mid-level professional

- Có 2-10 năm kinh nghiệm
- Apply nhiều job tương tự nhau
- Muốn tối ưu CV nhanh nhưng vẫn có chiều sâu

### Persona 2: Career switcher

- Muốn chuyển ngành hoặc chuyển vai trò
- Cần map kinh nghiệm cũ sang yêu cầu mới
- Cần AI giúp kể lại transferable skills

### Persona 3: Senior / lead / manager

- Có nhiều trải nghiệm phức tạp và nhiều impact
- Khó nén giá trị chiến lược vào một CV ngắn
- Cần AI giúp ưu tiên thông tin đúng cách

## 6. Giá trị cốt lõi

### User value

- Kể chuyện một lần, tái sử dụng nhiều lần
- Có một knowledge base sống về sự nghiệp
- Tạo CV tốt hơn mà không phải bắt đầu lại liên tục
- An tâm vì dữ liệu nghề nghiệp được bảo vệ và người dùng giữ quyền kiểm soát

### Product value

- Tạo khác biệt với CV builder truyền thống
- Có thể mở rộng sang nhiều output khác ngoài CV
- Có nền tảng phù hợp để phát triển open-source domain packs

## 7. Giải pháp sản phẩm

Sản phẩm hoạt động theo 3 bước chính:

### Bước 1: Capture

AI trò chuyện với người dùng để khai thác:

- Career timeline
- Dự án và thành tựu
- Context, impact, trade-off, ownership
- Kỹ năng, công cụ, domain knowledge
- Mục tiêu nghề nghiệp và preference

### Bước 2: Structure

Hệ thống chuyển hội thoại thành knowledge base cá nhân gồm:

- Dữ liệu raw conversation
- Structured facts
- Summary và inferred insights
- Evidence và source trace

### Bước 3: Generate

Khi người dùng đưa JD, hệ thống sẽ:

- Phân tích yêu cầu vị trí
- Match với knowledge base người dùng
- Chọn chiến lược positioning
- Generate CV tailored cho job đó

## 8. User flow chính

### Flow A: Onboarding và build KB

1. User tạo tài khoản và hồ sơ cơ bản
2. User import CV cũ hoặc dữ liệu sẵn có
3. AI bắt đầu conversation để khai thác thêm
4. Hệ thống trích xuất fact và đề nghị user xác nhận
5. Knowledge base được hình thành

### Flow B: Generate CV theo JD

1. User paste JD hoặc link job post
2. Hệ thống phân tích JD và bối cảnh vai trò
3. Hệ thống truy xuất thông tin phù hợp từ KB
4. AI generate CV tailored
5. User review, chỉnh sửa, export

### Flow C: Reuse knowledge base

1. User quay lại với một JD khác
2. Hệ thống reuse KB sẵn có
3. AI tạo version CV mới nhanh hơn

## 9. Tính năng MVP

### Bắt buộc

- Sign up / login
- Hồ sơ người dùng cơ bản
- Upload CV cũ hoặc paste nội dung
- Chat với AI để khai thác thêm trải nghiệm
- Lưu knowledge base cá nhân
- Paste JD
- JD analysis cơ bản
- Generate ít nhất 1 CV tailored
- Editor để user chỉnh tay
- Export ra Markdown hoặc PDF

### Nên có nếu đủ nguồn lực

- Nhiều phiên bản CV cho cùng một JD
- ATS-oriented suggestions
- Fit summary giữa user và JD
- “Why this bullet exists” để giải thích nguồn gốc nội dung

## 10. Trust, Privacy, Security

Đây là yêu cầu cốt lõi, không phải tính năng phụ.

### Product principles

- Mặc định mọi knowledge base cá nhân là private.
- User sở hữu dữ liệu của mình.
- Mọi output được sinh ra phải có thể truy nguồn về dữ liệu người dùng đã cung cấp hoặc xác nhận.
- Dữ liệu người dùng không được hòa trộn vào tri thức cộng đồng nếu chưa có consent rõ ràng.
- Người dùng có quyền xem, sửa, xóa, export và thu hồi dữ liệu.

### MVP requirements

- Mã hóa dữ liệu ở trạng thái lưu trữ và truyền tải
- Phân tách dữ liệu người dùng với domain knowledge public
- Có consent rõ ràng cho import dữ liệu, generate output và chia sẻ
- Có cơ chế xóa tài khoản và xóa knowledge base
- Có export dữ liệu cơ bản để user mang đi nơi khác
- Có audit log nội bộ cho việc dữ liệu nào được dùng để tạo output nào

### Những điều không được thỏa hiệp

- Không dùng dữ liệu cá nhân cho huấn luyện hoặc chia sẻ chéo giữa users mà không có sự cho phép minh bạch
- Không mặc định public bất kỳ phần nào của KB
- Không tạo cảm giác “open source” đồng nghĩa với “dữ liệu người dùng bị mở”

## 11. Yêu cầu chức năng

### Conversation engine

- Biết hỏi follow-up
- Biết phát hiện thông tin còn thiếu
- Biết điều chỉnh độ sâu theo user persona
- Hạn chế câu hỏi generic và lặp lại

### Knowledge extraction

- Trích xuất timeline, project, achievement, skill, evidence
- Gắn source trace cho facts
- Tách fact với inference
- Có confidence score ở mức hệ thống nội bộ

### Job analysis

- Parse JD thành requirements chính
- Nhận diện keywords, seniority, domain, must-have
- Tóm tắt chiến lược fit cho user

### CV generation

- Sinh CV rõ ràng, ngắn gọn, phù hợp vai trò
- Ưu tiên evidence mạnh nhất từ KB
- Cho phép regenerate theo strategy khác
- Cho user chỉnh tay trước khi export

## 12. Yêu cầu phi chức năng

### Reliability

- Không làm mất dữ liệu conversation và KB
- Có versioning cơ bản cho CV output

### Explainability

- User hiểu được vì sao hệ thống tạo ra nội dung đó
- Fact và inference không bị trộn lẫn mơ hồ

### Extensibility

- Sẵn sàng để thêm domain packs
- Không hard-code logic theo một ngành duy nhất

### Security

- Data isolation theo từng user
- Access control rõ ràng
- Có chiến lược secret management và logging phù hợp

## 13. Kiến trúc cấp cao

### Ứng dụng lõi

- Auth
- Chat UI
- KB viewer/editor
- JD analyzer UI
- CV editor và export

### AI layer

- Conversational interviewer
- Knowledge extraction pipeline
- Retrieval từ KB cá nhân
- JD understanding
- Matching và positioning
- CV generation

### Data layer

- Personal profile store
- Structured KB store
- Conversation store
- Vector retrieval layer
- Domain knowledge registry

### Security layer

- Encryption
- Permission model
- Consent tracking
- Audit logging
- Delete/export workflow

## 14. Open source approach

Open source nên tập trung vào:

- Application core
- Prompt framework
- Schema
- Evaluator
- Domain packs
- Templates

Không open source dữ liệu cá nhân của người dùng. Kiến trúc cần làm rõ ranh giới giữa:

- Public community knowledge
- Private user knowledge
- User-consented shareable artifacts

## 15. Success metrics

### Product metrics

- Tỷ lệ hoàn thành onboarding conversation
- Số lượng fact hữu ích được thu thập trên mỗi user
- Tỷ lệ user generate CV sau khi build KB
- Số JD trung bình được reuse trên cùng một KB
- Tỷ lệ user quay lại để cập nhật knowledge base

### Outcome metrics

- User cảm thấy CV mới phản ánh bản thân tốt hơn
- Thời gian chuẩn bị một lần apply giảm
- Mức chỉnh sửa tay sau khi generate giảm
- Tỷ lệ interview callback tăng

### Trust metrics

- Tỷ lệ user hiểu được privacy controls
- Tỷ lệ user hoàn thành export/delete flow thành công
- Tỷ lệ complaint liên quan đến privacy thấp

## 16. Rủi ro chính

- User không kiên nhẫn với conversation dài
- AI khai thác chưa đủ sâu hoặc sai domain
- KB extraction sai làm ảnh hưởng toàn bộ output sau đó
- CV nghe tốt nhưng thiếu trung thực hoặc thiếu bằng chứng
- Sai sót về privacy hoặc data handling sẽ phá hỏng niềm tin sản phẩm rất nhanh

## 17. Câu hỏi mở

- Nên chọn domain đầu tiên nào để launch?
- Nên nghiên cứu công ty/JD tới mức nào trong MVP?
- Mức nào của explainability là đủ cho user nhưng không làm flow nặng?
- Có nên cho user chọn chế độ local-first hoặc self-hosted về dài hạn?
- Chuẩn đóng góp domain pack của cộng đồng sẽ được review như thế nào?

## 18. Đề xuất bước tiếp theo

### Product

- Chốt persona đầu tiên
- Chọn domain launch đầu tiên
- Viết hypothesis và test script cho 5-10 user interview

### Engineering

- Thiết kế schema cho personal knowledge base
- Thiết kế data boundary giữa private KB và public domain packs
- Xác định kiến trúc consent, delete, export và audit từ đầu

### Open source

- Viết manifesto
- Viết contribution guide
- Định nghĩa cấu trúc `domain-pack/*`

## 19. Kết luận

Stories to CV nên được xây như một hệ thống giúp người dùng sở hữu một lớp dữ liệu nghề nghiệp sống của riêng họ, nơi AI vừa giúp khai thác chiều sâu trải nghiệm, vừa giúp biến dữ liệu đó thành CV phù hợp với từng cơ hội.

Muốn sản phẩm này thực sự mạnh, cần coi `knowledge base quality` và `trust/privacy/security` là hai năng lực lõi phát triển song song ngay từ MVP.
