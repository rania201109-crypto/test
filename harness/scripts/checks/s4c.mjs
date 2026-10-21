// G4c: planner-comments가 주석만 추가했는지, 4단계 커밋(HEAD)을 원본으로 기존 검사 스크립트를 다시 돌린다.
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ROOT, abs, check, readText } from "../lib/common.mjs";

const CHECKER = ".claude/skills/planner-comments/scripts/check-comments-only.mjs";

export function run() {
  const git = (...a) => execFileSync("git", a, { cwd: ROOT, encoding: "utf8" });
  const changed = git("diff", "--name-only", "HEAD", "--", "app").split("\n").filter(Boolean);
  const r = [check("주석이 달린 파일이 있음", changed.length > 0, changed.length ? `${changed.length}개` : "app/ 변경 없음")];

  const tmp = mkdtempSync(join(tmpdir(), "harness-4c-"));
  const fails = [];
  for (const f of changed) {
    const before = join(tmp, f.replace(/[\\/]/g, "__"));
    writeFileSync(before, git("show", `HEAD:${f}`));
    const p = spawnSync(process.execPath, [abs(CHECKER), before, abs(f)], { encoding: "utf8" });
    if (p.status !== 0) fails.push(`${f}: ${p.stdout.trim().split("\n").slice(1, 3).join(" / ")}`);
  }
  r.push(check("check-comments-only: 코드 변경 없음", fails.length === 0, fails.join("\n    ") || "모두 통과"));

  const routes = changed.filter((f) => f.endsWith("/page.tsx"));
  const noHead = routes.filter((f) => !readText(f).includes("[화면]"));
  r.push(check("라우트 파일 맨 위에 [화면] 요약 주석", noHead.length === 0, noHead.join(", ") || `${routes.length}개`));
  return r;
}
