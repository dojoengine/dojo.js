import { useDojo } from "./dojo/useDojo";
import { useAccount } from "@starknet-react/core";
import MasterAccountConnect from "./components/MasterWallet";
import BurnersManager from "./components/BurnersManager";
import BurnerSelector from "./components/BurnerSelector";
import Game from "./components/Game";
import "./App.css";

function App() {
    const { account: masterAccount } = useAccount();
    const { burnerManager } = useDojo();

    return (
        <>
            <MasterAccountConnect />

            {masterAccount && (
                <>
                    <BurnersManager />

                    {/* Context where we use burner account */}
                    {burnerManager.account && (
                        <>
                            <BurnerSelector />
                            <Game account={burnerManager.account} />
                        </>
                    )}
                </>
            )}
        </>
    );
}

export default App;
