export type Confidence = "high" | "medium" | "low" | "none";

/** Strength of the evidence behind a decoder rule, not date precision. */
export type VerificationStatus =
  | "VERIFIED"
  | "HIGH_CONFIDENCE"
  | "ESTIMATED"
  | "FORMAT_ONLY"
  | "UNKNOWN";

export type DatePrecision = "day" | "month" | "year" | "variable";

export type DecoderSourceType =
  | "manufacturer"
  | "regulator"
  | "documented-industry"
  | "observed-samples"
  | "community"
  | "none";

/**
 * Auditable provenance kept separately from runtime confidence. An empty
 * sourceReferences array is intentional: it prevents prose comments from being
 * mistaken for evidence and keeps the decoder in the verification backlog.
 */
export interface DecoderProfile {
  decoderId: string;
  version: string;
  verificationStatus: VerificationStatus;
  datePrecision: DatePrecision;
  sourceType: DecoderSourceType;
  sourceReferences: string[];
  verifiedAt: string | null;
  supportedCodeFormats: string[];
  knownLimitations: string[];
}

export type ProductCategory =
  | "skincare"
  | "makeup"
  | "perfume"
  | "haircare"
  | "suncare"
  | "generic";

/** Result of a manufacturer-specific decode attempt. */
export interface DecodeAttempt {
  /** Manufacture date at day precision, or null if only a coarser estimate. */
  manufactureDate: Date | null;
  confidence: Confidence;
  /** Human label for how we read the code, e.g. "Estée Lauder plant/month/year". */
  method: string;
  /**
   * Precision of this specific read, overriding the decoder's profile default.
   * Used when one decoder handles formats of differing precision (e.g. Dior's
   * modern year+month code vs. a vintage day-precise date).
   */
  datePrecision?: DatePrecision;
  /** Extra notes shown to the user (assumptions, ambiguity). */
  notes?: string[];
}

/** A decoder knows how to read one manufacturer's date-code family. */
export interface Decoder {
  id: string;
  label: string;
  /** Short explanation of the code format for the brand page (SEO content). */
  explanation: string;
  decode: (code: string, ctx: DecodeContext) => DecodeAttempt | null;
}

export interface DecodeContext {
  /** Evaluated "now" — injectable for deterministic tests. */
  now: Date;
}
