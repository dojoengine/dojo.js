import { useConnect, useAccount } from "@starknet-react/core";

export default function MasterAccountConnect() {
    const { connect, connectors } = useConnect();
    const { address, status } = useAccount();

    if (status === "connected") {
        return <p>Connected with address {address}</p>;
    }

    return (
        <ul>
            {connectors.map((connector) => (
                <li key={connector.id}>
                    <button onClick={() => connect({ connector })}>
                        {connector.name}
                    </button>
                </li>
            ))}
        </ul>
    );
}
