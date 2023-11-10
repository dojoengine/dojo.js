import { PhaserLayer } from "..";
import { move } from "./move";
import { controls } from "./controls";
import { mapSystem } from "./mapSystem";

export const registerSystems = (layer: PhaserLayer) => {
    move(layer);
    controls(layer);
    mapSystem(layer);
};
