import { ProfileForm } from "@/components/onboarding/ProfileForm";
import { BrainCircuit } from "lucide-react";

export const metadata = { title: "Set Up Your Profile — Interview Simulator" };

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-indigo-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 shadow-lg">
            <BrainCircuit className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Interview Simulator</h1>
          <p className="mt-2 text-gray-500">
            Tell us about yourself so we can personalize your questions and feedback.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-100/60">
          <ProfileForm />
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Your profile is stored only in your browser — never sent to our servers.
        </p>
      </div>
    </div>
  );
}
