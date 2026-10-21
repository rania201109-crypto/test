// 구독 신청 1건(Subscription). 브라우저 저장소(sessionStorage)에 1건만 저장한다. (PRD 5장)
export type Subscription = {
  id: string;
  name: string;
  phone: string;
  plan_id: string;
  monthly_price: number;
  agreed_privacy: boolean;
  created_at: string;
};

export const SUBSCRIPTION_KEY = "subscription";

// 신청 번호(id)와 신청 일시(created_at)는 저장하는 순간 여기서 만든다.
// 저장에 실패하면 예외를 던진다. 호출한 쪽에서 오류 문구를 보여 준다.
export function saveSubscription(input: Omit<Subscription, "id" | "created_at">): Subscription {
  const now = new Date();
  const subscription: Subscription = {
    ...input,
    id: `S${now.getTime()}`,
    created_at: now.toISOString(),
  };
  window.sessionStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subscription));
  return subscription;
}

export function readSubscriptionRaw(): string | null {
  try {
    return window.sessionStorage.getItem(SUBSCRIPTION_KEY);
  } catch {
    return null;
  }
}

export function parseSubscription(raw: string | null): Subscription | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Subscription;
  } catch {
    return null;
  }
}
