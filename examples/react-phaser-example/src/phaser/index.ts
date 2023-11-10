import { createPhaserEngine } from "@latticexyz/phaserx";
import { NetworkLayer } from "../dojo/createNetworkLayer";
import { registerSystems } from "./systems/registerSystems";
import { namespaceWorld } from "@dojoengine/recs";

export type PhaserLayer = Awaited<ReturnType<typeof createPhaserLayer>>;
type PhaserEngineConfig = Parameters<typeof createPhaserEngine>[0];

export const createPhaserLayer = async (
    networkLayer: NetworkLayer,
    phaserConfig: PhaserEngineConfig
) => {
    const world = namespaceWorld(networkLayer.world, "phaser");
    const {
        game,
        scenes,
        dispose: disposePhaser,
    } = await createPhaserEngine(phaserConfig);
    world.registerDisposer(disposePhaser);

    const { camera } = scenes.Main;

    camera.phaserCamera.setBounds(0, 0, 5000, 5000);
    camera.phaserCamera.centerOn(1500, 1500);

    const components = {};

    const layer = {
        networkLayer,
        world,
        game,
        scenes,
        components,
    };

    registerSystems(layer);

    return layer;
};
