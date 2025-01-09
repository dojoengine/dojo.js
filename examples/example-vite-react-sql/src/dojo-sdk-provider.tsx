import { createContext, ReactNode, useContext } from "react";
import { dojoConfig } from "../dojoConfig";
import { DojoProvider } from "@dojoengine/core";
import { setupWorld } from "./typescript/contracts.gen";
import { SDK } from "@dojoengine/sdk";
import { SchemaType } from "./typescript/models.gen";

/**
 * Interface defining the shape of the Dojo context.
 */
interface DojoContextType {
    /** The Dojo client instance */
    client: ReturnType<typeof setupWorld>;
    /** SDK client instance **/
    sdk: SDK<SchemaType>;
}

/**
 * React context for sharing Dojo-related data throughout the application.
 */
// @ts-expect-error Since we cannot dynamically set context at runtime, we will get a type error.
export const DojoContext = createContext<DojoContextType>(undefined);

/**
 * Provider component that makes Dojo context available to child components.
 *
 * @param props.children - Child components that will have access to the Dojo context
 * @param props.burnerManager - Instance of BurnerManager for handling burner accounts
 * @throws {Error} If DojoProvider is used more than once in the component tree
 */
export const DojoSdkProvider = ({
    sdk,
    children,
}: {
    sdk: SDK<SchemaType>;
    children: ReactNode;
}) => {
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
                client: setupWorld(dojoProvider),
                sdk: sdk,
            }}
        >
            {children}
        </DojoContext.Provider>
    );
};
