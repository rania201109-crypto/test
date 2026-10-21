// Card/Price — 주요 금액 요약. 패딩 20, 내부 간격 4, 모서리 12, 배경 bg/default.
// 할인율·정가는 쓰지 않는다. 매달 내는 금액 1개 + 할인 종료 후 금액 최대 1개.
import type { Plan } from "../_data/plans";
import { afterDiscountText, formatWon } from "../_data/plan-text";

export default function PriceCard({ plan }: { plan: Plan }) {
  const afterDiscount = afterDiscountText(plan);

  return (
    // ⚠ 확인 필요: Design.md 카드 너비 342 → 토큰 w-full + 부모 좌우 여백 24 (tokens.json에 없음)
    <section className="flex w-full flex-col gap-4 rounded-12 bg-bg-default p-20">
      <p className="text-caption font-medium text-text-tertiary">매달 내는 금액</p>
      <p data-price="monthly" className="text-heading-h2 font-bold text-text-primary">
        {formatWon(plan.monthly_price)}
      </p>
      {afterDiscount && (
        <p data-price="after-discount" className="text-caption font-medium text-text-tertiary">
          {afterDiscount}
        </p>
      )}
    </section>
  );
}
