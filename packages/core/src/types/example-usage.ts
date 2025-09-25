import { DojoProvider } from "../provider";
import {
    ExtractAbiTypes,
    ModelsFromAbi,
    GetModel,
    GetActionFunction,
} from "./index";

// Solution 1: Import the generated TypeScript file instead
import { compiledAbi } from "../../../../worlds/dojo-starter/compiled-abi";
import {
    Account,
    CairoCustomEnum,
    CairoOption,
    CairoOptionVariant,
    ETransactionVersion,
    ProviderInterface,
} from "starknet";

// Extract ABI types from the TypeScript version (this works!)
type MyAbi = ExtractAbiTypes<typeof compiledAbi>;
type Schema = ModelsFromAbi<typeof compiledAbi>;

// Note: If you need the JSON at runtime, you can still import it separately
// The types come from the TypeScript file, the runtime data from JSON

// IMPORTANT: TypeScript limitation with JSON imports
// When you import JSON files directly, TypeScript converts all string literals
// to generic 'string' type, which breaks ExtractAbiTypes.
//
// To extract types from JSON files, you must:
// 1. Run `npx generate-abi-types` in your world directory to create a .ts file
// 2. Import from the generated .ts file instead of .json
//
// The JSON file can still be used at runtime if needed:
// const runtimeAbi = compiledJson; // This has the actual data
// type CompileTimeTypes = ExtractAbiTypes<typeof compiledAbi>; // This has the types

// Debug: Check the structure of MyAbi
type MyAbiStructs = MyAbi["structs"];
type MyAbiEnums = MyAbi["enums"];
type MyAbiFunctions = MyAbi["functions"];
type MyAbiInterfaces = MyAbi["interfaces"];
type OptionnalNumber = MyAbiEnums["core::option::Option::<core::integer::u32>"];
const e = new CairoOption(CairoOptionVariant.Some, 12);

type DojoStarterActions =
    MyAbiInterfaces["dojo_starter::systems::actions::IActions"];
type WorldActions = MyAbiInterfaces["dojo::world::iworld::IWorld"];

const provider = new DojoProvider<[DojoStarterActions, WorldActions]>(
    compiledAbi
);
const account = new Account({
    provider: provider as unknown as ProviderInterface,
    address: "0x0",
    signer: "0x0",
    cairoVersion: "1",
    transactionVersion: ETransactionVersion.V3,
});

provider.spawn(account);
provider.move(account, {
    direction: new CairoCustomEnum({ Left: "()" }),
});
provider.register_contract(account, {
    salt: "",
    class_hash: "class_hash",
    namespace: "dojo_starter",
});
provider.delete_entities(account, {
    model_selector: "test",
    indexes: new CairoCustomEnum({ Id: "()" }),
    layout: new CairoCustomEnum({ Fixed: "()" }),
});

// Now you can use the extracted types
type Vec2 = Schema["dojo_starter"]["Vec2"];
type Position = GetModel<typeof compiledAbi, "dojo_starter-Position">;
type PositionCount = Schema["dojo_starter"]["PositionCount"];

// Note: Nested struct references are resolved through the ABI context.
// The type system now supports cross-references between structs in the same ABI.

// Enum types now include variants structure
type Direction = MyAbi["enums"]["dojo_starter::models::Direction"];
// Direction will be: {
//   variants: { None: void; Up: void; Down: void; Left: void; Right: void };
//   variantNames: "None" | "Up" | "Down" | "Left" | "Right";
//   type: CairoCustomEnum;
// }
type DirectionValue = Direction["type"]; // CairoCustomEnum
type DirectionVariantNames = Direction["variantNames"]; // "None" | "Up" | "Down" | "Left" | "Right"
type DirectionVariantMap = Direction["variants"]; // Object with variant names as keys

type OptionalDirection =
    MyAbi["enums"]["core::option::Option::<dojo_starter::models::Direction>"];
type OptionalDirectionValue = OptionalDirection["type"]; // CairoOption<DirectionValue>
const od: OptionalDirectionValue = new CairoOption(CairoOptionVariant.None);

const maybeDirection: OptionalDirectionValue = new CairoOption(
    CairoOptionVariant.Some,
    new CairoCustomEnum({ Up: "()" })
);

// Interface types - access interface functions
type IWorld = MyAbi["interfaces"]["dojo::world::iworld::IWorld"];
type WorldResourceFunction = IWorld["resource"]; // { inputs: { selector: string }, outputs: Resource }
type WorldUuidFunction = IWorld["uuid"]; // { inputs: {}, outputs: number }

// Action interface example
type MoveFunction = GetActionFunction<
    typeof compiledAbi,
    "dojo_starter",
    "IActions",
    "move"
>; // { inputs: { direction: Direction["type"] }, outputs: void }

// To make this work with your actual compiled-abi.json, you need to:
// 1. Create a script that converts compiled-abi.json to a TypeScript file with proper const assertions
// 2. Or use a build tool that preserves literal types when importing JSON

// Example of what the generated TypeScript file would look like:
// compiled-abi.generated.ts:
// export const compiledAbi = {
//   "abi": [
//     { "type": "struct", "name": "...", "members": [...] },
//     // ... rest of your ABI
//   ]
// } as const;

// Backward compatibility - still works with raw ABI arrays
declare const abi: [
    {
        type: "struct";
        name: "User";
        members: [{ name: "name"; type: "core::byte_array::ByteArray" }];
    },
];

type SingleAbiTypes = ExtractAbiTypes<typeof abi>;
type UserType = SingleAbiTypes["structs"]["User"]; // { name: string }
