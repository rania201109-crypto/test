// 요금제 데이터를 화면 문구로 바꾸는 함수 모음.
import type { Plan } from "./plans";

// 39000 → "39,000원"
export function formatWon(amount: number): string {
  return `${String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원`;
}

// "소진 후 1Mbps로 제한" 또는 "속도 제한 없음" (PRD 4-1·4-2, 판정 규칙 5)
export function throttleText(plan: Plan): string {
  return plan.throttle_after ? `소진 후 ${plan.throttle_after}로 제한` : "속도 제한 없음";
}

// "25개월째부터 69,000원". 할인이 없는 요금제는 null (PRD 4-1·4-2, 판정 규칙 4)
export function afterDiscountText(plan: Plan): string | null {
  if (plan.price_after_discount == null || plan.discount_months == null) return null;
  return `${plan.discount_months + 1}개월째부터 ${formatWon(plan.price_after_discount)}`;
}

// "24개월 할인". 할인이 없는 요금제는 null (PRD 4-1)
export function discountChipText(plan: Plan): string | null {
  return plan.discount_months == null ? null : `${plan.discount_months}개월 할인`;
}

// 필터용 기본 데이터량(GB). "무제한"은 가장 큰 값으로 본다.
export function dataAmountGb(plan: Plan): number {
  if (plan.data.includes("무제한")) return Number.POSITIVE_INFINITY;
  const match = plan.data.match(/(\d+)\s*GB/);
  return match ? Number(match[1]) : 0;
}
