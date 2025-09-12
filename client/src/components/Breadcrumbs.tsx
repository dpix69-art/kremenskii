import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  testId?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mt-6 mb-4 lg:mt-8">
      <ol className="flex items-center flex-wrap gap-1 text-sm text-muted-foreground pt-[0px] pb-[0px]">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="mx-2 h-3 w-3" />
            )}
            {item.href ? (
              <Link href={item.href}>
                <span 
                  className="hover:text-foreground transition-colors cursor-pointer"
                  data-testid={item.testId || `link-bc-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {item.label}
                </span>
              </Link>
            ) : (
              <span 
                className="text-foreground"
                data-testid={item.testId || `text-bc-current`}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}