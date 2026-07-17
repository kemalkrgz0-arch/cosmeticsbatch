// Relative, not "@/": the regression suite compiles this file directly with
// tsc and no path mapping, the same way the rest of src/lib does it.
import type { DecodeFailureReason } from "./decoder";

type FailureCopy = {
  title: string;
  body: (code: string, brand: string) => string;
  detail: string;
  retry: string;
  contact: string;
  email: string;
};

const en: Record<DecodeFailureReason, FailureCopy> = {
  barcode: {
    title: "This looks like a retail barcode",
    body: (code, brand) => `${code} looks like an EAN, UPC or GTIN for ${brand}, not a manufacturing batch code.`,
    detail: "We recorded it with a barcode label. Look for a shorter stamped, embossed or ink-jet code elsewhere on the product or box.",
    retry: "Check another code",
    contact: "Send packaging photos",
    email: "Contact us by email",
  },
  "invalid-format": {
    title: "Please check the code format",
    body: (code, brand) => `${code} is not in a format we can check for ${brand}.`,
    detail: "Remove spaces or punctuation and enter only the short letters and numbers printed as the batch code.",
    retry: "Correct the code",
    contact: "Send packaging photos",
    email: "Contact us by email",
  },
  unresolved: {
    title: "We could not decode this code yet",
    body: (code, brand) => `${code} was not recognized for ${brand}. This does not mean the product or code is invalid.`,
    detail: "Thank you for reporting it. We added the code to the brand review queue. A clear photo of the code and packaging will help us investigate the format.",
    retry: "Check the brand and code again",
    contact: "Send code photos",
    email: "Contact us by email",
  },
};

const tr: Record<DecodeFailureReason, FailureCopy> = {
  barcode: {
    title: "Bu kod ürün barkoduna benziyor",
    body: (code, brand) => `${code}, ${brand} için üretim parti kodundan çok EAN, UPC veya GTIN barkoduna benziyor.`,
    detail: "Kodu barkod etiketiyle kaydettik. Ürünün veya kutunun başka bir yerindeki daha kısa, damgalı, kabartmalı ya da mürekkep püskürtmeli kodu arayın.",
    retry: "Başka bir kod kontrol et",
    contact: "Ambalaj fotoğraflarını gönder",
    email: "E-posta ile iletişime geç",
  },
  "invalid-format": {
    title: "Kod biçimini kontrol edin",
    body: (code, brand) => `${code}, ${brand} için kontrol edebileceğimiz bir biçimde değil.`,
    detail: "Boşluk ve noktalama işaretlerini kaldırıp yalnızca parti kodu olarak basılmış kısa harf ve rakamları girin.",
    retry: "Kodu düzelt",
    contact: "Ambalaj fotoğraflarını gönder",
    email: "E-posta ile iletişime geç",
  },
  unresolved: {
    title: "Bu kodu henüz çözemedik",
    body: (code, brand) => `${code}, ${brand} için tanınmadı. Bu sonuç ürünün veya kodun geçersiz olduğu anlamına gelmez.`,
    detail: "Bize bildirdiğiniz için teşekkür ederiz. Kodu markanın inceleme listesine ekledik. Kodun ve ambalajın net fotoğrafları biçimi araştırmamıza yardımcı olur.",
    retry: "Markayı ve kodu tekrar kontrol et",
    contact: "Kod fotoğraflarını gönder",
    email: "E-posta ile iletişime geç",
  },
};

export function resultFailureCopy(locale: string, reason: DecodeFailureReason): FailureCopy {
  return locale.toLowerCase().startsWith("tr") ? tr[reason] : en[reason];
}

/**
 * Paris postcodes (75001–75020, plus 75116) printed in the address block that
 * cosmetics packaging carries for its EU responsible person.
 *
 * People type them into the checker as batch codes: "75008" arrived for two
 * different brands and "75116" for a third, from three different countries, so
 * this is a pattern rather than a one-off. None of them can ever decode — there
 * is no 500th day of a year — so recognising the shape here cannot mask a real
 * read; it just stops the user hunting for a code they have already walked past.
 */
const PARIS_POSTCODE = /^75(0(0[1-9]|1\d|20)|116)$/;

const addressHint = {
  en: "That number looks like a Paris postcode from the manufacturer's address on the pack, rather than a batch code. The batch code is a separate, shorter stamp — usually on the base of the bottle or on an end flap of the box.",
  tr: "Bu numara, ambalajdaki üretici adresinde geçen bir Paris posta koduna benziyor; batch kod değil. Batch kod ayrı ve daha kısa bir damgadır — genelde şişenin altında ya da kutunun yan kapağında bulunur.",
};

/** Extra nudge when the entered code is an address line, not a batch code. */
export function addressLookalikeHint(locale: string, code: string): string | null {
  if (!PARIS_POSTCODE.test(code.trim())) return null;
  return locale.toLowerCase().startsWith("tr") ? addressHint.tr : addressHint.en;
}
