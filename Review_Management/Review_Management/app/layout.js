import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata = {
  title: "Review | Reputation Intelligence for Modern Brands",
  description: "Capture 5-star Google reviews automatically and shield your brand from negative feedback through a private funnel.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased font-sans bg-white text-zinc-900 min-h-screen" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
