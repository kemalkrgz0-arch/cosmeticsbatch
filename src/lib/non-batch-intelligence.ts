import type { DecodeFailureReason } from "./decoder";
import { getEucerinProductReference } from "./eucerin-product-references";

export type FailedCodeKind = "decoder-failure" | "retail-identifier" | "product-reference";

/** Keep non-batch identifiers for future product mapping without scoring them as decoder gaps. */
export function classifyFailedCode(args: {
  brand: string;
  code: string;
  reason: DecodeFailureReason;
}): FailedCodeKind {
  if (args.reason === "barcode") return "retail-identifier";
  if (getEucerinProductReference(args.brand, args.code)) return "product-reference";
  return "decoder-failure";
}
