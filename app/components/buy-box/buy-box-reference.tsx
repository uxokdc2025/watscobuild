"use client";

import { PdpAuthProvider } from "../../pdp/_lib/auth";
import { PdpSummary } from "../../pdp/_lib/summary";
import { getPdp, pdps } from "../../pdp/_lib/registry";

export default function BuyBoxReference() {
  const product = getPdp("uc-ahri-matched-system") ?? pdps[0];
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-8">
      <header className="mb-8 space-y-3">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Blocks</p>
        <h1 className="text-3xl font-bold tracking-tight">Buy Box</h1>
        <p className="max-w-2xl text-muted-foreground">
          The PDP purchase panel — the value hierarchy that drives every product page: badges and
          price up top, branch availability, quantity + Add to Cart, and secondary actions. Price and
          stock are gated to signed-in; shown here signed-in.
        </p>
      </header>
      <div className="mx-auto max-w-md">
        <PdpAuthProvider initialSignedIn>
          <PdpSummary product={product} />
        </PdpAuthProvider>
      </div>
    </main>
  );
}
