"use client";

import * as React from "react";
import { DRAWER_MOTION_MS, DrawerBackdrop } from "@/components/ui/drawer";

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

  return <DrawerBackdrop closing={closing} onClose={finishClose} className="drawer-overlay-enter">{children}</DrawerBackdrop>;
}

export function closeDrawer() {
  window.dispatchEvent(new CustomEvent(DRAWER_EXIT_EVENT));
}
