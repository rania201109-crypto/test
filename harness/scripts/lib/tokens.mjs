// docs/tokens.json(유일한 기준)에서 기대 CSS 변수와 허용 값 집합을 만든다.
import { readJSON } from "./common.mjs";

const after = (key) => key.slice(key.indexOf("/") + 1);

export function loadTokens() {
  const t = readJSON("docs/tokens.json");
  const vars = new Map(); // CSS 변수 이름 → 기대 값

  for (const [key, v] of Object.entries(t.semantic)) {
    vars.set(`--color-${key.replace("/", "-")}`, v.value);
  }
  for (const [key, v] of Object.entries(t.typography)) {
    if (key.startsWith("font-family/")) vars.set(`--font-${after(key)}`, `"${v}"`);
    else if (key.startsWith("font-size/")) vars.set(`--text-${after(key)}`, `${v}px`);
  }
  for (const [key, v] of Object.entries(t.spacing)) vars.set(`--spacing-${after(key)}`, `${v}px`);
  for (const [key, v] of Object.entries(t.radius)) vars.set(`--radius-${after(key)}`, `${v}px`);

  return {
    vars,
    spacing: new Set(Object.keys(t.spacing).map(after)),
    radius: new Set(Object.keys(t.radius).map(after)),
    textNames: new Set(Object.keys(t.typography).filter((k) => k.startsWith("font-size/")).map(after)),
    colorNames: new Set(Object.keys(t.semantic).map((k) => k.replace("/", "-"))),
  };
}

// Tailwind 기본 테마를 끄는 초기화 줄. tokens.css의 @theme 맨 위에 있어야 한다.
export const THEME_RESETS = ["--color-*", "--font-*", "--text-*", "--spacing-*", "--radius-*"];

export const normValue = (v) => v.trim().replace(/;$/, "").replace(/'/g, '"').toLowerCase();
