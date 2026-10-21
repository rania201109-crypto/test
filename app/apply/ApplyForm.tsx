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

const PHONE_PATTERN = /^\d{11}$/;

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

  const nameValid = name.trim().length > 0;
  const phoneValid = PHONE_PATTERN.test(phone);
  const canSubmit = nameValid && phoneValid && agreed;
  const afterDiscount = afterDiscountText(plan);
  const backHref = `/plans/${plan.id}`;

  function handleSubmit() {
    if (!plan) return;
    if (!agreed) {
      setAgreeTouched(true);
      return;
    }
    if (!canSubmit) return;
    try {
      saveSubscription({
        name: name.trim(),
        phone,
        plan_id: plan.id,
        monthly_price: plan.monthly_price,
        agreed_privacy: true,
      });
    } catch {
      setSaveFailed(true);
      return;
    }
    router.push("/complete");
  }

  return (
    <>
      <Header title="구독 신청" backHref={backHref} />
      <main className="flex w-full flex-col gap-16 p-16">
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
          <Input
            id="apply-name"
            placeholder="이름"
            value={name}
            autoComplete="name"
            onChange={setName}
            onBlur={() => setNameTouched(true)}
            errorMessage={nameTouched && !nameValid ? MESSAGES.name : null}
          />
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
          {agreeTouched && !agreed && (
            <p className="text-body-small font-medium text-text-error">{MESSAGES.agree}</p>
          )}
        </section>
      </main>
      <BottomCTA bottom="24" gap="8">
        {saveFailed && <p className="text-body-small font-medium text-text-error">{MESSAGES.save}</p>}
        <Button variant="Primary" size="xl" cta="apply" disabled={!canSubmit} onClick={handleSubmit} fullWidth>
          신청하기
        </Button>
        <Button variant="Secondary" size="xl" href={backHref} fullWidth>
          취소
        </Button>
      </BottomCTA>
    </>
  );
}
