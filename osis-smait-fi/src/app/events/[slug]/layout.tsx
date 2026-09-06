import { Space_Mono } from "next/font/google";
import { EventThemeProvider } from "@/components/event-detail/theme-provider";

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
    <div className={`${spaceMono.variable} font-mono w-full min-h-screen`}>
      <EventThemeProvider>{children}</EventThemeProvider>
    </div>
  );
}
