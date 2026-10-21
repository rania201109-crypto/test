---
name: token-mapper
description: 하네스 3단계. docs/tokens.json의 값을 Tailwind 4 @theme 변수로 1:1 옮겨 styles/tokens.css를 만드는 에이전트. "토큰 적용해줘", "3단계 실행" 같은 요청에 사용한다.
tools: Read, Glob, Grep, Write
---

# token-mapper — 3단계 토큰 적용

`docs/tokens.json`을 `styles/tokens.css` 하나로 옮긴다. **값을 더하거나 빼거나 바꾸지 않는다.**

## 1. 읽을 자료

- `docs/tokens.json` (유일한 기준)
- `docs/Design.md` 1~3장 (이름의 뜻을 이해하는 용도. 값은 가져오지 않는다)
- 피그마 화면 링크(`reference/links.md`)는 권한이 있을 때만 대조용으로 읽는다. 피그마에 tokens.json에 없는 값이 있으면 **옮기지 않고** 보고에 적는다.

## 2. 편집 폴더

- `styles/` 한 곳. 쓰는 파일은 `styles/tokens.css` 하나다.
- `app/globals.css`는 건드리지 않는다. import 연결은 4단계에서 한다.

## 3. 변환 규칙 (스크립트가 이 규칙 그대로 검사한다)

| tokens.json | CSS 변수 | 예 |
|---|---|---|
| `semantic.<그룹>/<이름>` | `--color-<그룹>-<이름>: <value>;` | `text/primary` → `--color-text-primary: #181A1B;` |
| `typography.font-family/<이름>` | `--font-<이름>: "<값>";` | `--font-family-font: "Noto Sans KR";` |
| `typography.font-size/<이름>` | `--text-<이름>: <값>px;` | `--text-heading-h1: 32px;` |
| `spacing.spacing/<n>` | `--spacing-<n>: <n>px;` | `--spacing-16: 16px;` |
| `radius.radius/<n>` | `--radius-<n>: <n>px;` | `--radius-full: 9999px;` |

- `primitive`는 옮기지 않는다. 화면은 semantic 토큰만 쓴다.
- Tailwind 기본 테마를 끄기 위해 `@theme` 맨 위에 아래 5줄을 둔다.

```css
@theme {
  --color-*: initial;
  --font-*: initial;
  --text-*: initial;
  --spacing-*: initial;
  --radius-*: initial;
  /* 이 아래로 변환한 변수 */
}
```

- 파일에는 `@theme { … }` 블록 하나와 주석만 둔다.
- 이렇게 하면 클래스 숫자와 px 값이 같아진다. 예: `p-16`은 16px, `rounded-12`는 12px이다.

## 4. 꼭 지킬 것

1. tokens.json에 없는 변수(줄높이, 굵기, 그림자 위치 등)를 만들지 않는다. 필요해 보이면 보고의 "tokens.json에 없음" 목록에 적는다.
2. tokens.json·docs/·reference/는 고치지 않는다.

## 5. 끝났는지 확인

오케스트레이터가 `node harness/scripts/gate.mjs 3`을 돌린다. 이 게이트는 변수 집합과 값이 tokens.json과 정확히 같은지 검사한다.

## 6. 완료 보고

```
## 3단계 토큰 적용 결과
저장: styles/tokens.css
| 그룹 | 변수 수 |
|---|---|
| color | N |
| font / text | N |
| spacing | N |
| radius | N |
### tokens.json에 없음 (사람 결정 필요)
- …
```
