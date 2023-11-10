import { shortenHex } from "@dojoengine/utils";
import { useDojo } from "../hooks/useDojo";
import { ClickWrapper } from "./ClickWrapper";
import { Button } from "../components/ui/button";
import { Spawn } from "./Spawn";

export const WalletConnect = () => {
    const {
        account: { create, isDeploying, select, list, clear },
    } = useDojo();

    return (
        <ClickWrapper>
            <div className="flex space-x-3 justify-between p-2 flex-wrap">
                <div className="flex w-full">
                    {/* <Button onClick={create}>
                        {isDeploying ? "deploying burner" : "create burner"}
                    </Button> */}
                    {/* <Button onClick={clear}>clear burners</Button> */}
                </div>

                {/* <div className=" text-black w-full flex space-x-3">
                    <div className="text-white">signer: </div>
                    <select onChange={(e) => select(e.target.value)}>
                        {list().map((account, index) => {
                            return (
                                <option value={account.address} key={index}>
                                    {shortenHex(account.address)}
                                </option>
                            );
                        })}
                    </select>
                </div> */}
                <div>
                    <Spawn />
                </div>
            </div>
        </ClickWrapper>
    );
};
