// FilterChip — State=default | selected. 높이 40, 상하 8, 좌우 16, 모서리 full. 선택 상태는 회색조(fill/secondary).
type FilterChipProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

const STATE = {
  default: "border-border-default bg-bg-surface text-text-primary font-medium",
  selected: "border-fill-secondary bg-fill-secondary text-text-on-dark font-semibold",
};

export default function FilterChip({ label, selected, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`inline-flex h-40 shrink-0 items-center whitespace-nowrap rounded-full border px-16 py-8 text-body-small ${selected ? STATE.selected : STATE.default}`}
    >
      {label}
    </button>
  );
}
