import { describe, it, expect } from "vitest";
import {
    computeByteArrayHash,
    getSelectorFromTag,
    getComponentNameFromEvent,
    splitEventTag,
} from "../../utils/index";
import { byteArray } from "starknet";

describe("utils", () => {
    it("should getComponentFromEvent", () => {
        const f = (actions: string[], event: string[], action: string) => {
            expect(getComponentNameFromEvent(actions, event)).toBe(action);
        };

        // Working tests
        f(
            [
                "dojo_starter-Moves",
                "dojo_starter-Moved",
                "dojo_starter-Position",
            ],
            [
                "0x2a29373f1af8348bd366a990eb3a342ef2cbe5e85160539eaca3441a673f468",
                "0x1",
                "0x434962bc189d79bb549fa55f492780831b0852acf26c6d345f47f520d518589",
                "0x3",
                "0x64",
                "0x0",
                "0x1",
            ],
            "dojo_starter-Moves"
        );
        f(
            [
                "dojo_starter-Moves",
                "dojo_starter-Moved",
                "dojo_starter-Position",
            ],
            [
                "0x2ac8b4c190f7031b9fc44312e6b047a1dce0b3f2957c33a935ca7846a46dd5b",
                "0x1",
                "0x434962bc189d79bb549fa55f492780831b0852acf26c6d345f47f520d518589",
                "0x3",
                "0x64",
                "0x0",
                "0x1",
            ],
            "dojo_starter-Position"
        );
    });

    it("should throw an exception when the action is not found", () => {
        const f = (actions: string[], event: string[]) => {
            expect(() =>
                getComponentNameFromEvent(actions, event)
            ).toThrowError();
        };
        // Should throw an exception
        f(
            ["dojo_starter-Invalid"],
            [
                "0x2ac8b4c190f7031b9fc44312e6b047a1dce0b3f2957c33a935ca7846a46dd5b",
                "0x1",
                "0x434962bc189d79bb549fa55f492780831b0852acf26c6d345f47f520d518589",
                "0x3",
                "0x64",
                "0x0",
                "0x1",
            ]
        );
    });
    it("should splitEventTag", () => {
        const f = (tag: string, expected: string[]) => {
            expect(splitEventTag(tag)).toEqual(expected);
        };

        f("dojo_starter-Moves", ["dojo_starter", "Moves"]);
        f("dojo_starter-Moved", ["dojo_starter", "Moved"]);
        f("dojo_starter-Position", ["dojo_starter", "Position"]);
    });

    it("should computeByteArrayHash", () => {
        const t = computeByteArrayHash("test");
        expect("0x" + t.toString(16)).toBe(
            "0x2ca96bf6e71766195fa290b97c50f073b218d4e8c6948c899e3b07d754d6760"
        );
    });

    it("should get the proper event name", () => {
        const f = (namespace: string, event: string, expected: string) => {
            expect(getSelectorFromTag(namespace, event)).toBe(expected);
        };

        f(
            "dojo_starter",
            "Moves",
            "0x2a29373f1af8348bd366a990eb3a342ef2cbe5e85160539eaca3441a673f468"
        );
        f(
            "dojo_starter",
            "Position",
            "0x2ac8b4c190f7031b9fc44312e6b047a1dce0b3f2957c33a935ca7846a46dd5b"
        );
    });
});
