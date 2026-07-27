"use client";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function PackSize({
  options,
  value,
  onValueChange,
}: {
  options: string[];
  value: string;
  onValueChange: (v: string) => void;
}) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onValueChange}
      aria-label="Pack Size"
      className="grid gap-1 rounded-lg bg-muted p-1"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((o) => (
        <Label
          key={o}
          htmlFor={`pack-${o}`}
          className={cn(
            "grid h-11 cursor-pointer select-none place-items-center rounded-md text-sm font-medium text-foreground",
            "transition-[color,background-color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-out)]",
            "hover:bg-background/60",
            "has-[[data-state=checked]]:bg-primary has-[[data-state=checked]]:text-primary-foreground has-[[data-state=checked]]:shadow-sm has-[[data-state=checked]]:hover:bg-primary",
            "has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50"
          )}
        >
          <RadioGroupItem id={`pack-${o}`} value={o} className="sr-only" />
          {o}
        </Label>
      ))}
    </RadioGroup>
  );
}
