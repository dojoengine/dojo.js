import { useState } from "react";
import { Burner } from "@dojoengine/create-burner";
import { KATANA_ETH_CONTRACT_ADDRESS } from "@dojoengine/core";
import Balance from "./Balance";

interface BurnerDetailsProps {
    burner: Burner;
    index: number;
    removeBurner: () => Promise<void>;
}

export default function BurnerDetails({
    burner,
    index,
    removeBurner,
}: BurnerDetailsProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            await removeBurner();
        } catch (error) {
            console.error("Error removing burner:", error);
        }
        setIsLoading(false);
    };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                border: "1px solid rgb(148 163 184)",
                justifyContent: "space-between",
                borderRadius: "5px",
                padding: "10px",
            }}
        >
            <div>{`Burner_${index}`}</div>
            <div style={{ width: "600px" }}>{burner.address}</div>
            <Balance
                address={burner.address}
                token_address={KATANA_ETH_CONTRACT_ADDRESS}
            />
            <button
                style={{ width: "130px" }}
                onClick={handleDelete}
                disabled={isLoading}
            >
                {isLoading ? "Removing..." : "Remove"}
            </button>
        </div>
    );
}
