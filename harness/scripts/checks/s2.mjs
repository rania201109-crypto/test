// G2: pages.json의 라우트 수 = PRD 화면 수, 컴포넌트는 Design.md 4장 목록 안에서만.
import { check, exists, readJSON, readText, walk } from "../lib/common.mjs";
import { parsePRD, routeFile } from "../lib/prd.mjs";

// Design.md 4장의 ### 제목과 아이콘 표의 이름을 모은다.
export function designComponents() {
  const md = readText("docs/Design.md");
  const sec = md.slice(md.indexOf("## 4."));
  const names = new Set();
  for (const m of sec.matchAll(/^### (.+)$/gm)) if (!["속성 표기", "아이콘"].includes(m[1].trim())) names.add(m[1].trim());
  for (const m of sec.matchAll(/^\| (icon\/\w+) \|/gm)) names.add(m[1]);
  return names;
}

export function run() {
  const r = [];
  const specs = walk("docs", [".md"]).filter((f) => /^docs\/\d{4}-\d{2}-\d{2}-screen-spec\.md$/.test(f));
  r.push(check("screen-spec 결과 파일 있음", specs.length > 0, specs.sort().at(-1) ?? "docs/YYYY-MM-DD-screen-spec.md 없음"));

  const OUT = "harness/out/02/pages.json";
  if (!exists(OUT)) return [...r, check("pages.json 있음", false, `${OUT} 없음`)];
  const got = readJSON(OUT);
  const pages = got.pages ?? [];
  const prd = parsePRD();
  const want = prd.screens.map((s) => s.route);

  r.push(check("화면 수 = 라우트 수 = PRD 화면 수", pages.length === want.length && new Set(pages.map((p) => p.route)).size === pages.length, `${pages.length} / PRD ${want.length}`));
  const missing = want.filter((w) => !pages.some((p) => p.route === w));
  r.push(check("라우트가 PRD 라우트와 같음", missing.length === 0, missing.length ? `빠짐: ${missing.join(", ")}` : want.join(", ")));
  const badFile = pages.filter((p) => p.file !== routeFile(p.route)).map((p) => `${p.route}→${p.file}`);
  r.push(check("파일 경로가 App Router 규칙과 같음", badFile.length === 0, badFile.join(", ") || "모두 같음"));

  const lib = designComponents();
  const unknown = [...new Set(pages.flatMap((p) => p.components ?? []).filter((c) => !lib.has(c)))];
  r.push(check("컴포넌트가 모두 Design.md 목록 안에 있음", unknown.length === 0, unknown.length ? `목록 밖: ${unknown.join(", ")}` : `${lib.size}종 중에서만 사용`));
  const extra = pages.flatMap((p) => p.missing_components ?? []);
  r.push(check("필요하지만 없는 컴포넌트 0개", extra.length === 0, extra.length ? `사람 결정 필요: ${extra.join(", ")}` : "없음"));

  const qids = new Set((exists("harness/out/01/prd.json") ? readJSON("harness/out/01/prd.json").open_questions ?? [] : []).map((q) => q.id));
  const badQ = pages.flatMap((p) => p.open_questions ?? []).filter((q) => !qids.has(q));
  r.push(check("화면의 확인 필요 id가 prd.json에 있음", badQ.length === 0, badQ.join(", ") || "모두 있음"));
  return r;
}
