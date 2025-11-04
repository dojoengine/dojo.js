import { useDojoContext } from "./DojoContext";

export const useDojo = () => {
    const context = useDojoContext();

    return {
        setup: context,
        account: context.account,
    };
};
