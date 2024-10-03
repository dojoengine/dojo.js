import { useAccount, useDisconnect } from "@starknet-react/core";
import { Button } from "./ui/button";
import { shortAddress } from "@/lib/utils";

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
