// Input — State=default | caution | disabled | filled | focus. 모서리 0, 입력 텍스트 body/strong.
// 입력 영역과 메시지 사이 간격 12. caution이면 border/error와 오류 메시지를 보여 준다.
type InputProps = {
  id: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  errorMessage?: string | null;
  disabled?: boolean;
  inputMode?: "text" | "numeric";
  maxLength?: number;
  autoComplete?: string;
};

export default function Input({
  id,
  placeholder,
  value,
  onChange,
  onBlur,
  errorMessage,
  disabled = false,
  inputMode = "text",
  maxLength,
  autoComplete,
}: InputProps) {
  const caution = Boolean(errorMessage);
  const border = caution ? "border-border-error" : "border-border-default focus:border-border-focus";
  const surface = disabled ? "bg-bg-subtle text-text-on-disabled" : "bg-bg-surface text-text-primary";

  return (
    <div className="flex w-full flex-col gap-12">
      {/* ⚠ 확인 필요: Design.md 입력 영역 높이 58 → 토큰 h-56 (tokens.json에 없음) */}
      {/* ⚠ 확인 필요: Design.md 입력란 너비 358 → 토큰 w-full + 부모 좌우 여백 16 (tokens.json에 없음) */}
      <input
        id={id}
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        inputMode={inputMode}
        maxLength={maxLength}
        autoComplete={autoComplete}
        aria-invalid={caution}
        aria-describedby={caution ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        className={`h-56 w-full rounded-0 border px-16 text-body font-semibold outline-none placeholder:text-text-placeholder ${border} ${surface}`}
      />
      {/* ⚠ 확인 필요: Design.md caution 오류 아이콘 크기 값 없음 → 아이콘 생략, 메시지만 표시 */}
      {caution && (
        <p id={`${id}-error`} className="text-body-small font-medium text-text-error">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
