import { KeysClause, ToriiQueryBuilder } from "@dojoengine/sdk";
import { useEntityId, useEventQuery, useModel } from "@dojoengine/sdk/react";
import { useAccount } from "@starknet-react/core";
import { addAddressPadding } from "starknet";
import { ModelsMapping } from "./typescript/models.gen";

export function Events() {
    const { account } = useAccount();
    const entityId = useEntityId(account?.address ?? "0");
    useEventQuery(
        new ToriiQueryBuilder()
            .withClause(
                KeysClause(
                    [],
                    [addAddressPadding(account?.address ?? "0")],
                    "VariableLen"
                ).build()
            )
            .includeHashedKeys()
    );
    const moved = useModel(entityId, ModelsMapping.Moved);
    if (!account) {
        return (
            <div className="mt-6">
                <h2 className="text-white">Please connect your wallet</h2>
            </div>
        );
    }
    return (
        <div className="mt-6">
            <h2 className="text-white">
                Player Last Movement : {moved && moved.direction}{" "}
            </h2>

            {/* {events.map((e: ParsedEntity<SchemaType>, key) => {
                return <Event event={e} key={key} />;
            })} */}
        </div>
    );
}
