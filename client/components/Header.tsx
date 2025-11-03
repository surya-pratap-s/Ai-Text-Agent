"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, LogOut, LogIn } from "lucide-react";

export default function Header() {
    const { theme, setTheme } = useTheme();
    const { data: session } = useSession();

    return (
        <header className=" fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 border-b border-white/20 dark:border-gray-700/30 bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg backdrop-saturate-150 shadow-sm z-50 transition-all duration-300 ">
            <Link href="/" className="font-bold text-xl text-gray-900 dark:text-gray-100 tracking-wide">
                AI Agent
            </Link>


            {/* Theme Toggle & Drawer Button */}
            <div className="flex items-center gap-3">
                {!session ? (
                    <Link href={"/auth/signin"} className="p-2 rounded-full bg-white/20 dark:bg-gray-800/30 hover:bg-white/40 dark:hover:bg-gray-700/40 backdrop-blur-md transition">
                        <LogIn size={18} className="text-blue-500" />
                    </Link>
                ) : (
                    <button onClick={() => signOut()} className="p-2 rounded-full bg-white/20 dark:bg-gray-800/30 hover:bg-white/40 dark:hover:bg-gray-700/40 backdrop-blur-md transition">
                        <LogOut size={18} className="text-blue-500" />
                    </button>

                )}
                <button
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    className="p-2 rounded-full bg-white/20 dark:bg-gray-800/30 hover:bg-white/40 dark:hover:bg-gray-700/40 backdrop-blur-md transition" title="Toggle Theme" >
                    {theme === "dark" ? (
                        <Sun size={18} className="text-yellow-400" />
                    ) : (
                        <Moon size={18} className="text-blue-500" />
                    )}
                </button>

                <button id="drawer-toggle" className="p-2 rounded-full bg-white/20 dark:bg-gray-800/30 hover:bg-white/40 dark:hover:bg-gray-700/40 backdrop-blur-md transition" title="Open Menu" >
                    <Menu size={18} className="text-gray-800 dark:text-gray-200" />
                </button>
            </div>

        </header>
    );
}
