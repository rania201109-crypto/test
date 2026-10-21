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
  const { plan: raw } = await searchParams;
  const plan = typeof raw === "string" ? getPlan(raw) : undefined;
  // ⚠ 확인 필요: 로딩·빈·에러 상태는 approval.json 값(q6·q9·q13)에 따라 만들지 않음. 요금제가 없으면 기본 404 (PRD 6)
  if (!plan) notFound();

  return <ApplyForm planId={plan.id} />;
}
