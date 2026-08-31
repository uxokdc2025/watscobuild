"use client";

import * as React from "react";
import { DRAWER_MOTION_MS } from "@/components/ui/drawer";

export const DRAWER_EXIT_EVENT = "watsco:drawer-exit";
export function DrawerOverlay({ children }: { children: React.ReactNode }) {
  const [closing, setClosing] = React.useState(false);

  const finishClose = React.useCallback(() => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(() => {
      if (window.history.length > 1) window.history.back();
      else window.location.assign("/search");
    }, DRAWER_MOTION_MS);
  }, [closing]);

  React.useEffect(() => {
    window.addEventListener(DRAWER_EXIT_EVENT, finishClose);
    return () => window.removeEventListener(DRAWER_EXIT_EVENT, finishClose);
  }, [finishClose]);

  return (
    <div
      className={`drawer-overlay-enter fixed inset-0 z-50 bg-black/50 ${closing ? "drawer-overlay-exit" : ""}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) finishClose();
      }}
    >
      {children}
    </div>
  );
}

export function closeDrawer() {
  window.dispatchEvent(new CustomEvent(DRAWER_EXIT_EVENT));
}
