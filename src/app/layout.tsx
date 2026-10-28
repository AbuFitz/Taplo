import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/space-grotesk/wght.css";
import "./globals.css";
import { TAPLO_DOMAINS } from "@/lib/domains";
import { ChromeColour } from "@/components/taplo/chrome-colour";

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#ffffff", interactiveWidget: "resizes-content" };

export const metadata: Metadata = {
  icons: { icon: [{ url: "/logo/favicon.svg", type: "image/svg+xml" }, { url: "/logo/favicon-32.png", sizes: "32x32", type: "image/png" }, { url: "/logo/favicon-64.png", sizes: "64x64", type: "image/png" }], apple: "/logo/apple-touch-icon.png" },
  metadataBase: new URL(TAPLO_DOMAINS.website),
  title: { default: "Taplo · the business hub for local services", template: "%s" },
  description: "Profiles, services, reviews, bookings and payments for local service businesses. No website required.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">
        <ChromeColour />
        {children}
      </body>
    </html>
  );
}
