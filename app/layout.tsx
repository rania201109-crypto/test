import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "요금제 추천·구독",
  description: "데이터량·소진 후 속도·매달 내는 금액을 비교하고 바로 신청하는 요금제 서비스",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      {/* ⚠ 확인 필요: Design.md 기준 화면 폭 390 → max-w 미사용, 토큰 w-full (tokens.json에 없음) */}
      <body className="flex min-h-full w-full flex-col bg-bg-surface font-family-font text-text-primary">
        {children}
      </body>
    </html>
  );
}
