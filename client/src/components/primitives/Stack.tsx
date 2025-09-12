import { cn } from "@/lib/utils";

interface StackProps {
  children: React.ReactNode;
  className?: string;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  direction?: 'row' | 'col';
  align?: 'start' | 'center' | 'end';
  justify?: 'start' | 'center' | 'end' | 'between';
}

const gapVariants = {
  sm: "gap-2",      // 8px
  md: "gap-4",      // 16px
  lg: "gap-6",      // 24px
  xl: "gap-8",      // 32px
};

export default function Stack({ 
  children, 
  className,
  gap = "md",
  direction = "col",
  align = "start",
  justify = "start"
}: StackProps) {
  const flexDirection = direction === 'row' ? 'flex-row' : 'flex-col';
  const alignItems = `items-${align}`;
  const justifyContent = `justify-${justify}`;
  
  return (
    <div 
      className={cn(
        "flex",
        flexDirection,
        alignItems,
        justifyContent,
        gapVariants[gap],
        className
      )}
    >
      {children}
    </div>
  );
}