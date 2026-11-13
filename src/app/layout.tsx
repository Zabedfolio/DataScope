import type { Metadata } from "next";
import { StoreProvider } from "@/store/StoreProvider";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "DataScope - Enterprise Data Discovery & Intelligence",
  description: "High-performance enterprise data discovery, exploration, and intelligence platform.",
  icons: {
    icon: [
      { url: "/icon.png?v=datascope", type: "image/png" },
      { url: "/favicon.ico?v=datascope" },
    ],
    shortcut: "/icon.png?v=datascope",
    apple: "/icon.png?v=datascope",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.png?v=datascope" type="image/png" />
        <link rel="icon" href="/favicon.ico?v=datascope" sizes="any" />
        <link rel="apple-touch-icon" href="/icon.png?v=datascope" />
      </head>
      <body className="antialiased min-h-screen bg-background text-foreground flex flex-col">
        <StoreProvider>
          <Navbar />
          <div className="flex-1 flex flex-col">{children}</div>
        </StoreProvider>
      </body>
    </html>
  );
}
