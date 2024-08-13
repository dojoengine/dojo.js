import { ContractComponents } from "./defineContractComponents";

export type ClientModels = ReturnType<typeof models>;

export function models({
    contractModels,
}: {
    contractModels: ContractComponents;
}) {
    return {
        models: {
            ...contractModels,
        },
    };
}
