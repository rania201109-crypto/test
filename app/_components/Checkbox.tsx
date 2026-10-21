// Checkbox — State=default | active. 24×24. active는 fill/primary + 밝은 체크 표시. 설명 텍스트는 바깥에서 함께 배치한다.
import IconCheck from "./IconCheck";

type CheckboxProps = {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
};

const STATE = {
  default: "border border-border-default bg-bg-surface text-bg-surface",
  active: "border border-fill-primary bg-fill-primary text-icon-on-dark",
};

export default function Checkbox({ id, checked, onChange, label }: CheckboxProps) {
  return (
    <label htmlFor={id} className="flex w-full items-center gap-8">
      <input
        id={id}
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      {/* ⚠ 확인 필요: Design.md Checkbox 모서리 값 없음 → 토큰 rounded-4 (Design.md에 없음) */}
      <span className={`flex size-24 shrink-0 items-center justify-center rounded-4 ${checked ? STATE.active : STATE.default}`} aria-hidden="true">
        <IconCheck />
      </span>
      <span className="text-body-small font-medium text-text-primary">{label}</span>
    </label>
  );
}
