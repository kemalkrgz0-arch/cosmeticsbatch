"use client";

import { useState } from "react";

type Template = { label: string; subject: string; body: string };

/**
 * One reply form with a template picker.
 *
 * The tab previously rendered every template as its own subject + seven-row
 * textarea, stacked. Opening the reply section to send a single message meant
 * scrolling past three complete forms and picking the right submit button,
 * which is both slow and easy to get wrong. Choosing a template now refills one
 * form, and switching away from an edited draft asks first rather than throwing
 * the text away.
 */
export function ReplyComposer({
  action,
  templates,
}: {
  action: string;
  templates: Record<string, Template>;
}) {
  const keys = Object.keys(templates);
  const [template, setTemplate] = useState(keys[0]);
  const [subject, setSubject] = useState(templates[keys[0]].subject);
  const [body, setBody] = useState(templates[keys[0]].body);

  const edited =
    subject !== templates[template].subject || body !== templates[template].body;

  function selectTemplate(next: string) {
    if (
      edited &&
      !window.confirm("Replace your edited draft with the selected template?")
    ) {
      return;
    }
    setTemplate(next);
    setSubject(templates[next].subject);
    setBody(templates[next].body);
  }

  return (
    <form action={action} method="post" className="rounded-xl bg-bg-subtle p-4">
      <input type="hidden" name="intent" value="reply" />
      <input type="hidden" name="template" value={template} />

      <fieldset>
        <legend className="text-sm font-semibold">Template</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {keys.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => selectTemplate(key)}
              aria-pressed={template === key}
              className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${template === key ? "border-accent bg-accent text-white" : "bg-card"}`}
            >
              {templates[key].label}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="mt-4 block text-sm font-semibold">
        Subject
        <input
          required
          name="subject"
          maxLength={160}
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          className="mt-1 min-h-11 w-full rounded-lg border bg-card px-3 font-normal"
        />
      </label>

      <label className="mt-3 block text-sm font-semibold">
        Message
        <textarea
          required
          name="message"
          maxLength={4000}
          rows={9}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          className="mt-1 w-full rounded-lg border bg-card p-3 font-normal"
        />
      </label>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button className="min-h-11 rounded-lg bg-accent px-5 font-semibold text-white">
          Send reply
        </button>
        {edited && <span className="text-xs text-fg-muted">Draft edited</span>}
      </div>
    </form>
  );
}
