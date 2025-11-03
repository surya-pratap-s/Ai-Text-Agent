"use client";
import Head from "next/head";

export default function SEO({ title, description, keywords }: { title: string; description: string; keywords: string }) {
    return (
        <Head>
            <title>{title} | AI Agent Solutions</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta name="twitter:card" content="summary_large_image" />
        </Head>
    );
}