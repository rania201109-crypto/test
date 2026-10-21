"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import BottomCTA from "../_components/BottomCTA";
import Button from "../_components/Button";
import Checkbox from "../_components/Checkbox";
import Header from "../_components/Header";
import Input from "../_components/Input";
import ListRow from "../_components/ListRow";
import { getPlan } from "../_data/plans";
import { afterDiscountText, formatWon } from "../_data/plan-text";
import { saveSubscription } from "../_data/subscription";

// 휴대폰 번호는 숫자 11자리여야 맞는 값으로 본다. (US5 · PRD 4-3·5)
const PHONE_PATTERN = /^\d{11}$/;

// 오류 안내 문구 4개. PRD 4-3 '오류 상황과 안내 문구' 표의 문구를 그대로 쓴다.
const MESSAGES = {
  name: "이름을 입력해 주세요.",
  phone: "휴대폰 번호 11자리를 숫자로 입력해 주세요.",
  agree: "개인정보 수집·이용에 동의해야 신청할 수 있어요.",
  save: "신청을 저장하지 못했어요. 다시 시도해 주세요.",
};

export default function ApplyForm({ planId }: { planId: string }) {
  const router = useRouter();
  const plan = getPlan(planId);

  // ⚠ 확인 필요: 뒤로 갈 때 입력값은 approval.json q10 값에 따라 유지하지 않음 (PRD 4-3)
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [agreeTouched, setAgreeTouched] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);

  if (!plan) return null;

  // 이름이 비어 있지 않고, 휴대폰 번호가 숫자 11자리이고, 동의가 체크되어야 신청할 수 있다. (US5 · PRD 4-3 · 판정 규칙 6)
  const nameValid = name.trim().length > 0;
  const phoneValid = PHONE_PATTERN.test(phone);
  const canSubmit = nameValid && phoneValid && agreed;
  const afterDiscount = afterDiscountText(plan);
  // 뒤로 아이콘과 '취소'가 돌아갈 곳: 이 요금제의 상세 화면. (PRD 3·4-3)
  const backHref = `/plans/${plan.id}`;

  // '신청하기'를 눌렀을 때: 조건 확인 → 신청 1건 저장 → 신청 완료 화면으로 이동. (US5 · PRD 4-3)
  function handleSubmit() {
    if (!plan) return;
    // 동의 없이 신청을 시도하면 동의 항목 아래에 안내 문구를 띄우고 멈춘다. (PRD 4-3)
    if (!agreed) {
      setAgreeTouched(true);
      return;
    }
    if (!canSubmit) return;
    // 신청자 이름·휴대폰 번호·요금제 id·매달 내는 금액·동의 여부를 신청 1건(Subscription)으로 저장한다. (PRD 4-3·5)
    try {
      saveSubscription({
        name: name.trim(),
        phone,
        plan_id: plan.id,
        monthly_price: plan.monthly_price,
        agreed_privacy: true,
      });
    } catch {
      // 저장에 실패하면 화면에 머물고 '신청하기' 버튼 위에 저장 실패 문구를 띄운다. (PRD 4-3)
      setSaveFailed(true);
      return;
    }
    // 저장이 끝나면 신청 완료(/complete)로 이동한다. (US5 · PRD 4-3)
    router.push("/complete");
  }

  return (
    <>
      {/* 헤더: 뒤로 아이콘을 누르면 요금제 상세(/plans/[id])로 돌아간다. (PRD 3·4-3) */}
      <Header title="구독 신청" backHref={backHref} />
      <main className="flex w-full flex-col gap-16 p-16">
        {/* 신청 내용 구역: 고른 요금제 이름·매달 내는 금액을 보여 준다. 할인 있는 요금제만 '할인 종료 후' 줄이 보인다. (US4 · PRD 4-3) */}
        <section className="flex flex-col gap-12">
          <h2 className="text-heading-h3 font-bold text-text-primary">신청 내용</h2>
          <div className="flex flex-col">
            <ListRow label="요금제" value={plan.name} />
            <ListRow label="매달 내는 금액" value={formatWon(plan.monthly_price)} />
            {afterDiscount && <ListRow label="할인 종료 후" value={afterDiscount} />}
          </div>
        </section>
        <section className="flex flex-col gap-12">
          <h2 className="text-heading-h3 font-bold text-text-primary">신청 정보</h2>
          {/* 이름 입력란: 처음엔 비어 있다. 비운 채 다른 곳으로 옮기면 아래에 '이름을 입력해 주세요.'가 나온다. (US5 · PRD 4-3) */}
          <Input
            id="apply-name"
            placeholder="이름"
            value={name}
            autoComplete="name"
            onChange={setName}
            onBlur={() => setNameTouched(true)}
            errorMessage={nameTouched && !nameValid ? MESSAGES.name : null}
          />
          {/* 휴대폰 번호 입력란: 숫자만 11자리까지 받는다. 11자리가 아닌 채 옮기면 아래에 안내 문구가 나온다. (US5 · PRD 4-3) */}
          <Input
            id="apply-phone"
            placeholder="휴대폰 번호"
            value={phone}
            inputMode="numeric"
            maxLength={11}
            autoComplete="tel"
            onChange={(value) => setPhone(value.replace(/\D/g, ""))}
            onBlur={() => setPhoneTouched(true)}
            errorMessage={phoneTouched && !phoneValid ? MESSAGES.phone : null}
          />
        </section>
        {/* 개인정보 수집·이용 동의 구역: 처음엔 체크되지 않은 상태다. (US5 · PRD 4-3) */}
        <section className="flex flex-col gap-12">
          <Checkbox
            id="apply-agree"
            checked={agreed}
            label="개인정보 수집·이용에 동의합니다. (필수)"
            onChange={(checked) => {
              setAgreed(checked);
              setAgreeTouched(true);
            }}
          />
          {/* 동의를 해제했거나 동의 없이 신청을 시도하면 동의 항목 아래에 안내 문구가 나온다. (PRD 4-3) */}
          {agreeTouched && !agreed && (
            <p className="text-body-small font-medium text-text-error">{MESSAGES.agree}</p>
          )}
        </section>
      </main>
      {/* 하단 버튼 영역: 저장 실패 문구(실패했을 때만), '신청하기', '취소' 순서로 놓인다. (PRD 4-3) */}
      <BottomCTA bottom="24" gap="8">
        {saveFailed && <p className="text-body-small font-medium text-text-error">{MESSAGES.save}</p>}
        {/* 이름·휴대폰 번호·동의 중 하나라도 채우지 않으면 '신청하기'가 눌리지 않는다(disabled). (US5 · PRD 4-3 · 판정 규칙 6) */}
        <Button variant="Primary" size="xl" cta="apply" disabled={!canSubmit} onClick={handleSubmit} fullWidth>
          신청하기
        </Button>
        {/* '취소'를 누르면 요금제 상세(/plans/[id])로 돌아간다. (PRD 3·4-3) */}
        <Button variant="Secondary" size="xl" href={backHref} fullWidth>
          취소
        </Button>
      </BottomCTA>
    </>
  );
}
