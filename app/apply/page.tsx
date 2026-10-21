/**
 * [화면] 구독 신청
 * [목적] 선택한 요금제를 확인하고 이름·휴대폰 번호·개인정보 동의를 받아 구독 신청 1건을 저장한다.
 * [라우트] /apply?plan=<요금제 id>
 * [들어오는 곳] 요금제 상세의 '구독 신청하기'
 * [나가는 곳] '신청하기' → 신청 완료(/complete), 뒤로 아이콘·'취소' → 요금제 상세(/plans/[id])
 * [근거] PRD 3장·4-3 · US4, US5 · 판정 규칙 6
 * 입력 영역·버튼 동작은 ApplyForm.tsx 주석에 적었다.
 */
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Header from "../_components/Header";
import { getPlan } from "../_data/plans";
import ApplyForm from "./ApplyForm";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

// 진입 주소: /apply?plan=<요금제 id>. 주소의 값은 요청 시점에만 알 수 있어 Suspense 안에서 읽는다.
export default function ApplyPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<Header title="구독 신청" />}>
      <ApplyContent searchParams={searchParams} />
    </Suspense>
  );
}

async function ApplyContent({ searchParams }: { searchParams: SearchParams }) {
  // 주소의 plan 값(요금제 id)으로 신청할 요금제를 찾는다. 상세 화면에서 고른 요금제가 그대로 넘어온다. (US5 · PRD 4-2·4-3)
  const { plan: raw } = await searchParams;
  const plan = typeof raw === "string" ? getPlan(raw) : undefined;
  // ⚠ 확인 필요: 로딩·빈·에러 상태는 approval.json 값(q6·q9·q13)에 따라 만들지 않음. 요금제가 없으면 기본 404 (PRD 6)
  if (!plan) notFound();

  // 찾은 요금제로 신청 내용 요약·입력 영역·신청하기 버튼을 그린다. (PRD 4-3)
  return <ApplyForm planId={plan.id} />;
}
