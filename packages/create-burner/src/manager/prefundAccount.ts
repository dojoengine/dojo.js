import { AccountInterface, CallData, TransactionStatus } from "starknet";
import { KATANA_ETH_CONTRACT_ADDRESS, PREFUND_AMOUNT } from "..";

/**
 * Pre-funds a given account by initiating a transfer transaction.
 * 
 * @param address - The destination address to which funds are to be transferred.
 * @param account - The source account from which funds will be deducted.
 * @param ethContractAddress - The Ethereum contract address responsible for the transfer.
 *                             If not provided, defaults to KATANA_ETH_CONTRACT_ADDRESS.
 * 
 * @returns - Returns the result of the transfer transaction, typically including transaction details.
 * 
 * @throws - Throws an error if the transaction does not complete successfully.
 */
export const prefundAccount = async (
    address: string,
    account: AccountInterface,
    ethContractAddress: string = KATANA_ETH_CONTRACT_ADDRESS
): Promise<any> => {
    try {
        // Configure the options for the transfer transaction
        const transferOptions = {
            contractAddress: ethContractAddress,
            entrypoint: "transfer",
            calldata: CallData.compile([address, PREFUND_AMOUNT, "0x0"]),
        };

        // Retrieve the nonce for the account to avoid transaction collisions
        const nonce = await account.getNonce();

        // Initiate the transaction
        const { transaction_hash } = await account.execute(transferOptions,
            undefined,
            {
                nonce,
                maxFee: 0 // This is set to 0 for now, consider adjusting it based on network conditions or requirements.
            }
        );

        // Wait for the transaction to complete and check its status
        const result = await account.waitForTransaction(transaction_hash, {
            retryInterval: 1000,
            successStates: [TransactionStatus.ACCEPTED_ON_L2],
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