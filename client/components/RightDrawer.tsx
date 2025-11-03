"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Home, Settings, Mail } from "lucide-react";

export default function RightDrawer() {
    const [open, setOpen] = useState(false);
    const [visible, setVisible] = useState(false);
    const pathname = usePathname();

    // Open drawer when clicking header menu button
    useEffect(() => {
        const btn = document.getElementById("drawer-toggle");
        if (btn) btn.onclick = () => setVisible(true);
    }, []);

    // Close drawer with animation
    const closeDrawer = () => {
        setOpen(false);
        setTimeout(() => setVisible(false), 300);
    };

    // Smooth open animation
    useEffect(() => {
        if (visible) setTimeout(() => setOpen(true), 10);
    }, [visible]);

    if (!visible) return null;

    // Drawer menu items
    const menuItems = [
        { name: "Home", href: "/", icon: Home },
        { name: "Services", href: "/", icon: Settings },
        { name: "Contact Us", href: "/", icon: Mail },
    ];

    return (
        <div
            className={`fixed inset-0 z-50 transition-opacity duration-300 ${open ? "bg-black/50 opacity-100" : "bg-black/0 opacity-0"}`}
            onClick={closeDrawer}
        >
            <div className={`absolute right-0 top-0 h-full w-72  bg-white/90 dark:bg-gray-900/80 backdrop-blur-lg  p-6 shadow-xl transform transition-transform duration-300 ease-in-out  
                ${open ? "translate-x-0" : "translate-x-full"}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-semibold text-lg text-primary">AI Menu</h3>
                    <button onClick={closeDrawer} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <X size={18} />
                    </button>
                </div>

                {/* Menu List */}
                <nav className="space-y-2 font-medium">
                    {menuItems.map(({ name, href, icon: Icon }) => {
                        const active = pathname === href;
                        return (
                            <Link
                                key={name}
                                href={href}
                                className={`flex items-center gap-3 p-3 rounded-lg transition 
                                ${active
                                        ? "bg-primary/10 text-primary font-semibold bg-gray-200 dark:bg-gray-700"
                                        : "text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                                    }`}
                                onClick={closeDrawer}
                            >
                                <Icon
                                    size={18}
                                    className={`${active ? "text-primary" : "text-gray-500 dark:text-gray-400"}`}
                                />
                                {name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
