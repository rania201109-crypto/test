/**
 * [화면] 요금제 목록
 * [목적] 데이터량·소진 후 속도·매달 내는 금액을 한 카드에서 비교해 후보를 고르게 한다.
 * [라우트] /plans
 * [들어오는 곳] 서비스 진입, 요금제 상세의 뒤로 아이콘, 신청 완료의 뒤로 아이콘·'요금제 더 보기'
 * [나가는 곳] 카드의 '자세히' → 요금제 상세(/plans/[id])
 * [근거] PRD 3장·4-1 · US1, US2, US3, US4
 * ⚠ 확인 필요: 신청 완료에서 이 화면으로 오는 길은 임시 목적지다. (PRD 3·4-4)
 */
import Header from "../_components/Header";
import PlanList from "./PlanList";

export default function PlansPage() {
  return (
    <>
      {/* 맨 위 머리 영역(Header): 화면 제목 '요금제'를 보여 준다. (PRD 3·4-1) */}
      {/* ⚠ 확인 필요: Header root·Logo 포함은 approval.json extra.header_logo 제안값 (PRD 4-1) */}
      <Header type="root" title="요금제" />
      <main className="flex w-full flex-col gap-24 p-24">
        {/* 안내 구역: 화면 제목과 '무엇을 비교하는 화면인지' 한 줄 설명을 보여 준다. (US1·US3·US4 · PRD 1·3) */}
        <div className="flex flex-col gap-8">
          <h2 className="text-heading-h3 font-bold text-text-primary">나에게 맞는 요금제 찾기</h2>
          <p className="text-body-small font-medium text-text-secondary">
            데이터량, 다 쓴 뒤의 속도, 매달 내는 금액을 한 번에 비교해 보세요.
          </p>
        </div>
        {/* 필터 칩 + 요금제 카드 목록 구역. 칩·카드·추천 Tag·'자세히' 동작은 PlanList.tsx 주석에 적었다. (US1~US4 · PRD 4-1) */}
        <PlanList />
      </main>
    </>
  );
}
