"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-linear-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-950">
            <div className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-10 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6">Sign In</h1>

                <button onClick={() => signIn("google")} className="w-full bg-red-500 text-white py-2 rounded-md mb-4 hover:bg-red-600 transition" >
                    Sign in with Google
                </button>

                <div className="text-center text-gray-500 mb-4">or</div>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    signIn("credentials", { email, password });
                }}
                    className="space-y-4"
                >
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition" >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}
