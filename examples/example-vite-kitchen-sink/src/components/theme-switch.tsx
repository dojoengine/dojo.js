import {
    KeysClause,
    type ParsedEntity,
    type SDK,
    ToriiQueryBuilder,
} from "@dojoengine/sdk";
import { useDojoSDK, useEntityId } from "@dojoengine/sdk/react";
import type { Subscription } from "@dojoengine/torii-wasm";
import { useAccount } from "@starknet-react/core";
import { Moon, Sun } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { CairoCustomEnum } from "starknet";
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
import type { setupWorld } from "@/typescript/contracts.gen";
import type { SchemaType } from "@/typescript/models.gen";

interface ThemeState {
    current: string | null;
    next: string | null;
}
enum AvailableTheme {
    Light,
    Dark,
    Dojo,
}
const AvailableThemeClassMap = {
    [AvailableTheme.Light]: "light",
    [AvailableTheme.Dark]: "dark",
    [AvailableTheme.Dojo]: "dojo",
};
const AvailableThemeEnumValues = {
    [AvailableTheme.Light]: "Light",
    [AvailableTheme.Dark]: "Dark",
    [AvailableTheme.Dojo]: "Dojo",
};

export default function ThemeSwitchButton() {
    const [theme, setTheme] = useState<ThemeState>({
        current: AvailableThemeClassMap[AvailableTheme.Light],
        next: null,
    });
    const [isLoading, setIsLoading] = useState(false);
    const entityId = useEntityId(9999999);
    const { account } = useAccount();
    const [sub, setSub] = useState<Subscription | null>(null);
    const { sdk: db, client: actions } = useDojoSDK<
        typeof setupWorld,
        SchemaType
    >();

    const handleChangeTheme = useCallback(
        async (theme: AvailableTheme) => {
            setIsLoading(true);
            actions?.actions.changeTheme(
                account!,
                new CairoCustomEnum({
                    Predefined: new CairoCustomEnum({
                        [AvailableThemeEnumValues[theme]]: "()",
                    }),
                })
            );
        },
        [actions, account]
    );

    useEffect(() => {
        async function subscribeToEntityUpdates(db: SDK<SchemaType>) {
            const [initialTheme, sub] = await db.subscribeEntityQuery({
                query: new ToriiQueryBuilder()
                    .withClause(
                        KeysClause(
                            ["onchain_dash-Theme"],
                            ["9999999"],
                            "FixedLen"
                        ).build()
                    )
                    .includeHashedKeys(),
                callback: ({ data, error }) => {
                    if (data) {
                        const entity = data.pop() as ParsedEntity<SchemaType>;
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
                        setTheme({
                            // @ts-expect-error this is ok
                            current: AvailableThemeClassMap[at],
                            // @ts-expect-error this is ok
                            next: AvailableThemeClassMap[at],
                        });
                        setIsLoading(false);
                        return AvailableTheme[
                            entity.models.onchain_dash.Theme.value.unwrap()
                        ];
                    }
                    if (error) {
                        throw error;
                    }
                },
            });
            setSub(sub);

            const theme = initialTheme
                .getItems()[0]
                ?.models?.onchain_dash?.Theme?.value?.unwrap();
            let th = null;
            if (undefined === theme) {
                th = AvailableTheme.Light;
            } else {
                th = AvailableTheme[theme];
            }

            setTheme({
                // @ts-expect-error this is ok
                current: AvailableThemeClassMap[th] as string,
                // @ts-expect-error this is ok
                next: AvailableThemeClassMap[th] as string,
            });
        }
        if (db && sub === null) {
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
