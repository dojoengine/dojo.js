#!/bin/env node

import { CallData, stark, hash, ec } from "starknet";
import fs from "fs/promises";

async function createAccountDetails() {
    const privateKey = stark.randomAddress();
    const starkKeyPub = ec.starkCurve.getStarkKey(privateKey);

    const OZaccountConstructorCallData = CallData.compile({
        publicKey: starkKeyPub,
    });

    const OZcontractAddress = hash.calculateContractAddressFromHash(
        starkKeyPub,
        "0x05400e90f7e0ae78bd02c77cd75527280470e2fe19c54970dd79dc37a9d3645c",
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
