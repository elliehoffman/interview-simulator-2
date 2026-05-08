"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import type { UserProfile, ExperienceRange } from "@/lib/types";
import { cn } from "@/lib/utils";

const EXPERIENCE_OPTIONS: { value: ExperienceRange; label: string }[] = [
  { value: "0-2", label: "0–2 years" },
  { value: "3-5", label: "3–5 years" },
  { value: "6-10", label: "6–10 years" },
  { value: "10+", label: "10+ years" },
];

export function ProfileForm() {
  const router = useRouter();
  const { saveProfile } = useProfile();
  const [form, setForm] = useState({
    name: "",
    role: "",
    industry: "",
    yearsExperience: "3-5" as ExperienceRange,
    careerGoal: "",
  });
  const [saving, setSaving] = useState(false);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const valid = form.name.trim() && form.role.trim() && form.industry.trim() && form.careerGoal.trim();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setSaving(true);
    const profile: UserProfile = { ...form, createdAt: new Date().toISOString() };
    saveProfile(profile);
    router.push("/");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Your name" required>
          <input
            type="text"
            placeholder="Ellie Hoffman"
            value={form.name}
            onChange={set("name")}
            className={inputCls}
            required
          />
        </Field>
        <Field label="Current or target role" required>
          <input
            type="text"
            placeholder="Product Manager"
            value={form.role}
            onChange={set("role")}
            className={inputCls}
            required
          />
        </Field>
        <Field label="Industry" required>
          <input
            type="text"
            placeholder="Tech / SaaS"
            value={form.industry}
            onChange={set("industry")}
            className={inputCls}
            required
          />
        </Field>
        <Field label="Years of experience" required>
          <div className="grid grid-cols-4 gap-2">
            {EXPERIENCE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm((f) => ({ ...f, yearsExperience: opt.value }))}
                className={cn(
                  "rounded-lg border px-2 py-2.5 text-sm font-medium transition-colors",
                  form.yearsExperience === opt.value
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <Field label="Career goal" required hint="What are you working toward? This helps personalize your questions.">
        <textarea
          placeholder="I'm looking to transition into a senior PM role at a Series B startup, with a focus on growth and data products."
          value={form.careerGoal}
          onChange={set("careerGoal")}
          rows={3}
          className={cn(inputCls, "resize-none")}
          required
        />
      </Field>

      <button
        type="submit"
        disabled={!valid || saving}
        className="w-full rounded-xl bg-brand-500 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Saving…" : "Start Practicing →"}
      </button>
    </form>
  );
}

function Field({ label, children, required, hint }: { label: string; children: React.ReactNode; required?: boolean; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">
        {label}{required && <span className="ml-0.5 text-brand-500">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
      {children}
    </div>
  );
}

const inputCls = "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none ring-0 transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";
