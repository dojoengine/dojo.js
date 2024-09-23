"use client";

import {
  Book,
  Bot,
  Code2,
  Settings2,
  LifeBuoy,
  SquareTerminal,
  SquareUser,
  Triangle,
  Loader,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Connector, useConnect } from "@starknet-react/core";
import { useCallback, useState } from "react";

const walletIdToName = new Map([
  ["argentX", "Argent X"],
  ["braavos", "Braavos"],
  ["argentWebWallet", "Email"],
  ["argentMobile", "Argent mobile"],
]);

export default function Sidebar() {
  const { connectors, connectAsync } = useConnect();
  const [modalEnabled, setModalEnabled] = useState(false);

  const [pendingConnectorId, setPendingConnectorId] = useState<
    string | undefined
  >(undefined);

  const connect = useCallback(async (connector: Connector) => {
    setModalEnabled(false)
    setPendingConnectorId(connector.id);
    try {
      await connectAsync({ connector });
    } catch (error) {
      setModalEnabled(true);
      console.error(error);
    }
    setPendingConnectorId(undefined);
  }, [connectAsync]);

  function isWalletConnecting(connectorId: string) {
    return pendingConnectorId === connectorId;
  }

  return (
    <aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r">
      <div className="border-b p-2">
        <Button variant="outline" size="icon" aria-label="Home">
          <Triangle className="size-5 fill-foreground" />
        </Button>
      </div>
      <nav className="grid gap-1 p-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg bg-muted"
              aria-label="Playground"
            >
              <SquareTerminal className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={5}>
            OnChain Dash
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg"
              aria-label="Models"
            >
              <Bot className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={5}>
            Models
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg"
              aria-label="API"
            >
              <Code2 className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={5}>
            API
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg"
              aria-label="Documentation"
            >
              <Book className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={5}>
            Documentation
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg"
              aria-label="Settings"
            >
              <Settings2 className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={5}>
            Settings
          </TooltipContent>
        </Tooltip>
      </nav>
      <nav className="mt-auto grid gap-1 p-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="mt-auto rounded-lg"
              aria-label="Help"
            >
              <LifeBuoy className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={5}>
            Help
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <Dialog modal={modalEnabled}>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mt-auto rounded-lg"
                  aria-label="Help"
                >
                  <SquareUser className="size-5" />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Account
            </TooltipContent>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Choose the wallet you want to use</DialogTitle>
              </DialogHeader>
              <DialogDescription className="grid gap-2 p-4">
                {connectors.map((connector) => {
                  return (
                    <Button
                      key={connector.id}
                      onClick={() => connect(connector)}
                      variant="secondary"
                      className="relative pl-12 flex"
                    >
                      <div className="absolute left-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-xs bg-background">
                        <img
                          src={
                            connector.icon.dark
                          }
                          className="size-5"
                          alt={`${connector.name}`}
                        />
                      </div>
                      {walletIdToName.get(connector.id) ?? connector.name}
                      {isWalletConnecting(connector.id) && (
                        <Loader
                          className="absolute right-2.5 top-3 animate-spin"
                          size={24}
                        />
                      )}
                    </Button>
                  );
                })}
              </DialogDescription>
            </DialogContent>
          </Dialog>
        </Tooltip>
      </nav>
    </aside>
  )
}
