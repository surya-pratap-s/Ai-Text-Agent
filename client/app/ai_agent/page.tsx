"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import ThemeToggle from "@/components/ThemeToggle";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AgriAIChat() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [loading, setLoading] = useState(false);

    // --- New additions for auto-scroll ---
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]); // Runs every time the 'messages' array changes

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: "user", content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/ask`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: input }),
            });
            const data = await res.json();

            const aiMsg = {
                role: "assistant",
                content: data.reply || "I'm here to help with agriculture queries!",
            };
            setMessages((prev) => [...prev, aiMsg]);
        } catch (err) {
            setMessages((prev) => [...prev,
            {
                role: "assistant",
                content: "Unable to connect to AI server. Please check your Flask backend.",
            },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="px-4 py-3 flex bg-gray-100 dark:bg-gray-800 text-center justify-between font-semibold shadow-md">
                <span className="text-green-800 dark:text-white">🌾 Agriculture AI Assistant</span>
                <ThemeToggle/>
            </header>

            {/* Chat area */}
            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                        <p className="text-lg mb-2">Ask your farming questions here 👨‍🌾</p>
                        <p className="text-sm">Example: “How to protect tomato plants from fungus?”</p>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                            className={`max-w-[75%] px-4 py-2 rounded-2xl whitespace-pre-wrap leading-relaxed text-sm shadow-md ${msg.role === "user"
                                ? "bg-green-600 text-white rounded-br-none"
                                : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none"
                                }`}
                        >
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw, rehypeHighlight]}
                            >
                                {msg.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                ))}

                {/* --- New empty div for auto-scroll target --- */}
                <div ref={messagesEndRef} />
            </main>

            {/* Input Box */}
            <footer className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Type your question..."
                        className="flex-1 border border-gray-300 dark:border-gray-700 rounded-full px-4 py-2 outline-none bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-green-500"
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading}
                        className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                    </button>
                </div>
            </footer>
        </div>
    );
}