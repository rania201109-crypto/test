// 코드 내용 검사 규칙. 훅(guard-content)은 쓰는 순간에, 게이트 4는 app/ 전체에 같은 규칙을 적용한다.
import { loadTokens, normValue } from "./tokens.mjs";

const PALETTE =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";
const SPACING_UTIL =
  "p|px|py|pt|pr|pb|pl|ps|pe|m|mx|my|mt|mr|mb|ml|ms|me|gap|gap-x|gap-y|space-x|space-y|w|h|size|min-w|min-h|max-w|max-h|top|right|bottom|left|inset|inset-x|inset-y|start|end|translate-x|translate-y|basis|scroll-m|scroll-p";

const isCommentLine = (t) => /^(\/\/|\/\*|\*|\{\/\*|<!--)/.test(t);

// 개인정보 패턴: 주석까지 포함해 모든 줄에 적용한다.
const PII = [
  { rule: "개인정보: 휴대폰 번호", re: /01[016789][-.\s]?\d{3,4}[-.\s]?\d{4}/ },
  { rule: "개인정보: 이메일", re: /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}/ },
];

// 화면 코드(ts/tsx/js/jsx) 규칙: 주석 줄은 건너뛴다.
const CODE = [
  { rule: "토큰 밖 값: [임의 값] 클래스", re: /\b[a-z][a-z0-9-]*-\[[^\]]+\]/ },
  { rule: "토큰 밖 값: 색 리터럴(#hex)", re: /#[0-9a-fA-F]{3,8}\b/ },
  { rule: "토큰 밖 값: 색 함수", re: /\b(rgba?|hsla?|oklch|oklab)\(/ },
  { rule: "토큰 밖 값: px 리터럴", re: /\b\d+(\.\d+)?px\b/ },
  { rule: "토큰 밖 값: style 속성", re: /\bstyle=\{/ },
  { rule: "토큰 밖 값: 기본 팔레트 색", re: new RegExp(`\\b[a-z-]+-(?:${PALETTE})-\\d{2,3}\\b|\\b(?:bg|text|border)-(?:white|black)\\b`) },
  { rule: "토큰 밖 값: 줄높이 숫자(leading-N)", re: /(?<![\w-])leading-\d+(?![\w-])/ },
  { rule: "가격 규칙: 취소선(정가 표시)", re: /line-through|<del[\s>]|<s[\s>]/ },
  { rule: "가격 규칙: 할인율(%)", re: /\d+\s?%/ },
];

// app/ 안 CSS 규칙: 값은 styles/tokens.css에만 둔다.
const APP_CSS = [
  { rule: "토큰 밖 값: 색 리터럴(#hex)", re: /#[0-9a-fA-F]{3,8}\b/ },
  { rule: "토큰 밖 값: 색 함수", re: /\b(rgba?|hsla?|oklch|oklab)\(/ },
  { rule: "토큰 밖 값: px 리터럴", re: /\b\d+(\.\d+)?px\b/ },
  { rule: "토큰 밖 값: app/ 안의 @theme", re: /@theme/ },
];

let tokens;
const tk = () => (tokens ??= loadTokens());

// 숫자 클래스의 숫자가 tokens.json에 있는지 확인한다.
function numericViolations(line) {
  const out = [];
  const { spacing, radius, textNames } = tk();
  for (const m of line.matchAll(new RegExp(`(?<![\\w-])-?(?:${SPACING_UTIL})-(\\d+(?:\\.\\d+)?)(?![\\w./-])`, "g"))) {
    if (!spacing.has(m[1])) out.push({ rule: `토큰 밖 값: 간격 ${m[1]}은 spacing/* 에 없음`, snippet: m[0] });
  }
  for (const m of line.matchAll(/(?<![\w-])rounded(?:-(?:t|r|b|l|s|e|tl|tr|br|bl|ss|se|es|ee))?-([a-z0-9]+)(?![\w-])/g)) {
    if (!radius.has(m[1])) out.push({ rule: `토큰 밖 값: 모서리 ${m[1]}은 radius/* 에 없음`, snippet: m[0] });
  }
  for (const m of line.matchAll(/(?<![\w-])text-(xs|sm|base|lg|[2-9]?xl|\d+)(?![\w-])/g)) {
    if (!textNames.has(m[1])) out.push({ rule: `토큰 밖 값: 글자 크기 ${m[1]}은 font-size/* 에 없음`, snippet: m[0] });
  }
  return out;
}

// styles/tokens.css: 선언한 변수가 tokens.json과 같은 값인지 (빠진 것은 게이트 3이 본다).
function tokenCssViolations(line) {
  const m = line.match(/^\s*(--[\w-]+(?:-\*)?)\s*:\s*([^;]+);/);
  if (!m || m[1].endsWith("*")) return [];
  const expected = tk().vars.get(m[1]);
  if (expected === undefined) return [{ rule: `tokens.json에 없는 변수 ${m[1]}`, snippet: line.trim() }];
  if (normValue(expected) !== normValue(m[2])) return [{ rule: `${m[1]} 값이 tokens.json(${expected})과 다름`, snippet: line.trim() }];
  return [];
}

// file: 프로젝트 기준 상대 경로, text: 검사할 내용. 위반 목록 [{line, rule, snippet}]을 돌려준다.
export function scanContent(file, text) {
  const inApp = file.startsWith("app/");
  const isTokenCss = file === "styles/tokens.css";
  if (!inApp && !file.startsWith("styles/")) return [];
  const isCode = /\.(tsx?|jsx?|mjs)$/.test(file);
  const isCss = file.endsWith(".css");

  const out = [];
  text.split("\n").forEach((line, i) => {
    const push = (v) => out.push({ line: i + 1, ...v });
    for (const p of PII) {
      const m = line.match(p.re);
      if (m) push({ rule: p.rule, snippet: m[0] });
    }
    if (isCommentLine(line.trim())) return;
    if (isCode && inApp) {
      for (const r of CODE) {
        const m = line.match(r.re);
        if (m) push({ rule: r.rule, snippet: m[0] });
      }
      numericViolations(line).forEach(push);
    } else if (isCss && inApp) {
      for (const r of APP_CSS) {
        const m = line.match(r.re);
        if (m) push({ rule: r.rule, snippet: m[0] });
      }
    } else if (isTokenCss) {
      tokenCssViolations(line).forEach(push);
    }
  });
  return out;
}
