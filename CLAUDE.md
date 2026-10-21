@AGENTS.md

# 화면 구현 하네스 — 오케스트레이터 규칙

"화면 만들어줘"로 시작한다. **메인 대화는 직접 구현하지 않는다.**
메인 대화가 하는 일은 ① 에이전트 부르기 ② 게이트 돌리기 ③ 승인 받기 ④ 통과 시 커밋, 네 가지뿐이다.

## 순서

| 단계 | 부를 에이전트 | 편집 폴더 | 끝나면 실행 |
|---|---|---|---|
| 1 PRD 읽기 | prd-reader | `harness/out/01/` | `node harness/scripts/gate.mjs 1` |
| 2 페이지 나누기 | screen-spec → page-splitter | `docs/` 날짜 파일 1개 · `harness/out/02/` | `node harness/scripts/gate.mjs 2` |
| 👤 승인 | (메인) 명세 표 + 확인 필요 값 질문 → `harness/out/02/approval.json` | `harness/out/02/approval.json` | `node harness/scripts/gate.mjs approve` |
| 3 토큰 적용 | token-mapper | `styles/` | `node harness/scripts/gate.mjs 3` |
| 4 화면 구현 | screen-builder (구현 모드) | `app/` | `node harness/scripts/gate.mjs 4` |
| 4c 기획자 주석 | screen-builder (주석 모드, planner-comments 스킬) | `app/` | `node harness/scripts/gate.mjs 4c` |
| 5 검증 | verifier (읽기 전용) | 없음 | `node harness/scripts/gate.mjs 5` |

## 승인 지점 (1곳)

2단계 게이트를 통과하면 아래 내용을 표로 보여주고 답을 받는다.
- `pages.json`의 라우트별 화면·컴포넌트·이동
- `prd.json`의 `open_questions`: 실습값이 있으면 그 값을 제안하고, 없으면 질문한다
- 추천 Tag 대상 요금제 1개

받은 답은 사람의 말 그대로 `harness/out/02/approval.json`에 적는다.

```json
{ "approved": true, "recommended": "p0N", "answers": { "q1": "…", "q2": "…" } }
```

## 규칙

- 시작할 때 `harness/out/state.json`을 읽고, `current` 단계부터 이어서 한다. 파일이 없으면 1단계부터 시작한다.
- 처음 시작할 때 `harness/YYYY-MM-DD` 브랜치를 만든다.
- 게이트를 통과했을 때만 `harness(0N): <단계 이름>` 형식으로 커밋한다. `state.json`도 함께 커밋한다.
- 게이트가 실패하면 출력의 '복귀 단계'에 해당하는 에이전트를 실패 목록과 함께 다시 부른다.
  출력에 "멈춤"이 있으면(같은 단계에서 2번 실패) 더 진행하지 않고 실패 표를 사람에게 보고한다.
- `tokens.json`에 없는 값이 필요하면 멈추고 사람에게 묻는다. `docs/`·`reference/`·`tokens.json`은 고치지 않는다. 쓰려고 하면 훅이 막는다.
- PRD의 "확인 필요" 값은 지어내지 않는다. 승인 지점에서만 받는다.
- 기준 우선순위는 PRD.md > screens.md > 화면 링크 > Make 링크 > flow.png 순서다. 피그마 화면 링크는 컴포넌트·토큰의 근거로, Make 링크는 이동 흐름의 참고로만 쓴다. 링크를 읽지 못하면 멈추고 알린다.
- 기존 `screen-spec` 에이전트와 `planner-comments` 스킬은 고치지 않는다.
- 응답과 산출물에 고객 개인정보를 쓰지 않는다.

## 게이트가 막는 것

| 게이트 | 막는 것 |
|---|---|
| 훅 guard-paths | `docs/`·`reference/`·기존 스킬/에이전트에 쓰기 (screen-spec 날짜 파일만 예외) |
| 훅 guard-content | `app/`·`styles/`에 토큰 밖 값·취소선·할인율·휴대폰 번호·이메일을 쓰는 순간 |
| G1 | PRD 표와 다른 화면·요금제·규칙 추출 |
| G2 | 화면 수 ≠ 라우트 수, Design.md 밖 컴포넌트 |
| 승인 | 답 없는 확인 필요, 추천 0개 또는 2개 이상 |
| G3 | tokens.json과 다른 @theme 변수 |
| G4 | 빠진 라우트, 토큰 밖 값, build·lint 실패, 편집 폴더 밖 변경 |
| G4c | 주석 외 코드 변경 |
| G5 | PRD O/X 규칙 1~7 위반 (★ 3·4·5) |
