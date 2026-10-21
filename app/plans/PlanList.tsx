"use client";

import { useState } from "react";
import FilterChip from "../_components/FilterChip";
import PlanCard from "../_components/PlanCard";
import type { Plan } from "../_data/plans";
import { plans } from "../_data/plans";
import { dataAmountGb } from "../_data/plan-text";

type FilterId = "all" | "data50" | "unthrottled" | "discount";

// ⚠ 확인 필요: 필터 칩 항목은 approval.json q4·q16 값 '전체'·'데이터 50GB 이상'·'속도 제한 없음'·'할인 있음' (PRD 4-1·6)
const FILTERS: { id: FilterId; label: string; match: (plan: Plan) => boolean }[] = [
  { id: "all", label: "전체", match: () => true },
  { id: "data50", label: "데이터 50GB 이상", match: (plan) => dataAmountGb(plan) >= 50 },
  { id: "unthrottled", label: "속도 제한 없음", match: (plan) => plan.throttle_after === null },
  { id: "discount", label: "할인 있음", match: (plan) => plan.discount_months !== null },
];

// ⚠ 확인 필요: 기본 정렬은 approval.json q3 값 '매달 내는 금액이 낮은 순' (PRD 4-1)
const SORTED = [...plans].sort((a, b) => a.monthly_price - b.monthly_price);

export default function PlanList() {
  const [filterId, setFilterId] = useState<FilterId>("all");
  const filter = FILTERS.find((item) => item.id === filterId) ?? FILTERS[0];
  const visible = SORTED.filter(filter.match);

  return (
    <>
      <div className="flex gap-8 overflow-x-auto" role="group" aria-label="요금제 필터">
        {FILTERS.map((item) => (
          <FilterChip
            key={item.id}
            label={item.label}
            selected={item.id === filterId}
            onClick={() => setFilterId(item.id)}
          />
        ))}
      </div>
      {/* ⚠ 확인 필요: 로딩·빈·에러 상태는 approval.json q6 값에 따라 만들지 않음 (PRD 4-1·6) */}
      <div className="flex flex-col gap-16">
        {visible.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </>
  );
}
