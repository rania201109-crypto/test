// Logo — 32×24, brand/primary. Header root의 우측 브랜드 표시.
export default function Logo() {
  return (
    <svg className="h-24 w-32 shrink-0 text-brand-primary" viewBox="0 0 32 24" fill="currentColor" role="img" aria-label="로고">
      <circle cx="9" cy="12" r="8" />
      <rect x="20" y="4" width="8" height="16" rx="2" />
    </svg>
  );
}
