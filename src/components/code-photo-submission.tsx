"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Camera, CheckCircle2, Contrast, Crop, ImagePlus, LoaderCircle, RotateCw, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Brand } from "@/lib/brands";
import { photoSubmissionCopy } from "@/lib/photo-submission-copy";
import { Link } from "@/i18n/navigation";
import { photoAssistCopy } from "@/lib/photo-assist-copy";
import { photoTransformPlan, type PhotoRotation } from "@/lib/photo-transform";

type PhotoSelection = {
  id: string;
  file: File;
  previewUrl: string;
  rotation: PhotoRotation;
  crop: boolean;
  contrast: boolean;
};

async function sanitizeImage(selection: PhotoSelection): Promise<File> {
  const { file, rotation, crop, contrast } = selection;
  const bitmap = await createImageBitmap(file);
  const { sx, sy, sw, sh, drawWidth, drawHeight, canvasWidth, canvasHeight } =
    photoTransformPlan(bitmap.width, bitmap.height, rotation, crop);
  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("image conversion failed");
  }
  context.translate(canvas.width / 2, canvas.height / 2);
  context.rotate((rotation * Math.PI) / 180);
  context.filter = contrast ? "contrast(1.35)" : "none";
  context.drawImage(bitmap, sx, sy, sw, sh, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.86));
  if (!blob) throw new Error("image conversion failed");
  return new File([blob], "batch-code.jpg", { type: "image/jpeg" });
}

export function CodePhotoSubmission({ brand, locale }: { brand: Brand; locale: string }) {
  const copy = photoSubmissionCopy(locale);
  const assist = photoAssistCopy(locale);
  const whereCode = useTranslations("whereCode");
  const input = useRef<HTMLInputElement>(null);
  const photoButton = useRef<HTMLButtonElement>(null);
  const filesRef = useRef<PhotoSelection[]>([]);
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<PhotoSelection[]>([]);
  const [code, setCode] = useState("");
  const [note, setNote] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => () => {
    filesRef.current.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
  }, []);

  useEffect(() => {
    const reveal = (event?: Event) => {
      const detail = (event as CustomEvent<{ code?: string }> | undefined)?.detail;
      if (detail?.code) setCode(detail.code);
      setOpen(true);
    };
    if (window.location.hash === "#code-photo-submission") reveal();
    window.addEventListener("unresolved-code", reveal);
    window.addEventListener("hashchange", reveal);
    return () => {
      window.removeEventListener("unresolved-code", reveal);
      window.removeEventListener("hashchange", reveal);
    };
  }, []);

  useEffect(() => {
    if (open) photoButton.current?.focus({ preventScroll: true });
  }, [open]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (files.length === 0) {
      setValidationError(copy.missingPhoto);
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
        <p className="flex items-center gap-2 font-semibold"><CheckCircle2 className="h-5 w-5 text-success" aria-hidden="true" /> {copy.received}</p>
        <p className="mt-1 text-sm text-fg-muted">{copy.reply.replace("EMAILADDRESS", email)}</p>
      </div>
    );
  }

  return (
    <section id="code-photo-submission" className="mt-8 scroll-mt-24 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bg-subtle"><Camera className="h-5 w-5 text-accent" /></span>
        <div className="submission-copy min-w-0 flex-1">
          <h2 className="font-semibold">{copy.title.replace("BRANDNAME", brand.name)}</h2>
          <p className="mt-1 text-sm leading-relaxed text-fg-muted">{copy.description}</p>
          {!open && <button type="button" aria-expanded={false} aria-controls={`${formId}-form`} onClick={() => setOpen(true)} className="mt-3 min-h-11 rounded-lg text-sm font-semibold text-accent hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">{copy.open} →</button>}
        </div>
      </div>

      {open && (
        <form id={`${formId}-form`} lang={locale} onSubmit={submit} aria-busy={state === "sending"} className="mt-5 space-y-4 border-t border-border pt-5">
          <input id={`${formId}-photo`} ref={input} type="file" multiple accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => {
            files.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
            const selected = Array.from(e.target.files ?? []).slice(0, 3).map((file, index) => ({
              id: `${file.name}-${file.lastModified}-${index}`,
              file,
              previewUrl: URL.createObjectURL(file),
              rotation: 0 as const,
              crop: false,
              contrast: false,
            }));
            setFiles(selected);
            setState("idle");
            setValidationError((e.target.files?.length ?? 0) > 3 ? copy.tooMany : "");
          }} />
          <button ref={photoButton} type="button" aria-describedby={`${formId}-photo-help ${formId}-photo-status`} onClick={() => input.current?.click()} className="flex min-h-28 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border-strong bg-bg-subtle px-4 text-sm font-medium hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
            <ImagePlus className="h-6 w-6 text-accent" />
            {files.length ? `${files.length} ${copy.selected}` : copy.choose}
          </button>
          {files.length > 0 && <ul className="grid gap-3 sm:grid-cols-3">{files.map((photo, index) => <li key={photo.id} className="overflow-hidden rounded-xl border border-border bg-bg-subtle">
            <div className="relative aspect-square overflow-hidden bg-black/5">
              {/* Blob URLs remain local to this browser session and are never persisted. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.previewUrl} alt={`${assist.edit} ${index + 1}`} className={`h-full w-full ${photo.crop ? "object-cover" : "object-contain"}`} style={{ transform: `rotate(${photo.rotation}deg)`, filter: photo.contrast ? "contrast(1.35)" : undefined }} />
            </div>
            <div className="grid grid-cols-4 border-t border-border">
              <button type="button" aria-label={`${assist.rotate} ${index + 1}`} title={assist.rotate} onClick={() => setFiles((current) => current.map((item) => item.id === photo.id ? { ...item, rotation: ((item.rotation + 90) % 360) as PhotoSelection["rotation"] } : item))} className="inline-flex min-h-11 items-center justify-center hover:bg-card"><RotateCw className="h-4 w-4" aria-hidden="true" /></button>
              <button type="button" aria-label={`${assist.crop} ${index + 1}`} aria-pressed={photo.crop} title={assist.crop} onClick={() => setFiles((current) => current.map((item) => item.id === photo.id ? { ...item, crop: !item.crop } : item))} className="inline-flex min-h-11 items-center justify-center hover:bg-card aria-pressed:bg-card aria-pressed:text-accent"><Crop className="h-4 w-4" aria-hidden="true" /></button>
              <button type="button" aria-label={`${assist.contrast} ${index + 1}`} aria-pressed={photo.contrast} title={assist.contrast} onClick={() => setFiles((current) => current.map((item) => item.id === photo.id ? { ...item, contrast: !item.contrast } : item))} className="inline-flex min-h-11 items-center justify-center hover:bg-card aria-pressed:bg-card aria-pressed:text-accent"><Contrast className="h-4 w-4" aria-hidden="true" /></button>
              <button type="button" aria-label={`${assist.remove} ${index + 1}`} title={assist.remove} onClick={() => { URL.revokeObjectURL(photo.previewUrl); setFiles((current) => current.filter((item) => item.id !== photo.id)); }} className="inline-flex min-h-11 items-center justify-center text-danger hover:bg-card"><Trash2 className="h-4 w-4" aria-hidden="true" /></button>
            </div>
          </li>)}</ul>}
          <p id={`${formId}-photo-status`} className="sr-only" aria-live="polite">{files.length ? `${files.length} ${copy.selected}` : copy.noneSelected}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-medium">{copy.code}<input value={code} maxLength={64} onChange={(e) => setCode(e.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-border bg-bg px-3 text-base outline-none focus:border-accent sm:text-sm" /></label>
            <label className="text-sm font-medium">{copy.problem}<input value={note} maxLength={500} onChange={(e) => setNote(e.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-border bg-bg px-3 text-base outline-none focus:border-accent sm:text-sm" /></label>
          </div>
          <label className="block text-sm font-medium">{copy.email} <span className="text-danger" aria-hidden="true">*</span><input type="email" required autoComplete="email" inputMode="email" aria-describedby={`${formId}-email-help`} value={email} maxLength={254} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-border bg-bg px-3 text-base outline-none focus:border-accent sm:text-sm" /></label>
          <p id={`${formId}-email-help`} className="-mt-2 text-xs text-fg-muted">{copy.emailHelp}</p>
          <label className="flex min-h-11 items-start gap-3 rounded-xl p-1 text-sm text-fg-muted"><input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-accent" /><span><strong className="font-semibold text-fg">{copy.permission}</strong> {copy.consent}</span></label>
          {validationError && <p role="alert" className="text-sm text-danger">{validationError}</p>}
          {state === "error" && <p role="alert" className="text-sm text-danger">{copy.sendError}</p>}
          <button disabled={state === "sending"} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-cta px-5 text-sm font-semibold text-cta-fg disabled:cursor-wait disabled:opacity-70 sm:w-auto">{state === "sending" && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />} {state === "sending" ? copy.sending : copy.send}</button>
          <p id={`${formId}-photo-help`} className="text-xs text-fg-muted">{copy.help}</p>
          <Link href="/guides/how-to-find-your-batch-code" className="inline-flex min-h-11 items-center text-sm font-semibold text-accent hover:text-accent-hover">
            {whereCode("viewGuide")} →
          </Link>
        </form>
      )}
    </section>
  );
}
