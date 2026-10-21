// BottomCTA — 하단 동작 영역. 배경 bg/surface, 상단 선 border/subtle.
// 화면 예시 기준: 좌우 24, 상단 16, 하단 32(상세) 또는 24(신청·완료), 내부 간격 8 또는 12.
// 고정(sticky) 동작은 Design.md가 정하지 않았으므로 본문 아래에 둔다.
import type { ReactNode } from "react";

type BottomCTAProps = {
  children: ReactNode;
  bottom?: "24" | "32";
  gap?: "8" | "12";
};

const BOTTOM = { "24": "pb-24", "32": "pb-32" };
const GAP = { "8": "gap-8", "12": "gap-12" };

export default function BottomCTA({ children, bottom = "32", gap = "8" }: BottomCTAProps) {
  return (
    // ⚠ 확인 필요: Design.md BottomCTA 너비 390 → 토큰 w-full (tokens.json에 없음)
    <div className={`mt-auto flex w-full flex-col border-t border-border-subtle bg-bg-surface px-24 pt-16 ${BOTTOM[bottom]} ${GAP[gap]}`}>
      {children}
    </div>
  );
}
