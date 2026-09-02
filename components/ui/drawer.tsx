"use client";

import * as React from "react";
import { ChevronLeft, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Canonical motion timing for every side drawer in the system. */
export const DRAWER_MOTION_MS = 460;
/** Soft, fluid slide — not a rushed spring, not a fade. Same curve in and out,
 *  so closing reverses the way it opened. */
export const DRAWER_SPRING = {
  type: "tween" as const,
  duration: DRAWER_MOTION_MS / 1000,
  ease: [0.32, 0.72, 0, 1] as const,
};
const DrawerOverlayContext = React.createContext(false);

export function DrawerPanel({
  open,
  side = "right",
  children,
  className,
  role,
  "aria-modal": ariaModal,
  "aria-label": ariaLabel,
}: {
  open: boolean;
  side?: "left" | "right";
  children: React.ReactNode;
  className?: string;
  role?: string;
  "aria-modal"?: React.AriaAttributes["aria-modal"];
  "aria-label"?: string;
}) {
  const closedX = side === "right" ? "100%" : "-100%";
  const overlayClosing = React.useContext(DrawerOverlayContext);
  return (
    // `initial` left on (default) so the panel actually slides IN when it
    // mounts — initial={false} was suppressing the enter animation, which read
    // as an instant/fade appearance.
    <AnimatePresence>
      {open && !overlayClosing ? (
        <motion.aside
          key="drawer-panel"
          initial={{ x: closedX }}
          animate={{ x: 0 }}
          exit={{ x: closedX }}
          transition={DRAWER_SPRING}
          style={{ opacity: 1 }}
          className={className}
          role={role}
          aria-modal={ariaModal}
          aria-label={ariaLabel}
        >
          {children}
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}

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
      className={cn("bg-background text-foreground hover:bg-muted hover:text-foreground", className)}
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
    <DrawerOverlayContext.Provider value={closing}>
      <div
        className={drawerOverlayClassName(closing, className)}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        {children}
      </div>
    </DrawerOverlayContext.Provider>
  );
}
