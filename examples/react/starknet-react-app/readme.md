## Starknet React App

# Steps to Set Up ArgentX Wallet with Katana

1. **Launch Katana**

-   `katana --seed 0 --invoke-max-steps 1000000000 --allowed-origins "*"`

2. **Deploy ArgentX Account Contracts using the Script**

-   The script is located in the dojo repo under `dojo/crates/katana/scripts`:
    `./declare-argent-account.sh 0xb3ff441a68610b30fd5e2abbf3a1548eb6ba6f3559f2862bf2dc757e5828ca 0x2bbf4f9fd0bbb2e60b0316c1fe0b76cf7a4d0198bd493ced9b8df2a3a24d68a http://localhost:5050`

3. **In ArgentX, go to:**

    - Developers settings > Manage Network > Devnet (rename Katana)
        - RPC URL: `http://localhost:5050`
        - Account Class Hash: `0x029927c8af6bccf3f6fda035981e765a7bdbf18a2dc0d630494f8758aa908e2b` (from step 2)

4. **Create an ArgentX Account on Katana in the extension**

5. **Set Up starkli to Use a Katana prefunded Account:**

    - `mkdir ~/.starkli-wallets/`
    - `mkdir ~/.starkli-wallets/katana/`
    - `mkdir ~/.starkli-wallets/katana/account_1`
    - `starkli signer keystore from-key ~/.starkli-wallets/katana/account_1/keystore.json`
        - Enter private key: `0x2bbf4f9fd0bbb2e60b0316c1fe0b76cf7a4d0198bd493ced9b8df2a3a24d68a`
        - Set a password
    - `starkli account fetch 0xb3ff441a68610b30fd5e2abbf3a1548eb6ba6f3559f2862bf2dc757e5828ca --rpc http://localhost:5050 --output ~/.starkli-wallets/katana/account_1/account.json`
    - `touch ~/.starkli-wallets/katana/account_1/envars.sh`
    - Add the following to `envars.sh`:
        ```sh
        export STARKNET_ACCOUNT=katana-0
        export STARKNET_KEYSTORE=/Users/matthias/.starkli-wallets/katana/account_1/keystore.json
        export STARKNET_RPC=http://0.0.0.0:5050
        ```
    - `source ~/.starkli-wallets/katana/account_1/envars.sh`

6. **Send 1 ETH with Starkli to the Address of the Account Created on ArgentX in Step 4:**

    ````sh
    starkli invoke 0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7 transfer 0x06Ea4b364027a5BA99A7Db3B575469423dd540de60D083643071cfB77118763F 1000000000000000000 0```

    ````

7. **Send ETH to another account in your ArgentX wallet in order to deploy the account**
