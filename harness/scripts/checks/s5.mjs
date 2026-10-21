// G5 판정: next start로 받은 실제 HTML에서 PRD O/X 규칙 1~7을 센다. 결과는 harness/out/05/verify.json.
import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { ROOT, abs, check, exists, readJSON, readText, walk } from "../lib/common.mjs";
import { parsePRD } from "../lib/prd.mjs";
import { npm } from "./s4.mjs";

const PORT = 3100;
const BASE = `http://localhost:${PORT}`;
const PRICE = /\d{1,3}(?:,\d{3})+\s*원/g;
const SPEED = /소진 후 [\d.]+Mbps로 제한|속도 제한 없음/g;

// attr="value"가 붙은 요소 하나를 여는 태그부터 짝이 맞는 닫는 태그까지 잘라 낸다.
function elementByAttr(html, attr, value) {
  const at = html.indexOf(`${attr}="${value}"`);
  if (at < 0) return null;
  const start = html.lastIndexOf("<", at);
  const tag = html.slice(start + 1).match(/^[a-zA-Z0-9]+/)[0];
  const re = new RegExp(`<${tag}[\\s>]|</${tag}>`, "g");
  re.lastIndex = start;
  let depth = 0;
  for (let m; (m = re.exec(html)); ) {
    depth += m[0].startsWith("</") ? -1 : 1;
    if (depth === 0) return html.slice(start, m.index + m[0].length);
  }
  return html.slice(start);
}

const text = (html) => html.replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ");
const count = (s, re) => (s.match(re) ?? []).length;
const won = (n) => `${n.toLocaleString("en-US")}원`;
const expectedSpeed = (p) => (p.throttle_after ? `소진 후 ${p.throttle_after}로 제한` : "속도 제한 없음");

// 가격 2개까지(규칙 3), 할인 종료 후 금액(규칙 4), 속도 표기(규칙 5)를 한 덩어리(카드·상세)에 적용한다.
function priceAndSpeed(where, html, plan) {
  const t = text(html);
  const out = { r3: [], r4: [], r5: [] };
  const prices = count(t, PRICE);
  const monthly = count(html, /data-price="monthly"/g);
  const after = count(html, /data-price="after-discount"/g);
  if (prices > 2 || monthly !== 1 || after > 1) out.r3.push(`${where}: 금액 ${prices}개, monthly ${monthly}, after-discount ${after}`);
  if (/line-through|<del[\s>]|<s[\s>]/.test(html) || /\d+\s?%/.test(t)) out.r3.push(`${where}: 취소선 또는 할인율 있음`);
  if (!t.includes(won(plan.monthly_price))) out.r3.push(`${where}: 매달 내는 금액 ${won(plan.monthly_price)} 없음`);

  if (plan.price_after_discount == null) {
    if (after > 0) out.r4.push(`${where}: 할인 없는 요금제인데 할인 종료 후 금액 있음`);
  } else {
    const a = text(elementByAttr(html, "data-price", "after-discount") ?? "");
    const want = `${plan.discount_months + 1}개월째부터`;
    if (!a.includes(want) || !a.includes(won(plan.price_after_discount))) out.r4.push(`${where}: "${want} ${won(plan.price_after_discount)}" 없음`);
  }

  const speeds = t.match(SPEED) ?? [];
  if (speeds.length !== 1 || speeds[0] !== expectedSpeed(plan)) {
    const msg = `${where}: 속도 표기 ${speeds.length}개 (${speeds.join(" / ") || "없음"}), 기대 "${expectedSpeed(plan)}"`;
    // 규칙 5는 이름에 "무제한"이 든 요금제만 대상이다. 나머지는 참고로만 남긴다.
    if (plan.name.includes("무제한")) out.r5.push(msg);
    else out.r3.push(`[참고] ${msg}`);
  }
  return out;
}

async function waitReady(ms = 90000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    try {
      const res = await fetch(`${BASE}/plans`);
      if (res.status < 500) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

const kill = (child) => {
  if (process.platform === "win32") spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"]);
  else child.kill("SIGTERM");
};

export async function run() {
  const prd = parsePRD();
  const approval = exists("harness/out/02/approval.json") ? readJSON("harness/out/02/approval.json") : {};
  const rec = approval.recommended;
  const b = npm("build");
  if (!b.ok) return [check("판정 전 build", false, b.tail)];

  const server = spawn("npx", ["next", "start", "-p", String(PORT)], { cwd: ROOT, shell: true, stdio: "ignore" });
  const R = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] };
  const get = async (path) => {
    const res = await fetch(`${BASE}${path}`);
    if (res.status !== 200) R[1].push(`${path}: HTTP ${res.status}`);
    return res.text();
  };

  try {
    if (!(await waitReady())) return [check("next start 기동", false, `${BASE} 응답 없음`)];

    // 요금제 목록: 규칙 1·2·3·4·5
    const list = await get("/plans");
    const cards = [...list.matchAll(/data-plan-card="([^"]+)"/g)].map((m) => m[1]);
    const ids = prd.plans.map((p) => p.id);
    if (cards.length !== ids.length || ids.some((id) => !cards.includes(id))) R[1].push(`/plans 카드 ${cards.length}개 (${cards.join(", ")}), 기대 ${ids.join(", ")}`);
    const tags = count(list, /data-tag="recommended"/g);
    if (tags !== 1) R[2].push(`/plans 추천 Tag ${tags}개`);
    for (const p of prd.plans) {
      const card = elementByAttr(list, "data-plan-card", p.id);
      if (!card) continue;
      const o = priceAndSpeed(`/plans 카드 ${p.id}`, card, p);
      R[3].push(...o.r3); R[4].push(...o.r4); R[5].push(...o.r5);
      if (tags === 1 && /data-tag="recommended"/.test(card) !== (p.id === rec)) R[2].push(`/plans 추천 Tag 위치가 approval(${rec})과 다름: ${p.id}`);
    }

    // 요금제 상세: 규칙 2(상세의 추천 표시)·3·4·5
    for (const p of prd.plans) {
      const html = await get(`/plans/${p.id}`);
      const main = elementByAttr(html, "data-plan-detail", p.id);
      if (!main) { R[1].push(`/plans/${p.id}: data-plan-detail 없음`); continue; }
      const o = priceAndSpeed(`/plans/${p.id}`, main, p);
      R[3].push(...o.r3); R[4].push(...o.r4); R[5].push(...o.r5);
      if (/data-tag="recommended"/.test(main) !== (p.id === rec)) R[2].push(`/plans/${p.id}: 추천 Tag 표시가 approval과 다름`);
    }

    // 구독 신청: 규칙 6 (초기 상태만)
    const apply = await get(`/apply?plan=${ids[0]}`);
    const cta = apply.match(/<button[^>]*data-cta="apply"[^>]*>/);
    if (!cta) R[6].push(`/apply: data-cta="apply" 버튼 없음`);
    else if (!/\sdisabled(=""|\s|>|\/)/.test(cta[0])) R[6].push(`/apply: 빈 입력 상태에서 '신청하기'가 disabled가 아님`);

    // 신청 완료: 규칙 7 (정적 근사)
    await get("/complete");
    const src = walk("app/complete", [".ts", ".tsx"]).map((f) => readText(f)).join("\n");
    if (!/_data\/plans/.test(src)) R[7].push("app/complete: _data/plans로 요금제를 조회하지 않음");
    const hard = prd.plans.filter((p) => src.includes(p.name)).map((p) => p.name);
    if (hard.length) R[7].push(`app/complete: 요금제 이름을 코드에 직접 씀 (${hard.join(", ")})`);
  } finally {
    kill(server);
  }

  const label = {
    1: "R1 카드 4개·라우트 200",
    2: "R2 추천 Tag 1개",
    3: "R3 가격 2개까지 ★",
    4: "R4 할인 종료 후 금액은 할인 요금제만 ★",
    5: "R5 무제한 속도 표기 ★",
    6: "R6 미입력 시 신청 불가 (초기 상태만)",
    7: "R7 완료 화면 = 신청 요금제 (정적 근사)",
  };
  const results = Object.entries(R).map(([no, issues]) => {
    const real = issues.filter((i) => !i.startsWith("[참고]"));
    return check(label[no], real.length === 0, issues.join("\n    ") || "통과");
  });
  mkdirSync(abs("harness/out/05"), { recursive: true });
  writeFileSync(abs("harness/out/05/verify.json"), JSON.stringify({ checked_at: new Date().toISOString(), results }, null, 2));
  return results;
}
