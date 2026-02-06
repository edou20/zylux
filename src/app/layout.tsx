import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
    title: {
        default: "Zylux.ai - AI-Powered Discussion Platform",
        template: "%s | Zylux.ai"
    },
    description: "Join thousands discussing AI, automation, and immigration. Share insights, get answers, and build your network on Zylux.ai.",
    keywords: ["AI", "artificial intelligence", "discussion", "community", "immigration", "tech", "forum"],
    authors: [{ name: "Zylux.ai" }],
    creator: "Zylux.ai",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://zylux.ai",
        siteName: "Zylux.ai",
        title: "Zylux.ai - AI-Powered Discussion Platform",
        description: "Join thousands discussing AI, automation, and immigration.",
    },
    twitter: {
        card: "summary_large_image",
        title: "Zylux.ai - AI-Powered Discussion Platform",
        description: "Join thousands discussing AI, automation, and immigration.",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
