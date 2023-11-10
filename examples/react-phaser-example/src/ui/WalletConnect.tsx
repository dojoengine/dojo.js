import { ClickWrapper } from "./ClickWrapper";
import { Spawn } from "./Spawn";

export const WalletConnect = () => {
    return (
        <ClickWrapper>
            <div className="flex space-x-3 justify-between p-2 flex-wrap">
                <div>
                    <Spawn />
                </div>
            </div>
        </ClickWrapper>
    );
};
