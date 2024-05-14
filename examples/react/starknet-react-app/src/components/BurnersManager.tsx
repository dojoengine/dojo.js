import BurnerDetails from "./BurnerDetails";
import { useEffect, useState } from "react";
import { useDojo } from "../dojo/useDojo";

export default function BurnersManager() {
    const {
        burnerManager: {
            applyFromClipboard,
            list,
            create,
            clear,
            remove,
            copyToClipboard,
            isDeploying,
        },
    } = useDojo();

    const [clipboardStatus, setClipboardStatus] = useState({
        message: "",
        isError: false,
    });

    const handleRestoreBurners = async () => {
        try {
            await applyFromClipboard();
            setClipboardStatus({
                message: "Burners restored successfully!",
                isError: false,
            });
        } catch (error) {
            setClipboardStatus({
                message: `Failed to restore burners from clipboard`,
                isError: true,
            });
        }
    };

    useEffect(() => {
        if (clipboardStatus.message) {
            const timer = setTimeout(() => {
                setClipboardStatus({ message: "", isError: false });
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [clipboardStatus.message]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
            }}
        >
            <h2 style={{ margin: 0 }}>Burners</h2>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                }}
            >
                {list().map((burner, i) => (
                    <BurnerDetails
                        key={burner.address}
                        burner={burner}
                        removeBurner={async () => remove(burner.address)}
                        index={i}
                    />
                ))}
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <button
                    onClick={() =>
                        create({
                            prefundedAmount: "400000000000000000", // 0.4 ETH
                        })
                    }
                >
                    {isDeploying ? "Deploying burner..." : "Create burner"}
                </button>
                {list().length > 0 && (
                    <button onClick={async () => await copyToClipboard()}>
                        Save Burners to Clipboard
                    </button>
                )}
                <button onClick={handleRestoreBurners}>
                    Restore Burners from Clipboard
                </button>
                {clipboardStatus.message && (
                    <div
                        className={
                            clipboardStatus.isError ? "error" : "success"
                        }
                    >
                        {clipboardStatus.message}
                    </div>
                )}
                <button onClick={() => clear()}>Clear burners</button>
            </div>
        </div>
    );
}
