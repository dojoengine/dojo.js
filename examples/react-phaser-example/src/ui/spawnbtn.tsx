import { useAccount } from "../DojoContext";
import { useDojo } from "../hooks/useDojo";
import { ClickWrapper } from "./clickWrapper";

export const SpawnBtn = () => {
    const {
        networkLayer: {
            systemCalls: { spawn },
        },
    } = useDojo();

    const {
        account: { account, list, select, create, isDeploying },
    } = useAccount();

    return (
        <ClickWrapper>
            <button onClick={create}>
                {isDeploying ? "deploying burner" : "create burner"}
            </button>
            <div className="card">
                select signer:{" "}
                <select onChange={(e) => select(e.target.value)}>
                    {list().map((account, index) => {
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
                    spawn(account);
                }}
            >
                Spawn
            </button>
        </ClickWrapper>
    );
};
