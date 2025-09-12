import { cn } from "@/lib/utils";

interface MetaItem {
  label: string;
  value: string | React.ReactNode;
}

interface MetaListProps {
  items: MetaItem[];
  className?: string;
  gap?: 'sm' | 'md' | 'lg';
}

const gapVariants = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
};

export default function MetaList({ 
  items, 
  className,
  gap = "md"
}: MetaListProps) {
  return (
    <dl className={cn("space-y-4", gapVariants[gap], className)}>
      {items.map((item, index) => (
        <div key={index} className="flex flex-col gap-1">
          <dt className="text-sm font-medium text-muted-foreground">
            {item.label}
          </dt>
          <dd className="text-base text-foreground">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}