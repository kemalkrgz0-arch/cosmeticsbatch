import { MapPin } from "lucide-react";
import type { Brand } from "@/lib/brands";

export function BrandCodeGallery({
  brandName,
  heading,
  body,
  images,
}: {
  brandName: string;
  heading: string;
  body: string;
  images?: Brand["codeImages"];
}) {
  if (!images?.length) {
    return (
      <section className="mt-10">
        <h2 className="text-xl font-semibold">{heading}</h2>
        <p className="mt-3 leading-relaxed text-fg-muted">{body}</p>
      </section>
    );
  }

  return (
    <section className="relative mt-10 overflow-hidden rounded-3xl border border-border bg-bg-subtle/45 p-5 shadow-card sm:p-7">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-fg shadow-sm">
          <MapPin className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-xl font-semibold tracking-tight">{heading}</h2>
          <p className="mt-2 max-w-3xl leading-relaxed text-fg-muted">{body}</p>
        </div>
      </div>

      <figure
        className={`-mx-5 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto border-t border-border px-5 pt-6 [scrollbar-width:none] sm:mx-0 sm:grid sm:overflow-visible sm:px-0 ${
          images.length >= 3
            ? "sm:grid-cols-3"
            : images.length === 2
              ? "sm:grid-cols-2"
              : "sm:max-w-md"
        }`}
      >
        {images.map((image, index) => (
          <div
            key={image.src}
            className="group relative flex aspect-[4/3] w-[86%] shrink-0 snap-center items-center justify-center overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-card sm:w-auto sm:shrink"
          >
            <span className="absolute left-3 top-3 z-10 inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-border bg-card/90 px-2 text-xs font-semibold tabular-nums text-fg-muted shadow-sm backdrop-blur">
              {String(index + 1).padStart(2, "0")}
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt={`Where to find the batch code on ${brandName} packaging`}
              width={image.width}
              height={image.height}
              loading="lazy"
              decoding="async"
              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
        ))}
      </figure>
    </section>
  );
}
