"use client";

import * as React from "react";
import { Lock, LockOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Demo auth state. Signed-out (default) matches the live gated URLs;
 * signed-in reveals pricing/inventory. Shared via context so the summary and
 * the Frequently-Bought-Together cards stay in sync.
 */
const AuthContext = React.createContext<{
  signedIn: boolean;
  setSignedIn: (v: boolean) => void;
} | null>(null);

export function PdpAuthProvider({
  children,
  initialSignedIn = false,
}: {
  children: React.ReactNode;
  initialSignedIn?: boolean;
}) {
  const [signedIn, setSignedIn] = React.useState(initialSignedIn);
  return (
    <AuthContext.Provider value={{ signedIn, setSignedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within PdpAuthProvider");
  return ctx;
}

export function AuthToggle() {
  const { signedIn, setSignedIn } = useAuth();
  const opts = [
    { v: false, label: "Signed out", Icon: Lock },
    { v: true, label: "Signed in", Icon: LockOpen },
  ] as const;
  return (
    <div
      role="group"
      aria-label="Preview auth state"
      className="inline-flex items-center gap-0.5 rounded-md border bg-muted p-0.5 text-sm"
    >
      {opts.map(({ v, label, Icon }) => (
        <Button
          key={label}
          type="button"
          variant={signedIn === v ? "default" : "ghost"}
          size="sm"
          aria-pressed={signedIn === v}
          onClick={() => setSignedIn(v)}
          className={cn(
            "rounded-sm [&_svg]:size-3.5",
            signedIn !== v && "text-muted-foreground"
          )}
        >
          <Icon />
          {label}
        </Button>
      ))}
    </div>
  );
}
