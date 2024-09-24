import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import StarknetProvider from "@/components/starknet-provider";
import DojoProvider from "@/dojo/provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "OnChain Dash",
  description: "Showcase Dojo capacities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          geistSans.variable, geistMono.variable, "antialiased"
        )}
      >
        <StarknetProvider>
          <DojoProvider>
            <TooltipProvider delayDuration={400}>
              <div className="grid h-screen w-full pl-[53px]">
                <Sidebar />
                <div className="flex flex-col">
                  <Header />
                  {children}
                </div>
              </div>
            </TooltipProvider>
          </DojoProvider>
        </StarknetProvider>
      </body>
    </html>
  );
}
