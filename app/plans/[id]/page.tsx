/**
 * [화면] 요금제 상세
 * [목적] 선택한 요금제의 매달 내는 금액·할인 종료 후 금액·소진 후 속도를 확인하고 신청으로 넘어가게 한다.
 * [라우트] /plans/[id]
 * [들어오는 곳] 요금제 목록 카드의 '자세히', 구독 신청의 뒤로 아이콘·'취소'
 * [나가는 곳] '구독 신청하기' → 구독 신청(/apply?plan=<id>), 뒤로 아이콘 → 요금제 목록(/plans)
 * [근거] PRD 3장·4-2 · US3, US4, US5
 */
import { notFound } from "next/navigation";
import BottomCTA from "../../_components/BottomCTA";
import Button from "../../_components/Button";
import Header from "../../_components/Header";
import ListRow from "../../_components/ListRow";
import OptionItem from "../../_components/OptionItem";
import PriceCard from "../../_components/PriceCard";
import Tag from "../../_components/Tag";
import { getPlan, plans } from "../../_data/plans";
import { throttleText } from "../../_data/plan-text";

// 모든 요금제 id(p01~p04)의 상세 화면을 빌드할 때 미리 만든다.
export function generateStaticParams() {
  return plans.map((plan) => ({ id: plan.id }));
}

// ⚠ 확인 필요: 포함 혜택(OptionItem) 내용은 approval.json q8 값에 따라 비워 둠 (PRD 4-2)
const BENEFITS: { title: string; desc: string }[] = [];

export default async function PlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // 주소의 요금제 id(p01~p04)로 요금제 데이터에서 보여 줄 요금제를 찾는다. (PRD 4-2·5)
  const plan = getPlan(id);
  // ⚠ 확인 필요: 로딩·빈·에러 상태는 approval.json q9 값에 따라 만들지 않음. 없는 id는 기본 404 (PRD 4-2·6)
  if (!plan) notFound();

  return (
    <>
      {/* 헤더: 요금제 이름을 제목으로 보여 준다. 뒤로 아이콘을 누르면 요금제 목록(/plans)으로 이동한다. (PRD 3·4-2) */}
      <Header title={plan.name} backHref="/plans" />
      <main data-plan-detail={plan.id} className="flex w-full flex-col gap-24 p-24">
        {/* ⚠ 확인 필요: 추천 Tag 대상은 approval.json recommended = p02 (PRD 4-2·5) */}
        {/* 목록에서 추천 Tag가 붙은 요금제일 때만 '추천' 표시가 보이고, 아니면 숨긴다. (US2 · PRD 4-2) */}
        {plan.recommended && <Tag label="추천" tag="recommended" />}
        {/* 월 요금 카드: '매달 내는 금액' 1개와, 할인 있는 요금제만 '25개월째부터 ○원' 줄을 보여 준다. 할인이 없으면 그 줄을 숨긴다. (US4 · PRD 4-2 · 판정 규칙 3·4) */}
        <PriceCard plan={plan} />
        {/* 기본 제공 구역: 기본 데이터량과 소진 후 속도('소진 후 ○Mbps로 제한' 또는 '속도 제한 없음')를 보여 준다. (US1·US3 · PRD 4-2 · 판정 규칙 5) */}
        <section className="flex flex-col gap-12">
          <h2 className="text-heading-h3 font-bold text-text-primary">기본 제공</h2>
          {/* ⚠ 확인 필요: 통화·문자 등 다른 행은 approval.json q7 값에 따라 표시하지 않음 (PRD 4-2) */}
          <div className="flex flex-col">
            <ListRow label="데이터" value={plan.data} />
            <ListRow label="속도" value={<span data-throttle>{throttleText(plan)}</span>} />
          </div>
        </section>
        {/* 포함 혜택 구역: 혜택 내용이 정해지기 전까지는 비어 있어 화면에 나타나지 않는다. (PRD 4-2) */}
        {BENEFITS.length > 0 && (
          <section className="flex flex-col gap-12">
            <h2 className="text-heading-h3 font-bold text-text-primary">포함 혜택</h2>
            {BENEFITS.map((benefit) => (
              <OptionItem key={benefit.title} title={benefit.title} desc={benefit.desc} />
            ))}
          </section>
        )}
      </main>
      {/* ⚠ 확인 필요: PRD 4-2의 BottomCTA 매달 내는 금액 표시는 가격 2개 규칙(판정 규칙 3) 때문에 넣지 않음 */}
      {/* 하단 신청 영역: '구독 신청하기'를 누르면 이 요금제 id를 가지고 구독 신청(/apply?plan=<id>)으로 이동한다. (US5 · PRD 4-2) */}
      <BottomCTA bottom="32" gap="8">
        <Button variant="Primary" size="xl" href={`/apply?plan=${plan.id}`} fullWidth>
          구독 신청하기
        </Button>
      </BottomCTA>
    </>
  );
}
