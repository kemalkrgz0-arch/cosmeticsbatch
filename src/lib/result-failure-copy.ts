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
    detail: "Compare every character with the short stamp, confirm the selected brand, and make sure you did not enter a barcode, address or marketing reference. Spaces and punctuation are already ignored.",
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
  recognized: {
    title: "We recognize this code but cannot date it yet",
    body: (code, brand) => `${code} is a genuine ${brand} batch code, in a format we can identify but have not finished decoding.`,
    detail: "We would rather tell you this than guess a date. A photo showing this code next to any printed date on the packaging is exactly what we need to finish the format.",
    retry: "Check another code",
    contact: "Send packaging photos",
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
    detail: "Kısa damgadaki her karakteri karşılaştırın, seçilen markayı doğrulayın ve barkod, adres ya da pazarlama referansı girmediğinizden emin olun. Boşluklar ve noktalama işaretleri zaten yok sayılır.",
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
  recognized: {
    title: "Bu kodu tanıyoruz ama henüz tarihleyemiyoruz",
    body: (code, brand) => `${code}, gerçek bir ${brand} parti kodu — biçimini tanıyoruz, ancak çözümünü henüz tamamlamadık.`,
    detail: "Tarih uydurmaktansa bunu söylemeyi tercih ederiz. Bu kodun ambalajdaki herhangi bir basılı tarihle birlikte göründüğü bir fotoğraf, biçimi tamamlamamız için tam olarak ihtiyacımız olan şey.",
    retry: "Başka bir kod kontrol et",
    contact: "Ambalaj fotoğraflarını gönder",
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

/**
 * French packager registration, printed as "EMB 60350" in the address block.
 *
 * It sits directly beside the batch code on French-made cosmetics — both YSL
 * cartons photographed on 2026-07-20 show the two within a centimetre of each
 * other — and it is the more official-looking of the pair, so it gets typed.
 * "EMB60350" also happens to satisfy the L'Oréal letter-then-month shape, which
 * is how it reached a decoder at all.
 */
const EMB_REGISTRATION = /^EMB\d{3,6}$/;

const addressHint = {
  en: "That number looks like a Paris postcode from the manufacturer's address on the pack, rather than a batch code. The batch code is a separate, shorter stamp — usually on the base of the bottle or on an end flap of the box.",
  tr: "Bu numara, ambalajdaki üretici adresinde geçen bir Paris posta koduna benziyor; batch kod değil. Batch kod ayrı ve daha kısa bir damgadır — genelde şişenin altında ya da kutunun yan kapağında bulunur.",
};

const embHint = {
  en: "That looks like the packager registration (\"EMB\" followed by digits) from the manufacturer's address block, not a batch code. The batch code is a separate stamp nearby — often on the same face of the box, in a different typeface.",
  tr: "Bu, üreticinin adres bloğundaki ambalajcı sicil numarasına benziyor (\"EMB\" ve ardından rakamlar); batch kod değil. Batch kod yakınlarda ayrı bir damgadır — genelde kutunun aynı yüzünde, farklı bir yazı tipiyle.",
};

/** Extra nudge when the entered code is an address line, not a batch code. */
export function addressLookalikeHint(locale: string, code: string): string | null {
  const value = code.trim();
  const turkish = locale.toLowerCase().startsWith("tr");
  if (EMB_REGISTRATION.test(value.toUpperCase().replace(/[\s-]+/g, ""))) {
    return turkish ? embHint.tr : embHint.en;
  }
  if (!PARIS_POSTCODE.test(value)) return null;
  return turkish ? addressHint.tr : addressHint.en;
}
