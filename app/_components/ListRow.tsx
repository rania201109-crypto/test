// List/Row — Type=default | check. 라벨과 값을 나란히 보여 주는 정보 행. 상하 12, 좌우 4, 내부 간격 12.
import type { ReactNode } from "react";

type ListRowProps = {
  label: string;
  value: ReactNode;
  type?: "default" | "check";
};

export default function ListRow({ label, value, type = "default" }: ListRowProps) {
  return (
    // ⚠ 확인 필요: Design.md 행 너비 358 → 토큰 w-full (tokens.json에 없음)
    <div className="flex w-full items-start justify-between gap-12 border-b border-border-subtle px-4 py-12">
      <span className="flex shrink-0 items-center gap-8 text-body-small font-medium text-text-secondary">
        {type === "check" && <span className="size-4 rounded-full bg-icon-accent" aria-hidden="true" />}
        {label}
      </span>
      <span
        className={`text-right text-body-small font-semibold ${type === "check" ? "text-text-accent" : "text-text-primary"}`}
      >
        {value}
      </span>
    </div>
  );
}
