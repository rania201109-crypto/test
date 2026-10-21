// G4: 라우트 파일·데이터 파일이 있고, 토큰 밖 값·개인정보 0건, build·lint 통과.
import { spawnSync } from "node:child_process";
import { ROOT, check, exists, readJSON, readText, walk } from "../lib/common.mjs";
import { parsePRD, routeFile } from "../lib/prd.mjs";
import { scanContent } from "../lib/content-rules.mjs";

export const npm = (script) => {
  const p = spawnSync("npm", ["run", script], { cwd: ROOT, encoding: "utf8", shell: true });
  return { ok: p.status === 0, tail: `${p.stdout}\n${p.stderr}`.trim().split("\n").slice(-20).join("\n") };
};

export function staticChecks() {
  const r = [];
  const prd = parsePRD();
  const noRoute = prd.screens.map((s) => routeFile(s.route)).filter((f) => !exists(f));
  r.push(check("PRD 라우트마다 page.tsx 있음", noRoute.length === 0, noRoute.join(", ") || `${prd.screens.length}개`));

  const DATA = "app/_data/plans.ts";
  const data = exists(DATA) ? readText(DATA) : "";
  const noPlan = prd.plans.filter((p) => !data.includes(`"${p.id}"`) && !data.includes(`'${p.id}'`)).map((p) => p.id);
  r.push(check("요금제 데이터 파일에 PRD 요금제 id가 모두 있음", data && noPlan.length === 0, data ? noPlan.join(", ") || "모두 있음" : `${DATA} 없음`));

  const g = exists("app/globals.css") ? readText("app/globals.css") : "";
  r.push(check("globals.css가 styles/tokens.css를 불러옴", /@import\s+["']\.\.\/styles\/tokens\.css["']/.test(g), "app/globals.css"));

  if (exists("harness/out/02/approval.json")) {
    const rec = readJSON("harness/out/02/approval.json").recommended;
    r.push(check("추천 요금제가 데이터 파일에 반영됨", new RegExp(`["']${rec}["'][\\s\\S]{0,400}recommended:\\s*true`).test(data), `recommended: ${rec}`));
  }

  const files = walk("app", [".ts", ".tsx", ".js", ".jsx", ".css"]);
  const v = files.flatMap((f) => scanContent(f, readText(f)).map((x) => `${f}:${x.line} ${x.rule} (${x.snippet})`));
  r.push(check("토큰 밖 값·취소선·할인율·개인정보 0건", v.length === 0, v.length ? `${v.length}건\n    ${v.slice(0, 15).join("\n    ")}` : `${files.length}개 파일 검사`));
  return r;
}

export function run() {
  const r = staticChecks();
  if (r.some((x) => !x.ok)) return [...r, check("build·lint", false, "앞 검사 실패로 건너뜀")];
  const b = npm("build");
  r.push(check("npm run build exit 0", b.ok, b.ok ? "통과" : b.tail));
  const l = npm("lint");
  r.push(check("npm run lint exit 0", l.ok, l.ok ? "통과" : l.tail));
  return r;
}
