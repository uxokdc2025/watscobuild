"use client";

import * as React from "react";
import { MoreHorizontal, ExternalLink } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DrawerBackdrop, DrawerCloseButton, DrawerPanel } from "@/components/ui/drawer";
import { PreviewCode, PropsTable, Guidance } from "../_ds/code";
import { OnThisPage } from "../_ds/sidebar";

const TOC = [
  { id: "usage", label: "Usage" },
  { id: "dialog", label: "Dialog" },
  { id: "sheet", label: "Sheet" },
  { id: "drawer", label: "Drawer" },
  { id: "popover", label: "Popover" },
  { id: "tooltip", label: "Tooltip" },
  { id: "dropdown-menu", label: "Dropdown menu" },
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

export default function OverlaysReference() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);

  return (
    <div className="mx-auto flex max-w-6xl gap-10 px-4 py-10 md:px-8">
      <main className="min-w-0 flex-1 space-y-12">
        <header className="space-y-3">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Components
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Overlays</h1>
          <p className="max-w-2xl text-muted-foreground">
            Layered surfaces summoned by a control — a centered{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">Dialog</code>, an edge{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">Sheet</code>, our motion{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">Drawer</code>, a floating{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">Popover</code>,{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">Tooltip</code>, and{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">DropdownMenu</code>. The modal
            surfaces trap focus, set <code className="rounded bg-muted px-1 py-0.5 text-xs">aria-modal</code>,
            and close on <kbd className="rounded border bg-muted px-1 text-xs">Esc</kbd> or an
            outside click. Open each below — every preview is live.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <code className="rounded-md border bg-muted/50 px-2.5 py-1 font-mono text-xs text-muted-foreground">
              import {"{ Dialog, DialogTrigger, DialogContent }"} from &quot;@/components/ui/dialog&quot;
            </code>
          </div>
        </header>

        {/* ── Usage ── */}
        <section className="space-y-4">
          <H2 id="usage">Usage</H2>
          <p className="text-sm text-muted-foreground">
            Every overlay is the same shape: a <code className="rounded bg-muted px-1 py-0.5 text-xs">Trigger</code>{" "}
            wrapping your button with <code className="rounded bg-muted px-1 py-0.5 text-xs">asChild</code>, and a{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">Content</code> that portals out. Never toggle
            visibility with your own <code className="rounded bg-muted px-1 py-0.5 text-xs">useState</code> +{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">hidden</code> — you&apos;d lose the focus trap.
          </p>
          <PreviewCode
            install="dialog"
            code={`<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Edit profile</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>Make changes, then save.</DialogDescription>
    </DialogHeader>
    <div className="grid gap-3">
      <Label htmlFor="name">Name</Label>
      <Input id="name" defaultValue="Ada Lovelace" />
    </div>
    <DialogFooter>
      <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
      <DialogClose asChild><Button>Save changes</Button></DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
          >
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Edit profile</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>Make changes, then save.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-3">
                  <Label htmlFor="dlg-name">Name</Label>
                  <Input id="dlg-name" defaultValue="Ada Lovelace" />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button>Save changes</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PreviewCode>
        </section>

        {/* ── Dialog ── */}
        <section className="space-y-4">
          <H2 id="dialog">Dialog</H2>
          <p className="text-sm text-muted-foreground">
            A centered, focus-trapped modal for a short, self-contained task — confirm, edit one
            thing, acknowledge. It renders a scrim, an auto-wired close button, and returns focus to
            the trigger on close. For anything long or list-like, reach for a Sheet or Drawer instead.
          </p>
          <PreviewCode
            code={`<Dialog>
  <DialogTrigger asChild>
    <Button variant="destructive">Delete order</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Delete this order?</DialogTitle>
      <DialogDescription>This can&apos;t be undone.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
      <DialogClose asChild><Button variant="destructive">Delete</Button></DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
          >
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">Delete order</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Delete this order?</DialogTitle>
                  <DialogDescription>This can&apos;t be undone.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button variant="destructive">Delete</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PreviewCode>
        </section>

        {/* ── Sheet ── */}
        <section className="space-y-4">
          <H2 id="sheet">Sheet</H2>
          <p className="text-sm text-muted-foreground">
            A modal panel that slides in from an edge — <code className="rounded bg-muted px-1 py-0.5 text-xs">side=&quot;right&quot;</code>{" "}
            (default) or <code className="rounded bg-muted px-1 py-0.5 text-xs">&quot;left&quot;</code>. Same
            focus-trap and Esc/outside-click behavior as Dialog, with room for a scrollable form or
            filter stack. Radix-backed, so it&apos;s the drop-in when you don&apos;t need custom motion.
          </p>
          <PreviewCode
            install="sheet"
            code={`<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open filters</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Filters</SheetTitle>
      <SheetDescription>Narrow the results.</SheetDescription>
    </SheetHeader>
    <div className="grid gap-2">
      <Label htmlFor="brand">Brand</Label>
      <Input id="brand" placeholder="e.g. Carrier" />
    </div>
  </SheetContent>
</Sheet>`}
          >
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Open filters</Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>Narrow the results.</SheetDescription>
                </SheetHeader>
                <div className="grid gap-2">
                  <Label htmlFor="sheet-brand">Brand</Label>
                  <Input id="sheet-brand" placeholder="e.g. Carrier" />
                </div>
              </SheetContent>
            </Sheet>
          </PreviewCode>
        </section>

        {/* ── Drawer ── */}
        <section className="space-y-4">
          <H2 id="drawer">Drawer</H2>
          <p className="text-sm text-muted-foreground">
            The house drawer — a hand-built panel on the fleet&apos;s canonical motion curve (
            <code className="rounded bg-muted px-1 py-0.5 text-xs">DRAWER_SPRING</code>, ~460ms), used
            for the cart and account flows where the Radix Sheet&apos;s timing isn&apos;t enough.
            Compose <code className="rounded bg-muted px-1 py-0.5 text-xs">DrawerBackdrop</code> +{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">DrawerPanel</code> +{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">DrawerCloseButton</code> and drive it
            with your own state. Set <code className="rounded bg-muted px-1 py-0.5 text-xs">role=&quot;dialog&quot;</code>,{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">aria-modal</code>, and an{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">aria-label</code> yourself.
          </p>
          <PreviewCode
            code={`const [open, setOpen] = React.useState(false);

<Button variant="outline" onClick={() => setOpen(true)}>Open cart drawer</Button>

{open && (
  <DrawerBackdrop onClose={() => setOpen(false)}>
    <DrawerPanel
      open
      side="right"
      role="dialog"
      aria-modal="true"
      aria-label="Your cart"
      className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col gap-4 border-l bg-background p-6 shadow-lg"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Your cart</h2>
        <DrawerCloseButton label="Close cart" onClick={() => setOpen(false)} />
      </div>
      <p className="text-sm text-muted-foreground">Items you add will appear here.</p>
    </DrawerPanel>
  </DrawerBackdrop>
)}`}
          >
            <Button variant="outline" onClick={() => setDrawerOpen(true)}>
              Open cart drawer
            </Button>
            {drawerOpen && (
              <DrawerBackdrop onClose={() => setDrawerOpen(false)}>
                <DrawerPanel
                  open
                  side="right"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Your cart"
                  className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col gap-4 border-l bg-background p-6 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold">Your cart</h2>
                    <DrawerCloseButton
                      label="Close cart"
                      onClick={() => setDrawerOpen(false)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Items you add will appear here.
                  </p>
                </DrawerPanel>
              </DrawerBackdrop>
            )}
          </PreviewCode>
        </section>

        {/* ── Popover ── */}
        <section className="space-y-4">
          <H2 id="popover">Popover</H2>
          <p className="text-sm text-muted-foreground">
            A non-modal floating panel anchored to its trigger — it does{" "}
            <span className="font-medium text-foreground">not</span> trap focus or dim the page, so
            the rest of the UI stays live. Use it for a small set of controls or a quick detail, not
            a menu of actions (that&apos;s a Dropdown menu) and not a required decision (that&apos;s a Dialog).
          </p>
          <PreviewCode
            install="popover"
            code={`<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Dimensions</Button>
  </PopoverTrigger>
  <PopoverContent className="w-72">
    <div className="grid gap-2">
      <p className="font-medium">Dimensions</p>
      <p className="text-sm text-muted-foreground">Set the layer dimensions.</p>
      <div className="mt-2 grid grid-cols-3 items-center gap-2">
        <Label htmlFor="w">Width</Label>
        <Input id="w" defaultValue="100%" className="col-span-2 h-8" />
      </div>
    </div>
  </PopoverContent>
</Popover>`}
          >
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Dimensions</Button>
              </PopoverTrigger>
              <PopoverContent className="w-72">
                <div className="grid gap-2">
                  <p className="font-medium">Dimensions</p>
                  <p className="text-sm text-muted-foreground">Set the layer dimensions.</p>
                  <div className="mt-2 grid grid-cols-3 items-center gap-2">
                    <Label htmlFor="pop-w">Width</Label>
                    <Input id="pop-w" defaultValue="100%" className="col-span-2 h-8" />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </PreviewCode>
        </section>

        {/* ── Tooltip ── */}
        <section className="space-y-4">
          <H2 id="tooltip">Tooltip</H2>
          <p className="text-sm text-muted-foreground">
            A tiny label on hover or keyboard focus — for naming an icon-only control, never for
            essential content (it never appears on touch). Requires a{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">TooltipProvider</code> ancestor;
            mount one high in the tree and reuse it. Hover or tab to the buttons below.
          </p>
          <PreviewCode
            install="tooltip"
            code={`<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline">Hover me</Button>
    </TooltipTrigger>
    <TooltipContent>Appears on hover or focus</TooltipContent>
  </Tooltip>

  {/* Force-open for documentation with the \`open\` prop */}
  <Tooltip open>
    <TooltipTrigger asChild>
      <Button variant="outline">Anchored</Button>
    </TooltipTrigger>
    <TooltipContent side="bottom">Always-on tooltip</TooltipContent>
  </Tooltip>
</TooltipProvider>`}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Hover me</Button>
                </TooltipTrigger>
                <TooltipContent>Appears on hover or focus</TooltipContent>
              </Tooltip>
              <Tooltip open>
                <TooltipTrigger asChild>
                  <Button variant="outline">Anchored</Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Always-on tooltip</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </PreviewCode>
        </section>

        {/* ── Dropdown menu ── */}
        <section className="space-y-4">
          <H2 id="dropdown-menu">Dropdown menu</H2>
          <p className="text-sm text-muted-foreground">
            A keyboard-navigable menu of actions off a trigger — labels, separators, shortcuts,
            checkbox items, disabled items, and a destructive variant. Items support hover, focus,
            disabled, and selected states. Open it and arrow through.
          </p>
          <PreviewCode
            install="dropdown-menu"
            code={`<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" size="icon" aria-label="Open menu">
      <MoreHorizontal />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="start" className="w-52">
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      Profile <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem>Billing</DropdownMenuItem>
    <DropdownMenuCheckboxItem checked={notifications} onCheckedChange={setNotifications}>
      Notifications
    </DropdownMenuCheckboxItem>
    <DropdownMenuItem disabled>Team</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">Delete account</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open menu">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Profile
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuCheckboxItem
                  checked={notifications}
                  onCheckedChange={setNotifications}
                >
                  Notifications
                </DropdownMenuCheckboxItem>
                <DropdownMenuItem disabled>Team</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">Delete account</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </PreviewCode>
        </section>

        {/* ── Guidance ── */}
        <section className="space-y-4">
          <H2 id="guidance">Guidance</H2>
          <Guidance
            dos={[
              <>Wrap the trigger with <code className="rounded bg-muted px-1 py-0.5 text-xs">asChild</code> so your <code className="rounded bg-muted px-1 py-0.5 text-xs">Button</code> keeps its own hover/focus.</>,
              <>Let the modal surfaces manage focus — they trap it, set <code className="rounded bg-muted px-1 py-0.5 text-xs">aria-modal</code>, and close on <kbd className="rounded border bg-muted px-1 text-xs">Esc</kbd> or outside click.</>,
              <>Give an icon-only trigger and the Drawer an explicit <code className="rounded bg-muted px-1 py-0.5 text-xs">aria-label</code>.</>,
              <>Pick by weight: Dialog for a required decision, Sheet/Drawer for a long panel, Popover for optional detail, Tooltip for a name.</>,
            ]}
            donts={[
              <>Fake an overlay with <code className="rounded bg-muted px-1 py-0.5 text-xs">useState</code> + <code className="rounded bg-muted px-1 py-0.5 text-xs">hidden</code> — you lose the focus trap and Esc handling.</>,
              <>Put essential content in a Tooltip — it never shows on touch and vanishes on blur.</>,
              <>Use a Popover for a required decision, or nest one modal inside another.</>,
              <>Hand-roll the Drawer&apos;s motion — use <code className="rounded bg-muted px-1 py-0.5 text-xs">DrawerPanel</code> so timing matches the cart everywhere.</>,
            ]}
          />
        </section>

        {/* ── API ── */}
        <section className="space-y-4">
          <H2 id="api">API</H2>
          <PropsTable
            caption="Which overlay"
            rows={[
              { name: "Dialog", type: "modal, centered", description: "Short self-contained task or required decision. Traps focus." },
              { name: "Sheet", type: "modal, edge", description: "Radix panel from left/right — scrollable forms, filter stacks." },
              { name: "Drawer", type: "modal, edge + motion", description: "House-motion panel (cart, account). Compose it yourself." },
              { name: "Popover", type: "non-modal", description: "Anchored floating panel; page stays interactive." },
              { name: "Tooltip", type: "non-modal, hint", description: "Hover/focus label for an icon-only control." },
              { name: "DropdownMenu", type: "non-modal, menu", description: "Keyboard-navigable list of actions." },
            ]}
          />
          <PropsTable
            caption="Shared props"
            rows={[
              { name: "asChild (Trigger)", type: "boolean", description: "Render your own element as the trigger instead of a wrapper." },
              { name: "side (Sheet / Drawer)", type: "\"left\" | \"right\"", description: "Edge the panel enters from. Sheet defaults to right." },
              { name: "align / side (Content)", type: "start | center | end", description: "Popover / Dropdown / Tooltip placement relative to the trigger." },
              { name: "open / onOpenChange", type: "controlled", description: "Drive state yourself; omit for uncontrolled (recommended)." },
              { name: "showCloseButton (Dialog)", type: "boolean = true", description: "Auto-wired ✕ in the corner; set false to supply your own." },
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
              { label: "PDP — Add to cart drawer", href: "/pdp/uc-replacement-products?signedin=1" },
              { label: "PLP — Filters sheet", href: "/search?q=blower%20motor&signedin=1" },
              { label: "Store Locator", href: "/store-locator" },
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
