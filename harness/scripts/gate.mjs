// 사용법: node harness/scripts/gate.mjs <1|2|approve|3|4|4c|5>
// 단계 게이트를 돌리고 결과 표를 출력한다. harness/out/state.json을 갱신하고, 실패하면 복귀 단계를 알려 주며 exit 1로 끝난다.
import { mkdirSync, writeFileSync } from "node:fs";
import { abs, exists, readJSON } from "./lib/common.mjs";
import { scopeCheck } from "./lib/scope.mjs";

const STAGES = {
  1: { name: "PRD 읽기", next: "2", back: "1", mod: "./checks/s1.mjs" },
  2: { name: "페이지 나누기", next: "approve", back: "2", mod: "./checks/s2.mjs" },
  approve: { name: "사람 승인", next: "3", back: "approve", mod: "./checks/approve.mjs" },
  3: { name: "토큰 적용", next: "4", back: "3", mod: "./checks/s3.mjs" },
  4: { name: "화면 구현", next: "4c", back: "4", mod: "./checks/s4.mjs" },
  "4c": { name: "기획자 주석", next: "5", back: "4c", mod: "./checks/s4c.mjs" },
  5: { name: "검증", next: "done", back: "4", mod: "./checks/s5.mjs" },
};
const MAX_RETRY = 2;
const STATE = "harness/out/state.json";

const stage = process.argv[2];
const s = STAGES[stage];
if (!s) {
  console.error(`사용법: node harness/scripts/gate.mjs <${Object.keys(STAGES).join("|")}>`);
  process.exit(2);
}

const { run } = await import(s.mod);
let results;
try {
  results = await run();
} catch (e) {
  results = [{ name: "검사 실행", ok: false, detail: String(e?.message ?? e) }];
}
// 5단계는 판정만 하므로 편집 범위 검사를 하지 않는다. 4c는 4단계 커밋 이후의 변경만 본다.
if (stage !== "5") results.unshift(scopeCheck(stage));

const ok = results.every((r) => r.ok);
console.log(`\n## G${stage} ${s.name}: ${ok ? "통과" : `실패 (${results.filter((r) => !r.ok).length}건)`}\n`);
console.log("| 검사 | 결과 | 근거 |\n|---|---|---|");
for (const r of results) console.log(`| ${r.name} | ${r.ok ? "통과" : "실패"} | ${r.detail.split("\n")[0]} |`);
for (const r of results.filter((x) => !x.ok && x.detail.includes("\n"))) console.log(`\n### ${r.name}\n    ${r.detail}`);

const state = exists(STATE) ? readJSON(STATE) : { current: "1", retries: {}, history: [] };
state.history.push({ stage, ok, at: new Date().toISOString() });
if (ok) {
  state.retries[stage] = 0;
  state.current = s.next;
  state.stopped = false;
  if (stage === "approve") state.approved = true;
  console.log(`\n다음: ${s.next === "done" ? "완료" : `${s.next}단계 ${STAGES[s.next].name}`} (통과했으니 커밋한다)`);
} else {
  state.retries[s.back] = (state.retries[s.back] ?? 0) + 1;
  state.current = s.back;
  const stop = state.retries[s.back] >= MAX_RETRY;
  state.stopped = stop;
  console.log(`\n복귀 단계: ${s.back} ${STAGES[s.back].name} (재시도 ${state.retries[s.back]}/${MAX_RETRY})`);
  if (stop) console.log("멈춤: 같은 단계에서 2번 실패했다. 실패 목록을 사람에게 보고한다.");
}
mkdirSync(abs("harness/out"), { recursive: true });
writeFileSync(abs(STATE), JSON.stringify(state, null, 2));
process.exit(ok ? 0 : 1);
