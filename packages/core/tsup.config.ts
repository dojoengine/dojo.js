import { defineConfig } from "tsup";
import { tsupConfig } from "../../tsup.config";

export default defineConfig({
    ...tsupConfig,
    entry: [
        "src/index.ts",
        "src/scripts/accountDetails.ts",
        "src/scripts/checkBalance.ts",
        "src/scripts/deployAccount.ts",
    ],
    minify: false,
    splitting: false,
});
