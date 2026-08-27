# Address Book refinement pass

## Objective

Refine the existing Address Book implementation for maintainability and clearer account-vs-user address UX without changing the overall direction.

## Autonomy contract — read before any tool call.

1. **Do smart things** (`policy.md §9`, `feedback_do_smart_things.md`). Solve reversible issues directly and verify them.
2. **Exhaust investigation before asking.** Read the current implementation and existing design-system rules before changing it.
3. **Hetzner-first routing** (`policy.md §13`). Prefer filesystem, CLI, and headless checks.
4. **Primitives-first** (`policy.md §8`). Keep using the existing Watsco and shadcn primitives.
5. **Send-checkpoints** (`policy.md §5`). Do not send, deploy, push, or modify production data.
6. **Independent execution ≠ cross-model review** (`policy.md §2`). Return evidence, not confidence.

## Read these files first

- `CLAUDE.md`
- `docs/design-system.md`
- `docs/muse-specs/address-book-redesign.md`
- `app/dashboard/addresses/page.tsx`
- `app/dashboard/_components/dashboard-shell.tsx`
- `components/ui/button.tsx`
- `components/ui/dialog.tsx`

## Required refinements

- Preserve the page hierarchy, fixtures, add/edit form, validation, toast feedback, and responsive behavior already implemented.
- Extract typed fixtures/types and the reusable address-card presentation into focused modules so no single component file remains over 300 lines. Keep names and imports clear; do not introduce a broad abstraction.
- Account-managed addresses are not user-owned records. Do not present `Edit` or `Remove` as if the user can change the distributor record. Keep a clear `Set as default`/checkout-preference action where useful, plus concise read-only account guidance.
- User-saved addresses retain `Edit` and `Remove`, with the existing confirmation dialog and default handling.
- Keep the account ID and operational note secondary; prioritize label, recipient/company, address, and phone scanability.
- Preserve keyboard focus, accessible labels/descriptions, minimum 44px targets, and reduced-motion behavior.

## Definition of done

- `npm run build`, `npx tsc --noEmit`, and `npm run lint` pass.
- No changed component file exceeds 300 lines unless it is an unavoidable route composition; extract presentation/data before accepting that exception.
- Verify the user/account action distinction in the rendered code and test the add, edit, default, remove, cancel, close, validation, success, and empty states locally.
- Do not deploy or push.

## What NOT to do

- Do not change the existing shell, navigation, global tokens, other account routes, auth, database, or external APIs.
- Do not add persistence or invent backend behavior.
- Do not rewrite the page into a different visual direction.
