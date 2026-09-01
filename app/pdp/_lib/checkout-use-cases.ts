export type CheckoutUseCase = {
  phase: string;
  title: string;
  sources: string;
  pattern: string;
  decision: string;
};

/**
 * Synthesis of the checkout comparison PDF. These are scenarios for one
 * checkout system, not separate flows to maintain.
 */
export const CHECKOUT_USE_CASES: CheckoutUseCase[] = [
  {
    phase: "1 · Fulfillment",
    title: "Account and job context",
    sources: "Baker · Peirce · Homan’s",
    pattern: "Account and job-account selectors, PO validation, and an optional job name.",
    decision: "Keep account context at the top of checkout and validate PO input inline.",
  },
  {
    phase: "1 · Fulfillment",
    title: "Delivery, pickup, and routing",
    sources: "Baker · Homan’s · ECM",
    pattern: "Choose shipping or pickup, then select an address or branch, date, and delivery method.",
    decision: "Use one fulfillment selector with conditional fields instead of separate flows.",
  },
  {
    phase: "1 · Fulfillment",
    title: "Availability and date constraints",
    sources: "Baker · Peirce",
    pattern: "Branch-transfer and backorder notices, distance-based freight, cutoff-time validation, and date warnings.",
    decision: "Keep availability messages outside the step content; synchronize date, distance, and method rules.",
  },
  {
    phase: "2 · Payment",
    title: "Terms or credit card",
    sources: "Baker · Homan’s · ECM",
    pattern: "Account terms/COD alongside saved or newly entered credit-card payment.",
    decision: "Present mutually exclusive payment choices and keep new-card entry in the established drawer pattern.",
  },
  {
    phase: "3 · Review",
    title: "Review, coupon, and special handling",
    sources: "Baker · ECM",
    pattern: "Editable fulfillment and payment summaries, coupon entry, and special-handling acknowledgement.",
    decision: "Use one final review with clear totals, editable sections, and explicit exception acknowledgement.",
  },
  {
    phase: "Confirmation",
    title: "Order confirmation",
    sources: "Baker · Peirce · Homan’s · ECM",
    pattern: "Thank-you state with order number, fulfillment summary, and next steps.",
    decision: "Confirm the order immediately and link directly to Open Orders for tracking.",
  },
];

export const CHECKOUT_PHASES = [
  ["1", "Fulfillment", "Account, availability, delivery or pickup"],
  ["2", "Payment", "Terms or credit card"],
  ["3", "Review & submit", "Totals, exceptions, confirmation"],
] as const;
