"use client";

import Link from "next/link";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Brain, Code2, Lock } from "lucide-react";
import RightDrawer from "@/components/RightDrawer";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";

const services = [
  {
    title: "AI Agents",
    desc: "Tailored AI agents for intelligent automation and data-driven decisions.",
    icon: Brain,
    url: "/ai_agent",
    requiresAuth: true,
  },
  {
    title: "Text to Text Generation",
    desc: "Empower developers with AI-powered text and code generation tools.",
    icon: Code2,
    url: "/ai_text",
    requiresAuth: true,
  },
];

export default function Home() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [serverReady, setServerReady] = useState(false);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/status`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.status === "ok") {
            setServerReady(true);
            setLoading(false);
            return;
          }
          setTimeout(checkServer, 2000);

        }
      } catch (error) {
        setTimeout(checkServer, 2000);
      }
    };

    checkServer();
  }, []);

  if (loading || !serverReady) {
    return <Loader />;
  }

  return (<>
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
        <Link href="#services" className="px-8 py-3 text-white bg-linear-to-r from-blue-600 to-purple-600 rounded-full font-semibold shadow-lg hover:shadow-xl hover:shadow-purple-400/30 hover:scale-105 hover:brightness-110 transition-all duration-300">
          Explore Services
        </Link>
        <Link href="/contact" className="px-8 py-3 border border-gray-300 dark:border-gray-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition" >
          Contact Us
        </Link>
      </div>
    </section>

    {/* Services Section */}
    <section id="services" className="max-w-7xl mx-auto px-6 py-16 md:py-24 scroll-mt-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
        Our <span className="text-primary">AI Services</span>
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-10">
        {services.map((s, i) => {
          const isProtected = s.requiresAuth && !session;
          const targetUrl = isProtected ? "/auth/signin" : s.url;

          return (
            <Link href={targetUrl} key={i} className="group relative p-8 rounded-2xl border bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl border-gray-200 dark:border-gray-700 shadow-md hover:shadow-2xl hover:scale-[1.03] group-hover:border-blue-400 dark:group-hover:border-purple-400 transition-all duration-300 ease-in-out">
              {/* --- Enhanced UX: "Login Required" Badge --- */}
              {isProtected && (
                <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full bg-gray-100/70 dark:bg-gray-800/70 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                  <Lock size={12} />
                  <span>Login Required</span>
                </div>
              )}
              {/* ------------------------------------------- */}

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
          );
        })}
      </div>
    </section>

    <RightDrawer />
    <Footer />
  </>);
}