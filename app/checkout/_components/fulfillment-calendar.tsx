"use client";

import * as React from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/* ───────────────────────── Calendar (date validation) ─────────────────────────
 * Fixed "today" keeps the prototype deterministic (no SSR/CSR hydration drift and
 * stable screenshots). The calendar DISABLES invalid dates and surfaces the
 * reason — it never silently accepts an out-of-window pick. Shared by both the
 * pickup and delivery panels. */

export const TODAY = new Date(2026, 8, 4); // Fri, Sep 4 2026

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
export function addDays(d: Date, n: number): Date {
  const r = startOfDay(d);
  r.setDate(r.getDate() + n);
  return r;
}
function sameDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}
export function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function fmtTime(d: Date): string {
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export const TIME_SLOTS: { label: string; h: number; m: number; disabled?: boolean }[] = [
  { label: "9:00 AM", h: 9, m: 0 },
  { label: "9:30 AM", h: 9, m: 30 },
  { label: "10:00 AM", h: 10, m: 0 },
  { label: "10:30 AM", h: 10, m: 30 },
  { label: "11:00 AM", h: 11, m: 0 },
  { label: "11:30 AM", h: 11, m: 30 },
  { label: "12:00 PM", h: 12, m: 0 },
  { label: "12:30 PM", h: 12, m: 30 },
  { label: "1:00 PM", h: 13, m: 0 },
  { label: "1:30 PM", h: 13, m: 30, disabled: true },
  { label: "2:00 PM", h: 14, m: 0 },
  { label: "2:30 PM", h: 14, m: 30 },
  { label: "3:00 PM", h: 15, m: 0 },
  { label: "3:30 PM", h: 15, m: 30 },
  { label: "4:00 PM", h: 16, m: 0 },
];

/** First actually-selectable date at/after `earliest` (skips closed days). */
export function firstSelectable(earliest: Date): Date {
  let d = startOfDay(earliest);
  for (let i = 0; i < 14; i++) {
    if (!disabledReason(d, earliest)) return d;
    d = addDays(d, 1);
  }
  return d;
}

/** Returns a human reason a date can't be picked, or null if it's selectable. */
function disabledReason(date: Date, earliest: Date): string | null {
  const day = startOfDay(date);
  if (day.getTime() < startOfDay(earliest).getTime()) {
    if (day.getTime() < startOfDay(TODAY).getTime()) return "Date has passed";
    return "Before the earliest available date";
  }
  if (date.getDay() === 0) return "Branch closed Sundays";
  return null;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function CalendarGrid({
  selected,
  earliest,
  onSelect,
}: {
  selected: Date | null;
  earliest: Date;
  onSelect: (d: Date) => void;
}) {
  const [view, setView] = React.useState<Date>(() => new Date(earliest.getFullYear(), earliest.getMonth(), 1));

  const firstOfMonth = new Date(view.getFullYear(), view.getMonth(), 1);
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const leading = firstOfMonth.getDay();
  const minMonth = new Date(earliest.getFullYear(), earliest.getMonth(), 1);
  const maxMonth = new Date(earliest.getFullYear(), earliest.getMonth() + 2, 1);
  const canPrev = view > minMonth;
  const canNext = view < maxMonth;

  const cells: (Date | null)[] = [];
  for (let i = 0; i < leading; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(view.getFullYear(), view.getMonth(), d));

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
          disabled={!canPrev}
          aria-label="Previous month"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="text-xs font-semibold" aria-live="polite">
          {view.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
          disabled={!canNext}
          aria-label="Next month"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] font-medium text-muted-foreground">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-0.5">
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((date, i) => {
          if (!date) return <div key={`b-${i}`} />;
          const reason = disabledReason(date, earliest);
          const isSelected = selected ? sameDay(date, selected) : false;
          const isToday = sameDay(date, TODAY);
          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={!!reason}
              title={reason ?? undefined}
              aria-label={`${fmtDate(date)}${reason ? ` — ${reason}` : ""}`}
              aria-pressed={isSelected}
              onClick={() => onSelect(date)}
              className={cn(
                "grid h-7 place-items-center rounded-md text-xs transition-colors",
                reason
                  ? "cursor-not-allowed text-muted-foreground/40 line-through"
                  : "hover:bg-muted",
                isSelected && "bg-primary text-primary-foreground hover:bg-primary",
                !isSelected && isToday && !reason && "ring-1 ring-inset ring-border font-semibold"
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DateField({
  id,
  label,
  value,
  onSelect,
  earliest,
  reason,
  required = false,
}: {
  id: string;
  label: string;
  value: Date | null;
  onSelect: (d: Date) => void;
  earliest: Date;
  /** Persistent cutoff/availability explanation shown near the field. */
  reason?: string;
  required?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [pendingDate, setPendingDate] = React.useState<Date | null>(null);
  const [pendingTime, setPendingTime] = React.useState<(typeof TIME_SLOTS)[number] | null>(null);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setPendingDate(value);
      setPendingTime(
        value ? (TIME_SLOTS.find((s) => s.h === value.getHours() && s.m === value.getMinutes()) ?? null) : null
      );
    }
    setOpen(next);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required ? <span className="ml-0.5 text-destructive">*</span> : null}
      </Label>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <button
            id={id}
            type="button"
            aria-haspopup="dialog"
            className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 text-left text-sm shadow-xs transition-[color,box-shadow] outline-none hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <span className={cn(value ? "text-foreground" : "text-muted-foreground")}>
              {value ? `${fmtDate(value)} · ${fmtTime(value)}` : "Select a date"}
            </span>
            <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <div className="flex">
            <div className="w-56 border-r p-2">
              <CalendarGrid selected={pendingDate} earliest={earliest} onSelect={setPendingDate} />
            </div>
            <div className="flex w-28 flex-col p-2">
              <p className="mb-1.5 text-center text-xs font-semibold">Available times</p>
              <div className="max-h-[200px] space-y-1 overflow-y-auto pr-1">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot.label}
                    type="button"
                    disabled={slot.disabled}
                    onClick={() => setPendingTime(slot)}
                    className={cn(
                      "w-full rounded-md border px-2 py-1 text-center text-xs font-medium transition-colors",
                      slot.disabled
                        ? "cursor-not-allowed text-muted-foreground/40"
                        : pendingTime?.label === slot.label
                          ? "border-primary bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                    )}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 border-t p-2">
            <div className="flex items-center gap-2">
              <div className="rounded-md border px-2 py-1 text-xs">
                {pendingDate
                  ? pendingDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  : "No date"}
              </div>
              <Button type="button" variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={() => setPendingDate(firstSelectable(earliest))}>
                Today
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                className="h-7 px-2 text-xs"
                disabled={!pendingDate || !pendingTime}
                onClick={() => {
                  if (pendingDate && pendingTime) {
                    const d = new Date(pendingDate);
                    d.setHours(pendingTime.h, pendingTime.m, 0, 0);
                    onSelect(d);
                    setOpen(false);
                  }
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {reason ? (
        <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          <span>{reason}</span>
        </p>
      ) : null}
    </div>
  );
}
