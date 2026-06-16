# Hướng Dẫn Tạo Industry Context

Industry context là bản đồ vận hành của một ngành để chatbot biết hỏi đúng, hiểu thuật ngữ đúng, và gợi ý góc khai thác kinh nghiệm cho người dùng xác nhận. Nó không phải nơi để AI tự tạo thành tựu thay người dùng.

## Nguyên Tắc

- Knowledge base cá nhân của người dùng là nguồn sự thật.
- Industry context chỉ được dùng để hỏi tốt hơn, diễn giải thuật ngữ, và đề xuất framing dạng giả thuyết.
- Không tự bịa employer, metric, tool, regulation, responsibility, scope, hay achievement.
- Mọi claim dùng cho CV phải đi qua lời kể của người dùng hoặc source người dùng cung cấp.
- Guardrail là bắt buộc. Một pack không có câu hỏi khai thác và điều AI không được suy diễn thì chưa đủ an toàn để dùng.
- Ưu tiên ngôn ngữ thực tế của ngành hơn mô tả encyclopedia.

## Khi Nào Cần Tạo Pack Mới

Tạo industry context pack khi:

- Có nhóm người dùng mục tiêu thuộc một ngành có workflow, metric, stakeholder, hoặc risk riêng.
- Chatbot cần hỏi sâu hơn so với role context chung.
- JD thường nhắc đến thuật ngữ ngành mà người dùng có thể không biết cách chuyển thành career story.

Không tạo pack mới nếu khác biệt chỉ là tên công ty, tên sản phẩm, hoặc một nhóm kỹ năng có thể nằm trong role context.

## Quy Trình Tạo Pack

1. Xác định ranh giới ngành.
   Viết một đoạn summary ngắn trả lời: ngành này tạo giá trị gì, vận hành qua workflow nào, và có constraint gì đặc thù.

2. Liệt kê business model.
   Chỉ chọn các model giúp chatbot hiểu động lực kinh doanh, ví dụ payments, lending, marketplace, subscription, managed services.

3. Liệt kê core workflow.
   Mỗi workflow nên là một chuỗi công việc mà nhiều role có thể tham gia. Ví dụ fintech có `user-onboarding`, healthcare có `patient-intake`, logistics có `order-fulfillment`.

4. Gắn metric vào workflow.
   Metric nên là thứ người dùng có thể từng ảnh hưởng hoặc quan sát. Tránh metric quá xa công việc cá nhân nếu chatbot dễ khiến người dùng nhận vơ ownership.

5. Liệt kê stakeholder.
   Bao gồm team nội bộ, người dùng cuối, partner, regulator, vendor, hoặc nhóm vận hành liên quan.

6. Liệt kê tool/system phổ biến.
   Chỉ ghi tool category hoặc system class nếu brand cụ thể không ổn định. Ví dụ `KYC providers` tốt hơn đoán tên vendor khi chưa có nguồn.

7. Ghi regulatory, risk, privacy concern.
   Phần này giúp chatbot biết khi nào phải hỏi xác nhận, tránh tự suy diễn người dùng làm compliance.

8. Viết achievement pattern.
   Pattern là dạng câu để gợi ý khai thác, không phải claim sẵn. Luôn dùng placeholder như `X%`, `Y days`, `Z markets`.

9. Viết discovery questions.
   Câu hỏi phải giúp người dùng nhớ lại việc thật, số liệu thật, stakeholder thật, hoặc trade-off thật.

10. Viết guardrails.
    Guardrail phải nói rõ điều AI không được tự suy diễn trong ngành đó.

## Template

```yaml
id: "fintech"
label: "Fintech"
version: 1
active: true
summary: "Financial products delivered through software, data, and regulated operational workflows."

businessModels:
  - "Payments"
  - "Lending"
  - "Wealth management"
  - "B2B financial infrastructure"

coreWorkflows:
  - id: "user-onboarding"
    label: "User onboarding"
    typicalSteps:
      - "KYC"
      - "Risk scoring"
      - "Account activation"
    commonMetrics:
      - "conversion rate"
      - "KYC pass rate"
      - "time to activation"

keyMetrics:
  - id: "activation"
    label: "Activation"
    category: "product"
  - id: "fraud-rate"
    label: "Fraud rate"
    category: "risk"

stakeholders:
  - "customers"
  - "risk team"
  - "compliance"
  - "engineering"
  - "operations"

commonTools:
  - "KYC providers"
  - "payment gateways"
  - "risk engines"
  - "analytics dashboards"

regulatoryConcerns:
  - "data privacy"
  - "KYC/AML"
  - "auditability"
  - "consumer protection"

achievementPatterns:
  - "Reduced onboarding drop-off by X%"
  - "Improved fraud detection while preserving approval rate"
  - "Launched a compliant payment flow across markets"

discoveryQuestions:
  - "Did you influence conversion, approval rate, fraud, or compliance?"
  - "Which risk, compliance, operations, or partner stakeholders were involved?"
  - "What before-and-after metric proves the workflow improved?"

guardrails:
  - "Do not invent metrics, employers, tools, regulations, or regulated responsibilities."
  - "Use this industry context only to ask better questions and propose user-confirmed framings."
```

## Field Checklist

`id`: Stable kebab-case identifier. Do not rename casually after data references it.

`label`: Human-readable industry name.

`version`: Increment when the meaning or structure changes.

`active`: Whether the pack can be used by retrieval.

`summary`: One or two sentences about how the industry works.

`businessModels`: How organizations in the industry usually create revenue or value.

`coreWorkflows`: The recurring operating workflows a user may have contributed to.

`keyMetrics`: Metrics grouped by `business`, `product`, `risk`, `operations`, or `people`.

`stakeholders`: People or teams the user may have collaborated with.

`commonTools`: Tool categories and systems likely to appear in stories.

`regulatoryConcerns`: Constraints that require careful questioning and no assumption.

`achievementPatterns`: Reusable shapes for impact discovery.

`discoveryQuestions`: Context-aware questions the chatbot can ask directly.

`guardrails`: Industry-specific no-go assumptions.

## Quality Bar

A good industry context pack should:

- Help the chatbot ask at least five useful follow-up questions.
- Include at least three workflows and at least two metrics per important workflow.
- Include stakeholder and risk context, not only business metrics.
- Make achievement extraction easier without inventing achievement content.
- Be understandable to a user outside the industry.
- Be small enough to retrieve into a conversation brief.

## Review Questions

Before shipping a pack, ask:

- Could any discovery question pressure the user to claim something they did not do?
- Are metrics written as possibilities, not assumptions?
- Are regulatory concerns treated as context, not as user responsibility?
- Can the pack support junior, senior, and leadership users without over-claiming ownership?
- Does every achievement pattern require user confirmation or evidence?

## Where This Maps In Code

- Domain types and built-in packs live in `packages/domain`.
- Runtime validation schemas live in `packages/contracts`.
- Conversation policy and brief construction live in `packages/ai`.
- User claims saved from conversation should become private, provenance-aware career facts.
