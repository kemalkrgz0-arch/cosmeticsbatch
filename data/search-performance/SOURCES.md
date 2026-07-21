# Search performance sources

This inventory is the provenance record for normalized GSC and webmaster data.
Raw XLSX exports live in the ignored `raw/` directory and must remain immutable.
Normalized TSV files are reviewable repository evidence; they contain aggregate
search metrics only and must never be joined with private user submissions.

| Source ID | Provider | Exported | Measured period | Filters | Raw file | SHA-256 | Normalized output | Status |
|---|---|---:|---|---|---|---|---|---|
| GSC-2026-07-19-01 | Google Search Console | 2026-07-19 | filter: last 3 months; observed daily rows: 2026-07-02–2026-07-16 | Search type: Web; date: Last 3 months | `raw/GSC-2026-07-19-01.xlsx` | `d9c4b00b597254742bfbd4aff1aeada2013bffb2979b418563bca1262904ebbf` | `normalized/GSC-2026-07-19-01/` | 7 sheets; 596 query and 421 page observations |
| WEBMASTER-2026-07-19-01 | Yandex Webmaster | 2026-07-19 | needs verification | needs verification | `raw/WEBMASTER-2026-07-19-01.xlsx` | `5420dbc1274491873543c38a5844af27d9d755e1dfcf61f2d7279ec62895c154` | `normalized/WEBMASTER-2026-07-19-01/` | **Superseded by `WEBMASTER-2026-07-19-01R`. Not empty.** The normalized output holds a header alone because the importer trusted the file's `<dimension>` record; the export carries 589 query rows |
| GSC-2026-07-21-01 | Google Search Console | 2026-07-21 | filter: last 28 days; observed daily rows: 2026-07-02–2026-07-19 | Search type: Web; date: Last 28 days | `raw/GSC-2026-07-21-01.xlsx` | `6985cff6651018249a02bbb5c3a48045c9e14512802fb7b7984fc4cda6015002` | `normalized/GSC-2026-07-21-01/` | 7 sheets; 713 query and 494 page observations |
| WEBMASTER-2026-07-21-01 | Yandex Webmaster | 2026-07-21 | needs verification | needs verification | `raw/WEBMASTER-2026-07-21-01.xlsx` | `6f8d15338b40689d1a8ce825c57290884b95bd4439586f013adff379d27c8856` | `normalized/WEBMASTER-2026-07-21-01/` | **Superseded by `WEBMASTER-2026-07-21-01R`. Not empty.** Same importer defect; the export carries 735 query rows |
| WEBMASTER-2026-07-19-01R | Yandex Webmaster | 2026-07-19 | needs verification | needs verification | `raw/WEBMASTER-2026-07-19-01R.xlsx` | `5420dbc1274491873543c38a5844af27d9d755e1dfcf61f2d7279ec62895c154` | `normalized/WEBMASTER-2026-07-19-01R/` | re-import of the identical file after the dimension fix; 589 query observations across 90 columns |
| WEBMASTER-2026-07-21-01R | Yandex Webmaster | 2026-07-21 | needs verification | needs verification | `raw/WEBMASTER-2026-07-21-01R.xlsx` | `6f8d15338b40689d1a8ce825c57290884b95bd4439586f013adff379d27c8856` | `normalized/WEBMASTER-2026-07-21-01R/` | re-import of the identical file after the dimension fix; 735 query observations across 72 columns |
| WEBMASTER-2026-07-21-02 | Yandex Webmaster | 2026-07-21 | 2026-06-19–2026-07-19, stated in every row | needs verification | `raw/WEBMASTER-2026-07-21-02.xlsx` | `0989cbb1fd9e65f4d304bafa39b57b041db6d6873e3482f7c464f6654d426909` | `normalized/WEBMASTER-2026-07-21-02/` | 775 query observations across 25 columns; 1,109 impressions, 99 clicks, impression-weighted position 7.48 |

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
