"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function MobileHeaderMenu({ items, label, openLabel, closeLabel }: { items: { href: string; label: string }[]; label: string; openLabel: string; closeLabel: string }) {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
      if (event.key === "Tab" && panel.current) {
        const focusable = Array.from(panel.current.querySelectorAll<HTMLElement>('a,button:not([disabled])'));
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previous; document.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <>
      <button ref={trigger} type="button" aria-label={openLabel} aria-expanded={open} aria-controls="mobile-site-menu" onClick={() => setOpen(true)} className="inline-flex size-11 items-center justify-center rounded-full text-fg md:hidden"><Menu className="size-6" aria-hidden="true" /></button>
      {open && <div className="fixed inset-0 z-[70] md:hidden" role="dialog" aria-modal="true" aria-label={label}>
        <button type="button" aria-label={closeLabel} onClick={() => setOpen(false)} className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
        <div id="mobile-site-menu" ref={panel} className="absolute inset-x-3 top-3 rounded-[1.7rem] border border-border bg-card p-4 shadow-card">
          <div className="flex justify-end"><button type="button" aria-label={closeLabel} onClick={() => { setOpen(false); trigger.current?.focus(); }} className="inline-flex size-11 items-center justify-center rounded-full hover:bg-bg-subtle"><X className="size-6" aria-hidden="true" /></button></div>
          <nav aria-label={label}><ul className="space-y-1">{items.map((item) => <li key={item.href}><Link href={item.href} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 text-lg font-semibold hover:bg-bg-subtle">{item.label}</Link></li>)}</ul></nav>
        </div>
      </div>}
    </>
  );
}
