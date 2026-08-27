# Address Book independent QA

You are Muse QA, not Muse Dev. Do not trust implementation claims or infer success from source code. Verify the deployed preview and report evidence only. Do not modify files, commit, push, or deploy.

## Target

Preview URL: `https://watscobuild-kijnpam31-david-cervantes-projects-a2f97231.vercel.app/dashboard/addresses`

Reference context: `/Users/merlin/Desktop/Codex Image Aug 27, 2026, 02_36_55 AM.png`

## Read first

- `CLAUDE.md`
- `docs/design-system.md`
- `docs/muse-specs/address-book-redesign.md`
- `docs/muse-specs/address-book-polish.md`
- `app/dashboard/addresses/page.tsx`
- `app/dashboard/addresses/_components/address-card.tsx`
- `app/dashboard/addresses/_components/address-form-dialog.tsx`
- `app/dashboard/addresses/_components/confirm-remove-dialog.tsx`

## QA protocol

- Verify QA-0 reachability and route rendering at the preview URL.
- Inspect the page at 375, 768, 1024, and 1280 widths. Confirm no horizontal scroll at 375 and touch targets are usable.
- Check the existing Homans header/footer and account navigation remain present; Address Book is the active account item.
- Verify the empty `Your addresses` state and the three account-managed cards are clear and scannable.
- Verify account-managed cards do not offer misleading Edit/Remove controls, while user-saved cards do after creating one.
- Exercise Add new address: open, focus, validation on empty submit, valid save, success feedback, cancel, close button, and overlay/escape close.
- Exercise user address Edit, Set as default, Remove, cancel removal, and confirm removal.
- Verify keyboard reachability, visible focus, dialog labeling, error association, and readable action names.
- Check browser console and network for errors; record any pre-existing unrelated warnings separately.

## Output

Return `QA_PASSED_BY_MUSE` only with concrete evidence for each criterion, or `QA_FAILED` with exact reproduction steps and severity. Write the evidence package under `qa/run-address-book/` if the environment supports it, including `summary.md` and `reports/final.json`.
