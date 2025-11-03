import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "AI Agent Solutions | Intelligent Automation Software",
  description:
    "AI Agent Solutions provides next-gen AI automation, LLM tools, and personalized software for enterprise and e-commerce data intelligence.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300">
        <Providers>
          <main className="min-h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
