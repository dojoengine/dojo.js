import { describe, expect, it, vi } from "vitest";
import { type AccountInterface, TransactionFinalityStatus } from "starknet";

import { prefundAccount } from "../../src/manager/prefundAccount";

describe("prefundAccount", () => {
    it("gets the nonce and waits through the account provider", async () => {
        const receipt = { transaction_hash: "0xtransaction" };
        const getNonceForAddress = vi.fn().mockResolvedValue("0x7");
        const waitForTransaction = vi.fn().mockResolvedValue(receipt);
        const execute = vi
            .fn()
            .mockResolvedValue({ transaction_hash: "0xtransaction" });
        const account = {
            address: "0xaccount",
            provider: {
                getNonceForAddress,
                waitForTransaction,
            },
            execute,
        } as unknown as AccountInterface;

        await expect(
            prefundAccount("0xdestination", account, "0xfee", "1000", 50)
        ).resolves.toBe(receipt);

        expect(getNonceForAddress).toHaveBeenCalledWith("0xaccount");
        expect(execute).toHaveBeenCalledWith(expect.any(Array), {
            nonce: "0x7",
            maxFee: 50,
        });
        expect(waitForTransaction).toHaveBeenCalledWith("0xtransaction", {
            retryInterval: 1000,
            successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
        });
    });
});
