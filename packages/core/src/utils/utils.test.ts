import { expect, test } from "vitest";
import { getContractByName } from "../utils";
import manifest from "./manifest.json";

test("get address by contract name", () => {
    expect(getContractByName(manifest, "actions")).toBe(
        "0x152dcff993befafe5001975149d2c50bd9621da7cbaed74f68e7d5e54e65abc"
    );

    expect(getContractByName(manifest, "dojo_examples::actions::actions")).toBe(
        "0x152dcff993befafe5001975149d2c50bd9621da7cbaed74f68e7d5e54e65abc"
    );
});
