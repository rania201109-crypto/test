// Tag — 추천 등 짧은 상태 표시. 상하 4, 좌우 12, 모서리 999, caption/bold, 배경 border/subtle, 글자 text/secondary.
type TagProps = {
  label: string;
  // 판정 스크립트용 표시 (예: data-tag="recommended")
  tag?: string;
};

export default function Tag({ label, tag }: TagProps) {
  return (
    // ⚠ 확인 필요: Design.md Tag 높이 26(줄높이 18) → 토큰 py-4 + 기본 줄높이 (tokens.json에 줄높이 없음)
    <span
      data-tag={tag}
      className="inline-flex w-fit items-center rounded-999 bg-border-subtle px-12 py-4 text-caption font-bold text-text-secondary"
    >
      {label}
    </span>
  );
}
