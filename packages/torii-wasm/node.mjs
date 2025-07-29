import { createRequire } from "module";
const require = createRequire(import.meta.url);
const dojo_c = require("./pkg/node/dojo_c.js");

// Re-export all named exports
export const {
    Account,
    ByteArray,
    ControllerAccount,
    IntoUnderlyingByteSource,
    IntoUnderlyingSink,
    IntoUnderlyingSource,
    Provider,
    SigningKey,
    Subscription,
    ToriiClient,
    TypedData,
    VerifyingKey,
    getContractAddress,
    getSelectorFromTag,
    poseidonHash,
    getSelectorFromName,
    starknetKeccak,
    cairoShortStringToFelt,
    parseCairoShortString,
} = dojo_c;

// Also export as default for compatibility
export default dojo_c;
