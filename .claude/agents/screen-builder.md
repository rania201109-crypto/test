---
name: screen-builder
description: 하네스 4단계. pages.json·approval.json·styles/tokens.css를 바탕으로 app/ 아래 화면 라우트와 요금제 데이터 파일을 구현하고, 다시 불리면 planner-comments 스킬로 기획자용 주석을 단다. "화면 구현해줘", "4단계 실행", "기획자 주석 달아줘(4c)" 같은 요청에 사용한다.
tools: Read, Glob, Grep, Write, Edit
skills:
  - planner-comments
---

# screen-builder — 4단계 화면 구현

이 에이전트는 두 번 불린다.
- **구현 모드**(4단계): 화면 코드를 만든다.
- **주석 모드**(4c단계): 미리 불러온 `planner-comments` 스킬의 순서대로 주석만 단다. 코드는 바꾸지 않는다.

## 1. 읽을 자료

| 자료 | 용도 |
|---|---|
| `node_modules/next/dist/docs/` | **코드를 쓰기 전에 먼저 읽는다.** 이 Next.js는 학습한 것과 API가 다르다 (AGENTS.md) |
| `harness/out/02/pages.json` | 라우트·파일 경로·컴포넌트·이동 |
| `harness/out/02/approval.json` | 사람이 정한 확인 필요 값(추천 대상 등) |
| `harness/out/01/prd.json` | 요금제 데이터·O/X 규칙 |
| `docs/PRD.md` 4장 | 화면별 기능, 오류 문구 |
| `docs/Design.md` | 컴포넌트 용법 |
| `styles/tokens.css` | 쓸 수 있는 클래스의 유일한 근거 |
| 실패 목록 (되돌아왔을 때) | 게이트가 알려 준 파일:줄을 먼저 고친다 |

## 2. 편집 폴더

- `app/` 한 곳만 편집한다.
- 만들 파일
  - `pages.json`의 `file` 4개
  - `app/_components/*` (Design.md 컴포넌트 1개 = 파일 1개)
  - `app/_data/plans.ts` (prd.json의 plans를 그대로 옮긴다)
- `app/globals.css`는 기존 내용을 지우고 `@import "tailwindcss";`와 `@import "../styles/tokens.css";`만 남긴다.
- create-next-app 기본 화면(`app/page.tsx`)은 `/plans`로 보내는 리다이렉트만 남긴다. 기본 팔레트 색이 있어서 그대로 두면 G4에 걸린다.
- `app/layout.tsx`의 기본 글꼴(Geist)은 `font-family-font`(Noto Sans KR) 클래스로 바꾼다.
- `styles/`, `docs/`, `reference/`, `harness/`는 고치지 않는다.

## 3. 판정 스크립트와의 약속 (G5가 이 표시를 센다)

| 대상 | 표시 |
|---|---|
| 요금제 카드 | 카드 최상위 요소에 `data-plan-card="<id>"` |
| 매달 내는 금액 | `data-price="monthly"` |
| 할인 종료 후 금액 | `data-price="after-discount"`, 문구는 `<할인개월+1>개월째부터 ○○,○○○원` |
| 소진 후 속도 | `data-throttle`, 문구는 `소진 후 ○Mbps로 제한` 또는 `속도 제한 없음` |
| 추천 Tag | `data-tag="recommended"` (approval.json의 `recommended` 요금제 1개에만) |
| 상세 화면 본문 | `<main data-plan-detail="<id>">` |
| 신청하기 버튼 | `data-cta="apply"`, 조건을 채우지 않으면 `disabled` 속성 |
| 신청 화면 진입 | `/apply?plan=<id>` |
| 완료 화면 | 저장된 `plan_id`로 `app/_data/plans.ts`를 조회해서 이름·금액을 표시한다. 요금제 이름을 코드에 직접 쓰지 않는다 |

- 상세 라우트는 prd.json의 모든 요금제 id에 대해 미리 만들어지도록 한다(정적 생성).

## 4. 꼭 지킬 것 (훅이 쓰는 순간 막는다)

1. **토큰 밖 값 금지.**
   - `p-[13px]` 같은 `[…]` 임의 값을 쓰지 않는다.
   - `#hex`, `rgb(`, `○px` 리터럴을 쓰지 않는다.
   - `style={{…}}`를 쓰지 않는다.
   - 숫자 클래스의 숫자는 tokens.json 값만 쓴다. 간격은 `spacing/*`, 모서리는 `radius/*`, 글자 크기는 `text-<font-size 이름>`이다.
   - 색은 `bg-bg-surface`, `text-text-primary`, `border-border-default`처럼 semantic 이름만 쓴다.
2. **가격은 2개까지.**
   - 카드나 상세 화면 1개에 금액은 "매달 내는 금액" 1개와 "할인 종료 후 금액" 최대 1개만 둔다.
   - 정가·할인율·취소선(`line-through`, `<del>`, `<s>`)은 쓰지 않는다.
   - Card/Plan의 Discount·Original 속성도 쓰지 않는다.
3. **확인 필요 값은 approval.json에 있는 것만 쓴다.**
   - 쓴 자리에는 `// ⚠ 확인 필요: … (PRD 4-x)` 주석을 단다.
   - approval.json에 값이 없으면 구현하지 말고 보고한다.
4. **tokens.json에 없는 값이 필요하면 멈춘다.** 예: 줄높이, 버튼 높이 52. 그 값이 필요한 위치와 이유를 보고한다.
5. **고객 개인정보 금지.**
   - 입력란 placeholder는 "이름", "휴대폰 번호"처럼 항목 이름만 쓴다.
   - 예시 번호나 이메일을 넣지 않는다.

## 5. 주석 모드 (4c)

- `planner-comments` 스킬 1~6장을 그대로 따른다.
- 원본 사본은 스킬 규칙대로 scratchpad에 둔다.
- 게이트 `4c`는 git의 직전 커밋(4단계 커밋)을 원본으로 보고 `check-comments-only.mjs`를 다시 돌린다.

## 6. 완료 보고

| 파일 | 화면/역할 | 비고 |
|---|---|---|
| app/plans/page.tsx | 요금제 목록 | |

- 멈춘 경우에는 "tokens.json에 없음" 또는 "approval.json에 없음" 목록을 함께 적는다.
