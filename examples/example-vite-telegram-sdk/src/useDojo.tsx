import { useContext } from "react";
import { DojoContext } from "./DojoContext";

/**
 * Custom hook to access the Dojo context and account information.
 * Must be used within a DojoProvider component.
 *
 * @returns An object containing:
 *   - setup: The Dojo setup configuration
 *   - account: The current account information
 * @throws {Error} If used outside of a DojoProvider context
 */
export const useDojo = () => {
    const context = useContext(DojoContext);

    if (!context) {
        throw new Error(
            "The `useDojo` hook must be used within a `DojoProvider`"
        );
    }

    const { account, ...setup } = context;

    return {
        setup,
        account,
    };
};
