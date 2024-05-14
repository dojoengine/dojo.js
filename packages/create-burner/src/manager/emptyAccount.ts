import {
    AccountInterface,
    CallData,
    Contract,
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
 * @param address - The destination address to which funds are to be transferred.
 * @param account - The source account from which funds will be deducted.
 * @param feeTokenAddress - The Ethereum contract address responsible for the transfer.
 *                             If not provided, defaults to KATANA_ETH_CONTRACT_ADDRESS.
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
    maxFee: number
): Promise<any> => {
    try {
        // First read the balance of the account
        const contract = new Contract(abi, feeTokenAddress, provider);
        const res = await contract.call("balanceOf", [account.address]);
        const balance = res.balance.low as bigint;

        // Configure the options for the transfer transaction
        const transferOptions = {
            contractAddress: feeTokenAddress,
            entrypoint: "transfer",
            calldata: CallData.compile([masterAddress, balance, "0x0"]),
        };

        // Retrieve the nonce for the account to avoid transaction collisions
        const nonce = await account.getNonce();
        // Initiate the transaction
        const { transaction_hash } = await account.execute(
            [transferOptions],
            undefined,
            {
                nonce,
                maxFee,
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
