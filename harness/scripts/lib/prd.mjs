// docs/PRD.md의 표를 직접 읽는다. 1단계 결과(prd.json)를 대조하는 "정답"으로 쓴다.
import { readText } from "./common.mjs";

// "### 제목" 아래 첫 번째 표의 데이터 행을 칸 배열로 돌려준다.
function tableAfter(md, heading) {
  const lines = md.split("\n");
  const start = lines.findIndex((l) => l.trim().startsWith(heading));
  if (start < 0) throw new Error(`PRD에서 "${heading}"을 찾지 못했다`);
  const rows = [];
  let inTable = false;
  for (let i = start + 1; i < lines.length; i++) {
    const t = lines[i].trim();
    if (t.startsWith("|")) {
      inTable = true;
      rows.push(t.slice(1, -1).split("|").map((c) => c.trim()));
    } else if (inTable) break;
    else if (t.startsWith("#")) break;
  }
  return rows.slice(2); // 머리글 행과 구분선 행 제외
}

const won = (s) => {
  const m = s.match(/(\d{1,3}(?:,\d{3})+)원/);
  return m ? Number(m[1].replace(/,/g, "")) : null;
};

export function parsePRD() {
  const md = readText("docs/PRD.md");

  const screens = tableAfter(md, "### 화면 구조").map((c) => ({
    order: Number(c[0]),
    name: c[1],
    route: c[2].replace(/`/g, ""),
    stories: c[4].split(",").map((s) => s.trim()).filter(Boolean),
  }));

  const plans = tableAfter(md, "### 요금제 데이터").map((c) => {
    const months = c[2].match(/(\d+)개월 할인/);
    const throttle = c[4].match(/([\d.]+Mbps)로 제한/);
    return {
      id: c[0],
      name: c[1],
      monthly_price: won(c[2]),
      data: c[3],
      throttle_after: throttle ? throttle[1] : null,
      price_after_discount: won(c[5]),
      discount_months: months ? Number(months[1]) : null,
      description: c[6],
    };
  });

  const lines = md.split("\n");
  const ri = lines.findIndex((l) => l.startsWith("### 어기면 안 되는 것"));
  const rules = [];
  for (let i = ri + 1; i < lines.length; i++) {
    if (/^(#|---)/.test(lines[i])) break;
    const m = lines[i].match(/^(\d+)\.\s+(.*)$/);
    if (m) rules.push({ no: Number(m[1]), text: m[2].trim() });
  }

  // "확인 필요"가 들어간 줄 수. prd.json의 open_questions는 최소 이만큼 있어야 한다.
  const openLines = lines.filter((l) => l.includes("확인 필요")).length;

  return { screens, plans, rules, openLines };
}

// 라우트 → App Router 파일 경로. 예: /plans/[id] → app/plans/[id]/page.tsx
export const routeFile = (route) => `app${route === "/" ? "" : route}/page.tsx`;
