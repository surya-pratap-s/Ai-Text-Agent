"use client";
import { Loader2 } from "lucide-react";

export default function Loader() {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition-all duration-300">
            <Loader2 size={48} className="animate-spin text-blue-600 dark:text-blue-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                Server Starting...
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 animate-pulse">
                Please wait while backend initializes...
            </p>
        </div>
    );
}
