import type { Metadata } from "next";
import "./globals.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "LinkVault - Branded Short Links With Analytics",
    template: "%s | LinkVault"
  },
  description:
    "Create branded short links, track campaign clicks, and understand which channels convert from a clean marketing dashboard.",
  openGraph: {
    title: "LinkVault - Branded Short Links With Analytics",
    description:
      "A polished full-stack short-link manager for campaign teams.",
    url: appUrl,
    siteName: "LinkVault",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "LinkVault analytics dashboard" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkVault - Branded Short Links With Analytics",
    description: "Short links, UTM discipline, and click analytics in one dashboard.",
    images: ["/opengraph-image"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
