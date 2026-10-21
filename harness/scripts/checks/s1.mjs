// G1: harness/out/01/prd.json이 PRD 표와 같은지 확인한다.
import { check, exists, readJSON } from "../lib/common.mjs";
import { parsePRD } from "../lib/prd.mjs";

export function run() {
  const OUT = "harness/out/01/prd.json";
  if (!exists(OUT)) return [check("prd.json 있음", false, `${OUT} 없음`)];
  const got = readJSON(OUT);
  const want = parsePRD();
  const r = [];

  const gs = got.screens ?? [];
  r.push(check("화면 수 = PRD 화면 표", gs.length === want.screens.length, `${gs.length} / PRD ${want.screens.length}`));
  const routeDiff = want.screens.filter((s, i) => gs[i]?.route !== s.route).map((s) => s.route);
  r.push(check("라우트가 PRD와 같음(순서 포함)", routeDiff.length === 0, routeDiff.length ? `다름: ${routeDiff.join(", ")}` : want.screens.map((s) => s.route).join(", ")));

  const gp = new Map((got.plans ?? []).map((p) => [p.id, p]));
  r.push(check("요금제 id = PRD 요금제 표", gp.size === want.plans.length && want.plans.every((p) => gp.has(p.id)), [...gp.keys()].join(", ")));
  const fields = ["name", "monthly_price", "throttle_after", "price_after_discount", "discount_months"];
  const fieldDiff = [];
  for (const p of want.plans) for (const f of fields) if (gp.get(p.id)?.[f] !== p[f]) fieldDiff.push(`${p.id}.${f}`);
  r.push(check("요금제 값(이름·금액·속도·할인)이 PRD와 같음", fieldDiff.length === 0, fieldDiff.join(", ") || "모두 같음"));

  const gr = got.rules ?? [];
  const ruleDiff = want.rules.filter((w) => gr.find((x) => x.no === w.no)?.text !== w.text).map((w) => w.no);
  r.push(check("O/X 규칙이 PRD와 같음", gr.length === want.rules.length && ruleDiff.length === 0, `${gr.length} / PRD ${want.rules.length}${ruleDiff.length ? ` · 다른 번호: ${ruleDiff}` : ""}`));

  const oq = got.open_questions ?? [];
  const ids = oq.map((q) => q.id);
  r.push(check("확인 필요 id가 q1부터 겹치지 않음", ids.every((id) => /^q\d+$/.test(id)) && new Set(ids).size === ids.length, ids.join(", ")));
  r.push(check("확인 필요를 빠짐없이 옮김", oq.length >= want.openLines, `${oq.length}개 / PRD의 '확인 필요' 줄 ${want.openLines}개`));
  return r;
}
