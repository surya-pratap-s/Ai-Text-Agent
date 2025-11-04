import React from 'react'
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    return (
        <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-full bg-white/20 dark:bg-gray-800/30 hover:bg-white/40 dark:hover:bg-gray-700/40 backdrop-blur-md transition" title="Toggle Theme" >
            {theme === "dark" ? (
                <Sun size={18} className="text-yellow-400" />
            ) : (
                <Moon size={18} className="text-blue-500" />
            )}
        </button>
    )
}
