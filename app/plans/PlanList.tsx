"use client";

import { useState } from "react";
import FilterChip from "../_components/FilterChip";
import PlanCard from "../_components/PlanCard";
import type { Plan } from "../_data/plans";
import { plans } from "../_data/plans";
import { dataAmountGb } from "../_data/plan-text";

// 요금제 목록 화면의 필터 칩과 카드 목록 부분. 요금제 목록(/plans) 안에 들어간다. (PRD 4-1)
type FilterId = "all" | "data50" | "unthrottled" | "discount";

// ⚠ 확인 필요: 필터 칩 항목은 approval.json q4·q16 값 '전체'·'데이터 50GB 이상'·'속도 제한 없음'·'할인 있음' (PRD 4-1·6)
// 칩마다 남길 카드 조건: 전체=4개 모두, 50GB 이상, 소진 후 속도 제한 없음, 24개월 할인 있음. (US2 · PRD 4-1)
const FILTERS: { id: FilterId; label: string; match: (plan: Plan) => boolean }[] = [
  { id: "all", label: "전체", match: () => true },
  { id: "data50", label: "데이터 50GB 이상", match: (plan) => dataAmountGb(plan) >= 50 },
  { id: "unthrottled", label: "속도 제한 없음", match: (plan) => plan.throttle_after === null },
  { id: "discount", label: "할인 있음", match: (plan) => plan.discount_months !== null },
];

// ⚠ 확인 필요: 기본 정렬은 approval.json q3 값 '매달 내는 금액이 낮은 순' (PRD 4-1)
const SORTED = [...plans].sort((a, b) => a.monthly_price - b.monthly_price);

export default function PlanList() {
  // 화면이 기억하는 선택 칩(state). 처음에는 '전체'가 선택되어 4개 카드가 모두 보인다. (US2 · PRD 4-1)
  const [filterId, setFilterId] = useState<FilterId>("all");
  const filter = FILTERS.find((item) => item.id === filterId) ?? FILTERS[0];
  // 선택한 칩의 조건에 맞는 카드만 남긴다. 순서는 위 기본 정렬을 따른다. (US2 · PRD 4-1)
  const visible = SORTED.filter(filter.match);

  return (
    <>
      {/* 필터 칩 구역: 칩을 누르면 그 칩이 선택 상태로 바뀌고 조건에 맞는 카드만 남는다. '전체'를 누르면 4개로 돌아간다. (US2 · PRD 4-1) */}
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
      {/* 요금제 카드 목록 구역: 카드마다 이름·데이터량·소진 후 속도·매달 내는 금액을 보여 준다. 정가·할인율은 없다. (US1·US3·US4 · PRD 4-1 · 판정 규칙 1·3·5) */}
      {/* 할인이 있는 요금제(p03)만 '24개월 할인' 표시와 '25개월째부터 ○원' 줄이 보이고, 없으면 숨긴다. (US4 · PRD 4-1 · 판정 규칙 4) */}
      {/* ⚠ 확인 필요: 추천 Tag는 approval.json recommended = p02 카드 1개에만 붙는 실습용 임시값이다. (US2 · PRD 4-1 · 판정 규칙 2) */}
      {/* 카드의 '자세히'를 누르면 그 요금제의 상세(/plans/[id])로 이동한다. (US5 · PRD 4-1) */}
      <div className="flex flex-col gap-16">
        {visible.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </>
  );
}
