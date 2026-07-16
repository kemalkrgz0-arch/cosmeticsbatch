type SubmissionEmail = {
  id: string;
  brandName: string;
  brandSlug: string;
  code: string;
  note: string;
  userEmail: string;
  images: Array<{ filename: string; imageType: string; imageBytes: Uint8Array }>;
};

export type NotificationResult =
  | { status: "sent"; providerId: string | null }
  | { status: "not_configured" }
  | { status: "failed"; reason: string };

export async function sendSubmissionEmail(data: SubmissionEmail): Promise<NotificationResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const configuredRecipients = [
    process.env.SUBMISSION_NOTIFY_EMAIL,
    ...(process.env.REVIEWER_EMAILS ?? "").split(","),
  ];
  const recipients = [...new Set(configuredRecipients.map((email) => email?.trim().toLowerCase()).filter((email): email is string => Boolean(email)))];
  const from = process.env.SUBMISSION_FROM_EMAIL;
  if (!apiKey || recipients.length === 0 || !from) return { status: "not_configured" };

  const text = [
    "A new batch-code photo is ready for review.",
    "",
    `Submission: ${data.id}`,
    `Brand: ${data.brandName} (${data.brandSlug})`,
    `Visible code: ${data.code || "Not supplied"}`,
    `User note: ${data.note || "Not supplied"}`,
    `Reply email: ${data.userEmail}`,
    `Stored files: ${data.images.map((image) => image.filename).join(", ")}`,
    "",
    "Reply to this email to answer the user directly.",
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `code-photo-${data.id}`,
      },
      body: JSON.stringify({
        from,
        to: recipients,
        reply_to: data.userEmail,
        subject: `[Code photo] ${data.brandName} — ${data.id.slice(0, 19)}`,
        text,
        attachments: data.images.map((image) => ({
          content: Buffer.from(image.imageBytes).toString("base64"),
          filename: image.filename.split("/").at(-1) ?? "batch-code.jpg",
          content_type: image.imageType,
        })),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) return { status: "failed", reason: `http_${response.status}` };
    const result = await response.json() as { id?: string };
    return { status: "sent", providerId: result.id ?? null };
  } catch (error) {
    const reason = error instanceof Error && error.name === "TimeoutError" ? "timeout" : "request_failed";
    return { status: "failed", reason };
  }
}
