import { cn } from "@/lib/utils";

/** Deterministic monogram used in place of trademarked brand logos. */
export function BrandMark({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const initials = name
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <span
      aria-hidden
      className={cn(
        "flex items-center justify-center rounded-xl bg-bg-subtle font-semibold tracking-tight text-fg",
        className,
      )}
    >
      {initials}
    </span>
  );
}
