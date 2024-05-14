import { useConnect, useAccount, useDisconnect } from "@starknet-react/core";
import { KATANA_ETH_CONTRACT_ADDRESS } from "@dojoengine/core";
import Balance from "./Balance";

export default function MasterAccountConnect() {
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();
    const { address, status } = useAccount();

    if (status === "connected" && address) {
        return (
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <p>Master Account: {address}</p>
                <Balance
                    address={address}
                    token_address={KATANA_ETH_CONTRACT_ADDRESS}
                />
                <button onClick={() => disconnect()}>Disconnect</button>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <p>Connect with a wallet</p>

            {connectors.map((connector) => (
                <span key={connector.id}>
                    <button onClick={() => connect({ connector })}>
                        {connector.name}
                    </button>
                </span>
            ))}
        </div>
    );
}
