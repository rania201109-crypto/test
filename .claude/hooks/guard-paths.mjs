// PreToolUse(Write|Edit|MultiEdit) 훅: 읽기 전용 경로에 쓰려고 하면 exit 2로 막는다.
// 막는 곳: docs/(screen-spec 날짜 파일 제외) · reference/ · 기존 screen-spec 에이전트 · planner-comments 스킬
import { readFileSync } from "node:fs";
import { relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const input = JSON.parse(readFileSync(0, "utf8") || "{}");
const target = input.tool_input?.file_path ?? input.tool_input?.notebook_path;
if (!target) process.exit(0);

const rel = relative(ROOT, resolve(input.cwd ?? ROOT, target)).split(sep).join("/");
const RULES = [
  { re: /^docs\/(?!\d{4}-\d{2}-\d{2}-screen-spec\.md$)/, why: "docs/는 읽기 전용이다 (screen-spec 날짜 파일만 예외). tokens.json·PRD는 사람이 고친다" },
  { re: /^reference\//, why: "reference/는 읽기 전용이다" },
  { re: /^\.claude\/agents\/screen-spec\.md$/, why: "기존 screen-spec 에이전트는 고치지 않는다" },
  { re: /^\.claude\/skills\/planner-comments\//, why: "기존 planner-comments 스킬은 고치지 않는다" },
];
const hit = RULES.find((r) => r.re.test(rel));
if (hit) {
  console.error(`[guard-paths] 거부: ${rel} — ${hit.why}`);
  process.exit(2);
}
