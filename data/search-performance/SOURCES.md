# Search performance sources

This inventory is the provenance record for normalized GSC and webmaster data.
Raw XLSX exports live in the ignored `raw/` directory and must remain immutable.
Normalized TSV files are reviewable repository evidence; they contain aggregate
search metrics only and must never be joined with private user submissions.

| Source ID | Provider | Exported | Measured period | Filters | Raw file | SHA-256 | Normalized output | Status |
|---|---|---:|---|---|---|---|---|---|
| GSC-2026-07-19-01 | Google Search Console | 2026-07-19 | filter: last 3 months; observed daily rows: 2026-07-02–2026-07-16 | Search type: Web; date: Last 3 months | `raw/GSC-2026-07-19-01.xlsx` | `d9c4b00b597254742bfbd4aff1aeada2013bffb2979b418563bca1262904ebbf` | `normalized/GSC-2026-07-19-01/` | 7 sheets; 596 query and 421 page observations |
| WEBMASTER-2026-07-19-01 | needs verification | 2026-07-19 | needs verification | needs verification | `raw/WEBMASTER-2026-07-19-01.xlsx` | `5420dbc1274491873543c38a5844af27d9d755e1dfcf61f2d7279ec62895c154` | `normalized/WEBMASTER-2026-07-19-01/` | one sheet; only a `Query` header and zero observations |

Import command:

```sh
python3 scripts/import-search-performance.py --source-id SOURCE_ID --input path/to/export.xlsx
```

The importer refuses to replace an existing raw source or normalized directory.
Create a new source ID for every later export.

Validation command:

```sh
npm run test:search-data
```

This quality gate also runs inside `test:quality`. It rejects manifest drift,
unregistered sources, duplicate claims and private-data column names.
