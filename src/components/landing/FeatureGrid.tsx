import { Target, Zap, BarChart3, Briefcase, MessageSquare, Star } from "lucide-react";

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Three Question Types",
    desc: "Behavioral (STAR), open-ended case questions, and situational judgment — choose what to practice.",
    color: "bg-violet-100 text-violet-600",
  },
  {
    icon: Briefcase,
    title: "Job-Specific Questions",
    desc: "Paste a job description and get questions tailored to the exact role and required skills.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Zap,
    title: "Live AI Feedback",
    desc: "Streaming feedback analyzes your answer in real time — strengths, gaps, and specific coaching.",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: Star,
    title: "STAR Framework",
    desc: "Behavioral answers are scored on each STAR component: Situation, Task, Action, and Result.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Target,
    title: "Personalized to You",
    desc: "Questions and feedback are calibrated to your experience level, industry, and career goals.",
    color: "bg-rose-100 text-rose-600",
  },
  {
    icon: BarChart3,
    title: "Multiple Difficulty Levels",
    desc: "Easy, Medium, or Hard — dial in the challenge level to match where you are in your prep.",
    color: "bg-indigo-100 text-indigo-600",
  },
];

export function FeatureGrid() {
  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-gray-900">Everything you need to prepare</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${f.color}`}>
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mb-1 font-semibold text-gray-900">{f.title}</h3>
            <p className="text-sm leading-relaxed text-gray-500">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
