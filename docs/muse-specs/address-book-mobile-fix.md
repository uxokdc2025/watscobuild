# Address Book mobile overflow fix

You are Muse Dev fixing a QA finding. Read `CLAUDE.md`, `docs/design-system.md`, `app/pdp/_lib/chrome.tsx`, and `app/dashboard/addresses/page.tsx` first. Do not deploy or push.

## Finding

On the Address Book preview at 375px, the page document is 413px wide. The shared Homans utility link row contains a fixed-width `Help & Support` link beyond the viewport, causing horizontal scroll.

## Objective

Correct the shared Homans utility-row overflow in `app/pdp/_lib/chrome.tsx` using the smallest token-consistent responsive change. The row must remain usable/readable on mobile, while desktop spacing and content remain unchanged. Do not hide the last utility link by clipping it; allow the utility row to scroll or otherwise provide an intentional mobile overflow treatment inside its own bounded container without expanding the document.

## Acceptance criteria

- At 375px, `document.documentElement.scrollWidth === document.documentElement.clientWidth` on `/dashboard/addresses`.
- Utility links remain accessible and usable within the bounded row.
- No unrelated route or shell behavior changes.
- `npm run build`, `npx tsc --noEmit`, and `npm run lint` pass.
- Return `IMPLEMENTED` with changed files and evidence. Do not deploy or push.
