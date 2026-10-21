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
  const plan = getPlan(id);
  // ⚠ 확인 필요: 로딩·빈·에러 상태는 approval.json q9 값에 따라 만들지 않음. 없는 id는 기본 404 (PRD 4-2·6)
  if (!plan) notFound();

  return (
    <>
      <Header title={plan.name} backHref="/plans" />
      <main data-plan-detail={plan.id} className="flex w-full flex-col gap-24 p-24">
        {/* ⚠ 확인 필요: 추천 Tag 대상은 approval.json recommended = p02 (PRD 4-2·5) */}
        {plan.recommended && <Tag label="추천" tag="recommended" />}
        <PriceCard plan={plan} />
        <section className="flex flex-col gap-12">
          <h2 className="text-heading-h3 font-bold text-text-primary">기본 제공</h2>
          {/* ⚠ 확인 필요: 통화·문자 등 다른 행은 approval.json q7 값에 따라 표시하지 않음 (PRD 4-2) */}
          <div className="flex flex-col">
            <ListRow label="데이터" value={plan.data} />
            <ListRow label="속도" value={<span data-throttle>{throttleText(plan)}</span>} />
          </div>
        </section>
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
      <BottomCTA bottom="32" gap="8">
        <Button variant="Primary" size="xl" href={`/apply?plan=${plan.id}`} fullWidth>
          구독 신청하기
        </Button>
      </BottomCTA>
    </>
  );
}
