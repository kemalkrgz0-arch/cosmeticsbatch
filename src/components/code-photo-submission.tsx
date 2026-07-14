"use client";

import { useEffect, useId, useRef, useState } from "react";
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
  const photoButton = useRef<HTMLButtonElement>(null);
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [code, setCode] = useState("");
  const [note, setNote] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (open) photoButton.current?.focus();
  }, [open]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (files.length === 0) {
      setValidationError("Choose at least one JPEG, PNG or WebP photo before sending.");
      photoButton.current?.focus();
      return;
    }
    if (!consent || !email) return;
    setValidationError("");
    setState("sending");
    try {
      const clean = await Promise.all(files.map(sanitizeImage));
      const body = new FormData();
      body.set("slug", brand.slug);
      body.set("code", code);
      body.set("note", note);
      body.set("email", email);
      body.set("consent", "true");
      clean.forEach((image) => body.append("image", image));
      const response = await fetch("/api/code-photo", { method: "POST", body });
      if (!response.ok) throw new Error("submission failed");
      setState("sent");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div role="status" aria-live="polite" className="mt-8 rounded-2xl border border-success/30 bg-success-bg p-5">
        <p className="flex items-center gap-2 font-semibold"><CheckCircle2 className="h-5 w-5 text-success" aria-hidden="true" /> Photo received</p>
        <p className="mt-1 text-sm text-fg-muted">We&apos;ll review the code and reply to {email}.</p>
      </div>
    );
  }

  return (
    <section id="code-photo-submission" className="mt-8 scroll-mt-24 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bg-subtle"><Camera className="h-5 w-5 text-accent" /></span>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold">Can&apos;t find or read the {brand.name} code?</h2>
          <p className="mt-1 text-sm leading-relaxed text-fg-muted">Send a clear photo of the base, label or box. We&apos;ll review it and improve our examples.</p>
          {!open && <button type="button" aria-expanded={false} aria-controls={`${formId}-form`} onClick={() => setOpen(true)} className="mt-3 min-h-11 rounded-lg text-sm font-semibold text-accent hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">Send a code photo →</button>}
        </div>
      </div>

      {open && (
        <form id={`${formId}-form`} onSubmit={submit} aria-busy={state === "sending"} className="mt-5 space-y-4 border-t border-border pt-5">
          <input id={`${formId}-photo`} ref={input} type="file" multiple accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => { const selected = Array.from(e.target.files ?? []).slice(0, 3); setFiles(selected); setState("idle"); setValidationError((e.target.files?.length ?? 0) > 3 ? "You can send up to 3 photos in one submission." : ""); }} />
          <button ref={photoButton} type="button" aria-describedby={`${formId}-photo-help ${formId}-photo-status`} onClick={() => input.current?.click()} className="flex min-h-28 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border-strong bg-bg-subtle px-4 text-sm font-medium hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
            <ImagePlus className="h-6 w-6 text-accent" />
            {files.length ? `${files.length} photo${files.length > 1 ? "s" : ""} selected` : "Take or choose photos"}
          </button>
          {files.length > 0 && <ul className="space-y-1 text-sm text-fg-muted">{files.map((file, index) => <li key={`${file.name}-${index}`}>{index + 1}. {file.name}</li>)}</ul>}
          <p id={`${formId}-photo-status`} className="sr-only" aria-live="polite">{files.length ? `${files.length} photos selected.` : "No photo selected."}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-medium">Visible code (optional)<input value={code} maxLength={64} onChange={(e) => setCode(e.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-border bg-bg px-3 text-base outline-none focus:border-accent sm:text-sm" /></label>
            <label className="text-sm font-medium">What went wrong? (optional)<input value={note} maxLength={500} onChange={(e) => setNote(e.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-border bg-bg px-3 text-base outline-none focus:border-accent sm:text-sm" /></label>
          </div>
          <label className="block text-sm font-medium">Email for our reply <span className="text-danger" aria-hidden="true">*</span><input type="email" required autoComplete="email" inputMode="email" aria-describedby={`${formId}-email-help`} value={email} maxLength={254} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-border bg-bg px-3 text-base outline-none focus:border-accent sm:text-sm" /></label>
          <p id={`${formId}-email-help`} className="-mt-2 text-xs text-fg-muted">Used only to reply about this submission.</p>
          <label className="flex min-h-11 items-start gap-3 rounded-xl p-1 text-sm text-fg-muted"><input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-accent" /><span><strong className="font-semibold text-fg">Permission required.</strong> I confirm this is my photo and allow Cosmetics Batch to store the photo and my email, contact me about this submission, and use verified photo portions to improve its public guides. Personal details should not be visible.</span></label>
          {validationError && <p role="alert" className="text-sm text-danger">{validationError}</p>}
          {state === "error" && <p role="alert" className="text-sm text-danger">The photo could not be sent. Please try a smaller JPEG, PNG or WebP image.</p>}
          <button disabled={state === "sending"} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-cta px-5 text-sm font-semibold text-cta-fg disabled:cursor-wait disabled:opacity-70 sm:w-auto">{state === "sending" && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />} {state === "sending" ? "Sending…" : "Send for review"}</button>
          <p id={`${formId}-photo-help`} className="text-xs text-fg-muted">Choose up to 3 JPEG, PNG or WebP images from your camera or gallery. Each image is resized and re-encoded before upload to remove embedded location metadata. Maximum: 5 MB per processed image. Avoid including faces or other personal details.</p>
        </form>
      )}
    </section>
  );
}
