import React, { createContext, ReactNode } from "react";

import { BurnerManagerOptions } from "../types";

export const BurnerContext = createContext<BurnerManagerOptions | null>(null);

/**
 * Props for the BurnerProvider component {@link BurnerProvider}
 */
export interface BurnerProviderProps {
    children: ReactNode;
    initOptions: BurnerManagerOptions;
}

/**
 * BurnerProvider
 *
 * @description This wraps the entire application in a context provider to allow for access to keep
 *            the burner manager options available to all components. Takes {@link BurnerProviderProps}.
 *
 * ```tsx
 * import { BurnerProvider } from '@dojoengine/create-burner';
 *
 * const initOptions = { ... };
 *
 * const App = () => {
 *    return (
 *       <BurnerProvider initOptions={initOptions}>
 *         <MyApp />
 *      </BurnerProvider>
 * )};
 * ```
 *
 * @param children
 * @param initOptions
 */

export const BurnerProvider = ({
    children,
    initOptions,
}: BurnerProviderProps): React.ReactNode => {
    return (
        <BurnerContext.Provider value={initOptions}>
            {children}
        </BurnerContext.Provider>
    );
};
