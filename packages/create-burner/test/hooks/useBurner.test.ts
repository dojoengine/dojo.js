//@vitest-environment jsdom
import { renderHook } from "@testing-library/react-hooks";
import { describe, it } from "vitest";

import { useBurner } from "../../src/hooks/useBurner";

describe("useBurner", () => {
    it("testing", () => {
        const { result } = renderHook(() => useBurner());
    });
});
