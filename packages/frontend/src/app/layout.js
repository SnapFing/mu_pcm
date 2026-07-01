import { Playfair_Display, Noto_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./context/Providers";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from "@vercel/analytics/next"

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
        <Providers>
          {children}
        </Providers>
        <SpeedInsights />  
        <Analytics/>
      </body>
    </html>
  );
}