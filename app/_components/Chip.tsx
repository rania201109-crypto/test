// Chip — Type=benefit | package | sale. 이 서비스에서는 sale(할인 프로모션 문구)만 쓴다.
type ChipProps = {
  label: string;
  type?: "benefit" | "package" | "sale";
};

const TYPE = {
  benefit: "h-20 rounded-4 bg-bg-subtle text-caption-mini font-semibold text-text-secondary",
  package: "h-20 rounded-4 bg-fill-secondary text-caption-mini font-semibold text-text-on-dark",
  sale: "h-24 rounded-6 bg-bg-accent-subtle text-caption font-bold text-icon-accent",
};

export default function Chip({ label, type = "sale" }: ChipProps) {
  return (
    // ⚠ 확인 필요: Design.md Chip 좌우 패딩 값 없음 → 토큰 px-8 (Design.md에 없음)
    <span className={`inline-flex w-fit items-center px-8 ${TYPE[type]}`}>{label}</span>
  );
}
