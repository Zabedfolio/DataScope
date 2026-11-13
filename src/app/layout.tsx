import type { Metadata } from "next";
import { StoreProvider } from "@/store/StoreProvider";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "DataScope - Enterprise Data Discovery & Intelligence",
  description: "High-performance enterprise data discovery, exploration, and intelligence platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-background text-foreground flex flex-col">
        <StoreProvider>
          <Navbar />
          <div className="flex-1 flex flex-col">{children}</div>
        </StoreProvider>
      </body>
    </html>
  );
}
