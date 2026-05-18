import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollProgress from "@/components/ScrollProgress";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://electrician-simulator.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "전기기능사 이론 시뮬레이터 | addto 온라인",
    template: "%s | addto 온라인",
  },
  description:
    "전기력선·자기장·RLC 공진·변압기·회전 자계까지. 직접 만지며 이해하는 인터랙티브 시뮬레이터.",
  keywords: [
    "전기기능사",
    "전기 시뮬레이터",
    "옴의 법칙",
    "RLC",
    "변압기",
    "addto",
    "애드투",
  ],
  authors: [{ name: "addto" }],
  openGraph: {
    type: "website",
    title: "전기기능사 이론 시뮬레이터 | addto 온라인",
    description:
      "글로만 읽던 이론을 직접 만지며 이해하세요. 인터랙티브 시뮬레이터.",
    siteName: "addto 온라인",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "전기기능사 이론 시뮬레이터 | addto 온라인",
    description: "직접 만지며 이해하는 인터랙티브 시뮬레이터.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ScrollProgress />
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
