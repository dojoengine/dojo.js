import React, { useState, useEffect, useCallback } from "react";
import { Moon, Sun } from "lucide-react";
import { Subscription } from "@dojoengine/torii-wasm";
import { useAccount, useContractWrite } from "@starknet-react/core";
import { SDK } from "@dojoengine/sdk";
import { SchemaType, AvailableTheme } from "@/typescript/models.gen";
import { useDojoDb } from "@/dojo/provider";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { dojoConfig } from "@/../dojoConfig";
import { CairoCustomEnum } from "starknet";

interface ThemeState {
    current: string | null;
    next: string | null;
}
const AvailableThemeClassMap = {
    [AvailableTheme.Light]: "light",
    [AvailableTheme.Dark]: "dark",
    [AvailableTheme.Dojo]: "dojo",
};

export default function ThemeSwitchButton() {
    const [theme, setTheme] = useState<ThemeState>({
        current: AvailableThemeClassMap[AvailableTheme.Light],
        next: null,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [entityId, setEntityId] = useState<string | null>(null);
    const { address, account } = useAccount();
    const [sub, setSub] = useState<Subscription | null>(null);
    const { db, actions } = useDojoDb();

    const handleChangeTheme = useCallback(
        async (theme: AvailableTheme) => {
            setIsLoading(true);
            actions?.actions.changeTheme(
                account,
                new CairoCustomEnum({ Predefined: theme })
            );
        },
        [actions, account]
    );

    useEffect(() => {
        async function getEntity(db: SDK<SchemaType>): Promise<AvailableTheme> {
            const entity = await db.getEntities({
                query: {
                    onchain_dash: {
                        Theme: {
                            $: { where: { theme_key: { $eq: 9999999 } } },
                        },
                    },
                },
                callback: () => {},
            });
            const counter = entity.pop();
            if (!counter) {
                return AvailableTheme.Light;
            }

            const theme = counter.models?.onchain_dash?.Theme?.value.unwrap();
            setEntityId(counter.entityId);
            if (undefined === theme) {
                return AvailableTheme.Light;
            }
            // @ts-expect-error this resooves to enum value
            return AvailableTheme[theme];
        }
        if (db) {
            getEntity(db)
                .then((th: AvailableTheme) =>
                    setTheme({
                        current: AvailableThemeClassMap[th],
                        next: AvailableThemeClassMap[th],
                    })
                )
                .catch(console.error);
        }
    }, [address, db, setEntityId]);

    useEffect(() => {
        async function subscribeToEntityUpdates(db: SDK<SchemaType>) {
            const sub = await db.subscribeEntityQuery({
                // @ts-expect-error we should be able to use ['entityId'] here
                query: [entityId],
                callback: ({ data, error }) => {
                    if (data) {
                        const entity = data.pop();
                        if (!entity) {
                            return AvailableTheme.Light;
                        }
                        if (
                            entity.models.onchain_dash?.Theme?.value ===
                            undefined
                        ) {
                            return AvailableTheme.Light;
                        }
                        const theme =
                            entity.models?.onchain_dash?.Theme?.value.unwrap();

                        const at = AvailableTheme[theme];
                        // @ts-expect-error this resooves to enum value
                        setTheme({
                            current: AvailableThemeClassMap[at],
                            next: AvailableThemeClassMap[at],
                        });
                        setIsLoading(false);
                        return AvailableTheme[
                            entity.models.onchain_dash.Theme.value
                        ];
                    }
                    if (error) {
                        throw error;
                    }
                },
            });
            setSub(sub);
        }
        if (entityId && db && sub === null) {
            subscribeToEntityUpdates(db).then().catch(console.error);
        }
    }, [entityId, db, sub, theme]);

    useEffect(() => {
        document.body.classList.forEach((cls) =>
            document.body.classList.remove(cls)
        );
        if (null !== theme.next) {
            document.body.classList.add(theme.next);
        }
    }, [theme]);

    return (
        <div className="ml-auto flex items-center space-x-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" loading={isLoading}>
                        Theme
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Change theme on chain</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            onClick={() =>
                                handleChangeTheme(AvailableTheme.Light)
                            }
                        >
                            Light
                            <Sun className="h-4 w-4 ml-2" />
                            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() =>
                                handleChangeTheme(AvailableTheme.Dark)
                            }
                        >
                            Dark
                            <Moon className="h-4 w-4 ml-2" />
                            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() =>
                                handleChangeTheme(AvailableTheme.Dojo)
                            }
                        >
                            Dojo
                            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
