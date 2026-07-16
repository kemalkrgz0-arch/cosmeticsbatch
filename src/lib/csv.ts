/**
 * Serializes a value as a quoted CSV cell and neutralizes spreadsheet formulas.
 * Review exports contain user-controlled fields, so values beginning with a
 * formula sigil must remain text when opened in Excel or similar software.
 */
export function csvCell(value: unknown) {
  const text = value == null ? "" : String(value);
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
}

export function asCsv(rows: Array<Record<string, unknown>>) {
  if (rows.length === 0) return "";
  const columns = Object.keys(rows[0]);
  return [
    columns.map(csvCell).join(","),
    ...rows.map((row) =>
      columns.map((column) => csvCell(row[column])).join(","),
    ),
  ].join("\n");
}
