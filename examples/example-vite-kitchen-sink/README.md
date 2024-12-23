# OnChainDash Vite Kitchen Sink

This project aims at showcasing dojo's capabilities outside of gaming.

## Getting Started

First, install dependencies:

```bash
pnpm install
```

In one terminal window, start katana (the sequencer). If you want to use sepolia / mainnet contracts, you can just use a classic rpc (e.g. `https://rpc.netermind.io/(mainnet|sepolia)-juno`). If this is the case, you can skip the next command.

```bash
katana --disable-fee --allowed-origins "*"
```

In another terminal window, start torii server

```bash
# with katana
torii --world 0x6dd367f5e11f11e0502cb2c4db7ae9bb6d8b5a4a431750bed7bec88b218e12 --allowed-origins "*"
# with mainnet|sepolia
torii --world 0x6dd367f5e11f11e0502cb2c4db7ae9bb6d8b5a4a431750bed7bec88b218e12 --allowed-origins "*" --rpc "https://rpc.nethermind.io/(mainnet|sepolia)-juno?apikey={apikey}" -s 204922
```

Then, start the development server:

```bash
pnpm run dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

## Local Contracts deployment

In order to make those commands work, you need to have torii & katana running.

```bash
cd src/onchain
sozo build
sozo migrate apply
```

### Notes

-   you main want to update `actions` contract address in `src/components/caller-counter.tsx` & `src/components/global-counter.tsx` which is hardcoded in those files.
-   if you want to have braavos & argent wallet working, you need to deploy classes and deploy your wallet manually.
