# Address Book redesign

## Objective

Redesign `app/dashboard/addresses/page.tsx` as a polished, responsive My Account address workspace inside the existing Homans shell, using realistic account-address fixtures and a complete add-address interaction.

## Autonomy contract — read before any tool call.

1. **Do smart things** (`policy.md §9`, `feedback_do_smart_things.md`). Level-5+ on green-tier work: solve, name trade-offs, address failure modes, propose next steps — then execute. Never bounce a to-do list back to David for work you could do yourself.
2. **Exhaust investigation before asking.** When you hit ambiguity, inspect the repository, existing route patterns, the live preview, and available configuration before escalating.
3. **Hetzner-first routing** (`policy.md §13`). Prefer headless CLI/API and filesystem checks; do not hijack a foreground browser.
4. **Primitives-first** (`policy.md §8`). Reuse existing shell, button, input, label, dialog/sheet, and toast primitives where they fit.
5. **Send-checkpoints** (`policy.md §5`). Do not send email/SMS, mutate production data, or make paid/external changes.
6. **Independent execution ≠ cross-model review** (`policy.md §2`). Implement and self-check the work, but return evidence and leave final acceptance to the caller.

## Read these files first

- `CLAUDE.md`
- `docs/design-system.md`
- `app/dashboard/_components/dashboard-shell.tsx`
- `app/dashboard/addresses/page.tsx`
- `app/dashboard/shopping-lists/page.tsx`
- `app/dashboard/layout.tsx`
- `app/globals.css`
- `components/ui/button.tsx`
- `components/ui/input.tsx`
- `components/ui/label.tsx`
- Reference image: `/Users/merlin/Desktop/Codex Image Aug 27, 2026, 02_36_55 AM.png`

## Design and UX constraints

- Keep the existing Homans site header/footer and `DashboardShell`; this is a route redesign, not a new account framework.
- Treat the screenshot as information architecture reference: distinguish user-saved addresses from account-provided addresses, but improve scanability and action clarity.
- Use a clear page-level title, concise supporting copy, one prominent `Add new address` action, and a helpful empty state for user addresses.
- Render realistic account address cards from typed local fixtures. Make the primary/default state visually explicit without relying on color alone.
- Each address card must expose a readable address summary plus clear actions: `Set as default`, `Edit`, and `Remove` as appropriate. Avoid ambiguous icon-only controls; icon-only controls need labels.
- Adding an address must open an accessible modal or sheet with labeled fields, required-field validation, cancel/close behavior, and a success toast or inline confirmation. Keep data local to this prototype; do not add persistence or a backend.
- Use existing tokens and primitives. Maintain 8pt spacing, 44px minimum interactive targets, visible focus states, keyboard access, reduced-motion support, and no horizontal scroll at 375px.
- Keep copy sentence case and specific to HVAC purchasing/shipping. No lorem ipsum, placeholders presented as data, or AI-flavored filler.

## Responsive behavior

- 375px: single-column content and address cards; actions remain usable without overflow.
- 768px: cards may move to two columns where readable.
- 1024px and 1280px: preserve the account navigation rail and use a balanced content grid; avoid excessive empty space.

## Internal team

- Frontend: implement the route with typed fixtures and existing components.
- QA: verify all interactions, keyboard behavior, validation, responsive layouts, and no console errors.
- Designer: compare against `docs/design-system.md` and the supplied screenshot; refine hierarchy, spacing, state styling, and copy.

## Definition of done

- `npm run build` passes.
- `npx tsc --noEmit` passes.
- `npm run lint` is run; if the repository script is incompatible with the installed Next version, record the exact result and use the supported lint check available in the repo.
- Route is rendered through the existing dashboard shell.
- Add, edit, default, remove, cancel, close, validation, success, and empty states are implemented and tested locally by the internal QA role.
- Screenshots/inspection cover 375, 768, 1024, and 1280 widths; no horizontal scroll at 375px; touch targets are at least 44px.
- Do not deploy, push, or modify unrelated routes.

## What NOT to do

- Do not alter the global shell, brand chrome, dashboard navigation, production data, auth, database, or external APIs.
- Do not rewrite unrelated account routes.
- Do not claim production QA or final acceptance; return `IMPLEMENTED` with evidence and the changed-file list.
