import { expect, test } from "vitest";
import { getContractByName, parseModelName } from "../../src/utils";
import manifest from "../../src/utils/manifest.json";

test("get address by contract name", () => {
    expect(getContractByName(manifest, "actions")?.address).toBe(
        "0x152dcff993befafe5001975149d2c50bd9621da7cbaed74f68e7d5e54e65abc"
    );

    expect(
        getContractByName(manifest, "dojo_examples::actions::actions")?.address
    ).toBe("0x152dcff993befafe5001975149d2c50bd9621da7cbaed74f68e7d5e54e65abc");
});

test("model name parse", () => {
    const modelThreeWords = manifest.models.find(
        (model) => model.name === "dojo_examples::models::moves_at_remaining"
    );

    const model = manifest.models.find(
        (model) => model.name === "dojo_examples::models::erc_20_allowance"
    );

    const modelTwoWords = manifest.models.find(
        (model) => model.name === "dojo_examples::models::moves_remaining"
    );

    const modelSingleWord = manifest.models.find(
        (model) => model.name === "dojo_examples::models::moves"
    );

    expect(parseModelName(model)).toBe("ERC20Allowance");

    expect(parseModelName(modelTwoWords)).toBe("MovesRemaining");

    expect(parseModelName(modelSingleWord)).toBe("Moves");

    expect(parseModelName(modelThreeWords)).toBe("MovesAtRemaining");
});
