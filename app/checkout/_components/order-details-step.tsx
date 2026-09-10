"use client";

import * as React from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { BrandBranch, SwitchAccount } from "../_lib/brand-checkout";

/* ───────────────────────── Field (DS Input + Label) ─────────────────────────
 * Local, self-contained copy so this step has no import cycle with the client. */
function Field({
  id,
  label,
  required = false,
  error,
  className,
  ...props
}: React.ComponentProps<typeof Input> & { id: string; label: string; required?: boolean; error?: string; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>
        {label}
        {required ? <span className="ml-0.5 text-destructive">*</span> : null}
      </Label>
      <Input id={id} required={required} aria-invalid={error ? true : undefined} {...props} />
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
}

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center justify-between border-b px-5 py-4">
      <div className="flex items-center gap-3">
        <span className="grid size-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{number}</span>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
    </div>
  );
}

const MAX_NOTES = 2000;

/** Step 1 — Order Details. A single 2×2 grid — Account (clickable, opens the
 *  switch drawer) and Job name on top; PO number and Order notes below — over the
 *  confirmation-email + notify-salesperson controls. Branch is changed elsewhere
 *  (via the account switcher), so it's no longer edited here; the notes helper
 *  still names the receiving branch.
 *
 *  Account is passed in from the client (bound to the brand-checkout config for
 *  now). SEAM: the cart page's selected account should feed this via the same
 *  `account` prop once cart→checkout account hand-off is wired — that is the
 *  follow-up; nothing here reads the cart yet. */
export function OrderDetailsStep({
  account,
  onSwitchAccount,
  branch,
  po,
  setPo,
  poError,
  jobName,
  setJobName,
  notes,
  setNotes,
}: {
  account: SwitchAccount;
  onSwitchAccount: () => void;
  branch: BrandBranch;
  po: string;
  setPo: (v: string) => void;
  poError?: string;
  jobName: string;
  setJobName: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
}) {
  return (
    <>
      <SectionHeading number="1" title="Order details" />
      <div className="space-y-5 p-5">
        {/* Order-level fields — ONE 2×2 grid (single column on mobile), row-major:
            Account (clickable) · Job name / PO number · Order notes. */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Account — a CLICKABLE field: click to open the switch-account drawer
              and change it. Reflects the account chosen on the cart page (bound to
              brand config for now). */}
          <div className="space-y-2">
            <Label htmlFor="account-field">Account</Label>
            <button
              id="account-field"
              type="button"
              onClick={onSwitchAccount}
              aria-haspopup="dialog"
              className="flex min-h-11 w-full items-center justify-between gap-3 rounded-md border bg-background px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <span className="min-w-0 truncate">
                <span className="font-semibold">{account.name}</span>
                <span className="text-muted-foreground"> · {account.detail}</span>
              </span>
              <ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            </button>
          </div>

          <Field
            id="job-name"
            label="Job name"
            placeholder="Optional job name"
            value={jobName}
            onChange={(e) => setJobName(e.target.value)}
          />

          <Field id="po" label="PO number" required value={po} onChange={(e) => setPo(e.target.value)} placeholder="Enter PO number" error={poError} />

          {/* Order notes — compact (rows=2). */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-2">
              <Label htmlFor="order-notes">Order notes</Label>
              <span className="text-xs text-muted-foreground" aria-live="polite">
                {notes.length}/{MAX_NOTES}
              </span>
            </div>
            <Textarea
              id="order-notes"
              rows={2}
              value={notes}
              maxLength={MAX_NOTES}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Special instructions (e.g. call on arrival, gate code)"
              className="min-h-0 resize-none"
            />
            <p className="text-xs text-muted-foreground">Your branch, {branch.name}, will receive these.</p>
          </div>
        </div>

        <OrderConfirmationExtras />
      </div>
    </>
  );
}

/** Confirmation email + additional recipients + notify-salesperson (ECM). None
 *  of these gate submit, so their state stays local to this step. */
function OrderConfirmationExtras() {
  const [sendEmail, setSendEmail] = React.useState(true);
  const [notifyRep, setNotifyRep] = React.useState(false);
  const [recipients, setRecipients] = React.useState<string[]>([]);

  const addRecipient = () => setRecipients((r) => [...r, ""]);
  const removeRecipient = (index: number) => setRecipients((r) => r.filter((_, i) => i !== index));
  const setRecipient = (index: number, value: string) =>
    setRecipients((r) => r.map((v, i) => (i === index ? value : v)));

  return (
    <div className="space-y-3 rounded-md border bg-muted/30 p-4">
      <Label className="flex items-start gap-3 text-sm font-normal">
        <Checkbox checked={sendEmail} onCheckedChange={(v) => setSendEmail(v === true)} className="mt-0.5" />
        <span>
          <span className="block font-medium text-foreground">Send order confirmation email</span>
          <span className="block text-xs text-muted-foreground">A copy of this order goes to your account email.</span>
        </span>
      </Label>

      {sendEmail ? (
        <div className="space-y-2 pl-7">
          {recipients.map((email, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setRecipient(index, e.target.value)}
                placeholder="name@company.com"
                aria-label={`Additional recipient ${index + 1}`}
                className="h-9"
              />
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={() => removeRecipient(index)}
                aria-label={`Remove recipient ${index + 1}`}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addRecipient}>
            <Plus className="size-4" />
            {recipients.length ? "More" : "Add recipient"}
          </Button>
        </div>
      ) : null}

      <Label className="flex items-start gap-3 border-t pt-3 text-sm font-normal">
        <Checkbox checked={notifyRep} onCheckedChange={(v) => setNotifyRep(v === true)} className="mt-0.5" />
        <span>
          <span className="block font-medium text-foreground">Notify your salesperson (Dana Whitfield)</span>
          <span className="block text-xs text-muted-foreground">Send a heads-up to your assigned rep when this order is placed.</span>
        </span>
      </Label>
    </div>
  );
}
