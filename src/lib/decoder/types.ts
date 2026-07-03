export type Confidence = "high" | "medium" | "low" | "none";

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
