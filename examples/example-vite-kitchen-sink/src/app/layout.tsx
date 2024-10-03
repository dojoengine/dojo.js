import { TooltipProvider } from "@/components/ui/tooltip";

import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import StarknetProvider from "@/components/starknet-provider";


export default function RootLayout({ children }: React.PropsWithChildren<{}>) {
  return (
    <StarknetProvider>
      <TooltipProvider delayDuration={400}>
        <div className="grid h-screen w-full pl-[53px]">
          <Sidebar />
          <div className="flex flex-col">
            <Header />
            {children}
          </div>
        </div>
      </TooltipProvider>
    </StarknetProvider>
  );
}
