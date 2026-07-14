# L'Oréal group editorial review

Status: owner-approved for index coverage; native editorial validation remains
an open quality task.

## Scope

- The repository currently contains 39 entries assigned to L'Oréal Group,
  including the L'Oréal umbrella entry and Color Wow.
- The official portfolio link is the source for current group association. It
  is not evidence that every brand uses the same batch-code scheme.
- The shared decoder remains `UNKNOWN`, based on observed samples, with month
  precision. No language may describe it as manufacturer-verified.
- A successful decode cannot prove authenticity. A printed expiry or
  best-before date always takes priority over an estimated shelf-life date.

## Priority language gate

| Locale | Current status | Index decision |
| --- | --- | --- |
| English (`en`) | Source editorial copy | Index |
| Russian (`ru`) | Existing reviewed locale; core L'Oréal copy corrected | Index |
| Spanish (`es`) | Editorial draft; native review required | Index by owner decision |
| Japanese (`ja`) | Editorial draft; native review required | Index by owner decision |
| Italian (`it`) | Editorial draft; native review required | Index by owner decision |
| Turkish (`tr`) | Editorial draft; native review required | Index by owner decision |
| German (`de`) | Editorial draft; native review required | Index by owner decision |
| Indonesian (`id`) | Editorial draft; native review required | Index by owner decision |
| Vietnamese (`vi`) | Editorial draft; native review required | Index by owner decision |
| Swedish (`sv`) | Editorial draft; native review required | Index by owner decision |

Index eligibility does not mean human editorial verification. Do not add a
locale to `messages/content/reviewed.json` from this file alone. Native-language
review must check natural phrasing, search terminology,
punctuation, technical meaning and consistency between visible copy, metadata
and structured data.

## Data-integrity decisions

- Color Wow is now assigned to L'Oréal Group because L'Oréal reported that the
  acquisition completed in September 2025.
- Color Wow intentionally has no L'Oréal decoder assignment. Post-acquisition
  packaging samples are required before making that technical claim.
- Brands absent from the current catalog are not added merely because they
  appear in L'Oréal's portfolio. A new brand needs useful page content and
  decoder applicability evidence; otherwise it would create another thin page.
