import { ReactNode, createContext } from "react";
import { BurnerManagerOptions } from "../types";

export const BurnerContext = createContext<BurnerManagerOptions | null>(null);

interface BurnerProviderProps {
    children: ReactNode;
    initOptions: BurnerManagerOptions;
}

export const BurnerProvider = ({
    children,
    initOptions,
}: BurnerProviderProps): JSX.Element => {
    return (
        <BurnerContext.Provider value={initOptions}>
            {children}
        </BurnerContext.Provider>
    );
};
