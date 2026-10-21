import Header from "../_components/Header";
import PlanList from "./PlanList";

export default function PlansPage() {
  return (
    <>
      {/* ⚠ 확인 필요: Header root·Logo 포함은 approval.json extra.header_logo 제안값 (PRD 4-1) */}
      <Header type="root" title="요금제" />
      <main className="flex w-full flex-col gap-24 p-24">
        <div className="flex flex-col gap-8">
          <h2 className="text-heading-h3 font-bold text-text-primary">나에게 맞는 요금제 찾기</h2>
          <p className="text-body-small font-medium text-text-secondary">
            데이터량, 다 쓴 뒤의 속도, 매달 내는 금액을 한 번에 비교해 보세요.
          </p>
        </div>
        <PlanList />
      </main>
    </>
  );
}
