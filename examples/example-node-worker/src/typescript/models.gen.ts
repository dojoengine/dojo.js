import type { SchemaType as ISchemaType } from "@dojoengine/sdk";

import { CairoCustomEnum, CairoOption, CairoOptionVariant, BigNumberish } from 'starknet';

// Type definition for `dojo_starter::models::DirectionsAvailable` struct
export interface DirectionsAvailable {
	player: string;
	directions: Array<DirectionEnum>;
}

// Type definition for `dojo_starter::models::DirectionsAvailableValue` struct
export interface DirectionsAvailableValue {
	directions: Array<DirectionEnum>;
}

// Type definition for `dojo_starter::models::Moves` struct
export interface Moves {
	player: string;
	remaining: BigNumberish;
	last_direction: CairoOption<DirectionEnum>;
	can_move: boolean;
}

// Type definition for `dojo_starter::models::MovesValue` struct
export interface MovesValue {
	remaining: BigNumberish;
	last_direction: CairoOption<DirectionEnum>;
	can_move: boolean;
}

// Type definition for `dojo_starter::models::Position` struct
export interface Position {
	player: string;
	vec: Vec2;
}

// Type definition for `dojo_starter::models::PositionCount` struct
export interface PositionCount {
	identity: string;
	positition: Array<[BigNumberish, BigNumberish]>;
}

// Type definition for `dojo_starter::models::PositionCountValue` struct
export interface PositionCountValue {
	positition: Array<[BigNumberish, BigNumberish]>;
}

// Type definition for `dojo_starter::models::PositionValue` struct
export interface PositionValue {
	vec: Vec2;
}

// Type definition for `dojo_starter::models::Vec2` struct
export interface Vec2 {
	x: BigNumberish;
	y: BigNumberish;
}

// Type definition for `dojo_starter::systems::actions::actions::Moved` struct
export interface Moved {
	player: string;
	direction: DirectionEnum;
}

// Type definition for `dojo_starter::systems::actions::actions::MovedValue` struct
export interface MovedValue {
	direction: DirectionEnum;
}

// Type definition for `dojo_starter::models::Direction` enum
export const direction = [
	'Left',
	'Right',
	'Up',
	'Down',
] as const;
export type Direction = { [key in typeof direction[number]]: string };
export type DirectionEnum = CairoCustomEnum;

export interface SchemaType extends ISchemaType {
	dojo_starter: {
		DirectionsAvailable: DirectionsAvailable,
		DirectionsAvailableValue: DirectionsAvailableValue,
		Moves: Moves,
		MovesValue: MovesValue,
		Position: Position,
		PositionCount: PositionCount,
		PositionCountValue: PositionCountValue,
		PositionValue: PositionValue,
		Vec2: Vec2,
		Moved: Moved,
		MovedValue: MovedValue,
	},
}
export const schema: SchemaType = {
	dojo_starter: {
		DirectionsAvailable: {
			player: "",
			directions: [new CairoCustomEnum({ 
					Left: "",
				Right: undefined,
				Up: undefined,
				Down: undefined, })],
		},
		DirectionsAvailableValue: {
			directions: [new CairoCustomEnum({ 
					Left: "",
				Right: undefined,
				Up: undefined,
				Down: undefined, })],
		},
		Moves: {
			player: "",
			remaining: 0,
		last_direction: new CairoOption(CairoOptionVariant.None),
			can_move: false,
		},
		MovesValue: {
			remaining: 0,
		last_direction: new CairoOption(CairoOptionVariant.None),
			can_move: false,
		},
		Position: {
			player: "",
		vec: { x: 0, y: 0, },
		},
		PositionCount: {
			identity: "",
			positition: [[0, 0]],
		},
		PositionCountValue: {
			positition: [[0, 0]],
		},
		PositionValue: {
		vec: { x: 0, y: 0, },
		},
		Vec2: {
			x: 0,
			y: 0,
		},
		Moved: {
			player: "",
		direction: new CairoCustomEnum({ 
					Left: "",
				Right: undefined,
				Up: undefined,
				Down: undefined, }),
		},
		MovedValue: {
		direction: new CairoCustomEnum({ 
					Left: "",
				Right: undefined,
				Up: undefined,
				Down: undefined, }),
		},
	},
};
export enum ModelsMapping {
	Direction = 'dojo_starter-Direction',
	DirectionsAvailable = 'dojo_starter-DirectionsAvailable',
	DirectionsAvailableValue = 'dojo_starter-DirectionsAvailableValue',
	Moves = 'dojo_starter-Moves',
	MovesValue = 'dojo_starter-MovesValue',
	Position = 'dojo_starter-Position',
	PositionCount = 'dojo_starter-PositionCount',
	PositionCountValue = 'dojo_starter-PositionCountValue',
	PositionValue = 'dojo_starter-PositionValue',
	Vec2 = 'dojo_starter-Vec2',
	Moved = 'dojo_starter-Moved',
	MovedValue = 'dojo_starter-MovedValue',
}