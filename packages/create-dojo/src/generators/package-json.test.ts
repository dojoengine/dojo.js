import { describe, expect, it } from "vitest";

import type { ProjectConfig } from "../interactive-flow";
import type { DojoVersions } from "../utils/dojo-versions";
import { buildClientPackageJson } from "./client-app";
import { buildWorkerPackageJson } from "./worker-app";

const versions: DojoVersions = {
    core: "1.2.3",
    sdk: "2.3.4",
    toriiWasm: "3.4.5",
    predeployedConnector: "4.5.6",
};

const baseConfig: ProjectConfig = {
    projectName: "test-dojo-app",
    projectPath: "/tmp/test-dojo-app",
    appType: "client",
    useExistingContracts: true,
};

describe("generated package manifests", () => {
    it("pins Starknet.js and Node.js in client apps", () => {
        const manifest = buildClientPackageJson(
            {
                ...baseConfig,
                framework: "react-vite",
            },
            versions
        );

        expect(manifest.dependencies.starknet).toBe("10.0.2");
        expect(manifest.overrides.starknet).toBe("10.0.2");
        expect(manifest.pnpm.overrides.starknet).toBe("10.0.2");
        expect(manifest.engines.node).toBe(">=22");
    });

    it("pins Starknet.js and Node.js in worker apps", () => {
        const manifest = buildWorkerPackageJson(
            {
                ...baseConfig,
                appType: "worker",
            },
            versions
        );

        expect(manifest.dependencies.starknet).toBe("10.0.2");
        expect(manifest.overrides.starknet).toBe("10.0.2");
        expect(manifest.pnpm.overrides.starknet).toBe("10.0.2");
        expect(manifest.engines.node).toBe(">=22");
    });
});
