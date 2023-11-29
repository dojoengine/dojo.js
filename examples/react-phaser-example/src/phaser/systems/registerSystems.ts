import { PhaserLayer } from "..";
import { move } from "./move";
import { spawn } from "./spawn";
import { controls } from "./controls";
import { mapSystem } from "./mapSystem";

export const registerSystems = (layer: PhaserLayer) => {
    move(layer);
    spawn(layer);
    controls(layer);
    mapSystem(layer);
};
