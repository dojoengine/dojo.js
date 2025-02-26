import { KeysClause, ToriiQueryBuilder } from "@dojoengine/sdk";
import { useEntityId, useEntityQuery } from "@dojoengine/sdk/react";
import { ModelsMapping, type SchemaType } from "@/typescript/models.gen";
import { addAddressPadding } from "starknet";

export function usePlayerActions(address: string | undefined) {
    const entityId = useEntityId(address ?? "0");
    useEntityQuery<SchemaType>(
        new ToriiQueryBuilder()
            .withClause(
                KeysClause(
                    [ModelsMapping.Moves, ModelsMapping.Position],
                    [addAddressPadding(address ?? "0")],
                    "VariableLen"
                ).build()
            )
            .includeHashedKeys()
    );
    return entityId;
}
