import * as React from "react";
import { Check, FileText, Files, Sparkles, Table2 } from "lucide-react";

import { cn } from "@/lib/utils";

/* ── Reference content: Gemaire RA14AY36 Endeavor Line condenser ──
   Recreated for the tab/accordion design showcase. Server-safe (no hooks) so
   server pages can import SECTIONS and iterate it. */
export const RA14 = {
  brand: "Endeavor Line",
  title:
    "Endeavor Line 3 Ton 13.8–14.3 SEER2 Condenser R-454B with High/Low Pressure Switch — 208-230/1/60",
  short: "Endeavor Line 3 Ton 14.3 SEER2 Condenser R-454B",
  item: "RA14AY36AJ1NALHP",
  mfg: "RA14AY36AJ1NALHP",
  price: 1899.0,
  uom: "EACH",
  image: "/uc/glzs4b.png",
  sourceUrl:
    "https://www.gemaire.com/ra14ay36aj1nalhp-endeavor-line-3-ton-13-8-14-3-seer2-condenser-r-454b-with-high-low-pressure-switch-208-230-1-60-ra14ay36aj1nalhp",
  description:
    "The Endeavor Line RA14AY36 is a 3-ton, 13.8–14.3 SEER2 single-stage air conditioner condenser built around next-generation R-454B (A2L) refrigerant. Factory-installed high and low pressure switches protect the scroll compressor, while the powder-coated steel cabinet and louvered coil guard stand up to harsh outdoor conditions. Engineered for 208-230V / 1-phase / 60Hz residential and light-commercial split systems.",
  features: [
    "R-454B (A2L) low-GWP refrigerant — ready for 2025 regulations",
    "13.8–14.3 SEER2 single-stage efficiency",
    "Factory-installed high & low pressure switches",
    "Sound-dampening compressor blanket for quieter operation",
    "Powder-coated, corrosion-resistant steel cabinet",
    "Louvered coil guard protects the condenser coil",
    "AHRI-certified matched systems available",
  ],
  specs: [
    { label: "Nominal Capacity", value: "3 Ton (36,000 BTU)" },
    { label: "SEER2", value: "13.8 – 14.3" },
    { label: "Refrigerant", value: "R-454B (A2L)" },
    { label: "Compressor", value: "Single-Stage Scroll" },
    { label: "Electrical", value: "208-230V / 1 Ph / 60 Hz" },
    { label: "Pressure Switches", value: "High & Low (factory-installed)" },
    { label: "Sound Level", value: "72 dB" },
    { label: "Cabinet", value: "Powder-Coated Steel" },
    { label: "Coil", value: "Aluminum" },
    { label: "Connections", value: '3/8" Liquid × 3/4" Suction' },
    { label: "Dimensions", value: '35.5" H × 29" W × 29" D' },
    { label: "Warranty", value: "10-Yr Parts (registered)" },
  ],
  documents: [
    "Product Specification Sheet",
    "Installation Instructions",
    "Warranty Certificate",
    "AHRI Certificate",
    "Wiring Diagram",
  ],
};

/* ── Section bodies (shared by every tab + accordion variant) ── */
export function DescriptionBody() {
  return (
    <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
      {RA14.description}
    </p>
  );
}

export function FeaturesBody() {
  return (
    <ul className="flex flex-col gap-2.5">
      {RA14.features.map((f) => (
        <li key={f} className="flex items-start gap-2.5 text-sm">
          <Check className="mt-0.5 size-4 shrink-0 text-primary" />
          <span className="text-muted-foreground">{f}</span>
        </li>
      ))}
    </ul>
  );
}

export function SpecificationsBody() {
  return (
    <div className="overflow-hidden rounded-lg border">
      {RA14.specs.map((s, i) => (
        <div
          key={s.label}
          className={cn(
            "grid grid-cols-2 gap-4 px-4 py-2.5 text-sm",
            i % 2 ? "bg-muted/40" : "",
          )}
        >
          <span className="font-semibold">{s.label}</span>
          <span className="text-muted-foreground">{s.value}</span>
        </div>
      ))}
    </div>
  );
}

export function DocumentsBody() {
  return (
    <ul className="flex flex-col gap-1.5">
      {RA14.documents.map((d) => (
        <li key={d}>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            <FileText className="size-4 shrink-0" />
            {d} <span className="text-xs text-muted-foreground">(PDF)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/** The 4 content sections, in display order, used by every variant. */
export const SECTIONS: {
  id: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  Body: React.ComponentType;
}[] = [
  { id: "description", label: "Description", Icon: FileText, Body: DescriptionBody },
  { id: "documents", label: "Documents", Icon: Files, Body: DocumentsBody },
  { id: "features", label: "Features", Icon: Sparkles, Body: FeaturesBody },
  { id: "specifications", label: "Specifications", Icon: Table2, Body: SpecificationsBody },
];

/** Small labelled wrapper around each design variant. */
export function VariantBlock({
  n,
  name,
  note,
  children,
}: {
  n: number;
  name: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b pb-2">
        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {n}
        </span>
        <h3 className="text-lg font-bold tracking-tight">{name}</h3>
        <span className="text-sm text-muted-foreground">{note}</span>
      </div>
      {children}
    </section>
  );
}
