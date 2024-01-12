import { store } from "../store";
import { CreateAccount } from "./CreateAccount";

export const UI = () => {
    const layers = store((state) => {
        return {
            networkLayer: state.networkLayer,
            phaserLayer: state.phaserLayer,
        };
    });

    if (!layers.networkLayer || !layers.phaserLayer) return <></>;

    return (
        <div className="absolute inset-0 pointer-events-none">
            <CreateAccount />
        </div>
    );
};
