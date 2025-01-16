import { ReactNode, useContext, createContext } from "react";
import { SchemaType, SDK } from "../types";
import { DojoConfig, DojoProvider } from "@dojoengine/core";
import { createDojoStore } from "../state";

/**
 * Interface defining the shape of the Dojo context.
 */
export interface DojoContextType<
    Client extends (...args: any) => any,
    Schema extends SchemaType,
> {
    /** The Dojo client instance */
    config: DojoConfig;
    /** The Dojo client instance */
    client: ReturnType<Client>;
    /** SDK client instance **/
    sdk: SDK<Schema>;
    /** The Dojo provider */
    provider: DojoProvider;
    /** The dojo zustand store */
    useDojoStore: ReturnType<typeof createDojoStore<Schema>>;
}

/**
 * React context for sharing Dojo-related data throughout the application.
 */
// @ts-expect-error Since we c
// annot dynamically set context at runtime, we will get a type error.
export const DojoContext = createContext<DojoContextType>(undefined);

/**
 * Provider component that makes Dojo context available to child components.
 *
 * @param props.children - Child components that will have access to the Dojo context
 * @param props.burnerManager - Instance of BurnerManager for handling burner accounts
 * @throws {Error} If DojoProvider is used more than once in the component tree
 */
export function DojoSdkProvider<Schema extends SchemaType>({
    dojoConfig,
    sdk,
    clientFn,
    children,
}: {
    dojoConfig: DojoConfig;
    sdk: SDK<Schema>;
    clientFn: Function;
    children: ReactNode;
}) {
    const currentValue = useContext(DojoContext);
    if (currentValue) {
        throw new Error("DojoProvider can only be used once");
    }

    const dojoProvider = new DojoProvider(
        dojoConfig.manifest,
        dojoConfig.rpcUrl
    );

    return (
        <DojoContext.Provider
            value={{
                config: dojoConfig,
                client: clientFn(dojoProvider),
                sdk: sdk,
                provider: dojoProvider,
                useDojoStore: createDojoStore<Schema>(),
            }}
        >
            {children}
        </DojoContext.Provider>
    );
}
