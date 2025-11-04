import { dojoConfig, setup, type SetupResult } from "@showcase/dojo";

let context: SetupResult | null = null;

async function bootstrap() {
    context = await setup(dojoConfig);
    if (context.burnerManager.list().length === 0) {
        await context.burnerManager.create();
    }
    const account = context.burnerManager.getActiveAccount();
    self.postMessage({
        type: "ready",
        account: account?.address,
    });
}

bootstrap().catch((error) => {
    self.postMessage({ type: "error", error: String(error) });
});
