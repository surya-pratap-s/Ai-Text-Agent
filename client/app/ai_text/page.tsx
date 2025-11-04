"use client";
import { useEffect, useState, useRef } from "react";
import { Send, Loader2, Clock, Menu, X, Plus } from "lucide-react";
import SEO from "@/components/SEO";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import ThemeToggle from "@/components/ThemeToggle";

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

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeSession?.messages]);

    useEffect(() => {
        const stored = localStorage.getItem("chatSessions");
        if (stored) {
            const parsed = JSON.parse(stored);
            setSessions(parsed);
            if (parsed.length > 0) {
                setActiveSession(parsed[0]);
            } else {
                handleNewChat();
            }
        } else {
            handleNewChat();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (sessions.length > 0) {
            localStorage.setItem("chatSessions", JSON.stringify(sessions));
        }
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
        setShowSidebar(false);
    };

    const handleSend = async () => {
        if (!input.trim() || !activeSession) return;

        const newMessage: Message = {
            role: "user",
            content: input,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        const newTitle = activeSession.messages.length === 0
            ? input.slice(0, 30) + (input.length > 30 ? "..." : "")
            : activeSession.title;

        const updatedSession = {
            ...activeSession,
            title: newTitle,
            messages: [...activeSession.messages, newMessage],
        };

        setActiveSession(updatedSession);
        setSessions((prev) =>
            prev.map((s) => (s.id === activeSession.id ? updatedSession : s))
        );

        setInput("");
        setLoading(true);

        const textarea = document.getElementById("chat-input") as HTMLTextAreaElement;
        if (textarea) {
            textarea.style.height = "auto";
        }

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
                content: `Error connecting to AI API: ${error}`,
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

        {showSidebar && (
            <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setShowSidebar(false)}></div>
        )}

        <div className="relative flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <aside className={`fixed md:static top-0 left-0 z-40 w-72 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ${showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"} h-full flex flex-col`}>
                <div className="px-5 py-3 flex justify-between items-center border-b dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Chat History</h2>
                    <button onClick={() => setShowSidebar(false)} className="md:hidden text-gray-600 dark:text-gray-300">
                        <X size={18} />
                    </button>
                    <ThemeToggle />
                </div>

                <div className="flex-1 p-3 overflow-y-auto space-y-2">
                    <button onClick={handleNewChat} className="flex items-center gap-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 w-full px-3 py-2 rounded mb-2 dark:hover:bg-gray-700 hover:bg-gray-400 hover:text-white transition">
                        <Plus size={16} /> New Chat
                    </button>

                    {sessions.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400 p-3">No chats yet.</p>
                    ) : (
                        <ul className="space-y-2">
                            {sessions.map((s) => (
                                <li key={s.id}
                                    onClick={() => {
                                        setActiveSession(s);
                                        setShowSidebar(false);
                                    }}
                                    className={`p-3 rounded text-sm cursor-pointer transition truncate ${activeSession?.id === s.id
                                        ? "bg-gray-400 dark:bg-gray-600 text-gray-100 dark:text-gray-200 "
                                        : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                                        }`}
                                >
                                    {s.title}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </aside>

            <main className="flex-1 flex flex-col h-screen md:h-auto">
                <div className="md:hidden flex justify-between items-center fixed top-0 left-0 right-0 bg-gray-50 dark:bg-gray-900 p-4 border-b dark:border-gray-700 z-30">
                    <button onClick={() => setShowSidebar(true)} className="p-2 bg-gray-200 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300">
                        <Menu size={20} />
                    </button>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 px-4 truncate">
                        {activeSession?.title || "AI Chat"}
                    </h2>
                    <div className="w-8"></div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 pt-20 md:pt-6">
                    {!activeSession || activeSession.messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
                            <Clock size={40} className="mb-4 text-gray-400" />
                            <p className="text-lg">Start a new AI operation chat</p>
                        </div>
                    ) : (
                        activeSession.messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[75%] lg:max-w-[60%] rounded-lg shadow-md px-4 py-3 break-words ${msg.role === "user"
                                    ? "bg-blue-600 text-white rounded-br-none"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none"
                                    }`}
                                >
                                    {/* --- THIS IS THE FIX --- */}
                                    <div className="text-sm prose prose-sm dark:prose-invert prose-p:my-0 prose-ul:my-2 prose-ol:my-2 prose-code:bg-gray-700 prose-code:text-white prose-code:p-1 prose-code:rounded">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            rehypePlugins={[rehypeRaw, rehypeHighlight]}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                    <div className="text-[11px] opacity-60 mt-2 text-right">{msg.time}</div>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
                    {activeSession && (
                        <div className="flex items-end gap-3 border border-gray-300 dark:border-gray-700 rounded-xl p-3 bg-white dark:bg-gray-800 shadow-md">
                            <textarea
                                id="chat-input"
                                rows={1}
                                placeholder="Type your message... (Shift+Enter for new line)"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement;
                                    target.style.height = "auto";
                                    target.style.height = `${target.scrollHeight}px`;
                                }}
                                className="flex-1 bg-transparent outline-none text-gray-800 dark:text-gray-100 px-2 py-1.5 resize-none max-h-40 overflow-y-auto"
                            />
                            <button
                                onClick={handleSend}
                                disabled={loading || !input.trim()}
                                className="p-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow hover:scale-105 transition-transform disabled:opacity-60 disabled:scale-100"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    </>
    );
}