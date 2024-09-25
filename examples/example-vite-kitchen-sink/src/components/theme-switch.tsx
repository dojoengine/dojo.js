import React, { useState, useEffect, useCallback } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Subscription } from '@dojoengine/torii-wasm';
import { useAccount, useContractWrite } from '@starknet-react/core';
import { SDK } from '@dojoengine/sdk';
import { OnchainDashSchemaType, AvailableTheme, AvailableThemeClassMap } from '@/dojo/models';
import { useDojoDb } from '@/dojo/provider';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown"
import { dojoConfig } from "@/dojo.config";

interface ThemeState {
  current: AvailableTheme | null;
  next: AvailableTheme | null;
}

export default function ThemeSwitchButton() {
  const [theme, setTheme] = useState<ThemeState>({ current: AvailableTheme.Light, next: null });
  const [entityId, setEntityId] = useState<string | null>(null);
  const { address } = useAccount();
  const [sub, setSub] = useState<Subscription>(null);
  const { writeAsync } = useContractWrite({
    calls: []
  });


  const handleChangeTheme = useCallback(async (theme: AvailableTheme) => {
    await writeAsync({
      calls: [{
        contractAddress: dojoConfig.manifest.contracts[0].address,
        entrypoint: "change_theme",
        calldata: [parseInt(theme, 10)]
      }]
    })
  }, [writeAsync]);

  const db = useDojoDb();
  useEffect(() => {
    async function getEntity(db: SDK<OnchainDashSchemaType>) {
      const entity = await db.getEntities({
        onchain_dash: {
          Theme: { $: { where: { theme_key: { $eq: 9999999 } } } },
        }
      }, ({ data, error }) => { });
      const counter = entity.pop();
      if (!counter) {
        return AvailableTheme.Light;
      }

      setEntityId(counter.entityId);
      return AvailableTheme[counter.models.onchain_dash.Theme.value];
    }
    if (db) {
      getEntity(db).then((th) => setTheme({ current: AvailableThemeClassMap[th], next: AvailableThemeClassMap[th] })).catch(console.error)
    }
  }, [address, db, setEntityId])

  useEffect(() => {
    async function subscribeToEntityUpdates(db: SDK<OnchainDashSchemaType>) {
      const sub = await db.subscribeEntityQuery([entityId], ({ data, error }) => {
        if (data) {
          const entity = data.pop();
          if (!entity) {
            return AvailableTheme.Light;
          }
          if (entity.models.onchain_dash?.Theme?.value === undefined) {
            return AvailableTheme.Light;
          }

          setTheme({ current: AvailableThemeClassMap[entity.models.onchain_dash.Theme.value], next: AvailableThemeClassMap[entity.models.onchain_dash.Theme.value] });
          return AvailableTheme[entity.models.onchain_dash.Theme.value];
        }
        if (error) {
          throw error;
        }
      });
      setSub(sub);
    }
    if (entityId && db && sub === null) {
      subscribeToEntityUpdates(db).then().catch(console.error)
    }
  }, [entityId, db, sub, theme]);

  useEffect(() => {
    document.body.classList.forEach((cls) => document.body.classList.remove(cls));
    if (null !== theme.next) {
      document.body.classList.add(theme.next);
    }
  }, [theme]);

  return (
    <div className="ml-auto flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Theme</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Change theme on chain</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => handleChangeTheme(AvailableTheme.Light)}>
              Light
              <Sun className="h-4 w-4 ml-2" />
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleChangeTheme(AvailableTheme.Dark)}>
              Dark
              <Moon className="h-4 w-4 ml-2" />
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleChangeTheme(AvailableTheme.Dojo)}>
              Dojo
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
