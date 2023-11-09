import { useUIStore } from "../store/store";
import { ClickWrapper } from "./ClickWrapper";
import { WalletConnect } from "./WalletConnect";

export const CreateAccount = () => {
    const loggedIn = useUIStore((state: any) => state.loggedIn);

    const setLoggedIn = useUIStore((state: any) => state.setLoggedIn);

    return (
        <div
            className={`absolute h-screen w-screen bg-black top-0 left-0 z-100 text-white flex justify-center ${
                loggedIn ? "hidden" : ""
            }`}
        >
            <div className="self-center">
                <h3>RPS</h3>
                <h5>Eat to survive</h5>
                <div>
                    <WalletConnect />
                </div>
                <div>
                    <ClickWrapper>
                        <button onClick={() => setLoggedIn()}>enter</button>
                    </ClickWrapper>
                </div>
            </div>
        </div>
    );
};
