import { describe, expect, it } from "vitest";

import { createDojoConfig } from "../../config/index";

describe("config", () => {
    it("should return an object of type DojoConfigParams", async () => {
        const configObj = createDojoConfig({
            rpcUrl: "",
            toriiUrl: "",
            masterAddress: "",
            masterPrivateKey: "",
            accountClassHash: "",
            manifest: "",
        });
        expect(configObj).toBeTypeOf("object");
        expect(configObj.rpcUrl).not.toBeNull();
        expect(configObj.toriiUrl).not.toBeNull();
        expect(configObj.masterAddress).not.toBeNull();
        expect(configObj.masterPrivateKey).not.toBeNull();
        expect(configObj.accountClassHash).not.toBeNull();
    });
});
