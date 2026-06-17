# Conversation Follow-up Playbook

Mục tiêu của playbook này là biến industry/role context thành hành vi hội thoại nhiều lượt. Chatbot không chỉ hỏi câu mở đầu, mà biết đang thiếu mảnh nào của câu chuyện, khi nào cần đào sâu, và khi nào phải dừng lại để tránh ép người dùng nhận vơ thành tựu.

Authoring rule: define `conversationFollowUp` inside the same industry context file. A standalone playbook is only a reusable base or fallback; the industry pack is the source of truth for how that industry should follow up.

## Mục Tiêu

Một follow-up tốt giúp người dùng:

- nhớ thêm bối cảnh thật;
- tách phần mình trực tiếp làm khỏi kết quả của cả team;
- tìm metric hoặc proxy evidence;
- nói ra trade-off, constraint, stakeholder, và cách ra quyết định;
- bộc lộ working style và career theme cá nhân;
- tạo nhiều career story nhỏ từ một ký ức ban đầu.

## Ba Lớp Knowledge

1. Industry context trả lời: ngành này có workflow, metric, stakeholder, risk nào?
2. Role context trả lời: vai trò này thường tạo impact qua trách nhiệm và scope nào?
3. Follow-up playbook trả lời: ở lượt tiếp theo nên hỏi gì để câu chuyện giàu hơn nhưng vẫn trung thực?

Trong authoring, lớp 1 và lớp 3 nên nằm chung một industry context file. Như vậy mỗi ngành tự định nghĩa cả bản đồ vận hành lẫn cách chatbot đào sâu câu chuyện trong ngành đó.

## Story Slots

Story slot là mảnh thông tin chatbot cần thu thập qua nhiều lượt.

Các slot nền nên có:

- `scope`: câu chuyện xảy ra ở product, workflow, system, customer problem, hoặc business moment nào.
- `personal-contribution`: người dùng trực tiếp làm, quyết định, xây, phân tích, sửa, điều phối, hoặc ảnh hưởng phần nào.
- `workflow-context`: phần việc nằm ở bước nào trong workflow, trước đó và sau đó xảy ra gì.
- `impact-metric`: metric, before/after, observable change, hoặc proxy signal.
- `stakeholders`: ai liên quan, ai bị ảnh hưởng, ai cần được thuyết phục.
- `tradeoff`: constraint, conflict, risk, hoặc hard decision.
- `evidence`: dashboard, ticket, document, release note, feedback, postmortem, hoặc source khác.
- `reflection`: câu chuyện này nói gì về cách người dùng làm việc.

## Trigger Rules

Trigger giúp chatbot chọn câu follow-up đúng lúc.

```yaml
triggers:
  - id: "team-outcome-claim"
    targetSlotId: "personal-contribution"
    priority: 100
    whenUserMentions:
      - "we built"
      - "our team"
      - "we launched"
    question: "What part did you personally own or directly deliver?"
    reason: "Separate the user's contribution from a team outcome before storing facts."

  - id: "vague-impact"
    targetSlotId: "impact-metric"
    priority: 90
    whenUserMentions:
      - "improved"
      - "optimized"
      - "helped"
      - "faster"
    question: "What before-and-after metric, observable change, or proxy signal shows the improvement?"
    reason: "The user described impact, but the story still needs concrete evidence or a proxy signal."
```

Priority quan trọng: claim của team phải được tách thành đóng góp cá nhân trước khi hỏi metric, vì nếu hỏi metric quá sớm chatbot dễ biến outcome của team thành achievement cá nhân.

## Follow-up Policy

- Hỏi một điều mỗi lượt.
- Ưu tiên slot required trước optional.
- Nếu message khớp trigger có priority cao, hỏi trigger đó trước.
- Nếu target slot của trigger đã có câu trả lời, bỏ qua trigger đó.
- Khi không trigger nào khớp, hỏi slot required chưa có.
- Khi required đủ rồi, hỏi optional slot giúp câu chuyện sâu hơn.
- Khi mọi slot đủ, yêu cầu người dùng confirm framing trước khi lưu career fact.

## Question Design

Câu hỏi tốt:

- mở nhưng cụ thể;
- giúp người dùng nhớ việc thật;
- không gài giả định về ownership, metric, tool, scale, hoặc impact;
- cho phép trả lời không có số liệu chính xác;
- có thể dẫn đến nhiều câu chuyện con.

Ví dụ tốt:

```text
Bạn trực tiếp phụ trách phần nào trong việc đó?
```

```text
Nếu không nhớ số chính xác, có proxy nào không: thời gian tiết kiệm, lỗi giảm, adoption, feedback, incident, hoặc cycle time?
```

Ví dụ không tốt:

```text
Bạn đã tăng revenue bao nhiêu?
```

Câu này giả định user có revenue impact và có thể ép overclaim.

## Template

```yaml
id: "career-story-excavation"
label: "Career story excavation"
version: 1
active: true
goal: "Turn vague work memories into private, provenance-aware career stories."

principles:
  - "Ask one thing at a time."
  - "Probe personal contribution before turning team outcomes into user facts."
  - "Treat every unverified framing as a hypothesis that needs user confirmation."

storySlots:
  - id: "personal-contribution"
    label: "Personal contribution"
    required: true
    question: "Which part did you personally own or directly deliver?"
    captureTargets:
      - "owned scope"
      - "direct actions"
      - "decision rights"
    followUpHints:
      - "Separate the user's contribution from team or company outcomes."

triggers:
  - id: "team-outcome-claim"
    targetSlotId: "personal-contribution"
    priority: 100
    whenUserMentions:
      - "we built"
      - "our team"
    question: "What part did you personally own or directly deliver?"
    reason: "Separate the user's contribution from a team outcome before storing facts."

completionCriteria:
  - "Required story slots have user-stated answers."
  - "Any suggested framing is confirmed by the user before becoming a career fact."

guardrails:
  - "Do not invent metrics, ownership, seniority, employers, tools, regulations, or evidence."
  - "Ask for one missing slot at a time."
```

## Example Flow

User:

```text
Team tôi optimize backend API cho checkout.
```

Assistant should ask:

```text
Phần nào trong backend API đó là bạn trực tiếp phụ trách hoặc trực tiếp deliver?
```

User:

```text
Tôi refactor phần price calculation và thêm cache.
```

Assistant can ask:

```text
Việc đó thay đổi metric hoặc dấu hiệu nào không: latency, error rate, checkout completion, incident, hoặc support ticket?
```

User:

```text
P95 latency giảm từ khoảng 900ms xuống 350ms.
```

Assistant can ask:

```text
Có evidence riêng tư nào sau này mình có thể dùng để verify không: dashboard, ticket, PR, release note, hay feedback từ team?
```

## Review Checklist

- Playbook có slot cho contribution, metric, evidence, và reflection chưa?
- Trigger có ưu tiên chống overclaim chưa?
- Câu hỏi có đang gợi ý claim quá mạnh không?
- Có cho phép proxy evidence khi user không nhớ số chính xác không?
- Có yêu cầu confirm trước khi lưu career fact không?
