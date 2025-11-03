"use client";

import Link from "next/link";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Brain, Code2, LucideVoicemail } from "lucide-react";
import RightDrawer from "@/components/RightDrawer";
import { useSession } from "next-auth/react";

const services = [
  {
    title: "Custom AI Agents",
    desc: "Tailored AI agents for intelligent automation and data-driven decisions.",
    icon: Brain,
    url: "/agent",
  },
  {
    title: "Text & Code Generation",
    desc: "Empower developers with AI-powered text and code generation tools.",
    icon: Code2,
    url: "/text_agent",
  },
  {
    title: "Speech To Speech",
    desc: "Enable real-time AI voice interaction for natural and engaging conversations.",
    icon: LucideVoicemail,
    url: "/",
  },
];

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
      <SEO
        title="AI Agent Software"
        description="Next-gen AI automation for businesses."
        keywords="AI Agents, Automation, LLM Integration, AI Tools"
      />

      <Header />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-6 py-20 md:py-40 text-center bg-linear-to-b from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-black transition-all duration-500">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          Empower Your Business with{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-purple-500">
            AI Agents
          </span>
        </h1>
        <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-300 mb-10">
          Automate insights, enhance productivity, and scale effortlessly with
          AI-driven tools, text generation, and LLM integrations.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            href="/"
            className="px-8 py-3 text-white bg-linear-to-r from-blue-600 to-purple-600 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300"
          >
            Explore Services
          </Link>
          <Link
            href="/"
            className="px-8 py-3 border border-gray-300 dark:border-gray-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Contact Us
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
          Our <span className="text-primary">AI Services</span>
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((s, i) => (
            <Link href={session ? s.url : "/auth/signin"} key={i} className="group relative p-8 rounded-2xl border bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl border-gray-200 dark:border-gray-700 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out " >
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-500/10 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 mb-6 flex items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-purple-500 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <s.icon size={26} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <RightDrawer />
      <Footer />
    </>
  );
}
