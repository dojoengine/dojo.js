import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useContractWrite } from "@starknet-react/core";
import { useDojoDb } from "@/dojo/provider";
import { SDK } from "@dojoengine/sdk";
import { OnchainDashSchemaType } from "@/dojo/models";
import { Subscription } from "@dojoengine/torii-wasm";
import { dojoConfig } from "@/dojo.config";

export default function GlobalCOunter() {
  const [count, setCount] = useState(0);
  const [sub, setSub] = useState<Subscription>(null);
  const { write: incrementGlobalCounter } = useContractWrite({
    calls: [{
      contractAddress: dojoConfig.manifest.contracts[0].address,
      entrypoint: "increment_global_counter",
      calldata: []
    }]
  });
  const handleGlobalClick = useCallback(async () => {
    incrementGlobalCounter();
  }, [incrementGlobalCounter]);

  const db = useDojoDb();

  useEffect(() => {
    async function getEntity(db: SDK<OnchainDashSchemaType>) {
      const entity = await db.getEntities({
        onchain_dash: {
          GlobalCounter: { $: { where: { global_counter_key: { $eq: 9999999 } } } }
        }
      }, ({ data, error }) => { });

      const counter = entity.pop();
      if (!counter) {
        return 0;
      }
      const count = parseInt(counter.models.onchain_dash.GlobalCounter.counter, 16);
      return count;
    }

    if (db) {
      getEntity(db).then(setCount).catch(console.error)
    }
  }, [db])

  useEffect(() => {
    async function subscribeToEntityUpdates(db: SDK<OnchainDashSchemaType>) {
      const sub = await db.subscribeEntityQuery({
        onchain_dash: { GlobalCounter: { $: { where: { global_counter_key: { $eq: 9999999 } } } } }
      }, ({ data, error }) => {
        if (data) {
          const entity = data.pop();
          if (!entity) {
            return;
          }
          if (entity.models.onchain_dash?.GlobalCounter?.counter === undefined) {
            return
          }
          const count = parseInt(entity.models.onchain_dash?.GlobalCounter?.counter, 16);
          setCount(count);
          return;
        }
        if (error) {
          throw error;
        }
      });
      setSub(sub);
    }
    if (db && sub === null) {
      subscribeToEntityUpdates(db).then(() => { }).catch(console.error)
    }
    return () => {
      if (sub) {
        sub.free();
      }
    };
  }, [db, sub]);

  return (
    <fieldset className="grid gap-6 rounded-lg border p-4">
      <legend className="-ml-1 px-1 text-sm font-medium">
        Global counter
      </legend>
      <div className="grid gap-3">
        Count : {count}
      </div>
      <div className="grid gap-3">
        <Button variant="outline" className="rounded-lg" onClick={handleGlobalClick}>Click me !</Button>
      </div>
    </fieldset>
  )
}
