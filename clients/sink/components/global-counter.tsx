import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useAccount, useContractWrite } from "@starknet-react/core";
import { useDojoDb } from "@/dojo/provider";
import { SDK } from "@dojoengine/sdk";
import { OnchainDashSchemaType } from "@/dojo/models";

export default function GlobalCOunter() {
  const [count, setCount] = useState(0);
  const { write: incrementGlobalCounter } = useContractWrite({
    calls: [{
      contractAddress: "0x00a6cf5a4945bd1ebf38fac5282eaf3cf3b615186987f5cd16b4b9eef9cc3ab2",
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
        world: {
          global_counter: { $: { where: { global_counter_key: { $is: 9999999 } } } }
        }
      }, () => { });
      console.log(entity)
      return 1;
    }

    if (db) {
      getEntity(db).then(setCount).catch(console.error)
    }
  }, [db])

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
