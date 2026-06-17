# Hướng Dẫn Tạo Industry Context

Industry context là một file kiến thức giúp chatbot hiểu cách một ngành vận hành để hỏi tiếp tốt hơn trong cuộc trò chuyện nghề nghiệp. File này vừa mô tả ngành, vừa định nghĩa `conversationFollowUp` cho ngành đó. Không tạo follow-up riêng ở nơi khác, vì cách khai thác câu chuyện của software engineer, banker, sales, nurse, hay designer đều khác nhau.

Mục tiêu quan trọng nhất: giúp người dùng kể nhiều hơn, cụ thể hơn, và trung thực hơn. Chatbot phải biết đang thiếu mảnh nào của câu chuyện, nên hỏi câu tiếp theo ra sao, và khi nào phải dừng lại để xác nhận thay vì suy diễn.

## Nguyên Tắc

- Knowledge base cá nhân của người dùng là nguồn sự thật.
- Industry context chỉ dùng để hỏi tốt hơn, hiểu thuật ngữ, và đề xuất framing dưới dạng giả thuyết cần xác nhận.
- Không tự bịa employer, metric, tool, regulation, trách nhiệm, scope, seniority, hoặc achievement.
- Mỗi câu hỏi follow-up chỉ nên khai thác một mảnh còn thiếu.
- Luôn tách `team outcome` khỏi `personal contribution` trước khi lưu career fact.
- Follow-up phải tùy theo ngành. Một ngành có workflow, risk, stakeholder, metric, và bằng chứng riêng thì phải có slot và trigger riêng.
- Guardrail là bắt buộc. Nếu file khiến AI dễ ép người dùng nhận vơ thành tựu thì file chưa đạt.

## Khi Nào Cần Tạo Industry Context

Tạo file mới khi nhóm người dùng mục tiêu có workflow, metric, stakeholder, risk, hoặc cách chứng minh thành tựu riêng. Ví dụ: fintech cần hỏi về KYC, fraud, auditability; software engineering cần hỏi về system boundary, production reliability, code ownership, latency, test coverage; healthcare cần hỏi về patient safety và clinical workflow.

Không tạo file mới nếu khác biệt chỉ là tên công ty, tên sản phẩm, hoặc một bộ kỹ năng nhỏ có thể nằm trong role context.

## Cấu Trúc File

Một industry context hoàn chỉnh gồm hai phần trong cùng một YAML:

- `industry context`: ngành tạo giá trị thế nào, workflow nào quan trọng, metric nào thường dùng, stakeholder nào liên quan, rủi ro nào cần tránh suy diễn.
- `conversationFollowUp`: chatbot nên hỏi tiếp thế nào để người dùng kể rõ scope, đóng góp cá nhân, bối cảnh ngành, impact, stakeholder, evidence, và reflection.

Không dùng file follow-up riêng. Nếu một ngành cần follow-up khác, sửa hoặc tạo industry context khác.

## Quy Trình Soạn

1. Xác định ranh giới ngành.
   Viết `summary` trả lời: ngành này tạo giá trị gì, vận hành qua workflow nào, và có constraint gì đặc thù.

2. Liệt kê business model.
   Chọn các model giúp AI hiểu động lực kinh doanh, ví dụ subscription, marketplace, payments, managed services, infrastructure, consulting.

3. Liệt kê core workflow.
   Mỗi workflow nên là chuỗi công việc mà nhiều role có thể tham gia. Với software engineer, workflow có thể là feature delivery, backend service development, reliability, quality automation, technical debt modernization.

4. Gắn metric vào workflow.
   Metric nên là thứ người dùng có thể từng ảnh hưởng hoặc quan sát. Tránh metric quá xa công việc cá nhân nếu dễ làm AI suy diễn ownership.

5. Liệt kê stakeholder.
   Bao gồm end users, customers, internal teams, product, design, QA, security, operations, leadership, vendors, regulators nếu có.

6. Liệt kê tool hoặc system class.
   Ưu tiên category ổn định như CI/CD, observability, issue tracker, cloud platform, data warehouse. Chỉ ghi brand cụ thể khi thật sự phổ biến trong ngành.

7. Ghi risk, privacy, compliance, reliability concern.
   Phần này giúp AI biết khi nào cần hỏi xác nhận và không tự gán trách nhiệm cho người dùng.

8. Viết achievement pattern.
   Pattern chỉ là dạng khai thác, không phải claim sẵn. Dùng placeholder như `X%`, `Y ms`, `Z users`, `N teams`.

9. Viết discovery questions.
   Câu hỏi phải giúp người dùng nhớ lại việc thật, số liệu thật, stakeholder thật, trade-off thật, hoặc bằng chứng thật.

10. Thiết kế `conversationFollowUp`.
    Đây là phần quyết định chatbot có biết đào sâu không. Hãy định nghĩa story slots, trigger, completion criteria, và guardrails theo ngành.

## Cách Thiết Kế Conversation Follow-up

`conversationFollowUp.goal` mô tả chatbot cần giúp người dùng kể loại câu chuyện nào trong ngành này.

`principles` là luật hội thoại ngắn, ví dụ:

- Hỏi một thứ mỗi lượt.
- Ưu tiên làm rõ đóng góp cá nhân trước metric.
- Khi người dùng nói "team mình", hỏi phần họ trực tiếp làm.
- Khi người dùng nói impact mơ hồ, hỏi metric, bằng chứng, hoặc proxy.
- Khi có risk, compliance, security, hoặc production incident, hỏi bối cảnh trước khi ghi nhận ownership.

`storySlots` là các mảnh cần có để câu chuyện đủ giàu. Nên có ít nhất:

- `scope`: sản phẩm, workflow, system, customer segment, hoặc business area bị ảnh hưởng.
- `personal-contribution`: người dùng trực tiếp làm gì, quyết định gì, sở hữu phần nào.
- `industry-context`: chi tiết đặc thù ngành như regulated workflow, production system, clinical process, sales cycle, supply chain step.
- `impact-metric`: số liệu trước sau, observable change, hoặc proxy evidence.
- `stakeholders`: ai liên quan, ai được align, ai bị ảnh hưởng.
- `evidence`: artifact, dashboard, ticket, release note, review, feedback, document.

`triggers` là quy tắc chọn câu hỏi tiếp theo khi user nói một tín hiệu cụ thể. Trigger tốt gồm:

- `whenUserMentions`: cụm từ người dùng có thể nói.
- `targetSlotId`: slot cần bổ sung.
- `priority`: số lớn hơn được hỏi trước.
- `question`: câu hỏi cụ thể, một ý.
- `reason`: vì sao cần hỏi câu này để tránh suy diễn hoặc làm câu chuyện sâu hơn.

`completionCriteria` nói khi nào chatbot có thể tóm tắt và xin xác nhận.

`guardrails` nói rõ AI không được suy diễn điều gì trong ngành này.

## Checklist Field

`id`: Stable kebab-case id. Không đổi tùy tiện sau khi đã có dữ liệu tham chiếu.

`label`: Tên ngành cho người đọc.

`version`: Tăng khi ý nghĩa hoặc cấu trúc thay đổi.

`active`: Có được dùng trong retrieval không.

`summary`: Một hoặc hai câu về cách ngành vận hành.

`businessModels`: Cách tổ chức trong ngành tạo doanh thu hoặc giá trị.

`coreWorkflows`: Workflow lặp lại mà người dùng có thể từng đóng góp.

`keyMetrics`: Metric theo nhóm `business`, `product`, `risk`, `operations`, hoặc `people`.

`stakeholders`: Người hoặc nhóm liên quan đến câu chuyện nghề nghiệp.

`commonTools`: Tool category hoặc system class thường xuất hiện.

`regulatoryConcerns`: Constraint cần hỏi cẩn thận.

`achievementPatterns`: Dạng thành tựu để gợi nhớ, không phải claim.

`discoveryQuestions`: Câu hỏi mở để khai thác scope, contribution, metric, stakeholder, trade-off, evidence.

`guardrails`: Những điều AI không được tự suy diễn.

`conversationFollowUp`: Cách chatbot hỏi tiếp trong ngành này.

## Quality Bar

Một industry context đạt chuẩn khi:

- Có ít nhất ba workflow quan trọng.
- Có metric đủ gần với công việc cá nhân để hỏi mà không ép claim.
- Có stakeholder và risk context, không chỉ business metric.
- Có `conversationFollowUp.storySlots` đủ để biến một câu trả lời mơ hồ thành story có scope, contribution, impact, evidence.
- Có trigger cho team outcome, impact mơ hồ, và ít nhất một tín hiệu đặc thù ngành.
- Có guardrail ngăn AI tự bịa ownership, metric, tool, regulation, hoặc evidence.
- Người ngoài ngành vẫn đọc hiểu được.

## Review Trước Khi Ship

- Câu hỏi nào có thể khiến user nhận vơ việc họ không làm?
- Metric có được viết như khả năng khai thác, không phải giả định không?
- Risk hoặc compliance có bị biến thành trách nhiệm của user khi chưa xác nhận không?
- Follow-up có hỏi một ý mỗi lượt không?
- Có trigger nào giúp chatbot đào sâu khi user nói "we", "team", "improved", "optimized", "launched" không?
- Khi đủ slot, chatbot có biết tóm tắt và xin xác nhận trước khi lưu fact không?

## Template Và Ví Dụ

Dùng `packages/domain/industry-contexts/template.yaml` làm base để copy.

Xem ví dụ hoàn chỉnh cho software engineer tại `packages/domain/industry-contexts/software-engineer.yaml`.

## Mapping Trong Code

- Domain types và built-in packs nằm trong `packages/domain`.
- Runtime validation schemas nằm trong `packages/contracts`.
- Conversation policy, brief, và follow-up engine nằm trong `packages/ai`.
- User claims được lưu từ hội thoại phải là private, provenance-aware career facts.
