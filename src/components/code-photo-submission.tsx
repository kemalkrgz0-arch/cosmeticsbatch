"use client";

import { useRef, useState } from "react";
import { Camera, CheckCircle2, ImagePlus, LoaderCircle } from "lucide-react";
import type { Brand } from "@/lib/brands";

async function sanitizeImage(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.86));
  if (!blob) throw new Error("image conversion failed");
  return new File([blob], "batch-code.jpg", { type: "image/jpeg" });
}

export function CodePhotoSubmission({ brand }: { brand: Brand }) {
  const input = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [code, setCode] = useState("");
  const [note, setNote] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!file || !consent) return;
    setState("sending");
    try {
      const clean = await sanitizeImage(file);
      const body = new FormData();
      body.set("slug", brand.slug);
      body.set("code", code);
      body.set("note", note);
      body.set("consent", "true");
      body.set("image", clean);
      const response = await fetch("/api/code-photo", { method: "POST", body });
      if (!response.ok) throw new Error("submission failed");
      setState("sent");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="mt-8 rounded-2xl border border-success/30 bg-success-bg p-5">
        <p className="flex items-center gap-2 font-semibold"><CheckCircle2 className="h-5 w-5 text-success" /> Photo received</p>
        <p className="mt-1 text-sm text-fg-muted">We&apos;ll review the code and use verified submissions to improve this brand guide.</p>
      </div>
    );
  }

  return (
    <section className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bg-subtle"><Camera className="h-5 w-5 text-accent" /></span>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold">Can&apos;t find or read the {brand.name} code?</h2>
          <p className="mt-1 text-sm leading-relaxed text-fg-muted">Send a clear photo of the base, label or box. We&apos;ll review it and improve our examples.</p>
          {!open && <button type="button" onClick={() => setOpen(true)} className="mt-3 text-sm font-semibold text-accent hover:text-accent-hover">Send a code photo →</button>}
        </div>
      </div>

      {open && (
        <form onSubmit={submit} className="mt-5 space-y-4 border-t border-border pt-5">
          <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" className="sr-only" onChange={(e) => { setFile(e.target.files?.[0] ?? null); setState("idle"); }} />
          <button type="button" onClick={() => input.current?.click()} className="flex min-h-28 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border-strong bg-bg-subtle px-4 text-sm font-medium hover:border-accent">
            <ImagePlus className="h-6 w-6 text-accent" />
            {file ? file.name : "Take or choose a photo"}
          </button>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-medium">Visible code (optional)<input value={code} maxLength={64} onChange={(e) => setCode(e.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-border bg-bg px-3 outline-none focus:border-accent" /></label>
            <label className="text-sm font-medium">What went wrong? (optional)<input value={note} maxLength={500} onChange={(e) => setNote(e.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-border bg-bg px-3 outline-none focus:border-accent" /></label>
          </div>
          <label className="flex items-start gap-2.5 text-sm text-fg-muted"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" /><span>I confirm this is my photo and allow Cosmetics Batch to store, review and use it to improve its public guides. Personal details should not be visible.</span></label>
          {state === "error" && <p role="alert" className="text-sm text-danger">The photo could not be sent. Please try a smaller JPEG, PNG or WebP image.</p>}
          <button disabled={!file || !consent || state === "sending"} className="inline-flex h-11 items-center gap-2 rounded-xl bg-cta px-5 text-sm font-semibold text-cta-fg disabled:cursor-not-allowed disabled:opacity-50">{state === "sending" && <LoaderCircle className="h-4 w-4 animate-spin" />} Send for review</button>
          <p className="text-xs text-fg-muted">The image is resized and re-encoded before upload to remove embedded location metadata. Maximum upload: 5 MB.</p>
        </form>
      )}
    </section>
  );
}
