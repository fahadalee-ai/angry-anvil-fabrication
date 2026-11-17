/**
 * Service boundaries for payments, Printify, and course media.
 *
 * FLAG — Apple App Store rules generally require In-App Purchase for digital
 * courses sold inside an iOS app. Confirm Stripe vs Apple IAP with the client
 * before development continues. `confirmPayment` is the only place a sample
 * "server confirmation" is issued. The UI must not unlock a course by itself.
 *
 * FLAG — Merchandise is meant to sync from Printify. `listPrintifyProducts`
 * returns SAMPLE catalog rows until a Printify account is connected.
 *
 * PDFs and videos are not given URLs. Entitled lessons render an in-app sample
 * player. Locked lessons return "locked" and no asset path.
 */

export const SAMPLE_OTP = "482913";

export const PAYMENT_NOTICE =
  "Payment provider is not configured. This sample stands in for a verified server confirmation. Confirm Apple In-App Purchase or Stripe with the client before release. Nothing is charged.";

export const PRINTIFY_NOTICE =
  "Merchandise is a SAMPLE stand-in for a Printify catalog. Orders are not sent to Printify until that account is connected.";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type PaymentKind = "order" | "course";

export async function confirmPayment(input: {
  kind: PaymentKind;
  amountLabel: string;
  simulateFailure?: boolean;
}): Promise<{ ok: true; reference: string } | { ok: false; reason: "failed" }> {
  await wait(900);
  if (input.simulateFailure) return { ok: false, reason: "failed" };
  return { ok: true, reference: `sample_${input.kind}_${Date.now()}` };
}

export async function restoreReceipts(): Promise<{ ok: true }> {
  await wait(500);
  return { ok: true };
}

export type MediaAccess = "locked" | "sample-player";

export function mediaForLesson(entitled: boolean, freePreview: boolean): MediaAccess {
  if (freePreview || entitled) return "sample-player";
  return "locked";
}
