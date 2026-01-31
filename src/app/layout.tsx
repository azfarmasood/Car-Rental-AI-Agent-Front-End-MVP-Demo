import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { Toaster } from "@/components/ui/sonner";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RentAgent - AI Car Rental",
  description: "Book your dream car with our AI assistant.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${outfit.className} bg-background text-foreground overflow-x-hidden selection:bg-blue-500/30`}
      >
        <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
