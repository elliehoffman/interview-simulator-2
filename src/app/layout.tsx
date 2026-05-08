import type { Metadata } from "next";
import "./globals.css";
import { ProfileGate } from "@/components/onboarding/ProfileGate";
import { SessionProvider } from "@/context/SessionContext";

export const metadata: Metadata = {
  title: "Interview Simulator — AI-Powered Practice",
  description: "Personalized behavioral interview practice with real-time AI feedback and STAR framework evaluation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <SessionProvider>
          <ProfileGate>
            {children}
          </ProfileGate>
        </SessionProvider>
      </body>
    </html>
  );
}
