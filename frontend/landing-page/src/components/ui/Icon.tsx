import {
  ArrowRight,
  BookOpen,
  Check,
  FlaskConical,
  Globe,
  Mail,
  MapPin,
  Menu,
  Palette,
  Phone,
  Sparkles,
  Trophy,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/types";

/** Maps the site's icon names to lucide icons (shadcn's icon library). */
const icons: Record<IconName, LucideIcon> = {
  arrow: ArrowRight,
  book: BookOpen,
  globe: Globe,
  people: Users,
  spark: Sparkles,
  science: FlaskConical,
  palette: Palette,
  trophy: Trophy,
  menu: Menu,
  close: X,
  pin: MapPin,
  mail: Mail,
  phone: Phone,
  check: Check,
};

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 22, className }: IconProps) {
  const Component = icons[name];

  return (
    <Component
      size={size}
      strokeWidth={1.8}
      aria-hidden="true"
      focusable="false"
      className={className}
    />
  );
}
