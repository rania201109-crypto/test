// 하네스 스크립트 공통 도구: 프로젝트 경로, 파일 읽기, 폴더 훑기, git 변경 목록.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

export const ROOT = fileURLToPath(new URL("../../../", import.meta.url));

export const abs = (p) => join(ROOT, p);
export const toRel = (p) => relative(ROOT, p).split(sep).join("/");
export const exists = (p) => existsSync(abs(p));
export const readText = (p) => readFileSync(abs(p), "utf8").replace(/\r\n/g, "\n");
export const readJSON = (p) => JSON.parse(readText(p));

// 폴더 아래 파일을 모두 모은다(node_modules·.next 제외). 결과는 프로젝트 기준 상대 경로.
export function walk(dir, exts) {
  const out = [];
  if (!exists(dir)) return out;
  const visit = (d) => {
    for (const name of readdirSync(abs(d))) {
      if (name === "node_modules" || name === ".next") continue;
      const p = `${d}/${name}`;
      if (statSync(abs(p)).isDirectory()) visit(p);
      else if (!exts || exts.some((e) => name.endsWith(e))) out.push(p);
    }
  };
  visit(dir);
  return out;
}

// 커밋되지 않은 변경(새 파일 포함) 경로 목록.
export function changedFiles() {
  const out = execFileSync("git", ["status", "--porcelain", "-uall"], { cwd: ROOT, encoding: "utf8" });
  return out
    .split("\n")
    .filter(Boolean)
    .map((l) => l.slice(3).replace(/^"|"$/g, ""))
    .map((p) => (p.includes(" -> ") ? p.split(" -> ")[1] : p));
}

// 결과 항목 하나를 만든다. 모든 검사는 이 모양으로 돌려준다.
export const check = (name, ok, detail = "") => ({ name, ok: Boolean(ok), detail });
