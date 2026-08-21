"use client";

import * as React from "react";

export function DrawerOverlay({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="drawer-overlay-enter fixed inset-0 z-50 bg-black/50"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) window.history.back();
      }}
    >
      {children}
    </div>
  );
}

export function closeDrawer() {
  if (window.history.length > 1) window.history.back();
  else window.location.assign("/search");
}
