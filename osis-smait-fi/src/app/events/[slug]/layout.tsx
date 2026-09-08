import { Space_Mono } from "next/font/google";
import { EventThemeProvider } from "@/components/event-detail/theme-provider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function EventDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${spaceMono.variable} font-mono w-full min-h-screen flex flex-col`}>
      <Navbar />
      <EventThemeProvider>{children}</EventThemeProvider>
      <Footer />
    </div>
  );
}
