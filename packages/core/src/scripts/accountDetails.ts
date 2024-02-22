#!/usr/bin/env node

import { CallData, stark, hash, ec } from "starknet";
import fs from "fs/promises";

async function createAccountDetails() {
    if (process.env.ACCOUNT_CLASS_HASH === undefined) {
        throw new Error("Please set ACCOUNT_CLASS_HASH in .env file.");
    }

    const privateKey = stark.randomAddress();
    const starkKeyPub = ec.starkCurve.getStarkKey(privateKey);

    const OZaccountConstructorCallData = CallData.compile({
        publicKey: starkKeyPub,
    });

    const OZcontractAddress = hash.calculateContractAddressFromHash(
        starkKeyPub,
        process.env.ACCOUNT_CLASS_HASH,
        OZaccountConstructorCallData,
        0
    );

    const envData = `ACCOUNT_PRIVATE_KEY=${privateKey}
ACCOUNT_PUBLIC_KEY=${starkKeyPub}
ACCOUNT_ADDRESS=${OZcontractAddress}
`;

    const envFilePath = "./.env";

    try {
        await fs.appendFile(envFilePath, envData);
        console.log(`Account details exported to ${envFilePath}`);
    } catch (err) {
        console.error("Error writing to .env file:", err);
    }
}

createAccountDetails().catch(console.error);
