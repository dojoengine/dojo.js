import { type Connector, useConnect } from "@starknet-react/core";
import {
    Book,
    Circle,
    Code2,
    LifeBuoy,
    Loader,
    SquareUser,
} from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { appConfig } from "@/config";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";

export default function Sidebar() {
    const { connectors, connectAsync } = useConnect();
    const [modalEnabled, setModalEnabled] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const [pendingConnectorId, setPendingConnectorId] = useState<
        string | undefined
    >(undefined);

    const connect = useCallback(
        async (connector: Connector) => {
            setModalEnabled(false);
            setPendingConnectorId(connector.id);
            try {
                await connectAsync({ connector });
                setModalOpen(false);
            } catch (error) {
                setModalOpen(true);
                setModalEnabled(true);
                console.error(error);
            }
            setPendingConnectorId(undefined);
        },
        [connectAsync, setModalOpen]
    );

    function isWalletConnecting(connectorId: string) {
        return pendingConnectorId === connectorId;
    }

    return (
        <aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r">
            <div className="border-b p-2">
                <Button variant="outline" size="icon" aria-label="Home">
                    <Circle className="size-5 fill-red-600 stroke-red-600" />
                </Button>
            </div>
            <nav className="grid gap-1 p-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <a
                            href={appConfig.links.github}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-lg"
                                aria-label="API"
                            >
                                <Code2 className="size-5" />
                            </Button>
                        </a>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={5}>
                        API
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <a
                            href={appConfig.links.doc}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-lg"
                                aria-label="Documentation"
                            >
                                <Book className="size-5" />
                            </Button>
                        </a>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={5}>
                        Documentation
                    </TooltipContent>
                </Tooltip>
            </nav>
            <nav className="mt-auto grid gap-1 p-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <a
                            href={appConfig.links.discord}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="mt-auto rounded-lg"
                                aria-label="Help"
                            >
                                <LifeBuoy className="size-5" />
                            </Button>
                        </a>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={5}>
                        Help
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <Dialog
                        modal={modalEnabled}
                        open={modalOpen}
                        onOpenChange={setModalOpen}
                    >
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
                                <DialogTitle>
                                    Choose the wallet you want to use
                                </DialogTitle>
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
                                                    // @ts-expect-error this is working
                                                    src={connector.icon.dark}
                                                    className="size-5"
                                                    alt={`${connector.name}`}
                                                />
                                            </div>
                                            {connector.name}
                                            {isWalletConnecting(
                                                connector.id
                                            ) && (
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
    );
}
