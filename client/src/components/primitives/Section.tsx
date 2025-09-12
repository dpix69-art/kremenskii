import { cn } from "@/lib/utils";
import type { SectionProps } from "@/types";

const paddingVariants = {
  sm: "py-8",       // 32px
  md: "py-12",      // 48px
  lg: "py-16",      // 64px
  xl: "py-24",      // 96px
};

export default function Section({ 
  children, 
  className, 
  paddingY = "lg"
}: SectionProps) {
  return (
    <section 
      className={cn(
        paddingVariants[paddingY],
        className
      )}
    >
      {children}
    </section>
  );
}