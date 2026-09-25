import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ClubProvider } from "@/context/ClubContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Preloader from "@/components/layout/Preloader";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Leo Club of St. Thomas' College, Matara • Leo District 306 D8",
  description:
    "Official website of the Leo Club of St. Thomas' College, Matara, Leo District 306 D8, Sri Lanka. Leadership • Experience • Opportunity — empowering youth through leadership, fellowship, and service since 2024.",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col bg-white text-leo-charcoal antialiased">
        <Preloader />
        <ClubProvider>
          {/* Main Top Navigation */}
          <Navbar />
          
          {/* Page Content */}
          <main className="flex-grow">{children}</main>
          
          {/* Global Footer */}
          <Footer />
        </ClubProvider>
      </body>
    </html>
  );
}
