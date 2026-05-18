import type { Metadata } from "next";
import { Cinzel, Cinzel_Decorative, DM_Sans, JetBrains_Mono } from "next/font/google";
import ErrorBoundary from "@/components/ErrorBoundary";
import "./globals.css";

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-cinzel-decorative",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "StatQuest — Turn Fear Into Mastery",
  description: "Gamified statistics learning for BBA students. Duolingo meets Dark Souls.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzelDecorative.variable} ${cinzel.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full text-[var(--text-primary)] font-sans antialiased">
        {/* Noise overlay */}
        <div className="noise-overlay" aria-hidden="true" />

        {/* Global ambient glows */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div
            className="ambient-blob"
            style={{
              top: "-200px",
              left: "-200px",
              width: "700px",
              height: "700px",
              background: "radial-gradient(circle, rgba(108,99,255,0.07) 0%, transparent 70%)",
              filter: "blur(1px)",
            }}
          />
          <div
            className="ambient-blob"
            style={{
              bottom: "-150px",
              right: "-150px",
              width: "600px",
              height: "600px",
              background: "radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)",
              filter: "blur(1px)",
            }}
          />
          <div
            className="ambient-blob"
            style={{
              top: "40%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "900px",
              height: "900px",
              background: "radial-gradient(circle, rgba(108,99,255,0.03) 0%, transparent 60%)",
              filter: "blur(1px)",
            }}
          />
        </div>

        {/* Main content */}
        <div className="relative z-10">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </div>
      </body>
    </html>
  );
}
