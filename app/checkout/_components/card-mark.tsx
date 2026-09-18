import { Badge } from "@/components/ui/badge";

export function CardMark({ brand, className }: { brand: string; className?: string }) {
  const color = brand === "VISA" || brand === "AMEX" ? "blue" : "slate";
  return (
    <Badge variant="solid" color={color} className={className ?? "h-8 min-w-12 rounded-sm px-1.5 text-[9px] font-bold"}>
      {brand === "MASTERCARD" ? "●●" : brand}
    </Badge>
  );
}
