import { Burner } from "@dojoengine/create-burner";
import { useDojo } from "../dojo/useDojo";

export default function BurnerSelector() {
    const {
        burnerManager: { account, list, select },
    } = useDojo();

    return (
        <div className="card">
            Select signer:{" "}
            <select
                value={account ? account.address : ""}
                onChange={(e) => select(e.target.value)}
            >
                {list().map((burner: Burner, index: number) => {
                    return (
                        <option value={burner.address} key={index}>
                            {burner.address}
                        </option>
                    );
                })}
            </select>
        </div>
    );
}
