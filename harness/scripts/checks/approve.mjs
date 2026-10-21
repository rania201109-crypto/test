// 사람 승인: approval.json에 승인 표시, 모든 확인 필요 답, 추천 요금제 정확히 1개.
import { check, exists, readJSON } from "../lib/common.mjs";

export function run() {
  const OUT = "harness/out/02/approval.json";
  if (!exists(OUT)) return [check("approval.json 있음", false, `${OUT} 없음 — 사람에게 승인과 값을 받는다`)];
  const a = readJSON(OUT);
  const prd = readJSON("harness/out/01/prd.json");
  const ids = (prd.open_questions ?? []).map((q) => q.id);
  const answers = a.answers ?? {};
  const unanswered = ids.filter((id) => typeof answers[id] !== "string" || !answers[id].trim());
  const planIds = (prd.plans ?? []).map((p) => p.id);
  const rec = Array.isArray(a.recommended) ? a.recommended : [a.recommended].filter(Boolean);

  return [
    check("사람이 승인함", a.approved === true, `approved: ${a.approved}`),
    check("확인 필요에 모두 답함", unanswered.length === 0, unanswered.length ? `답 없음: ${unanswered.join(", ")}` : `${ids.length}개 모두`),
    check("추천 요금제가 정확히 1개 (PRD 규칙 2)", rec.length === 1 && planIds.includes(rec[0]), `recommended: ${JSON.stringify(a.recommended)}`),
  ];
}
