// 사용법: node check-comments-only.mjs <원본 파일> <수정한 파일>
// 원본의 모든 줄이 순서대로 그대로 남아 있고, 새로 생긴 줄이 모두 주석 줄이면 통과(종료 코드 0).
import { readFileSync } from "node:fs";

const [, , beforePath, afterPath] = process.argv;
if (!beforePath || !afterPath) {
  console.error("사용법: node check-comments-only.mjs <원본 파일> <수정한 파일>");
  process.exit(2);
}

const read = (p) => readFileSync(p, "utf8").replace(/\r\n/g, "\n").split("\n");
const before = read(beforePath);
const after = read(afterPath);

const isCommentLine = (line) => {
  const t = line.trim();
  return (
    t.startsWith("//") ||
    t.startsWith("/*") ||
    t.startsWith("*") ||
    t.startsWith("{/*") ||
    t.startsWith("<!--")
  );
};

// 원본 줄이 수정본 안에 순서대로 들어 있는지 확인하고, 짝이 없는 수정본 줄을 모은다.
const added = [];
let i = 0;
for (let j = 0; j < after.length; j++) {
  if (i < before.length && after[j] === before[i]) {
    i++;
  } else {
    added.push({ line: j + 1, text: after[j] });
  }
}

const problems = [];
if (i < before.length) {
  problems.push(`원본 ${i + 1}번째 줄이 바뀌었거나 사라졌다: ${JSON.stringify(before[i])}`);
}
for (const a of added) {
  if (!isCommentLine(a.text)) {
    problems.push(`수정본 ${a.line}번째 줄이 주석이 아니다: ${JSON.stringify(a.text)}`);
  }
}

if (problems.length) {
  console.log("실패");
  for (const p of problems) console.log(" - " + p);
  process.exit(1);
}
console.log(`통과: 주석 ${added.length}줄 추가, 코드 변경 없음`);
