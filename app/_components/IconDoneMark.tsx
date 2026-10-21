// icon/doneMark — 64×64. 원형 fill/primary 배경 + 밝은(icon/on-dark) 체크 도형.
export default function IconDoneMark() {
  return (
    <span className="flex size-64 items-center justify-center rounded-full bg-fill-primary text-icon-on-dark" aria-hidden="true">
      {/* ⚠ 확인 필요: Design.md 내부 도형 크기 값 없음 → 토큰 size-40 (Design.md에 없음) */}
      <svg className="size-40" viewBox="0 0 24 24" fill="none">
        <path d="M6 12.5L10 16.5L18 8.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
