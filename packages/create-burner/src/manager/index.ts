import {
    Account,
    CairoVersion,
    ProviderInterface,
    ProviderOptions,
    SignerInterface,
} from "starknet";

export function newAccount(
    provider: ProviderOptions | ProviderInterface,
    address: string,
    signer: Uint8Array | string | SignerInterface,
    cairoVersion: CairoVersion
): Account {
    return new Account({
        provider,
        address,
        signer,
        cairoVersion,
    });
}

export { BurnerManager } from "./burnerManager";
export { PredeployedManager } from "./predeployedManager";
export { prefundAccount } from "./prefundAccount";
export { setupBurnerManager } from "./setupBurnerManager";
