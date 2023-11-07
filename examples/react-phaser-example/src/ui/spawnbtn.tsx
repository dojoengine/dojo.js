import { useDojo } from "../hooks/useDojo";
import { ClickWrapper } from "./clickWrapper";

export const SpawnBtn = () => {
    // const {
    //     account: {
    //         create,
    //         list,
    //         get,
    //         account,
    //         select,
    //         isDeploying
    //     },
    //     networkLayer: {
    //         systemCalls: { spawn },
    //     },
    // } = useDojo();

    return (
        <ClickWrapper>
            {/* <button onClick={create}>{isDeploying ? "deploying burner" : "create burner"}</button>
            <div className="card">
                select signer:{" "}
                <select onChange={e => select(e.target.value)}>
                    {list().map((account, index) => {
                        return <option value={account.address} key={index}>{account.address}</option>
                    })}
                </select>
            </div> */}
            {/* <button
                onClick={() => {
                    spawn(account);
                }}
            >
                Spawn
            </button> */}
        </ClickWrapper>
    );
};