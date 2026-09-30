import { Globe, Smartphone, Share2, Search, Clapperboard } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Service } from "@/lib/services";

const icons = {
  globe: Globe,
  smartphone: Smartphone,
  share2: Share2,
  search: Search,
  clapperboard: Clapperboard,
} as const;

export function ServiceIcon({
  icon,
  className,
}: {
  icon: Service["icon"];
  className?: string;
}) {
  const Icon = icons[icon];
  return <Icon className={cn("size-6", className)} aria-hidden="true" />;
}
