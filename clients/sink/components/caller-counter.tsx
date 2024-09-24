import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useAccount, useContractWrite } from "@starknet-react/core";
import { useDojoDb } from "@/dojo/provider";
import { SDK } from "@dojoengine/sdk";
import { OnchainDashSchemaType } from "@/dojo/models";

export default function CallerCounter() {
  const [count, setCount] = useState(0);
  const { address } = useAccount();
  const { write: incrementCallerCounter } = useContractWrite({
    calls: [{
      contractAddress: "0x00a6cf5a4945bd1ebf38fac5282eaf3cf3b615186987f5cd16b4b9eef9cc3ab2",
      entrypoint: "increment_caller_counter",
      calldata: []
    }]
  });

  const handleCallerClick = useCallback(async () => {
    incrementCallerCounter();
  }, [incrementCallerCounter]);

  const db = useDojoDb();
  useEffect(() => {
    async function getEntity(db: SDK<OnchainDashSchemaType>, address: string) {
      const entity = await db.getEntities({
        world: {
          caller_counter: { $: { where: { caller: { $is: address } } } }
        }
      }, () => { });
      console.log(entity)
      return 10;
    }
    if (address && db) {
      getEntity(db, address).then(setCount).catch(console.error)
    }

  }, [address, db])
  return (
    <fieldset className="grid gap-6 rounded-lg border p-4">
      <legend className="-ml-1 px-1 text-sm font-medium">
        Per wallet counter
      </legend>
      <div className="grid gap-3">
        Count : {count}
      </div>
      <div className="grid gap-3">
        <Button variant="outline" className="rounded-lg" onClick={handleCallerClick}>Click me !</Button>
      </div>
    </fieldset>

  );
}
