import type { Submission } from "@/lib/submission-store";

export const REPLY_TEMPLATES = {
  identified: {
    label: "Code identified",
    subject: "Your Cosmetics Batch code review",
    body: "Thank you for sending the photo. We reviewed the visible batch code, matched it to the documented coding format, and cross-checked it against known examples used in our research. The available evidence supports the manufacturing-date result below.\n\nVerified reading:\n\nEvidence note:\n\nThis result concerns the manufacturing information encoded in the batch format. It does not by itself authenticate the product or replace manufacturer guidance about product condition or safety.",
  },
  clearer_photo: {
    label: "Clearer photo needed",
    subject: "A clearer batch-code photo is needed",
    body: "Thank you for your submission. We could not read the complete code with enough confidence. Please reply with a well-lit, close-up photo showing the entire printed or embossed code. If possible, include one wider photo showing where the code appears on the product or packaging.\n\nPlease avoid sending receipts, addresses, faces, or other personal information.",
  },
  unverifiable: {
    label: "Unable to verify",
    subject: "Update on your Cosmetics Batch code review",
    body: "Thank you for sending the photo. We reviewed the visible code, but we cannot verify a reliable manufacturing date from the available format. We prefer not to provide a precise date when the evidence is insufficient.\n\nA batch code alone cannot confirm authenticity, expiry, or product safety. For a definitive answer, please contact the manufacturer and include the product name, code, and photos.",
  },
} as const;

export async function sendReviewerReply(submission: Submission, subject: string, message: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.SUBMISSION_FROM_EMAIL;
  if (!apiKey || !from) return { status: "failed" as const, reason: "not_configured" };
  const text = `${message.trim()}\n\nKind regards,\nCosmetics Batch Review Team\ncontact@cosmeticsbatch.com\nhttps://cosmeticsbatch.com`;
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `review-reply-${submission.id}-${submission.revision}`,
      },
      body: JSON.stringify({ from, to: [submission.email], reply_to: "contact@cosmeticsbatch.com", subject: subject.trim(), text }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) return { status: "failed" as const, reason: `http_${response.status}` };
    const result = await response.json() as { id?: string };
    return { status: "sent" as const, providerId: result.id };
  } catch {
    return { status: "failed" as const, reason: "request_failed" };
  }
}
