// Header — Type=default | root. 높이 56, 좌우 16, 상하 4. default 내부 간격 8, root 내부 간격 12.
import Link from "next/link";
import IconArrowLeft from "./IconArrowLeft";
import Logo from "./Logo";

type HeaderProps = {
  title: string;
  type?: "default" | "root";
  // default 타입에서 뒤로 아이콘을 눌렀을 때 갈 곳. 없으면 아이콘 자리를 빈 공간으로 둔다.
  backHref?: string;
};

// ⚠ 확인 필요: Design.md Header 너비 390 → 토큰 w-full (tokens.json에 없음)
const BASE = "flex h-56 w-full shrink-0 items-center bg-bg-surface px-16 py-4";

export default function Header({ title, type = "default", backHref }: HeaderProps) {
  if (type === "root") {
    return (
      <header className={`${BASE} gap-12`}>
        <h1 className="grow text-heading-h4 font-medium text-text-primary">{title}</h1>
        <Logo />
      </header>
    );
  }

  return (
    <header className={`${BASE} gap-8`}>
      {backHref ? (
        <Link href={backHref} aria-label="뒤로" className="flex size-24 shrink-0 items-center justify-center">
          <IconArrowLeft />
        </Link>
      ) : (
        <span className="size-24 shrink-0" aria-hidden="true" />
      )}
      <h1 className="grow text-center text-subtitle font-semibold text-text-primary">{title}</h1>
      <span className="size-24 shrink-0" aria-hidden="true" />
    </header>
  );
}
