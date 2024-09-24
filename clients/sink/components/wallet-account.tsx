"use client"
import { useAccount, useDisconnect } from "@starknet-react/core";
import { Button } from "./ui/button";

function shortAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function WalletAccount() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  if (undefined === address) {
    return
  }
  return <Button onClick={() => disconnect()} variant="outline" className="rounded-lg">
    {shortAddress(address ?? "0x")}
  </Button>
}
