import {
    Connector,
    useAccount,
    useConnect,
    useDisconnect,
} from "@starknet-react/core";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useCallback, useState } from "react";
import { Loader } from "lucide-react";
import { shortAddress } from "@/lib/utils";

export function Wallet() {
    const { address } = useAccount();
    const { connectAsync, connectors } = useConnect();
    const { disconnect } = useDisconnect();
    const [pendingConnectorId, setPendingConnectorId] = useState<
        string | undefined
    >(undefined);

    const connect = useCallback(
        async (connector: Connector) => {
            setPendingConnectorId(connector.id);
            try {
                await connectAsync({ connector });
            } catch (error) {
                console.error(error);
            }
            setPendingConnectorId(undefined);
        },
        [connectAsync]
    );

    function isWalletConnecting(connectorId: string) {
        return pendingConnectorId === connectorId;
    }

    if (address) {
        return (
            <>
                <Button variant="outline" onClick={() => disconnect}>
                    {shortAddress(address)}
                </Button>
            </>
        );
    }

    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline">Connect</Button>
                </PopoverTrigger>
                <PopoverContent>
                    {connectors.map((connector) => {
                        return (
                            <Button
                                key={connector.id}
                                onClick={() => connect(connector)}
                                variant="secondary"
                                className="relative pl-12 flex w-full mb-3"
                            >
                                <div className="absolute left-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-xs bg-background">
                                    <img
                                        // @ts-expect-error it's ok
                                        src={connector.icon.dark}
                                        className="size-5"
                                        alt={`${connector.name}`}
                                    />
                                </div>
                                {connector.name}
                                {isWalletConnecting(connector.id) && (
                                    <Loader
                                        className="absolute right-2.5 top-3 animate-spin"
                                        size={24}
                                    />
                                )}
                            </Button>
                        );
                    })}
                </PopoverContent>
            </Popover>
        </>
    );
}
