import type { Metadata } from "next";
import { StoreProvider } from "@/store/StoreProvider";
import { AuthProvider } from "@/features/auth/context/AuthContext";
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
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background text-foreground flex flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('datascope-theme');
                  var theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'dark');
                  document.documentElement.setAttribute('data-theme', theme);
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <StoreProvider>
          <AuthProvider>
            <Navbar />
            <div className="flex-1 flex flex-col">{children}</div>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
