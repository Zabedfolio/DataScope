import type { Metadata } from "next";
import { StoreProvider } from "@/store/StoreProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "DataScope",
  description: "DataScope Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}

