"use client";

import { useState } from "react";
import { useSession } from "@/hooks/useSession";
import { cn } from "@/lib/utils";
import { Link, FileText, X } from "lucide-react";

type Tab = "text" | "url";

export function JobDescriptionInput() {
  const { setJobContext, jobContext } = useSession();
  const [tab, setTab] = useState<Tab>("text");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function parse() {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/parse-job-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input.trim(), inputType: tab }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      setJobContext(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (jobContext) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-4 animate-fade-in">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-green-800">{jobContext.roleTitle}</p>
            <p className="mt-1 text-xs text-green-700">{jobContext.roleSummary}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {jobContext.keySkills.map((s) => (
                <span key={s} className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 border border-green-200">{s}</span>
              ))}
            </div>
          </div>
          <button onClick={() => setJobContext(null)} className="mt-0.5 text-green-600 hover:text-green-800">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
      <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
        {(["text", "url"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setInput(""); setError(null); }}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-all",
              tab === t ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"
            )}
          >
            {t === "text" ? <FileText className="h-3 w-3" /> : <Link className="h-3 w-3" />}
            {t === "text" ? "Paste Text" : "Enter URL"}
          </button>
        ))}
      </div>

      {tab === "text" ? (
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste the job description here…"
          rows={5}
          className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        />
      ) : (
        <input
          type="url"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="https://company.com/jobs/123"
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        />
      )}

      {input.length > 3800 && (
        <p className="text-xs text-amber-600">{input.length.toLocaleString()} chars — only the first 4,000 will be used.</p>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}

      <button
        onClick={parse}
        disabled={!input.trim() || loading}
        className="w-full rounded-lg bg-gray-800 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:opacity-50"
      >
        {loading ? "Parsing…" : "Parse Job Description"}
      </button>
    </div>
  );
}
