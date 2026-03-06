import { Link } from "wouter";

interface BreadcrumbItem {
  label: string;
  href?: string;
  testId?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

function normalizeHref(href?: string): string {
  if (!href) return "/";
  if (href.startsWith("#/")) return href.slice(1);
  if (href === "#/") return "/";
  return href;
}

export default function Breadcrumbs({ items }: Props) {
  return (
    <nav
      className="flex flex-wrap gap-1 text-type-small text-muted-foreground mb-6"
      aria-label="Breadcrumb"
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <span className="mx-1 text-muted-foreground/50">/</span>}
            {isLast || !item.href ? (
              <span className="text-foreground" data-testid={item.testId}>
                {item.label}
              </span>
            ) : (
              <Link href={normalizeHref(item.href)}>
                <span
                  className="underline underline-offset-2 hover:text-foreground transition-colors cursor-pointer"
                  data-testid={item.testId}
                >
                  {item.label}
                </span>
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
