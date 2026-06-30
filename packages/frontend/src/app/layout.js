import { Playfair_Display, Noto_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./context/Providers";
import { SpeedInsights } from '@vercel/speed-insights/next';

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto",
  display: "swap",
});

export const metadata = {
  title: "MU SDA PCM — Mulungushi University Seventh-Day Adventist Campus Ministries",
  description:
    "Mulungushi University Public Campus Ministries — supporting students in their spiritual journey while pursuing academic excellence.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${notoSans.variable} antialiased`}>
        {/*
          Providers is a "use client" wrapper — required in Next.js App Router
          because layout.js is a Server Component and cannot directly hold
          React Context state. All pages now have access to DataContext.
        */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}