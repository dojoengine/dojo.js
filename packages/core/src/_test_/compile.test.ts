import { describe, expect, it } from "vitest";
import { findFunctionAbiByNamespace } from "../utils/compile";
import manifest from "./manifest_pistols_dev.json";

const abi = manifest.abis as any;

describe("findFunctionAbiByNamespace", () => {
    it("should find commit_moves in bot_player interface (1 input)", () => {
        const func = findFunctionAbiByNamespace(
            abi,
            "pistols",
            "bot_player",
            "commit_moves"
        );

        expect(func).toBeDefined();
        expect(func?.name).toBe("commit_moves");
        expect(func?.inputs).toHaveLength(1);
        expect(func?.inputs[0].name).toBe("duel_id");
    });

    it("should find commit_moves in game interface (3 inputs)", () => {
        const func = findFunctionAbiByNamespace(
            abi,
            "pistols",
            "game",
            "commit_moves"
        );

        expect(func).toBeDefined();
        expect(func?.name).toBe("commit_moves");
        expect(func?.inputs).toHaveLength(3);
        expect(func?.inputs[0].name).toBe("duelist_id");
        expect(func?.inputs[1].name).toBe("duel_id");
        expect(func?.inputs[2].name).toBe("hashed");
    });

    it("should find set_paused in admin interface", () => {
        const func = findFunctionAbiByNamespace(
            abi,
            "pistols",
            "admin",
            "set_paused"
        );

        expect(func).toBeDefined();
        expect(func?.name).toBe("set_paused");
        expect(func?.inputs).toHaveLength(1);
        expect(func?.inputs[0].name).toBe("paused");
    });

    it("should fallback to dojo core interface for upgrade", () => {
        const func = findFunctionAbiByNamespace(
            abi,
            "pistols",
            "admin",
            "upgrade"
        );

        expect(func).toBeDefined();
        expect(func?.name).toBe("upgrade");
        expect(func?.inputs).toHaveLength(1);
        expect(func?.inputs[0].name).toBe("new_class_hash");
    });

    it("should return undefined for nonexistent function", () => {
        const func = findFunctionAbiByNamespace(
            abi,
            "pistols",
            "admin",
            "nonexistent_function"
        );

        expect(func).toBeUndefined();
    });
});
