import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  as: As = "h2",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-2xl text-center", className)}>
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">
          {eyebrow}
        </p>
      )}
      <As className="text-balance text-2xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </As>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-xl text-pretty text-fg-muted">
          {subtitle}
        </p>
      )}
    </div>
  );
}
