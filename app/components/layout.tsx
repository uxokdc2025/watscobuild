import * as React from "react";

import { DsSidebar } from "./_ds/sidebar";

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh bg-background md:flex">
      <DsSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
