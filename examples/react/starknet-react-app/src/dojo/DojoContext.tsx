import {
    BurnerManagerHook,
    BurnerManager,
    useBurnerManager,
} from "@dojoengine/create-burner";
import { dojoConfig } from "../../dojoConfig.ts";
import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { AccountInterface } from "starknet";
import { SetupResult } from "./generated/setup";
import { useAccount } from "@starknet-react/core";

interface DojoContextType extends SetupResult {
    masterAccount: AccountInterface | undefined;
    burnerManager: BurnerManagerHook;
}

export const DojoContext = createContext<DojoContextType | null>(null);

export const DojoProvider = ({
    children,
    value,
}: {
    children: ReactNode;
    value: SetupResult;
}) => {
    const currentValue = useContext(DojoContext);
    if (currentValue) throw new Error("DojoProvider can only be used once");

    const { account: masterAccount } = useAccount();

    const [burnerManagerInstance, setBurnerManagerInstance] =
        useState<BurnerManager | null>(null);

    useEffect(() => {
        const initBurnerManagerInstance = async (
            masterAccount: AccountInterface
        ) => {
            const burnerManager = new BurnerManager({
                masterAccount,
                accountClassHash: dojoConfig.accountClassHash,
                rpcProvider: value.dojoProvider.provider,
                feeTokenAddress: dojoConfig.feeTokenAddress,
            });

            try {
                await burnerManager.init();
            } catch (e) {
                console.error(e);
            }

            setBurnerManagerInstance(burnerManager);
        };

        if (masterAccount) {
            console.log(
                "Burner Manager init masterAccount " + masterAccount.address
            );
            initBurnerManagerInstance(masterAccount);
        }
    }, [masterAccount]);

    const burnerManager = useBurnerManager({
        burnerManager: burnerManagerInstance,
    });

    return (
        <DojoContext.Provider
            value={{
                ...value,
                masterAccount,
                burnerManager,
            }}
        >
            {children}
        </DojoContext.Provider>
    );
};
