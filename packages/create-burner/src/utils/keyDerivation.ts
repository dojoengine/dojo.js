import { HDKey } from "@scure/bip32";
import { ec, encode, num } from "starknet";

//
// inspired by:
// https://community.starknet.io/t/account-keys-and-addresses-derivation-standard/1230
// https://github.com/argentlabs/argent-x/blob/main/packages/extension/src/background/keys/keyDerivation.ts
// https://github.com/amanusk/starknet-cli-wallet/blob/main/src/keyDerivation.ts
//
// BIP-32 Hierarchical Deterministic Wallets
// https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki
//

function getPathForIndex(index: number): string {
    return `m/44'/9004'/0'/0/${index}`;
}

/**
 * @description derive an account KeyPair from a secret hash and index, allowing deterministic account creation
 * @param {string} secret a secret hash, like the signature of a message signed on the client, never stored!
 * @param {number} index sequential number identifying the account
 * @returns {KeyPair} the account address (pubKey) and private key (getPrivateKey)
 **/
export function derivePrivateKeyFromSeed(
    secret: string,
    index: number
): string {
    if (!secret) {
        throw "seed is undefined";
    }
    const masterNode = HDKey.fromMasterSeed(num.hexToBytes(secret));
    const childNode = masterNode.derive(getPathForIndex(index));
    if (!childNode.privateKey) {
        throw "childNode.privateKey is undefined";
    }
    const groundKey = ec.starkCurve.grindKey(childNode.privateKey);
    return encode.addHexPrefix(groundKey);
}
