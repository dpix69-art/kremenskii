import { cn } from "@/lib/utils";
import type { ContainerProps } from "@/types";

const containerVariants = {
  sm: "max-w-2xl",
  md: "max-w-4xl", 
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  "7xl": "max-w-7xl", // Default for artist portfolio - 1280px
};

export default function Container({ 
  children, 
  className, 
  maxWidth = "7xl" 
}: ContainerProps) {
  return (
    <div 
      className={cn(
        "mx-auto px-6 lg:px-8",
        containerVariants[maxWidth],
        className
      )}
    >
      {children}
    </div>
  );
}