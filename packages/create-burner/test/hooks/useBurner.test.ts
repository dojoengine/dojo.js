//@vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react-hooks";
import { useBurner } from "../../src/hooks/useBurner";

describe("useBurner", () => {
    it("testing", () => {
        const { result } = renderHook(() => useBurner());
    });
});
