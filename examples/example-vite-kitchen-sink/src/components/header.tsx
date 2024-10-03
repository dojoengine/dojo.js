import {
  Share,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import ThemeSwitchButton from "@/components/theme-switch"
import WalletAccount from "./wallet-account"
import { appConfig } from "@/config"

export default function Header() {
  return (

    <header className="sticky top-0 z-10 flex h-[53px] items-center justify-between gap-1 border-b bg-background px-4">
      <div className="flex items-center gap-2"><img src="/dojo-logo.svg" alt="Dojo logo" className="h-24 w-24" /><h1 className="text-xl font-semibold">OnChain Dash</h1></div>
      <div className="flex items-center gap-2">
        <ThemeSwitchButton />
        <WalletAccount />
        <a href={appConfig.links.github} target="_blank" rel="noreferrer">
          <Button
            variant="outline"
            className="ml-auto gap-1.5 text-sm"
            size="sm"
          >
            <Share className="size-3.5" />
            Share
          </Button>
        </a>
      </div>
    </header>
  )
}
