"use client";
import { useEffect, useState } from "react";
import { Send, Loader2, Clock, Menu, X, Plus } from "lucide-react";
import SEO from "@/components/SEO";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

interface Message {
    role: "user" | "assistant";
    content: string;
    time: string;
}

interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;


export default function Text_Agent() {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
    
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const [showSidebar, setShowSidebar] = useState(false);

    // Load saved chats from localStorage
    useEffect(() => {
        const stored = localStorage.getItem("chatSessions");
        if (stored) {
            const parsed = JSON.parse(stored);
            setSessions(parsed);
            setActiveSession(parsed[0] || null);
        }
    }, []);

    // Save chats to localStorage
    useEffect(() => {
        localStorage.setItem("chatSessions", JSON.stringify(sessions));
    }, [sessions]);

    const handleNewChat = () => {
        const newChat: ChatSession = {
            id: Date.now().toString(),
            title: "New Chat",
            messages: [],
            createdAt: new Date().toLocaleString(),
        };
        setSessions((prev) => [newChat, ...prev]);
        setActiveSession(newChat);
    };

    const handleSend = async () => {
        if (!input.trim() || !activeSession) return;

        const newMessage: Message = {
            role: "user",
            content: input,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        const updatedSession = {
            ...activeSession,
            title: activeSession.messages.length === 0
                ? input.slice(0, 30) + (input.length > 30 ? "..." : "")
                : activeSession.title,
            messages: [...activeSession.messages, newMessage],
        };

        setActiveSession(updatedSession);
        setSessions((prev) => prev.map((s) => (s.id === activeSession.id ? updatedSession : s)));

        setInput("");
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/text_to_text`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: input, history: updatedSession.messages }),
            });

            const data = await response.json();

            const aiMessage: Message = {
                role: "assistant",
                content: data.reply || "I'm here to assist you with AI operations.",
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };

            const finalSession = { ...updatedSession, messages: [...updatedSession.messages, aiMessage], };
            setActiveSession(finalSession);
            setSessions((prev) => prev.map((s) => (s.id === activeSession.id ? finalSession : s)));
        } catch (error) {
            const errorMsg: Message = {
                role: "assistant",
                content: `Error connecting to AI API.: ${error}`,
                time: new Date().toLocaleTimeString(),
            };
            const errorSession = { ...updatedSession, messages: [...updatedSession.messages, errorMsg], };
            setActiveSession(errorSession);
            setSessions((prev) => prev.map((s) => (s.id === activeSession.id ? errorSession : s)));
        } finally {
            setLoading(false);
        }
    };

    return (<>
        <SEO title="AI Chat Assistant" description="Chat with your AI assistant" keywords={""} />

        <div className="relative flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            {/* Sidebar (Desktop + Mobile Drawer) */}
            <aside className={`fixed md:static top-0 left-0 z-40 w-72 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ${showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"} h-full md:h-auto`}>
                <div className="flex flex-col h-full">
                    <div className="p-5 flex justify-between items-center border-b dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Chat History</h2>
                        <button onClick={() => setShowSidebar(false)} className="md:hidden text-gray-600 dark:text-gray-300">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 p-3 overflow-y-auto">
                        <button onClick={handleNewChat} className="flex items-center gap-2 bg-blue-600 text-white w-full px-3 py-2 rounded-lg mb-4 hover:bg-blue-700 transition">
                            <Plus size={16} /> New Chat
                        </button>

                        {sessions.length === 0 ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400">No chats yet.</p>
                        ) : (
                            <ul className="space-y-2">
                                {sessions.map((s) => (
                                    <li key={s.id}
                                        onClick={() => {
                                            setActiveSession(s);
                                            setShowSidebar(false);
                                        }}
                                        className={`p-3 rounded-lg text-sm cursor-pointer transition ${activeSession?.id === s.id
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                                            }`}
                                    >
                                        {s.title}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </aside>

            {/* Chat Area */}
            <main className="flex-1 flex flex-col justify-between p-4 md:p-6 md:ml-0 mt-16 md:mt-0">
                {/* Mobile Menu */}
                <div className="md:hidden mb-4 flex justify-between items-center fixed top-0 left-0 right-0 bg-gray-50 dark:bg-gray-900 p-4 border-b dark:border-gray-700 z-30">
                    <button onClick={() => setShowSidebar(true)} className="p-2 bg-gray-200 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300">
                        <Menu size={20} />
                    </button>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        {activeSession?.title || "AI Chat"}
                    </h2>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-4 mt-10 md:mt-0">
                    {!activeSession || activeSession.messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
                            <Clock size={40} className="mb-4 text-gray-400" />
                            <p className="text-lg">Start a new AI operation chat</p>
                        </div>
                    ) : (
                        activeSession.messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-full rounded shadow-md px-4 py-2 whitespace-pre-wrap wrap-break-word leading-normal text-sm ${msg.role === "user"
                                    ? "bg-blue-600 text-white rounded-br-none"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none"
                                    }`}
                                >
                                    <div className="text-sm space-y-1">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            rehypePlugins={[rehypeRaw, rehypeHighlight]}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                    <div className="text-[11px] opacity-60 mt-1 text-right">{msg.time}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Input Box */}
                {activeSession && (
                    <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-full p-2 bg-white dark:bg-gray-800 shadow-md">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            className="flex-1 px-4 py-2 bg-transparent outline-none text-gray-800 dark:text-gray-100"
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading}
                            className="p-2 rounded-full bg-linear-to-r from-blue-600 to-purple-600 text-white shadow hover:scale-105 transition-transform disabled:opacity-60"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        </button>
                    </div>
                )}
            </main>
        </div>
    </>
    );
}
