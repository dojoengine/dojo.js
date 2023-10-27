import "./App.css";
import { useDojo } from "./DojoContext";
import { useComponentValue } from "@latticexyz/react";
import { Direction } from "./dojo/createSystemCalls";
import { EntityIndex } from "@latticexyz/recs";

function App() {
    const {
        setup: {
            systemCalls: { spawn, move },
            components: { Moves, Position },
        },
        account: { create, list, select, account, isDeploying, clear },
    } = useDojo();

    // entity id - this example uses the account address as the entity id
    const entityId = account.address.toString();

    // get current component values
    const position = useComponentValue(Position, entityId as EntityIndex);
    const moves = useComponentValue(Moves, entityId as EntityIndex);

    return (
        <>
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
                <div>
                    <button onClick={() => clear()}>Clear burners</button>
                </div>
            </div>
            <div className="card">
                <button onClick={() => spawn(account)}>Spawn</button>
                <div>
                    Moves Left:{" "}
                    {moves ? `${moves["remaining"]}` : "Need to Spawn"}
                </div>
                <div>
                    Position:{" "}
                    {position
                        ? `${position["x"]}, ${position["y"]}`
                        : "Need to Spawn"}
                </div>
            </div>
            <div className="card">
                <button onClick={() => move(account, Direction.Up)}>
                    Move Up
                </button>{" "}
                <br />
                <button onClick={() => move(account, Direction.Left)}>
                    Move Left
                </button>
                <button onClick={() => move(account, Direction.Right)}>
                    Move Right
                </button>{" "}
                <br />
                <button onClick={() => move(account, Direction.Down)}>
                    Move Down
                </button>
            </div>
        </>
    );
}

export default App;
