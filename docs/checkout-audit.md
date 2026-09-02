# Checkout Audit & Recommendations

_2026-09-02. Audit of `app/checkout/_components/checkout-client.tsx` (Codex build) against
best-practice ecommerce and the unified design system. Goal: one unified checkout, 6 use cases as
states of that flow, every element pointing to the DS._

## Verdict

The bones are right — 3-step flow (Fulfillment → Payment → Review), sticky Order Summary, progress
stepper, confirmation + empty states. **But it bypasses the design system and models the 6 use
cases as scattered `scenario === "…"` conditionals instead of a clean state model.** That is the
"messy" part. Recommend a targeted rebuild on DS primitives + a single use-case config map — not a
throwaway.

## Consistency (DS violations — fix)

1. **Fields are hand-rolled** — the local `Field` (l.61) renders a raw `<input>` with
   `focus-visible:ring-2 focus-visible:ring-ring` (the exact focus-ring drift Ryan flagged). Every
   checkout field uses it. → Use DS `<Input>` + `<Label>`.
2. **Brand color in the body** — `bg-brand-homans-bg` as the page background (l.30, 32, 37). Violates
   "brand color only in header/footer." → Neutral surface (`bg-muted/30`).
3. **Two patterns for one choice** — Fulfillment uses hand-rolled `<button>` cards (l.82); Payment
   uses radio `<label>`s (l.86). → One radio-card pattern for both.
4. **Notices hand-rolled** — `CheckoutNotice` re-implements an alert with `border-warning/50`. → Use
   the DS Alert component.
5. **Edit links** are raw `<button>` (l.90). → `<Button variant="link">` or a real link.
6. `<img>` not `next/image` (l.90, 94) — perf; acceptable for prototype.

## Best-practice / UX (recommend)

1. **Use cases → state, not conditionals.** Replace the scattered `scenario ===` checks with one
   config map: `{ [slug]: { initialStep, notices, flags, seededFields } }`. One flow, six presets.
2. **Account/job context is a summary, not a form.** Pull the account block from the global account
   component as a read-only summary at the top; only PO + job name are editable. Matches the
   documented decision "keep account context at the top."
3. **Pickup shows the wrong fields.** When Pickup is selected it still renders Street/City/State/ZIP
   (l.82). → Pickup = branch + date only; Delivery = address + date + method.
4. **No validation.** PO is `required` but there's no inline error/`aria-invalid`. Use case calls for
   "validate PO input inline." → Add inline validation + error states.
5. **Payment missing saved cards.** Use case says "saved or newly entered." → Add a saved-card list
   with "add new" (the established drawer pattern), not just a bare card form.
6. **Confirmation has no order number.** Use case wants "order number + next steps." → Show an order
   number and link straight to Open Orders (already links to /dashboard/orders — add the number).
7. **Order summary** is good; add a tax line and per-line edit/remove for completeness.

## Recommended plan (one unified checkout)

- Swap all fields/notices/selectors to DS primitives (`Input`, `Label`, `RadioGroup`, `Alert`,
  `Button`). Removes every consistency violation in one pass.
- Introduce `CHECKOUT_SCENARIOS[slug]` config; drive initial step + notices + seeded fields from it.
  The 6 "Open checkout example" buttons already pass `?case=<slug>` — they map 1:1.
- Fix pickup fields, add PO validation, saved-card selection, and an order number on confirmation.
- Keep it inside the DS as the Checkout **Block** (already added at /components/checkout).

Net: same flow, half the branching, zero hand-rolled inputs, and every use case demonstrably points
to the component library.
