// OptionItem — State=default | selected. 단일 선택 카드. 상하 16, 좌우 20, 내부 간격 12, 모서리 12.
type OptionItemProps = {
  title: string;
  desc: string;
  selected?: boolean;
};

const STATE = {
  default: "border border-border-default bg-bg-surface",
  // ⚠ 확인 필요: Design.md selected 테두리 1.5 → 토큰 border(1) (tokens.json에 없음)
  selected: "border border-border-medium bg-bg-default",
};

export default function OptionItem({ title, desc, selected = false }: OptionItemProps) {
  return (
    <div className={`flex w-full items-start gap-12 rounded-12 px-20 py-16 ${selected ? STATE.selected : STATE.default}`}>
      <div className="flex grow flex-col gap-4">
        <p className={selected ? "text-subtitle font-bold text-text-primary" : "text-body font-semibold text-text-primary"}>
          {title}
        </p>
        <p className="text-body-small font-medium text-text-secondary">{desc}</p>
      </div>
    </div>
  );
}
