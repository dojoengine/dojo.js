import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo,
} from "react";
import {
    useLaunchParams,
    cloudStorage,
    miniApp,
    openLink,
} from "@telegram-apps/sdk-react";
import * as Dojo from "@dojoengine/torii-client";
import encodeUrl from "encodeurl";
import { CartridgeSessionAccount } from "@cartridge/account-wasm/session";

interface AccountStorage {
    username: string;
    address: string;
    ownerGuid: string;
    transactionHash?: string;
    expiresAt: string;
}

interface SessionSigner {
    privateKey: string;
    publicKey: string;
}

interface AccountContextType {
    accountStorage?: AccountStorage;
    sessionSigner?: SessionSigner;
    account?: CartridgeSessionAccount;
    openConnectionPage: () => void;
    clearSession: () => void;
    address?: string;
    username?: string;
    keychainUrl?: string;
    redirectUri?: string;
    policies?: { target: string; method: string; description: string }[];
    rpcUrl?: string;
    network?: string;
}

interface AccountProviderProps {
    children: React.ReactNode;
    keychainUrl: string;
    policies: { target: string; method: string; description: string }[];
    redirectUri: string;
    rpcUrl: string;
    network?: string;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider: React.FC<AccountProviderProps> = ({
    children,
    keychainUrl,
    policies,
    redirectUri,
    rpcUrl,
    network,
}) => {
    const { initData } = useLaunchParams();
    const [accountStorage, setAccountStorage] = useState<AccountStorage>();
    const [sessionSigner, setSessionSigner] = useState<SessionSigner>();

    useEffect(() => {
        const initializeSession = async () => {
            const keys = await cloudStorage.getKeys();

            if (keys.includes("sessionSigner")) {
                const signer = await cloudStorage.getItem("sessionSigner");
                setSessionSigner(JSON.parse(signer) as SessionSigner);
                return;
            }

            const privateKey = Dojo.signingKeyNew();
            const publicKey = Dojo.verifyingKeyNew(privateKey);
            const newSigner = { privateKey, publicKey };

            await cloudStorage.setItem(
                "sessionSigner",
                JSON.stringify(newSigner)
            );
            setSessionSigner(newSigner);
        };

        const loadStoredAccount = async () => {
            const account = await cloudStorage.getItem("account");
            if (!account) return;

            const parsedAccount = JSON.parse(account) as AccountStorage;
            if (
                !parsedAccount.address ||
                !parsedAccount.ownerGuid ||
                !parsedAccount.expiresAt
            ) {
                await cloudStorage.deleteItem("account");
                return;
            }

            setAccountStorage(parsedAccount);
        };

        initializeSession();
        loadStoredAccount();
    }, []);

    useEffect(() => {
        if (!initData?.startParam) return;

        const cartridgeAccount = JSON.parse(
            atob(initData.startParam)
        ) as AccountStorage;
        cloudStorage.setItem("account", JSON.stringify(cartridgeAccount));
        setAccountStorage(cartridgeAccount);
    }, [initData]);

    const account = useMemo(() => {
        if (!accountStorage || !sessionSigner) return;

        return CartridgeSessionAccount.new_as_registered(
            rpcUrl,
            sessionSigner.privateKey,
            accountStorage.address,
            accountStorage.ownerGuid,
            network
                ? Dojo.cairoShortStringToFelt(network)
                : Dojo.cairoShortStringToFelt("SN_MAINNET"),
            {
                expiresAt: Number(accountStorage.expiresAt),
                policies,
            }
        );
    }, [accountStorage, sessionSigner]);

    const openConnectionPage = async () => {
        if (!sessionSigner) {
            const privateKey = Dojo.signingKeyNew();
            const publicKey = Dojo.verifyingKeyNew(privateKey);
            const newSigner = { privateKey, publicKey };

            await cloudStorage.setItem(
                "sessionSigner",
                JSON.stringify(newSigner)
            );
            setSessionSigner(newSigner);
            return;
        }

        const url = encodeUrl(
            `${keychainUrl}/session?public_key=${sessionSigner.publicKey}` +
                `&redirect_uri=${redirectUri}&redirect_query_name=startapp` +
                `&policies=${JSON.stringify(policies)}&rpc_url=${rpcUrl}`
        );

        openLink(url, {
            tryInstantView: false,
        });
        miniApp.close();
    };

    const clearSession = async () => {
        await Promise.all([
            cloudStorage.deleteItem("sessionSigner"),
            cloudStorage.deleteItem("account"),
        ]);
        setSessionSigner(undefined);
        setAccountStorage(undefined);
    };

    return (
        <AccountContext.Provider
            value={{
                accountStorage,
                sessionSigner,
                account,
                openConnectionPage,
                clearSession,
                address: accountStorage?.address,
                username: accountStorage?.username,
                keychainUrl,
                redirectUri,
                policies,
                rpcUrl,
            }}
        >
            {children}
        </AccountContext.Provider>
    );
};

export const useAccount = () => {
    const context = useContext(AccountContext);
    if (!context) {
        throw new Error("useAccount must be used within an AccountProvider");
    }
    return context;
};
