#!/usr/bin/env node

import { Account, CallData, RpcProvider } from "starknet";

if (
    process.env.ACCOUNT_PUBLIC_KEY === undefined ||
    process.env.ACCOUNT_ADDRESS === undefined ||
    process.env.ACCOUNT_PRIVATE_KEY === undefined ||
    process.env.ACCOUNT_CLASS_HASH === undefined
) {
    throw new Error(
        "Please set ACCOUNT_PUBLIC_KEY, ACCOUNT_ADDRESS, and ACCOUNT_PRIVATE_KEY in .env file."
    );
}

export const provider = new RpcProvider({ nodeUrl: process.env.NODE_URL });

const account = new Account(
    provider,
    process.env.ACCOUNT_ADDRESS,
    process.env.ACCOUNT_PRIVATE_KEY,
    "1"
);

const accountOptions = {
    classHash: process.env.ACCOUNT_CLASS_HASH,
    constructorCalldata: CallData.compile({
        publicKey: process.env.ACCOUNT_PUBLIC_KEY,
    }),
    addressSalt: process.env.ACCOUNT_PUBLIC_KEY,
};

await account.deployAccount(accountOptions, {
    nonce: 1,
    maxFee: 0, // TODO: update
});
