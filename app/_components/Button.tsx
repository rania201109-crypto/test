// Button — Type=Primary | Secondary, Size=sm | lg | xl, State=Default | Hover | Disabled. 모서리 8, 좌우 패딩 24.
// href가 있으면 다른 화면으로 가는 링크로, 없으면 버튼으로 그린다.
import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  variant?: "Primary" | "Secondary";
  size?: "sm" | "lg" | "xl";
  href?: string;
  disabled?: boolean;
  onClick?: () => void;
  fullWidth?: boolean;
  // 판정 스크립트용 표시 (예: data-cta="apply")
  cta?: string;
};

const SIZE = {
  // ⚠ 확인 필요: Design.md sm 높이 Primary 40 / Secondary 42 → 토큰 h-40 (tokens.json에 42 없음)
  sm: "h-40 px-24",
  lg: "h-48 px-24",
  // ⚠ 확인 필요: Design.md xl 높이 52 → 토큰 h-56 (tokens.json에 없음)
  xl: "h-56 px-24",
};

const VARIANT = {
  Primary: "bg-fill-primary text-text-on-dark font-semibold hover:bg-fill-primary-hover",
  Secondary: "border border-border-default bg-surface-default text-text-primary font-semibold hover:bg-bg-subtle",
};

const DISABLED = {
  // Primary Disabled 라벨은 body/medium (Design.md Button)
  Primary: "bg-fill-disabled text-text-on-dark font-medium",
  // Secondary Disabled 라벨은 body/strong 유지
  Secondary: "border border-border-default bg-fill-disabled text-text-primary font-semibold",
};

export default function Button({
  children,
  variant = "Primary",
  size = "xl",
  href,
  disabled = false,
  onClick,
  fullWidth = false,
  cta,
}: ButtonProps) {
  // ⚠ 확인 필요: Design.md 라벨 줄높이 24 → 토큰 없음, 높이 클래스로만 맞춤 (tokens.json에 없음)
  const className = [
    "inline-flex shrink-0 items-center justify-center rounded-8 text-body",
    SIZE[size],
    disabled ? DISABLED[variant] : VARIANT[variant],
    fullWidth ? "w-full" : "",
  ].join(" ");

  if (href && !disabled) {
    return (
      <Link href={href} className={className} data-cta={cta}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={className} disabled={disabled} onClick={onClick} data-cta={cta}>
      {children}
    </button>
  );
}
