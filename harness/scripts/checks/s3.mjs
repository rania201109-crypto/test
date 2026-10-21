// G3: styles/tokens.css의 @theme 변수 집합·값이 tokens.json과 정확히 같은지 확인한다.
import { check, exists, readText } from "../lib/common.mjs";
import { THEME_RESETS, loadTokens, normValue } from "../lib/tokens.mjs";

export function run() {
  const FILE = "styles/tokens.css";
  if (!exists(FILE)) return [check("tokens.css 있음", false, `${FILE} 없음`)];
  const css = readText(FILE).replace(/\/\*[\s\S]*?\*\//g, "");
  const blocks = [...css.matchAll(/@theme\s*\{([^}]*)\}/g)];
  const r = [check("@theme 블록이 정확히 1개", blocks.length === 1, `${blocks.length}개`)];
  if (blocks.length !== 1) return r;
  const outside = css.replace(blocks[0][0], "").trim();
  r.push(check("@theme 밖에 다른 내용 없음", outside === "", outside.slice(0, 80)));

  const decl = new Map();
  for (const m of blocks[0][1].matchAll(/(--[\w-]+(?:-\*)?)\s*:\s*([^;]+);/g)) decl.set(m[1], m[2]);

  const noReset = THEME_RESETS.filter((k) => decl.get(k)?.trim() !== "initial");
  r.push(check("Tailwind 기본 테마 초기화 5줄", noReset.length === 0, noReset.length ? `빠짐: ${noReset.join(", ")}` : "모두 있음"));

  const { vars } = loadTokens();
  const got = [...decl.keys()].filter((k) => !k.endsWith("*"));
  const missing = [...vars.keys()].filter((k) => !decl.has(k));
  const extra = got.filter((k) => !vars.has(k));
  const wrong = [...vars].filter(([k, v]) => decl.has(k) && normValue(decl.get(k)) !== normValue(v)).map(([k]) => k);
  r.push(check("tokens.json 변수가 모두 있음", missing.length === 0, missing.length ? `빠짐 ${missing.length}: ${missing.slice(0, 6).join(", ")}` : `${vars.size}개`));
  r.push(check("tokens.json에 없는 변수 0개", extra.length === 0, extra.join(", ") || "없음"));
  r.push(check("값이 tokens.json과 같음", wrong.length === 0, wrong.join(", ") || "모두 같음"));
  return r;
}
