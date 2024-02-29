import {
    useContractWrite,
    useAccount,
    useNetwork,
    useContract,
} from "@starknet-react/core";
import { erc20ABI } from "./erc20";
import { useMemo } from "react";
import { CallData } from "starknet";
import { KATANA_ETH_CONTRACT_ADDRESS } from "@dojoengine/core";

const transferOptions = {
    contractAddress: KATANA_ETH_CONTRACT_ADDRESS,
    entrypoint: "transfer",
    calldata: CallData.compile([
        "0x04c52be6a42ba0268BfbeE1b478D944FbF16d0228d90a23E8f3915dc2349D6E1",
        "0x2386f26fc10000",
        "0x0",
    ]),
};

export function Deploy() {
    const { address } = useAccount();
    const { chain } = useNetwork();

    const { contract } = useContract({
        abi: erc20ABI,
        address: chain.nativeCurrency.address,
    });

    const calls = useMemo(() => {
        if (!address || !contract) return [];
        return contract.populateTransaction["transfer"]!(address, {
            low: 1,
            high: 0,
        });
    }, [contract, address]);

    const { writeAsync, data, isPending } = useContractWrite({
        calls: [transferOptions],
    });

    return (
        <>
            <button onClick={() => writeAsync()}>Transfer</button>
            <p>status: {isPending && <div>Submitting...</div>}</p>
            <p>hash: {data?.transaction_hash}</p>
        </>
    );
}
