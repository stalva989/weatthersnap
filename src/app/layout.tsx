import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://weathersnap.app"),

  title: {
    default: "WeatherSnap | Historical Weather Reports for Properties",
    template: "%s | WeatherSnap",
  },

  description:
    "Check documented hail, wind, tornado, and historical weather activity near a property. Generate a Weather Snapshot using authoritative weather data sources.",

  applicationName: "WeatherSnap",

  keywords: [
    "historical weather",
    "hail history",
    "property weather history",
    "weather date of loss",
    "hail reports",
    "wind reports",
    "storm history",
    "NOAA storm reports",
    "property weather report",
    "insurance weather report",
  ],

  authors: [
    {
      name: "WeatherSnap",
    },
  ],

  creator: "WeatherSnap",
  publisher: "WeatherSnap",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    siteName: "WeatherSnap",
    title: "WeatherSnap | Historical Weather Reports for Properties",
    description:
      "Check documented hail, wind, tornado, and historical weather activity near a property.",
    url: "https://weathersnap.app",
  },

  twitter: {
    card: "summary_large_image",
    title: "WeatherSnap | Historical Weather Reports for Properties",
    description:
      "Check documented hail, wind, tornado, and historical weather activity near a property.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}