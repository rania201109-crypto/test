"use client";
/**
 * [화면] 신청 완료
 * [목적] 방금 저장한 구독 신청 내역(신청 번호·요금제·매달 내는 금액·신청 일시·신청자 이름)을 보여 준다.
 * [라우트] /complete
 * [들어오는 곳] 구독 신청의 '신청하기'(저장 성공 후)
 * [나가는 곳] 뒤로 아이콘·'요금제 더 보기' → 요금제 목록(/plans)
 * [근거] PRD 3장·4-4 · US5 · 판정 규칙 7
 * ⚠ 확인 필요: 나가는 곳 두 개는 PRD에 목적지가 없어 approval.json 값(/plans)을 쓴 임시값이다. (PRD 3·4-4)
 */

import { useMemo, useSyncExternalStore } from "react";
import BottomCTA from "../_components/BottomCTA";
import Button from "../_components/Button";
import Header from "../_components/Header";
import IconDoneMark from "../_components/IconDoneMark";
import ListRow from "../_components/ListRow";
import { getPlan } from "../_data/plans";
import { formatWon } from "../_data/plan-text";
import { parseSubscription, readSubscriptionRaw } from "../_data/subscription";

// 저장된 신청 1건은 브라우저에서만 읽을 수 있다. 서버에서 그릴 때는 값이 없는 것으로 본다.
const subscribe = () => () => {};
const getServerSnapshot = () => null;

function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleString("ko-KR");
}

export default function CompletePage() {
  const raw = useSyncExternalStore(subscribe, readSubscriptionRaw, getServerSnapshot);
  const subscription = useMemo(() => parseSubscription(raw), [raw]);
  // 요금제 이름·매달 내는 금액은 저장된 plan_id로 요금제 데이터에서 다시 찾는다. (판정 규칙 7)
  const plan = subscription ? getPlan(subscription.plan_id) : undefined;

  return (
    <>
      {/* ⚠ 확인 필요: 뒤로 아이콘 목적지는 approval.json q1·q12 값 /plans (PRD 3·4-4) */}
      {/* 헤더: 뒤로 아이콘을 누르면 요금제 목록(/plans)으로 이동한다. (PRD 4-4) */}
      <Header title="신청 완료" backHref="/plans" />
      <main className="flex w-full flex-col gap-16 p-16">
        {/* 완료 표시 구역: 완료 아이콘과 '구독 신청이 완료됐어요' 문구를 보여 준다. (US5 · PRD 4-4) */}
        <section className="flex flex-col items-center gap-12">
          <IconDoneMark />
          <h2 className="text-heading-h3 font-bold text-text-primary">구독 신청이 완료됐어요</h2>
        </section>
        {/* ⚠ 확인 필요: 로딩·빈·에러 상태는 approval.json q13 값에 따라 만들지 않음. 저장값이 없으면 내역을 비워 둠 (PRD 4-4·6) */}
        {/* 신청 내역 구역: 신청 번호·요금제 이름·매달 내는 금액·신청 일시·신청자 이름을 방금 저장한 신청 1건 값으로 채운다. (US5 · PRD 4-4 · 판정 규칙 7) */}
        {subscription && plan && (
          <div className="flex flex-col">
            <ListRow label="신청 번호" value={subscription.id} />
            <ListRow label="요금제" value={plan.name} />
            <ListRow label="매달 내는 금액" value={formatWon(plan.monthly_price)} />
            <ListRow label="신청 일시" value={formatDateTime(subscription.created_at)} />
            <ListRow label="신청자 이름" value={subscription.name} />
          </div>
        )}
      </main>
      {/* ⚠ 확인 필요: '요금제 더 보기' 목적지는 approval.json q2·q11 값 /plans (PRD 3·4-4) */}
      {/* 하단 버튼 영역: '요금제 더 보기'를 누르면 요금제 목록(/plans)으로 이동한다. (PRD 4-4) */}
      <BottomCTA bottom="24" gap="12">
        <Button variant="Primary" size="xl" href="/plans" fullWidth>
          요금제 더 보기
        </Button>
      </BottomCTA>
    </>
  );
}
