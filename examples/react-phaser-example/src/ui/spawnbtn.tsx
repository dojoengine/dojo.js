import { store } from "../store/store";
import { ClickWrapper } from "./clickWrapper";

export const SpawnBtn = () => {
    const networkLayer = store.getState().networkLayer;

    const account = networkLayer?.account;

    const calls = networkLayer?.systemCalls;

    const deployAccount = () => {
        account?.create();
    };

    return (
        <ClickWrapper>
            <button onClick={deployAccount}>
                {networkLayer?.account.isDeploying
                    ? "deploying burner"
                    : "create burner"}
            </button>
            <div className="card">
                select signer:{" "}
                <select onChange={(e) => account?.select(e.target.value)}>
                    {account?.list().map((account, index) => {
                        return (
                            <option value={account.address} key={index}>
                                {account.address}
                            </option>
                        );
                    })}
                </select>
            </div>
            <button
                onClick={() => {
                    calls?.spawn(account?.getActiveAccount());
                }}
            >
                Spawn
            </button>
        </ClickWrapper>
    );
};
