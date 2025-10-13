import {
    KeysClause,
    type ParsedEntity,
    type SDK,
    ToriiQueryBuilder,
} from "@dojoengine/sdk";
import { useDojoSDK } from "@dojoengine/sdk/react";
import type { Subscription } from "@dojoengine/torii-wasm";
import { useAccount } from "@starknet-react/core";
import { CornerDownLeft } from "lucide-react";
import {
    type KeyboardEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { useForm } from "react-hook-form";
import { shortAddress, toValidAscii } from "@/lib/utils";
import type { setupWorld } from "@/typescript/contracts.gen";
import type { Message, SchemaType } from "@/typescript/models.gen";
import { dojoConfig } from "../../dojoConfig";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface MessageItem {
    content: string;
    identity: string;
    timestamp: number;
}

interface FormValues {
    message: string;
}

export default function Chat() {
    const { register, handleSubmit, reset } = useForm<FormValues>();
    const { account } = useAccount();
    const [messages, setMessages] = useState<MessageItem[]>([]);
    const [sub, setSub] = useState<Subscription | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const { sdk: db } = useDojoSDK<typeof setupWorld, SchemaType>();
    const publish = useCallback(
        async (data: FormValues) => {
            if (!account || !db) return;

            const asciiMessage = toValidAscii(data.message);
            const msg = db.generateTypedData("onchain_dash-Message", {
                identity: account?.address,
                content: asciiMessage,
                timestamp: Date.now(),
            });
            try {
                const signature = await account.signMessage(msg);

                try {
                    await db.client.publishMessage({
                        message: JSON.stringify(msg),
                        signature: signature as string[],
                        world_address: dojoConfig.manifest.world.address || "",
                    });
                    reset();
                } catch (error) {
                    console.error("failed to publish message:", error);
                }
            } catch (error) {
                console.error("failed to sign message:", error);
            }
        },
        [db, account, reset]
    );

    useEffect(() => {
        async function subscribeToEntityUpdates(db: SDK<SchemaType>) {
            const [initialMessages, sub] = await db.subscribeEntityQuery({
                query: new ToriiQueryBuilder()
                    .withClause(
                        KeysClause(
                            ["onchain_dash-Message"],
                            [undefined],
                            "FixedLen"
                        ).build()
                    )
                    .includeHashedKeys(),
                callback: ({ data }) => {
                    if (data) {
                        const entity = data.pop() as ParsedEntity<SchemaType>;
                        if (!entity) {
                            return;
                        }
                        const msg = entity.models.onchain_dash.Message;
                        if (msg === undefined) {
                            return;
                        }
                        setMessages((prevMessages) => [
                            ...prevMessages,
                            msg as MessageItem,
                        ]);
                    }
                },
            });
            setSub(sub);

            setMessages(
                initialMessages
                    .getItems()
                    .map((e) => e.models.onchain_dash.Message as MessageItem)
                    .filter(Boolean)
                    .sort((a: Message, b: Message): number =>
                        Number.parseInt(a.timestamp.toString(), 16) <
                        Number.parseInt(b.timestamp.toString(), 16)
                            ? -1
                            : 1
                    )
            );
        }
        if (db && sub === null) {
            subscribeToEntityUpdates(db).then().catch(console.error);
        }
    }, [db, sub, setMessages]);

    const handleKeyPress = useCallback((e: KeyboardEvent<HTMLFormElement>) => {
        if (e.key !== "Enter") {
            return;
        }
        if (e.shiftKey && e.key === "Enter") {
            e.shiftKey = false;
            return;
        }
        e.preventDefault();
        formRef.current?.requestSubmit();
        return;
    }, []);

    return (
        <form
            ref={formRef}
            className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2"
            onSubmit={handleSubmit((data) => publish(data))}
            onKeyPress={handleKeyPress}
        >
            <Badge variant="outline" className="absolute right-3 top-3">
                Output
            </Badge>
            <div className="flex-1">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-2 p-2 text-sm"
                    >
                        <div className="flex-shrink-0">
                            <span className="inline-flex items-center pr-2 mr-4 justify-center border-r-[1px] border-solid border-r-gray-300">
                                {shortAddress(msg.identity)}
                            </span>
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>
            <div
                className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
                x-chunk="dashboard-03-chunk-1"
            >
                <Label htmlFor="message" className="sr-only">
                    Message
                </Label>
                <Textarea
                    id="message"
                    placeholder="Type your message here..."
                    className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                    {...register("message")}
                />
                <div className="flex items-center p-3 pt-0">
                    <Button size="sm" className="ml-auto gap-1.5">
                        Send Message
                        <CornerDownLeft className="size-3.5" />
                    </Button>
                </div>
            </div>
        </form>
    );
}
