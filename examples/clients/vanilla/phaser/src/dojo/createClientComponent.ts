import { overridableComponent } from "@dojoengine/recs";
import { ContractComponents } from "./defineContractComponents";

export type ClientComponents = ReturnType<typeof createClientComponents>;

export function createClientComponents({
    contractComponents,
}: {
    contractComponents: ContractComponents;
}) {
    return {
        ...contractComponents,
        Position: overridableComponent(contractComponents.Position),
        Moves: overridableComponent(contractComponents.Moves),
    };
}
