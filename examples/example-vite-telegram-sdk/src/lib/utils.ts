import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export async function fetchUsername(address: string) {
    const data = await (
        await fetch("https://api.cartridge.gg/query", {
            headers: {
                "content-type": "application/json",
            },
            body: `{"query":"query {\\n  accounts(where:{\\n    contractAddress: \\"${address}\\"\\n  }) {\\n    edges {\\n      node {\\n        id,\\ncontractAddress      }\\n    }\\n  }\\n}"}`,
            method: "POST",
        })
    ).json();

    return data.data.accounts.edges?.[0]?.node?.id;
}

export async function fetchUsernames(addresses: string[]) {
    const data = await (
        await fetch("https://api.cartridge.gg/query", {
            headers: {
                "content-type": "application/json",
            },
            body: `{"query":"query {\\n  accounts(where:{\\n    or: [${addresses
                .map(
                    (address) => `{contractAddressHasPrefix: \\"${address}\\"}`
                )
                .join(
                    ","
                )}]\\n  }) {\\n    edges {\\n      node {\\n        id,\\ncontractAddress      }\\n    }\\n  }\\n}"}`,
            method: "POST",
        })
    ).json();

    return data.data.accounts.edges.reduce((acc, edge) => {
        acc[edge.node.contractAddress] = edge.node.id;
        return acc;
    }, {});
}
