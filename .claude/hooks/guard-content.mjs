// PreToolUse(Write|Edit|MultiEdit) 훅: app/·styles/에 쓰는 내용에 토큰 밖 값·취소선·할인율·개인정보가 있으면 exit 2로 막는다.
// 규칙은 게이트 4와 같은 harness/scripts/lib/content-rules.mjs를 쓴다.
import { readFileSync } from "node:fs";
import { relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { scanContent } from "../../harness/scripts/lib/content-rules.mjs";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const input = JSON.parse(readFileSync(0, "utf8") || "{}");
const ti = input.tool_input ?? {};
if (!ti.file_path) process.exit(0);

const rel = relative(ROOT, resolve(input.cwd ?? ROOT, ti.file_path)).split(sep).join("/");
// Write는 전체 내용, Edit·MultiEdit는 새로 들어가는 부분만 검사한다.
const added = ti.content ?? ti.new_string ?? (ti.edits ?? []).map((e) => e.new_string).join("\n");
const v = scanContent(rel, added ?? "");
if (v.length) {
  console.error(`[guard-content] 거부: ${rel}에 규칙 위반 ${v.length}건`);
  for (const x of v.slice(0, 10)) console.error(`  - ${x.line}행 ${x.rule}: ${x.snippet}`);
  console.error("tokens.json에 있는 값만 쓴다. 필요한 값이 없으면 멈추고 사람에게 묻는다.");
  process.exit(2);
}
