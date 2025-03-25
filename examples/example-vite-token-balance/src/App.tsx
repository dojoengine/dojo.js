import "./App.css";
import { Wallet } from "./components/wallet";
import TokenBalance from "./components/token-balance";

function App() {
    return (
        <>
            <h1>Connect your wallet</h1>
            <Wallet />
            <TokenBalance />
        </>
    );
}

export default App;
