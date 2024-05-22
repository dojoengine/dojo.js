import {
    AccountInterface,
    CallData,
    Contract,
    InvocationsDetails,
    RpcProvider,
    TransactionFinalityStatus,
} from "starknet";

const abi = [
    {
        members: [
            {
                name: "low",
                offset: 0,
                type: "felt",
            },
            {
                name: "high",
                offset: 1,
                type: "felt",
            },
        ],
        name: "Uint256",
        size: 2,
        type: "struct",
    },
    {
        name: "balanceOf",
        type: "function",
        inputs: [
            {
                name: "account",
                type: "felt",
            },
        ],
        outputs: [
            {
                name: "balance",
                type: "Uint256",
            },
        ],
        stateMutability: "view",
    },
];

/**
 * Empty a given account by initiating a transfer transaction to the masterAccount
 *
 * @param provider - The RPC provider used to interact with the StarkNet network.
 * @param masterAddress - The address of the master account to which funds are to be transferred.
 * @param account - The source account from which funds will be deducted.
 * @param feeTokenAddress - The Ethereum contract address responsible for the transfer.
 *                             If not provided, defaults to KATANA_ETH_CONTRACT_ADDRESS.
 * @param transactionDetails - Additional transaction details to be included in the transaction.
 *
 * @returns - Returns the result of the transfer transaction, typically including transaction details.
 *
 * @throws - Throws an error if the transaction does not complete successfully.
 */
export const emptyAccount = async (
    provider: RpcProvider,
    masterAddress: string,
    account: AccountInterface,
    feeTokenAddress: string,
    transactionDetails?: InvocationsDetails
): Promise<any> => {
    try {
        const maxFee = transactionDetails?.maxFee || 0;
        if (maxFee === 0) return; // No need to transfer if the max fee is 0

        // First read the balance of the account
        const contract = new Contract(abi, feeTokenAddress, provider);
        const res = await contract.call("balanceOf", [account.address]);
        const balance = BigInt(res.balance.low);

        const transferAmount = balance - BigInt(maxFee);

        if (transferAmount < 0) {
            throw new Error("Insufficient balance to cover the max fee.");
        }

        // Configure the options for the transfer transaction
        const transferOptions = {
            contractAddress: feeTokenAddress,
            entrypoint: "transfer",
            calldata: CallData.compile([masterAddress, transferAmount, "0x0"]),
        };

        // Retrieve the nonce for the account to avoid transaction collisions
        const nonce = await account.getNonce();
        // Initiate the transaction
        const { transaction_hash } = await account.execute(
            [transferOptions],
            undefined,
            {
                maxFee: 0,
                nonce,
                ...transactionDetails,
            }
        );

        // Wait for the transaction to complete and check its status
        const result = await account.waitForTransaction(transaction_hash, {
            retryInterval: 1000,
            successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
        });

        if (!result) {
            throw new Error("Transaction did not complete successfully.");
        }

        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
