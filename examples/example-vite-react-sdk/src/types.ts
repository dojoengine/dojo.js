// Compile this file using
// DOJO_ROOT="path/to/dojo-starter" bunx @dojoengine/core --output ./dojo_starter_dev.json --generate-types
import { DojoProvider, ExtractAbiTypes } from "@dojoengine/core";
import { compiledAbi } from "./dojo_starter_dev";
import { dojoConfig } from "../dojoConfig";

type DojoStarterAbi = ExtractAbiTypes<typeof compiledAbi>;
type DojoStarterActions =
    DojoStarterAbi["interfaces"]["dojo_starter::systems::actions::IActions"];

export const dojoProvider = new DojoProvider<DojoStarterActions>(
    dojoConfig.manifest,
    dojoConfig.rpcUrl
);
