import * as React from "react";
import { ChevronLeft, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Canonical motion timing for every drawer in the system. */
export const DRAWER_MOTION_MS = 520;

export function drawerOverlayClassName(closing = false, className?: string) {
  return cn("fixed inset-0 z-50 bg-black/50", closing && "drawer-overlay-exit", className);
}

export function drawerPanelClassName(
  side: "left" | "right" | "bottom",
  closing = false,
  className?: string,
) {
  const enter = side === "left"
    ? "drawer-panel-left-enter"
    : side === "bottom"
      ? "drawer-panel-bottom-enter"
      : "drawer-panel-right-enter";
  const exit = side === "left"
    ? "drawer-panel-left-exit"
    : side === "bottom"
      ? "drawer-panel-bottom-exit"
      : "drawer-panel-right-exit";
  return cn(enter, closing && exit, className);
}

export function DrawerCloseButton({
  onClick,
  label = "Close",
  className,
}: {
  onClick: () => void;
  label?: string;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      aria-label={label}
      onClick={onClick}
      className={cn("bg-background text-foreground hover:bg-muted hover:text-foreground", className)}
    >
      <X aria-hidden="true" />
    </Button>
  );
}

/** Canonical nested-drawer back control: same placement and surface as close. */
export function DrawerBackButton({
  onClick,
  label = "Back",
  className,
}: {
  onClick: () => void;
  label?: string;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      aria-label={label}
      onClick={onClick}
      className={cn("bg-background text-foreground hover:bg-muted", className)}
    >
      <ChevronLeft aria-hidden="true" />
    </Button>
  );
}

export function DrawerBackdrop({
  closing = false,
  onClose,
  children,
  className,
}: {
  closing?: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={drawerOverlayClassName(closing, className)}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {children}
    </div>
  );
}
