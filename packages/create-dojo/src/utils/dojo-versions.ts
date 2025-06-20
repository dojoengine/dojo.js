import https from "https";

export interface DojoVersions {
    core: string;
    sdk: string;
    toriiWasm: string;
    predeployedConnector: string;
}

async function getLatestVersion(packageName: string): Promise<string> {
    return new Promise((resolve, reject) => {
        https
            .get(
                `https://registry.npmjs.org/-/package/${packageName}/dist-tags`,
                (res) => {
                    if (res.statusCode === 200) {
                        let body = "";
                        res.on("data", (data) => (body += data));
                        res.on("end", () => {
                            try {
                                const tags = JSON.parse(body);
                                resolve(tags.latest || "latest");
                            } catch (error) {
                                resolve("latest");
                            }
                        });
                    } else {
                        resolve("latest");
                    }
                }
            )
            .on("error", (error) => {
                console.warn(
                    `Failed to fetch version for ${packageName}:`,
                    error
                );
                resolve("latest");
            });
    });
}

export async function getLatestDojoVersions(): Promise<DojoVersions> {
    const [core, sdk, toriiWasm, predeployedConnector] = await Promise.all([
        getLatestVersion("@dojoengine/core"),
        getLatestVersion("@dojoengine/sdk"),
        getLatestVersion("@dojoengine/torii-wasm"),
        getLatestVersion("@dojoengine/predeployed-connector"),
    ]);

    return {
        core,
        sdk,
        toriiWasm,
        predeployedConnector,
    };
}
