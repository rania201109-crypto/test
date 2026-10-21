// Card/Plan — 요금제 이름·설명·가격·배지·프로모션·버튼 묶음. 패딩 20, 내부 간격 8, 모서리 16, border/default 1.
// Discount·Original(할인율·정가) 속성은 쓰지 않는다. 가격은 매달 내는 금액 1개 + 할인 종료 후 금액 최대 1개.
import type { Plan } from "../_data/plans";
import { afterDiscountText, discountChipText, formatWon, throttleText } from "../_data/plan-text";
import Button from "./Button";
import Chip from "./Chip";
import Tag from "./Tag";

export default function PlanCard({ plan }: { plan: Plan }) {
  const chip = discountChipText(plan);
  const afterDiscount = afterDiscountText(plan);

  return (
    // ⚠ 확인 필요: Design.md 카드 너비 342 → 토큰 w-full + 부모 좌우 여백 24 (tokens.json에 없음)
    <article
      data-plan-card={plan.id}
      className="flex w-full flex-col gap-8 rounded-16 border border-border-default bg-bg-surface p-20"
    >
      {(plan.recommended || chip) && (
        <div className="flex flex-wrap items-center gap-8">
          {/* ⚠ 확인 필요: 추천 Tag 대상은 approval.json recommended = p02 (PRD 4-1) */}
          {plan.recommended && <Tag label="추천" tag="recommended" />}
          {chip && <Chip type="sale" label={chip} />}
        </div>
      )}
      <h2 className="text-subtitle font-bold text-text-primary">{plan.name}</h2>
      <p className="text-body-small font-medium text-text-secondary">{plan.description}</p>
      <div className="flex flex-col gap-4">
        <p className="text-body-small font-semibold text-text-primary">데이터 {plan.data}</p>
        <p data-throttle className="text-body-small font-medium text-text-secondary">
          {throttleText(plan)}
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-subtitle font-bold text-text-primary">
          매달 <span data-price="monthly">{formatWon(plan.monthly_price)}</span>
        </p>
        {afterDiscount && (
          <p data-price="after-discount" className="text-caption font-medium text-text-tertiary">
            {afterDiscount}
          </p>
        )}
      </div>
      <Button variant="Secondary" size="sm" href={`/plans/${plan.id}`} fullWidth>
        자세히
      </Button>
    </article>
  );
}
