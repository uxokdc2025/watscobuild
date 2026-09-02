"use client";

import * as React from "react";
import {
  AlertCircle,
  CheckCircle2,
  Terminal,
  PackageOpen,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PreviewCode, PropsTable, Guidance } from "../_ds/code";
import { OnThisPage } from "../_ds/sidebar";

const TOC = [
  { id: "usage", label: "Usage" },
  { id: "alert", label: "Alert" },
  { id: "skeleton", label: "Skeleton" },
  { id: "progress", label: "Progress" },
  { id: "toast", label: "Toast" },
  { id: "empty-state", label: "Empty state" },
  { id: "guidance", label: "Guidance" },
  { id: "api", label: "API" },
  { id: "in-production", label: "In production" },
];

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-8 text-xl font-semibold tracking-tight">
      {children}
    </h2>
  );
}

export default function FeedbackReference() {
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 11));
    }, 900);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mx-auto flex max-w-6xl gap-10 px-4 py-10 md:px-8">
      <main className="min-w-0 flex-1 space-y-12">
        <header className="space-y-3">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Components
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Feedback</h1>
          <p className="max-w-2xl text-muted-foreground">
            How the storefront tells a customer what just happened — a persistent{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">Alert</code>, a{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">Skeleton</code> while data loads,
            a <code className="rounded bg-muted px-1 py-0.5 text-xs">Progress</code> bar, or a
            transient <code className="rounded bg-muted px-1 py-0.5 text-xs">toast</code>. Match the
            surface to the permanence of the message: inline for something the user must act on,
            toast for a fleeting confirmation.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <code className="rounded-md border bg-muted/50 px-2.5 py-1 font-mono text-xs text-muted-foreground">
              import {"{ Alert, AlertTitle, AlertDescription }"} from &quot;@/components/ui/alert&quot;
            </code>
            <code className="rounded-md border bg-muted/50 px-2.5 py-1 font-mono text-xs text-muted-foreground">
              import {"{ toast }"} from &quot;sonner&quot;
            </code>
          </div>
        </header>

        {/* ── Usage ── */}
        <section className="space-y-4">
          <H2 id="usage">Usage</H2>
          <p className="text-sm text-muted-foreground">
            An Alert is a persistent, in-flow message. It always has a title; a description is
            optional. The leading icon is any lucide icon — it sizes and aligns automatically.
          </p>
          <PreviewCode
            install="alert"
            previewClassName="items-stretch"
            code={`<Alert>
  <Terminal />
  <AlertTitle>Heads up</AlertTitle>
  <AlertDescription>
    You can add components to your app using the CLI.
  </AlertDescription>
</Alert>`}
          >
            <Alert>
              <Terminal />
              <AlertTitle>Heads up</AlertTitle>
              <AlertDescription>
                You can add components to your app using the CLI.
              </AlertDescription>
            </Alert>
          </PreviewCode>
        </section>

        {/* ── Alert ── */}
        <section className="space-y-4">
          <H2 id="alert">Alert</H2>
          <p className="text-sm text-muted-foreground">
            Two real variants — <code className="rounded bg-muted px-1 py-0.5 text-xs">default</code>{" "}
            and <code className="rounded bg-muted px-1 py-0.5 text-xs">destructive</code>. A success
            tone is not a variant; it&apos;s the default alert tinted with the{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">in-stock</code> token, so status
            color stays consistent with the rest of the storefront.
          </p>
          <PreviewCode
            previewClassName="items-stretch"
            code={`{/* Default */}
<Alert>
  <Terminal />
  <AlertTitle>Heads up</AlertTitle>
  <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
</Alert>

{/* Success — default alert + in-stock text token (not a variant) */}
<Alert className="text-in-stock *:data-[slot=alert-description]:text-in-stock/90">
  <CheckCircle2 />
  <AlertTitle>Payment received</AlertTitle>
  <AlertDescription>Your order is confirmed.</AlertDescription>
</Alert>

{/* Destructive */}
<Alert variant="destructive">
  <AlertCircle />
  <AlertTitle>Something went wrong</AlertTitle>
  <AlertDescription>Your session expired. Please log in again.</AlertDescription>
</Alert>`}
          >
            <Alert>
              <Terminal />
              <AlertTitle>Heads up</AlertTitle>
              <AlertDescription>
                You can add components to your app using the CLI.
              </AlertDescription>
            </Alert>
            <Alert className="text-in-stock *:data-[slot=alert-description]:text-in-stock/90">
              <CheckCircle2 />
              <AlertTitle>Payment received</AlertTitle>
              <AlertDescription>Your order is confirmed.</AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription>
                Your session expired. Please log in again.
              </AlertDescription>
            </Alert>
          </PreviewCode>
        </section>

        {/* ── Skeleton ── */}
        <section className="space-y-4">
          <H2 id="skeleton">Skeleton</H2>
          <p className="text-sm text-muted-foreground">
            A pulsing placeholder that holds the exact shape of content while it loads — never a
            spinner for layout. Size it with utilities to mirror the real element (avatar, line,
            card). Every data view ships a loading state built from these.
          </p>
          <PreviewCode
            install="skeleton"
            code={`<div className="flex items-center gap-4">
  <Skeleton className="size-12 rounded-full" />
  <div className="grid gap-2">
    <Skeleton className="h-4 w-[180px]" />
    <Skeleton className="h-4 w-[140px]" />
  </div>
</div>`}
          >
            <div className="flex items-center gap-4">
              <Skeleton className="size-12 rounded-full" />
              <div className="grid gap-2">
                <Skeleton className="h-4 w-[180px]" />
                <Skeleton className="h-4 w-[140px]" />
              </div>
            </div>
          </PreviewCode>
        </section>

        {/* ── Progress ── */}
        <section className="space-y-4">
          <H2 id="progress">Progress</H2>
          <p className="text-sm text-muted-foreground">
            A determinate bar for a known-length task (upload, checkout step, quota).{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">value</code> is 0–100. The third
            bar below is live — it advances on a timer to show the fill transition.
          </p>
          <PreviewCode
            install="progress"
            previewClassName="flex-col items-stretch gap-5"
            code={`<Progress value={0} />
<Progress value={66} />
<Progress value={progress} /> {/* live, driven by state */}
<Progress value={100} />`}
          >
            <div className="grid w-full gap-1.5">
              <span className="text-xs text-muted-foreground">Empty</span>
              <Progress value={0} className="w-full" />
            </div>
            <div className="grid w-full gap-1.5">
              <span className="text-xs text-muted-foreground">In progress</span>
              <Progress value={66} className="w-full" />
            </div>
            <div className="grid w-full gap-1.5">
              <span className="text-xs text-muted-foreground">Loading (live)</span>
              <Progress value={progress} className="w-full" />
            </div>
            <div className="grid w-full gap-1.5">
              <span className="text-xs text-muted-foreground">Complete</span>
              <Progress value={100} className="w-full" />
            </div>
          </PreviewCode>
        </section>

        {/* ── Toast ── */}
        <section className="space-y-4">
          <H2 id="toast">Toast (Sonner)</H2>
          <p className="text-sm text-muted-foreground">
            Transient confirmation, dismissed on its own. Fired imperatively with{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">toast()</code> — never rendered in
            JSX. Toasts appear top-right, below the global header, with a per-state color and icon
            baked into the global <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;Toaster /&gt;</code>.
            Click any button to fire a real toast.
          </p>
          <PreviewCode
            install="sonner"
            code={`import { toast } from "sonner";

toast("Event created");
toast.success("Saved successfully");
toast.error("Could not save changes");
toast.info("Branch availability updated");
toast.warning("Only 2 items remain");

// Loading → resolve by reusing the id
const id = toast.loading("Uploading…");
setTimeout(() => toast.success("Uploaded", { id }), 1800);

// With an action
toast("File deleted", {
  action: { label: "Undo", onClick: () => toast("Restored") },
});`}
          >
            <Button variant="outline" onClick={() => toast("Event created")}>
              Default
            </Button>
            <Button variant="outline" onClick={() => toast.success("Saved successfully")}>
              Success
            </Button>
            <Button variant="outline" onClick={() => toast.error("Could not save changes")}>
              Error
            </Button>
            <Button variant="outline" onClick={() => toast.info("Branch availability updated")}>
              Info
            </Button>
            <Button variant="outline" onClick={() => toast.warning("Only 2 items remain")}>
              Warning
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const id = toast.loading("Uploading…");
                setTimeout(() => toast.success("Uploaded", { id }), 1800);
              }}
            >
              Loading
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast("File deleted", {
                  action: { label: "Undo", onClick: () => toast("Restored") },
                })
              }
            >
              With action
            </Button>
          </PreviewCode>
        </section>

        {/* ── Empty state ── */}
        <section className="space-y-4">
          <H2 id="empty-state">Empty state</H2>
          <p className="text-sm text-muted-foreground">
            Not a component — a composition. Every list, search, and cart view needs a non-blank zero
            state: an icon, a one-line explanation of why it&apos;s empty, and one recovery action as
            a <code className="rounded bg-muted px-1 py-0.5 text-xs">Button</code>. Build it from
            primitives so it inherits the same type and spacing everywhere.
          </p>
          <PreviewCode
            previewClassName="items-stretch"
            code={`<div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 text-center">
  <PackageOpen className="size-8 text-muted-foreground" aria-hidden />
  <div className="space-y-1">
    <p className="font-medium">No results for &quot;blower motor&quot;</p>
    <p className="text-sm text-muted-foreground">
      Try a different part number, or clear your filters.
    </p>
  </div>
  <Button variant="outline" size="sm">Clear filters</Button>
</div>`}
          >
            <div className="flex w-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 text-center">
              <PackageOpen className="size-8 text-muted-foreground" aria-hidden />
              <div className="space-y-1">
                <p className="font-medium">No results for &quot;blower motor&quot;</p>
                <p className="text-sm text-muted-foreground">
                  Try a different part number, or clear your filters.
                </p>
              </div>
              <Button variant="outline" size="sm">
                Clear filters
              </Button>
            </div>
          </PreviewCode>
        </section>

        {/* ── Guidance ── */}
        <section className="space-y-4">
          <H2 id="guidance">Guidance</H2>
          <Guidance
            dos={[
              <>Use an <code className="rounded bg-muted px-1 py-0.5 text-xs">Alert</code> for a message the user must read or act on; use a toast for a fleeting confirmation.</>,
              <>Match a skeleton to the real element&apos;s shape and size so layout doesn&apos;t jump when data arrives.</>,
              <>Fire toasts imperatively with <code className="rounded bg-muted px-1 py-0.5 text-xs">toast.success/error/…</code> so the right color and icon come for free.</>,
              <>Give every list, search, and cart a real empty state with one recovery action.</>,
            ]}
            donts={[
              <>Invent an alert color — success is the <code className="rounded bg-muted px-1 py-0.5 text-xs">in-stock</code> token, danger is <code className="rounded bg-muted px-1 py-0.5 text-xs">variant=&quot;destructive&quot;</code>.</>,
              <>Use a toast for an error the user must fix — it disappears before they can act.</>,
              <>Swap layout for a centered spinner; hold the shape with skeletons instead.</>,
              <>Render <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;Toaster /&gt;</code> per page — it&apos;s mounted once, globally.</>,
            ]}
          />
        </section>

        {/* ── API ── */}
        <section className="space-y-4">
          <H2 id="api">API</H2>
          <PropsTable
            caption="Alert — variant"
            rows={[
              { name: "default", type: "card", description: "Neutral, informational message. Tint with a text token for success." },
              { name: "destructive", type: "danger", description: "Errors and failures — text uses the destructive token." },
            ]}
          />
          <PropsTable
            caption="Alert — anatomy"
            rows={[
              { name: "<Alert>", type: "role=\"alert\"", description: "Wrapper. Optional leading lucide icon auto-aligns." },
              { name: "<AlertTitle>", type: "required", description: "One-line heading; truncates to a single line." },
              { name: "<AlertDescription>", type: "optional", description: "Supporting text in muted-foreground." },
            ]}
          />
          <PropsTable
            caption="toast()"
            rows={[
              { name: "toast(msg)", type: "neutral", description: "Plain notification." },
              { name: "toast.success(msg)", type: "in-stock", description: "Confirm a completed action." },
              { name: "toast.error(msg)", type: "destructive", description: "Report a failure (that needs no fix)." },
              { name: "toast.info / .warning", type: "info / warn", description: "Informational or cautionary note." },
              { name: "toast.loading(msg)", type: "pending", description: "Returns an id — resolve it with toast.success(msg, { id })." },
              { name: "{ action }", type: "option", description: "Adds a labelled button, e.g. Undo." },
            ]}
          />
          <PropsTable
            caption="Progress"
            rows={[
              { name: "value", type: "number 0–100", description: "Determinate fill percentage." },
              { name: "className", type: "string", description: "Width/height overrides; defaults to full width when set." },
            ]}
          />
        </section>

        {/* ── In production ── */}
        <section className="space-y-4">
          <H2 id="in-production">In production</H2>
          <p className="text-sm text-muted-foreground">
            Where these ship. Compare against the library above.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Checkout — confirmation", href: "/checkout?demo=1" },
              { label: "PLP — Search results", href: "/search?q=blower%20motor&signedin=1" },
              { label: "PDP — Add to cart", href: "/pdp/uc-replacement-products?signedin=1" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {l.label}
                <ExternalLink className="size-3.5" />
              </Link>
            ))}
          </div>
        </section>
      </main>

      <OnThisPage items={TOC} />
    </div>
  );
}
